import {stackOfStates} from "./index";
import {latexCode} from "./index"

export let emptyAxiom = `\\AxiomC{}\n`;


document.getElementById("export-latex-button").addEventListener("click", function () {
  document.getElementById("latexContent").textContent = latexCode;
  document.getElementById("latexModal").style.display = "block";
  document.getElementById("modalOverlay").style.display = "block";
});

window.closeModal = function () {
  document.getElementById("latexModal").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";
};

export function jsonToLatex(node) {
  if (!node) return "";

  switch (node.type) {
    case "assignment":
      const variable = node.variable;
      const valueExpression = node.value.map(jsonToLatex).join(" ");
      return `${variable} := ${valueExpression}`;

    case "binary":
      const left = jsonToLatex(node.left);
      const right = jsonToLatex(node.right);
      return `${left} ${node.operator} ${right}`;

    case "variable":
      return node.name;

    case "number":
      return node.value;

    case "if":
      const condition = jsonToLatex(node.condition);
      const thenBranch = node.thenBranch.body.map(jsonToLatex).join(" ");
      const elseBranch = node.elseBranch.body.map(jsonToLatex).join(" ");
      return `\\texttt{if}(${condition}) \\: \\texttt{then} \\: ${thenBranch} \\: \\texttt{else} \\: ${elseBranch}`;

    case "while":
      const whileCondition = jsonToLatex(node.condition);
      const whileBody = node.body.map(jsonToLatex).join(" ");
      return `\\texttt{while}(${whileCondition}) \\: \\texttt{do} \\: ${whileBody}`;

    case "semicolon":
      const leftPart = jsonToLatex(node.leftSemicolon);
      const rightPart = jsonToLatex(node.rightSemicolon);
      return `${leftPart}; \\: ${rightPart}`;

    case "comparison":
      const compLeft = jsonToLatex(node.left);
      const compRight = jsonToLatex(node.right);
      return `${compLeft} ${node.operator} ${compRight}`;

    case "statements":
      return node.body.map(jsonToLatex).join(" ");

    default:
      console.warn(`Unknown node type: ${node.type}`);
      return "";
  }
}

export function ifConditionResultToLatex(condition, result, startState) {
  const conditionLatex = jsonToLatex(condition);
  const boolResult = result ? "\\textbf{tt}" : "\\textbf{ff}";
  return `\\mathscr{B} \\left[\\!\\left[ ${conditionLatex} \\right]\\!\\right] s_${startState} = ${boolResult}`;
}

export function whileWithConditionResultToLatex(node, result, iterationThroughStates, isLastStatement) {
  const whileLatex = jsonToLatex(node);
  const conditionLatex = jsonToLatex(node.condition);
  const boolResult = result ? "\\textbf{tt}" : "\\textbf{ff}";


  return result === true ? (isLastStatement === false ? `${whileLatex}, s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates]) - 1}
      \\rangle \\rightarrow s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates])},\\, \\mathscr{B} \\left[\\!\\left[ ${conditionLatex} \\right]\\!\\right] s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates]) - 2} = ${boolResult}`
      : `${whileLatex}, s_${iterationThroughStates}  \\rangle \\rightarrow s_${iterationThroughStates},\\, \\mathscr{B} \\left[\\!\\left[ ${conditionLatex} \\right]\\!\\right] s_${iterationThroughStates - 1} = ${boolResult}`)
    : `\\mathscr{B} \\left[\\!\\left[ ${conditionLatex} \\right]\\!\\right] s_${iterationThroughStates} = ${boolResult}`;
}

export function displayFinalStates() {
  const statesDiv = document.getElementById("states");

  for (let i = 1; i < stackOfStates.length; i++) {
    const currentIndex = i;
    const previousIndex = i - 1;

    const changes = Array.from(stackOfStates[i])
      .map(([key, value]) => `${key} \\mathrel{\\mapsto} ${value}`)
      .join(", ");

    const mathExpression = `
        s_{${currentIndex}} = s_{${previousIndex}} [ ${changes} ]
      `;

    const p = document.createElement("p");
    p.textContent = `$$${mathExpression}$$`;
    statesDiv.appendChild(p);
  }
}

export function makeGuessOfFinalStates() {
  const statesDiv = document.getElementById("guessFinalStates");
  statesDiv.innerHTML = "";

  for (let i = 1; i < stackOfStates.length; i++) {
    const currentIndex = i;
    const previousIndex = i - 1;

    const mathExpression = `s_{${currentIndex}} = s_{${previousIndex}}`;

    const containerId = `stateContainer-${currentIndex}`;

    const container = document.createElement("div");
    container.id = containerId;
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.marginBottom = "8px";

    const p = document.createElement("p");
    p.textContent = `$$${mathExpression}$$`;
    p.style.marginRight = "10px";

    const varInput = document.createElement("input");
    varInput.type = "text";
    varInput.id = `varName-${currentIndex}`;
    varInput.placeholder = "Variable name";
    varInput.style.padding = "5px";
    varInput.style.border = "1px solid #ccc";
    varInput.style.borderRadius = "4px";
    varInput.style.marginRight = "5px";

    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.id = `varValue-${currentIndex}`;
    valueInput.placeholder = "Value";
    valueInput.style.padding = "5px";
    valueInput.style.border = "1px solid #ccc";
    valueInput.style.borderRadius = "4px";

    container.appendChild(p);
    container.appendChild(varInput);
    container.appendChild(valueInput);
    statesDiv.appendChild(container);
  }
}



export async function renderLatex() {
  const outputDiv = document.getElementById('outputResultArea');
  outputDiv.innerHTML = latexCode;
  const interactiveResultArea = document.getElementById('interactiveResultArea');


  MathJax.typesetPromise([interactiveResultArea, outputDiv]).then(() => {
  }).catch((err) => {
    console.error("MathJax error:", err);
  });

}




