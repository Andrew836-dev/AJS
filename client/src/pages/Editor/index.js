import React, { useState, useRef, useEffect } from "react";
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
  const defaultCode = "let greeting = 'Hello World!', secondary;\nfunction helloWorld() {\n  console.log(greeting);\n}\nsecondary = 2;\nhelloWorld();\n";
  const history = useHistory();
  const { language: mode, id: codeId } = useParams();
  const editorRef = useRef();
  const [darkTheme, setDarkTheme] = useState(true);
  const [readOnly, setReadOnly] = useState(true);
  const [title, setTitle] = useState("Untitled");
  const [codeState, setCodeState] = useState("");
  const [userState] = useUserContext();
  // let mode = language;

  useEffect(() => {
    let inEditor = true;
    if (!codeId) {
      setDarkTheme(userState.darkTheme);
      setReadOnly(false);
      if (history.location.state) {
        const { code } = history.location.state;
        setCodeState(code);
      } else {
        const initialCode = (
          localStorage.getItem("codeText")
          || defaultCode
        );
        setCodeState(initialCode);
      }
    } else if (codeId.length !== 24) {
      redirectWithCode(`const invalidCodeId = "${codeId}";\nconsole.log(invalidCodeId + "is not a valid code ID. Starting a new session");\n`);
    } else {
      setDarkTheme(userState.darkTheme);
      setCodeState("Checking server for code " + codeId);
      API
        .getCodebyId(codeId)
        .then(dbCode => {
          if (inEditor) {
            setReadOnly(dbCode.author !== userState.id);
            setTitle(dbCode.title);
            setCodeState(dbCode.body.join("\n"));
            editorRef.current.editor.setOption("readOnly", dbCode.author !== userState.id);
            editorRef.current.editor.setValue(dbCode.body.join("\n"));
          }
        })
        .catch(() => {
          if (inEditor) {
            redirectWithCode(`const codeId = "${codeId}";\nconsole.log(codeId + " was not found in the database, starting a new session.");\n`);
          }
        });
    }
    return () => {
      inEditor = false;
    }
  }, [codeId, history.location, userState.id, userState.darkTheme])

  function redirectWithCode(code) {
    history.replace("/editor/" + mode, { code: code });
  }

  function handleCodeChange(editor, change) {
    if (change.origin === "setValue") return;
    let editorValue = editor.getValue();
    localStorage.setItem("codeText", editorValue);
    setCodeState(editorValue);
  }

  async function saveCode() {
    const codeToSave = codeState.split("\n");
    // setLoading(true);
    if (!codeId) {
      return API
        .saveCode("new", { mode, title, body: codeToSave })
        .then(dbCode => {
          history.push("/editor/" + mode + "/" + dbCode._id)
        }).catch(dbErr => {
          console.log("Error creating", dbErr);
          // setLoading(false);
        });
    }
    API.saveCode(codeId, codeToSave)
      // .then(() => setLoading(false))
      .catch(dbErr => {
        console.log("Error saving", dbErr);
        // setLoading(false);
      });
  }

  const codeMirrorOptions = {
    theme: (darkTheme ? "monokai" : "default"),
    // readOnly: readOnly,
    lineWrapping: true,
    // keyMap: "sublime",
    mode: mode,
  }
  return <Box fill>
    <Box direction="row" justify="end" margin={{ right: "small" }}>
      <h3>Title: </h3>
      <TextInput value={title} onChange={({ target }) => setTitle(target.value)} />
      <CheckBox label="Dark" checked={darkTheme} onClick={() => setDarkTheme(!darkTheme)} />
      <Box>
        <Button icon={<New />} onClick={() => redirectWithCode("")} />
        <Text size="small">New</Text>
      </Box>
      <Box>
        <Button icon={<Copy />} onClick={() => redirectWithCode(codeState)} />
        <Text size="small">Fork</Text>
      </Box>
      <Box>
        <Button icon={<Save />} onClick={saveCode} disabled={userState.role === GUEST || readOnly} />
        <Text size="small">Save</Text>
      </Box>
    </Box>
    <ResponsiveContext.Consumer>
      {size => (<Box direction="row-responsive" justify="center">
        <Box width={size !== "small" ? "50%" : "100%"} height="50vh">
          <CodeMirror
            ref={editorRef}
            value={codeState}
            options={codeMirrorOptions}
            onChange={handleCodeChange}
          />
        </Box>
        <Box width={size !== "small" ? "45%" : "100%"}>
          {mode === "markdown"
            ? <Markdown>{codeState}</Markdown>
            : <CodeWrapper code={safeParse(codeState)} />}
        </Box>
      </Box>)}
    </ResponsiveContext.Consumer>
  </Box>
}

export default Editor;