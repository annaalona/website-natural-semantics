import {removeStatements} from "./utilities";
import {stackOfStates, createDerivationTree} from "./index";

export function whileRule(jsonResult) {
  let actualState = stackOfStates[stackOfStates.length - 1];

  let condition = jsonResult.condition;
  let loopBody;
  let isCondition = evaluateCondition(condition, actualState);
  let conditionsArray = [];
  conditionsArray.push(isCondition);

  while (isCondition) {
    loopBody = jsonResult.body[0];
    updateStateBasedOnBranch(actualState, loopBody, "while");
    isCondition = evaluateCondition(condition, stackOfStates[stackOfStates.length - 1]);
    conditionsArray.push(isCondition);
  }

  return conditionsArray;
}

export function ifRule(jsonResult) {
  let actualState = stackOfStates[stackOfStates.length - 1];

  let isConditionTrue = evaluateCondition(jsonResult.condition, actualState);
  let thenOrElseStructure = isConditionTrue ? jsonResult.thenBranch.body : jsonResult.elseBranch.body;

  updateStateBasedOnBranch(actualState, thenOrElseStructure, "if");

  return {isConditionTrue, thenOrElseStructure};
}
export function semicolonRule(json) {
  if (json.type === 'semicolon') {
    const leftPart = json.leftSemicolon || null;
    let rightPart = json.rightSemicolon || null;

    rightPart = removeStatements(rightPart);

    return {leftPart, rightPart};
  }

  return false;
}

export function assignmentRule(jsonResult) {
  let actualState = stackOfStates[stackOfStates.length - 1];
  let newState = new Map(actualState);
  let assignment = jsonResult;
  let variableName = assignment.variable;
  let newValue = evaluateExpression(assignment.value[0], newState);

  newState.set(variableName, newValue);

  stackOfStates.push(newState);
}

function updateStateBasedOnBranch(actualState, thenOrElseStructure, rule) {
  let newState = new Map(actualState);

  if (rule === "while") {
    thenOrElseStructure.body.forEach(statement => {
      if (statement.type === 'assignment') {
        const variableName = statement.variable;
        const newValue = evaluateExpression(statement.value[0], stackOfStates[stackOfStates.length - 1]);
        newState.set(variableName, newValue);
        stackOfStates.push(newState);
      } else {
        createDerivationTree(statement);
      }
    });
  } else if (rule === "if") {
    thenOrElseStructure.forEach(statement => {
      if (statement.type === 'assignment') {
        const variableName = statement.variable;
        const newValue = evaluateExpression(statement.value[0], newState);
        newState.set(variableName, newValue);
      }
    });
  }
}

function evaluateExpression(expression, actualState) {
  switch (expression.type) {
    case 'variable':
      if (actualState.has(expression.name)) {
        return actualState.get(expression.name);
      }
      break;
    case 'number':
      return expression.value;
    case 'binary':
      let leftValue = evaluateExpression(expression.left, actualState);
      let rightValue = evaluateExpression(expression.right, actualState);

      switch (expression.operator) {
        case '+':
          return leftValue + rightValue;
        case '-':
          return leftValue - rightValue;
        case '*':
          return leftValue * rightValue;
        case '/':
          return leftValue / rightValue;
        default:
          throw new Error(`Unknown binary operator: ${expression.operator}`);
      }
    default:
      throw new Error(`Unknown expression type: ${expression.type}`);
  }
}

function evaluateCondition(condition, actualState) {
  let leftValue = evaluateExpression(condition.left, actualState);
  let rightValue = evaluateExpression(condition.right, actualState);

  switch (condition.operator) {
    case '<':
      return leftValue < rightValue;
    case '<=':
      return leftValue <= rightValue;
    case '>':
      return leftValue > rightValue;
    case '>=':
      return leftValue >= rightValue;
    case '==':
      return leftValue === rightValue;
    case '!=':
      return leftValue !== rightValue;
    default:
      throw new Error(`Unknown comparison operator: ${condition.operator}`);
  }
}

export function generateStatesHashMap() {
  let hashMap = new Map();

  let containers = document.querySelectorAll("#inputsParentContainer > div");

  containers.forEach(function (container) {
    let keyInput = container.querySelector('input[id^="inpVar"]');
    let valueInput = container.querySelector('input[id^="inp"]:not([id^="inpVar"])');

    if (
      keyInput &&
      valueInput &&
      keyInput.value.trim() !== "" &&
      valueInput.value.trim() !== "" &&
      !isNaN(parseInt(valueInput.value, 10))
    ) {
      hashMap.set(keyInput.value.trim(), parseInt(valueInput.value, 10));
    }
  });

  return hashMap;
}
