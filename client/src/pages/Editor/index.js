import React, { useState, useRef } from "react";
import { parseScript } from "esprima";
//import CodeWrapper from "../../components/CodeWrapper";
// import { useParams, useHistory } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "codemirror/theme/monokai.css";

function Editor() {
  // let history = useHistory();
  // console.log(history);
  // let language = useParams().language;
  let language = "javascript";
  // if (!language) {
  //   let { pathname, hash, search } = history.location;
  //   if (pathname.slice(-1) === "/") pathname += "javascript";
  //   else pathname += "/javascript";
  //   history.replace(pathname + hash + search);
  // }
  const code = useRef();
  // const code = "function helloWorld() {\n  console.log("Hello World!");\n}";
  const [parsedCode, setParsedCode] = useState({});
  console.log(parsedCode);
  return <>
    <CodeMirror
      ref={code}
      value={"let greeting = 'Hello World!', secondary;\nfunction helloWorld() {\n  console.log(greeting);\n}\nsecondary = 2;\nhelloWorld();\n"}
      options={{
        theme: "monokai",
        // keyMap: "sublime",
        mode: language,
      }}
      onChange={(editor) => setParsedCode(safeParse(editor.getValue()))}
    />
  </>
}

function safeParse(codeString) {
  try {
    return parseScript(codeString);
  } catch (err) {
    return { error: `${err.description}, Line ${err.lineNumber}, Character ${err.column}` };
  }
}

export default Editor;