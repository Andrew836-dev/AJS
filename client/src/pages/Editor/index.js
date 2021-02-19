import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { useUserContext } from "../../utils/UserStore";
import { useParams, useHistory } from "react-router-dom";
import {
  Box,
  Button,
  CheckBox,
  Markdown,
  ResponsiveContext,
  Text,
  TextInput
} from "grommet";
import { Save, New, Copy } from "grommet-icons";
import CodeWrapper from "../../components/CodeWrapper";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/theme/monokai.css";
import { GUEST } from "../../utils/roles";
import API from "../../utils/API";
import safeParse from "../../utils/safeParse";

function Editor() {
  const history = useHistory();
  const { language: mode, id: codeId } = useParams();
  const editorRef = useRef();
  const [darkTheme, setDarkTheme] = useState(true);
  const [readOnly, setReadOnly] = useState(true);
  const [title, setTitle] = useState("Untitled");
  const [codeState, setCodeState] = useState("");
  const [userState] = useUserContext();
  const redirectWithCode = useCallback(code => {
    history.push("/editor/" + mode, { code: code });
    setReadOnly(false);
    if (editorRef.current && editorRef.current.editor) {
      editorRef.current.editor.setOption("readOnly", false);
    }
  }, [history, mode]);

  useEffect(() => {
    let inEditor = true;
    if (codeId) {
      if (codeId.length === 24) { // Id length 24 for MongoDB Id
        setDarkTheme(userState.darkTheme);
        setCodeState("Checking server for code " + codeId);
        API
          .getCodebyId(codeId)
          .then(dbCode => {
            if (inEditor) {
              setTitle(dbCode.title);
              setReadOnly(dbCode.author !== userState.id);
              editorRef.current.editor.setOption("readOnly", (dbCode.author !== userState.id ? "nocursor" : false));
              setCodeState(dbCode.body.join("\n"));
              editorRef.current.editor.setValue(dbCode.body.join("\n"));
            }
          })
          .catch(() => {
            if (inEditor) {
              redirectWithCode(`const codeId = "${codeId}";\nconsole.log(codeId + " was not found in the database, starting a new session.");\n`);
            }
          });
      } else {
        // for invalid Id
        redirectWithCode(`const invalidCodeId = "${codeId}";\nconsole.log(invalidCodeId + "is not a valid code ID. Starting a new session");\n`);
      }
      return () => {
        // return value for if component unmounted before API call finished
        inEditor = false;
      }
    }
    // for no Id
    setDarkTheme(userState.darkTheme);
    setReadOnly(false);
    if (history.location.state && typeof history.location.state.code === "string") {
      setCodeState(history.location.state.code);
    } else {
      const defaultCode = "let greeting = 'Hello World!', secondary;\nfunction helloWorld() {\n  console.log(greeting);\n}\nsecondary = 2;\nhelloWorld();\n";
      const initialCode = localStorage.getItem("codeText") || defaultCode;
      setCodeState(initialCode);
    }

  }, [codeId, history.location, userState.id, userState.darkTheme, redirectWithCode])


  function handleCodeChange(editor, change) {
    if (change.origin === "setValue") return;
    let editorValue = editor.getValue();
    localStorage.setItem("codeText", editorValue);
    setCodeState(editorValue);
  }

  async function saveCode() {
    const codeToSave = codeState.split("\n");
    API.saveCode(`${codeId ? codeId : "new"}`, ({ mode, title, body: codeToSave }))
      .then(dbCode => history.push("/editor/" + mode + "/" + dbCode._id))
      .catch(dbErr => console.log("Error creating", dbErr));
  }

  const codeMirrorOptions = (withDarkTheme) => ({
    theme: (withDarkTheme ? "monokai" : "default"),
    lineWrapping: true,
    mode: mode,
  });

  const size = useContext(ResponsiveContext);
  return <>
    <Box direction="row" justify="start" gap="small" width="100%">
      <Box margin={{ right: size }}>
        <Button plain
          icon={<New />} label="New"
          onClick={() => redirectWithCode("")}
        />
        <Button plain
          icon={<Copy />} label="Fork"
          onClick={() => redirectWithCode(codeState)}
        />
        <Button plain
          icon={<Save />} label="Save"
          onClick={saveCode}
          disabled={userState.role === GUEST || readOnly}
        />
      </Box>
      <Box>
        <Box direction="row">
          <Text size="xxlarge" style={{ marginTop: "0px" }}>Title: </Text>
          <TextInput disabled={userState.role === GUEST} value={title} onChange={({ target }) => setTitle(target.value)} />
        </Box>
        <CheckBox label="Dark" checked={darkTheme} onClick={() => setDarkTheme(!darkTheme)} />
      </Box>
    </Box>
    <Box direction="row-responsive" width="100%" gap="small">
      <Box height="50vh" width={size === "small" ? "100%" : "50%"}>
        <CodeMirror
          ref={editorRef}
          value={codeState}
          options={codeMirrorOptions(darkTheme)}
          onChange={handleCodeChange}
        />
      </Box>
      <Box width={size === "small" ? "100%" : "50%"}>
        {mode === "markdown"
          ? <Markdown>{codeState}</Markdown>
          : <CodeWrapper code={safeParse(codeState)} />}
      </Box>
    </Box>
  </>
}

export default Editor;