import React from "react";
import { List } from "grommet";
import CodeBlock from "../CodeBlock";

function CodeWrapper({ code }) {
  if (code.error) return <p>{code.error}</p>
  if (!code.body) return <p>Loading</p>
  return (
    <ul>
      <details>
        <summary>
          {code.type} : {code.sourceType}
        </summary>
        {code.body
          && code.body.map((bodyObject, index) => <CodeBlock key={`${code.type}${index}`} code={bodyObject} />)}
      </details>
    </ul>
  )
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

const renderObjectInList = function (object) {
  let textToReturn = "";
  console.log(Object.keys(object).filter(key => object.hasOwnProperty(key)));
  for (let key in object) {
    textToReturn += `<details>
    <summary>${key} : ${actualTypeOf(object[key])}</summary>
    <ul>${displayValue(object[key])}</ul>
    </details>`
  }
  return textToReturn;
}

const displayValue = function (value) {
  if (typeof value === "object") {
    if (value) {
      return `${renderObjectInList(value)}`;
    } else {
      return "null";
    }
  } else if (typeof value === "string") {
    return `"${value}"`
  } else {
    return `${value.toString()}`;
  }
}
function actualTypeOf(thing) {
  if (typeof thing !== "object") return typeof thing;
  if (Array.isArray(thing)) return "array";
  if (thing === null) return "null";
  console.log(typeof thing);
  return "object";
}

// const actualTypeOf = function (object) {
//   if (typeof object === "object") {
//     if (object && "forEach" in object) {
//       return "array";
//     } else if (object) {
//       return "object";
//     } else {
//       return "null";
//     }
//   } else {
//     return typeof object;
//   }
// }
export default CodeWrapper;