import React from "react";

function ObjectBlock(props) {
  const keyList = Object.keys(props.object);
  return (<ul>
    {keyList.map(key => (
      <details key={key}>
        <summary>
          {key} : {displayCanonicalTypeOf(props.object[key])}
        </summary>
        <ul>
          {displayValueOf(props.object[key])}
        </ul>
      </details>)
    )}
  </ul>)
}

function displayValueOf(thisObject) {
  switch (typeof thisObject) {
    case "string":
      return `"${thisObject}"`;
    case "number":
      return thisObject;
    case "object":
      if (thisObject === null) {
        return "null";
      }
      return <ObjectBlock object={thisObject} />
    default:
      return thisObject.toString();
  }
}

function displayCanonicalTypeOf(thisObject) {
  if (thisObject === null) {
    return "null";
  }
  if (Array.isArray(thisObject)) {
    return "array";
  }
  return typeof thisObject;
}

export default ObjectBlock;