import React, { useState, useRef, useEffect } from "react";
import { useUserContext } from "../../utils/UserStore";
import { useParams, useHistory } from "react-router-dom";
import { Box, Button, TextInput } from "grommet";
import { Save, New, Copy } from "grommet-icons";
import CodeWrapper from "../../components/CodeWrapper";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "codemirror/theme/monokai.css";
import { GUEST } from "../../utils/roles";
import API from "../../utils/API";
import safeParse from "../../utils/safeParse";

function Editor() {
  const defaultCode = "let greeting = 'Hello World!', secondary;\nfunction helloWorld() {\n  console.log(greeting);\n}\nsecondary = 2;\nhelloWorld();\n";
  const history = useHistory();
  const { id: codeId } = useParams();
  const editorRef = useRef();
  // const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("Untitled");
  const [codeState, setCodeState] = useState("");
  const [userState] = useUserContext();
  let mode = "javascript";

  useEffect(() => {
    if (!codeId) {
      if (history.location.state) {
        const { message } = history.location.state;
        setCodeState(message);
      } else {
        const initialCode = (
          localStorage.getItem("codeText")
          || defaultCode
        );
        setCodeState(initialCode);
      }
      setAuthor(userState.id);
      // setLoading(false);
    } else if (codeId.length !== 24) {
      history.replace("/code", { message: `const invalidCodeId = ${codeId};\nconsole.log(invalidCodeId + "is not a valid code ID. Starting a new session");\n` });
    } else {
      setCodeState("Checking server for code " + codeId);
      API
        .getCodebyId(codeId)
        .then(dbCode => {
          setAuthor(dbCode.author);
          setTitle(dbCode.title);
          setCodeState(dbCode.body.join("\n"));
          // setLoading(false);
          editorRef.current.editor.setValue(dbCode.body.join("\n"));
        })
        .catch(() => {
          history.push("/code", { message: `const codeId = ${codeId};\nconsole.log(codeId + " was not found in the database, starting a new session.");\n` })
        });
    }

  }, [codeId, history, history.location, userState.id])

  function handleCodeChange(editor, change) {
    if (change.origin === "setValue") return;
    let editorValue = editor.getValue();
    localStorage.setItem("codeText", editorValue);
    setCodeState(editorValue);
  }

  function saveCode() {
    const codeToSave = codeState.split("\n");
    // setLoading(true);
    if (!codeId) {
      return API
        .saveCode("new", {mode, title, body: codeToSave})
        .then(dbCode => {
          history.push("/code/" + dbCode._id)
        }).catch(dbErr => {
          console.log(dbErr);
          // setLoading(false);
        });
    }
    API.saveCode(codeId, codeToSave)
      // .then(() => setLoading(false))
      .catch(dbErr => {
        console.log(dbErr);
        // setLoading(false);
      });
  }

  return <Box fill>
    <Box direction="row" justify="end" margin={{ right: "small" }}>
    <h3>Title: </h3>
      <TextInput value={title} onChange={({ target }) => setTitle(target.value)} />
      <Button icon={<New />} onClick={() => history.push("/code", { message: defaultCode })} />
      <Button icon={<Copy />} onClick={() => history.push("/code", { message: codeState })} />
      <Button icon={<Save />} onClick={saveCode} disabled={userState.role === GUEST || userState.id !== author} />
    </Box>
    <Box>
      <CodeMirror
        ref={editorRef}
        value={codeState}
        options={{
          theme: "monokai",
          // keyMap: "sublime",
          mode: mode,
        }}
        onChange={handleCodeChange}
      />
    </Box>
    <Box>
      {/* <CodeWrapper code={safeParse(codeState)} /> */}
    </Box>
  </Box>
}

export default Editor;