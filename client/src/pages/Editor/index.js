import React, { useState, useRef, useEffect } from "react";

import { GUEST, USER } from "../../utils/roles";
import API from "../../utils/API";
import { useUserContext } from "../../utils/UserStore";
import { useParams, useHistory } from "react-router-dom";
//import CodeWrapper from "../../components/CodeWrapper";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "codemirror/theme/monokai.css";

function Editor() {
  const defaultCode = "let greeting = 'Hello World!', secondary;\nfunction helloWorld() {\n  console.log(greeting);\n}\nsecondary = 2;\nhelloWorld();\n";
  const history = useHistory();
  const { id: codeId } = useParams();
  const editorRef = useRef();
  const initialCodeRef = useRef("Loading");
  const [loading, setLoading] = useState(true);
  const [codeState, setCodeState] = useState("");
  const [userState] = useUserContext();
  let language = "javascript";

  useEffect(() => {
    if (!codeId) {
      if (typeof history.location.state === "string") {
        initialCodeRef.current = history.location.state
      } else {
        initialCodeRef.current = (
          localStorage.getItem("codeText")
          || defaultCode
        );
      }
      setLoading(false);
    } else if (codeId.length !== 24) {
      history.replace("/code", `const invalidCodeId = ${codeId};\nconsole.log(invalidCodeId + "is not a valid code ID. Starting a new session");\n`);
    } else {
      initialCodeRef.current = "Checking server for code " + codeId;
      API
        .getCodebyId(codeId)
        .then(dbCode => {
          setCodeState(dbCode.body.join("\n"));
          setLoading(false);
          initialCodeRef.current = dbCode.body.join("\n");
          editorRef.current.editor.setValue(dbCode.body.join("\n"));
        })
        .catch(() => {
          history.push("/code", `const codeId = ${codeId};\nconsole.log(codeId + " was not found in the database, starting a new session.");\n`)
        });
    }

  }, [codeId, history])

  function handleCodeChange(editor, change) {
    let editorValue = editor.getValue();
    localStorage.setItem("codeText", editorValue);
    if (change.origin === "setValue") return;
    setCodeState(editorValue);
  }

  function saveCode() {
    const codeToSave = editorRef.current.editor.getValue().split("\n");
    setLoading(true);
    if (!codeId) {
      return API
        .saveCode("new", codeToSave)
        .then(dbCode => {
          history.push("/code/" + dbCode._id)
        }).catch(dbErr => {
          console.log(dbErr);
          setLoading(false);
        });
    }
    API.saveCode(codeId, codeToSave)
      .then(dbCode => {
        console.log(dbCode);
        setLoading(false);
      })
      .catch(dbErr => {
        console.log(dbErr);
        setLoading(false);
      });
  }

  const codeToDisplay = initialCodeRef.current;
  return <div>
    <CodeMirror
      ref={editorRef}
      value={codeToDisplay}
      options={{
        theme: "monokai",
        // keyMap: "sublime",
        mode: language,
      }}
      onChange={handleCodeChange}
    />{userState.role === GUEST
      ? null
      : <button onClick={saveCode}>Save</button>}
    <p>{loading}</p>
  </div>
}

export default Editor;