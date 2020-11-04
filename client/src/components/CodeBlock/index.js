import React from "react";
import ObjectBlock from "../ObjectBlock";

const validCodeTypes = {
  EXPRESSION_STATEMENT: "ExpressionStatement",
  FUNCTION_DECLARATION: "FunctionDeclaration",
  VARIABLE_DECLARATION: "VariableDeclaration",
  BLOCK_STATEMENT: "BlockStatement"
}

const validExpressionTypes = {
  ASSIGNMENT_EXPRESSION: "AssignmentExpression",
  CALL_EXPRESSION: "CallExpression"
}

function CodeBlock({ code }) {
  switch (code.type) {
    case validCodeTypes.EXPRESSION_STATEMENT:
      switch (code.expression.type) {
        case validExpressionTypes.ASSIGNMENT_EXPRESSION:
          return <ul>
            <details>
              <summary>
                {`${code.expression.left.name ? code.expression.left.name : code.expression.left.value} = ${code.expression.right.name ? code.expression.right.name : code.expression.right.value}`}
              </summary>
            </details>
          </ul>;
        case validExpressionTypes.CALL_EXPRESSION:
          return <ul>
            <details>
              <summary>Function Call : {code.expression.callee ? `${code.expression.callee.name}` : "Anonymous"}</summary>
              {`Arguments : ${code.expression.arguments.length ? code.expression.arguments.map(argument => argument.name ? argument.name : "Haven't gotten to this part yet").join(", ") : "None"}`}
            </details>
          </ul>
        default:
          //console.log(code);
          return <ObjectBlock object={code} />;
      }
    case validCodeTypes.FUNCTION_DECLARATION:
      //console.log(code);
      return <ul>
        <details>
          <summary>Function Declaration : {code.id ? code.id.name : "Anonymous"}</summary>
          <p>{`Parameters : ${code.params.length ? code.params.map(param => param.name).join(", ") : "None"}`}</p>
          <ObjectBlock object={code.body} />
        </details>
      </ul>;
    case validCodeTypes.VARIABLE_DECLARATION:
      return <ul>
        {code.declarations
          .map(declaration => <details key={`declare${declaration.id.name}`}>
            <summary>
              {`${code.kind} ${declaration.id.name} = ${declaration.init ? declaration.init.value : "Not defined here"}`}
            </summary>
            {(code.kind === "var" || code.kind === "let") && (
              <>
                <p>{code.kind} is a variable declaration that can be reassigned later</p>
                <p>This means that you can change what it is referencing. (<code>{declaration.id.name} = "Potatoes"</code>) is fine</p>
              </>)}
            {code.kind === "const" && (
              <>
                <p>const is a variable that can <strong>not</strong> be reassigned later</p>
                <p>This means that you can not change what it is referencing. (<code>{declaration.id.name} = "Potatoes"</code>) will cause an error.</p>
              </>)}
          </details>)}
      </ul>;
    case validCodeTypes.BLOCK_STATEMENT:
      return code.body.map((statement, index) => <CodeBlock key={index.toString() + statement.toString()} code={statement} />);
    default:
      return <ul>
        <details>
          <summary>{code.type}</summary>
          <ObjectBlock object={code} />
        </details>
      </ul>;
  }
}

export default CodeBlock;