import React from "react";

const validCodeTypes = {
  EXPRESSION_STATEMENT: "ExpressionStatement",
  FUNCTION_DECLARATION: "FunctionDeclaration",
  VARIABLE_DECLARATION: "VariableDeclaration"
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
              {`Arguments : ${code.expression.arguments.length ? code.expression.arguments.join(", ") : "None"}`}
            </details>
          </ul>
        default:
          console.log(code);
          return <p>Expression</p>;
      }
    case validCodeTypes.FUNCTION_DECLARATION:
      console.log(code);
      return <ul>
        <details>
          <summary>Function Declaration : {code.id ? code.id.name : "Anonymous"}</summary>
          <p>{`Parameters : ${code.params.length ? code.params.map(param => param.name).join(", ") : "None"}`}</p>
          <CodeBlock code={code.body} />
        </details>
      </ul>;
    case validCodeTypes.VARIABLE_DECLARATION:
      return <ul>
        {code.declarations
          .map(declaration => <details key={`declare${declaration.id.name}`}>
            <summary>
              {`${code.kind} ${declaration.id.name} = ${declaration.init ? declaration.init.value : "undefined"}`}
            </summary>
          </details>)}
      </ul>;
    default:
      return <>Default</>;
  }
}

export default CodeBlock;