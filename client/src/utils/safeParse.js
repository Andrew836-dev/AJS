import { parseScript } from "esprima";

function safeParse(codeString) {
  try {
    return parseScript(codeString);
  } catch (err) {
    return { error: `${err.description}, Line ${err.lineNumber}, Character ${err.column}` };
  }
}

export default safeParse;