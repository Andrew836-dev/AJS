import React from "react";
import CodeBlock from "../CodeBlock";

function CodeWrapper({ code }) {
  if (code.error) return <p>{code.error}</p>
  if (!code.body) return <p>Loading</p>
  return <>
    <ul>
      <details>
        <summary>
          {code.type} : {code.sourceType}
        </summary>
        {code.body
          ? code.body.map((bodyObject, index) => <CodeBlock key={`${code.type}${index}`} code={bodyObject} />)
          : <></>}
      </details>
    </ul>
  </>
}

function javascriptParse(code) {
  switch (code.type) {
    case "Program":
    default:
      console.log(code.type);
  }
  // for (let key in code) {
  // const newUl = document.createElement("ul");
  // const newSummary = document.createElement("summary");
  // const newDetail = document.createElement("details");
  return <ul>
    <details>
      <summary>
        {/*key} : {actualTypeOf(code[key])*/}
      </summary>
      {/*code[key]*/}
    </details>
  </ul>
  // newSummary.textContent = `${key} : ${actualTypeOf(object[key])}`;
  // if (typeof object[key] === "object") {
  //   renderObjectInList(object[key], newUl)
  // } else if (typeof object[key] !== "undefined") {
  //   newUl.textContent = object[key];
  // } else {
  //   newUl.textContent = "null";
  // }
  // newDetail.appendChild(newSummary);
  // newDetail.appendChild(newUl);
  // parentEl.appendChild(newDetail);
  //}
}

function actualTypeOf(thing) {
  if (typeof thing !== "object") return typeof thing;
  if (Array.isArray(thing)) return "array";
  if (thing === null) return "null";
  return "object";
}
export default CodeWrapper;