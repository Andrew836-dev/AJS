import React, { useState, useRef, useEffect } from "react";
import { useUserContext } from "../../utils/UserStore";
import { useParams, useHistory } from "react-router-dom";
import { Box, Button, TextInput, Markdown } from "grommet";
import { Save, New, Copy } from "grommet-icons";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "codemirror/theme/monokai.css";
import { GUEST } from "../../utils/roles";
import API from "../../utils/API";

function MarkdownEditor() {
  const defaultCode = "#Hello!\n1. This is a **markdown** *viewer*, try it out!\n* There's lots you can do\n\n\n* Bullets!\n  * More Bullets!";
  const history = useHistory();
  const { id: codeId } = useParams();
  const editorRef = useRef();
  // const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("Untitled");
  const [codeState, setCodeState] = useState("");
  const [userState] = useUserContext();
  let mode = "markdown";

  useEffect(() => {
    if (!codeId) {
      if (history.location.state) {
        const { message } = history.location.state;
        setCodeState(message);
      } else {
        const initialCode = (
          localStorage.getItem("markdownText")
          || defaultCode
        );
        setCodeState(initialCode);
      }
      setAuthor(userState.id);
      // setLoading(false);
    } else if (codeId.length !== 24) {
      history.replace("/markdown", { message: `const invalidCodeId = ${codeId};\nconsole.log(invalidCodeId + "is not a valid code ID. Starting a new session");\n` });
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
          history.push("/markdown", { message: `const codeId = ${codeId};\nconsole.log(codeId + " was not found in the database, starting a new session.");\n` })
        });
    }

  }, [codeId, history, history.location, userState.id])

  function handleCodeChange(editor, change) {
    if (change.origin === "setValue") return;
    let editorValue = editor.getValue();
    localStorage.setItem("markdownText", editorValue);
    setCodeState(editorValue);
  }

  function saveCode() {
    const codeToSave = codeState.split("\n");
    // setLoading(true);
    if (!codeId) {
      return API
        .saveCode("new", { mode, title, body: codeToSave })
        .then(dbCode => {
          history.push("/markdown/" + dbCode._id)
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
    <Box direction="row" margin={{ right: "small" }}>
      <h3>Title: </h3>
      <TextInput value={title} onChange={({ target }) => setTitle(target.value)} />
      <Button icon={<New />} onClick={() => history.push("/markdown", { message: defaultCode })} />
      <Button icon={<Copy />} onClick={() => history.push("/markdown", { message: codeState })} />
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
      <Markdown children={codeState} />
    </Box>
  </Box>
}

export default MarkdownEditor;