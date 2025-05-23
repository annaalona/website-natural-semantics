import antlr4 from 'antlr4';

import JaneLexer from '../myAntlr/JaneLexer.js';
import JaneParser from '../myAntlr/JaneParser.js';
import JaneVisitor from '../myAntlr/JaneVisitor.js';

import {initializeLanguage, setupLanguagePicker,} from "./language-switcher.js";

import {assignmentRule, generateStatesHashMap, ifRule, semicolonRule, whileRule} from "./semantic-rules"

import {
  editorSecond,
  getEditor,
  getModel,
  initializeMonacoEditor,
  initializeSingleLineMonacoEditor,
  insertSymbol,
  resizeMonacoEditor,
  setupMonacoErrorSyntaxHighlighting
} from "./monaco-editor.js";

import {
  displayFinalStates,
  emptyAxiom,
  ifConditionResultToLatex,
  jsonToLatex,
  whileWithConditionResultToLatex,
} from "./generate-latex"

import {
  setupEnterGuessOfFinalStates,
  setupFileUploadListeners,
  setupGuessOfFinalStates,
  setupHelpMenuAndPasteExampleFeature,
  setupPlusMinusInputButtons,
  downloadMathAsSVG,
  setupExportLatexModal
} from "./interaction-with-user";

import {countSemicolonsJSON, hasOnlyOneAssignment, hasOnlyOneSkip, wrapInStatements} from "./utilities";

import {currentIndex, replaceStars, setupInteractiveMode} from "./interactive-mode";

import {createKeyboard} from "./ui"

export let stackOfStates = [];
export let latexCode;
export let iterationThroughStates = 0;
export let historyOfTree = [];
export let arrayOfIterationsInTree = [];
export let pairsOfStates = [];

let semicolonIterationsArray = [];
let semicolonIterator = 0;
let countSemicolons;
let isOnlyOneAssignment;
let isOnlyOneSkip;

setupFileUploadListeners();
setupHelpMenuAndPasteExampleFeature();
setupEnterGuessOfFinalStates();
setupGuessOfFinalStates();
setupPlusMinusInputButtons();
initializeMonacoEditor();
initializeSingleLineMonacoEditor();
setupMonacoErrorSyntaxHighlighting();
resizeMonacoEditor();
setupExportLatexModal();
createKeyboard();


export const editor = getEditor();
export const model = getModel();

// **********************************************************
//
//       RUN PROGRAM (main functionality of application)
//
// **********************************************************
const visualizeButton = document.getElementById("visualizeButton");
visualizeButton.addEventListener("click", function () {
  // Clear variables
  historyOfTree = [];
  historyOfTree.push(emptyAxiom);
  iterationThroughStates = 0;
  stackOfStates = [];

  let inputText = model.getValue();

  if (inputText.trim() !== "") {
    const result = createJSONStructure(inputText);

    // Start of the tree
    latexCode = '\\begin{prooftree}\n';

    // Analyzation of input
    countSemicolons = countSemicolonsJSON(result)
    isOnlyOneAssignment = hasOnlyOneAssignment(result)
    isOnlyOneSkip = hasOnlyOneSkip(result)

    // Create a map of states
    let startState = generateStatesHashMap();
    stackOfStates.push(startState);

    // Create a latex tree using recursion
    createDerivationTree(result);

    if (checkIfStatesValid()) {
      alert("Variables weren't defined properly. Please check your program.");
      return;
    }

    // End of the tree
    latexCode = latexCode + "\\end{prooftree}";

    // Clear the iterations for future comparing
    arrayOfIterationsInTree = deleteAllLatexElements(arrayOfIterationsInTree);

    displayFinalStates();
    setupInteractiveMode();

    const outputDiv = document.getElementById('outputResultArea');
    const interactiveResultArea = document.getElementById('interactiveResultArea');
    const mathkeyboard = document.getElementById('math-keyboard');

    // Put output latex into div
    outputDiv.innerHTML = latexCode;
    renderOutputLatex(outputDiv, interactiveResultArea, mathkeyboard);
  } else {
    alert("Please enter some code to visualize.");
  }
});

// *********** AUTOMATED USAGE OF SEMANTIC RULES ***********
export function createDerivationTree(node) {
  let solvedTree = {valueTree: node, leftTree: null, rightTree: null};
  switch (node.type) {
    case "statements":
      iterateThroughRules(node);
      break;
    case "if":
      createIfStructure(node);
      break;
    case "assignment":
      createAssignmentStructure(node);
      break;
    case "while":
      createWhileStructure(node);
      break;
    case "semicolon":
      createSemicolonStructure(node);
      break;
    case "skip":
      createSkipStructure();
      break;
  }
  return solvedTree;
}

function createJSONStructure(inputText) {
  let chars = new antlr4.InputStream(inputText);
  let lexer = new JaneLexer(chars);
  let tokens = new antlr4.CommonTokenStream(lexer);
  let parser = new JaneParser(tokens);
  let tree = parser.program();

  const visitor = new JaneVisitor();
  return visitor.visit(tree);
}

function checkIfStatesValid() {
  // Check for NaN in stackOfStates
  return stackOfStates.some(stateMap => {
    if (!(stateMap instanceof Map)) return false;
    for (const value of stateMap.values()) {
      if (Number.isNaN(value)) {
        return true;
      }
    }
    return false;
  });
}

function renderOutputLatex(outputDiv, interactiveResultArea, mathkeyboard) {
  try {
    MathJax.typesetPromise([outputDiv, interactiveResultArea, mathkeyboard]).then(() => {
      const interactiveButtons = document.getElementById('interactive-buttons');
      interactiveButtons.classList.add('visible');

      const formBox = document.querySelector('.form-box');
      if (formBox) {
        formBox.classList.add('visible');
      }

      const leftButton = document.getElementById('left-click-button');
      const rightButton = document.getElementById('right-click-button');

      if (leftButton && rightButton) {
        leftButton.classList.add('active');
        rightButton.classList.remove('active');
        updateSwitchPosition('left-click-button');

        if (isDarkTheme()) {
          leftButton.style.color = 'black';
          rightButton.style.color = 'white';
        } else {
          leftButton.style.color = 'white';
          rightButton.style.color = 'black';
        }
      }

      updateStatesList();
      if (isOnlyOneAssignment || isOnlyOneSkip) {
        document.getElementById('right-click-button').click();
      }
    });
  } catch (err) {
    console.error("MathJax error:", err);
  }
}

document.getElementById("exportButton").onclick = function() {
  downloadMathAsSVG();
}

// *********** SEMICOLON ***********

function createSemicolonStructure(node) {
  const {leftPart, rightPart} = semicolonRule(node);

  let elementOfHistory = emptyAxiom + emptyAxiom + `\\BinaryInfC{$\\langle ${jsonToLatex(node)}, s_0 \\rangle \\rightarrow s_#$}\n`;
  if (historyOfTree.length !== 0) {
    let previousElementInTreeHistory = historyOfTree[historyOfTree.length - 1];
    const lastAxiomCIndex = previousElementInTreeHistory.lastIndexOf('\\AxiomC{}');

    if (lastAxiomCIndex !== -1) {
      previousElementInTreeHistory = previousElementInTreeHistory.substring(0, lastAxiomCIndex) +
        `\\AxiomC{}\\AxiomC{}\\BinaryInfC{$\\langle ${jsonToLatex(node)}, s_# \\rangle \\rightarrow s_#$}\n` +
        previousElementInTreeHistory.substring(lastAxiomCIndex + '\\AxiomC{}'.length);
      historyOfTree.push(previousElementInTreeHistory);
    }
  } else {
    historyOfTree.push(elementOfHistory);
  }

  let singleSemicolonIteration = `\\langle ${jsonToLatex(node)}, s_# \\rangle \\rightarrow s_#`;
  arrayOfIterationsInTree.push(replaceStars(singleSemicolonIteration, pairsOfStates));

  let indexOfThisElement = arrayOfIterationsInTree.length - 1;

  // Semicolon structure
  createDerivationTree(leftPart);
  semicolonIterationsArray.push(iterationThroughStates);
  createDerivationTree(rightPart);

  let amountOfElements = semicolonIterationsArray.length;

  pairsOfStates.push(countSemicolons === 1 ? 0 :
    (semicolonIterationsArray.at(amountOfElements - semicolonIterator - 2)));
  pairsOfStates.push(stackOfStates.indexOf(stackOfStates[stackOfStates.length - 1]));

  arrayOfIterationsInTree[indexOfThisElement] = replaceStars(arrayOfIterationsInTree[indexOfThisElement], pairsOfStates);

  latexCode += `\\BinaryInfC{$\\langle ${jsonToLatex(node)}, s_${countSemicolons === 1 ? 0 :
    (semicolonIterationsArray.at(amountOfElements - semicolonIterator - 2))}
        \\rangle \\rightarrow s_${stackOfStates.indexOf(stackOfStates[stackOfStates.length - 1])}$}\n`;

  semicolonIterator++;
  countSemicolons--;
}

// *********** WHILE ***********

function createWhileStructure(node) {
  const startIterationForWhile = iterationThroughStates;
  const conditionsArray = whileRule(node);

  const conditionLatexSecond = jsonToLatex(node.condition);
  const boolResult = conditionsArray[conditionsArray.length - 1] ? "\\textbf{tt}" : "\\textbf{ff}";

  if(node.body[0].body[0].type === 'assignment') {
    iterationThroughStates++;
  }

  let latexCodeWhile = [];

  latexCodeWhile.push(((node.body[0].body[0].type === 'if' || node.body[0].body[0].type === 'semicolon')
      ? `\\AxiomC{$ \\mathscr{B} [ ${conditionLatexSecond} ] s_${iterationThroughStates} = ${boolResult}$}\n`
      : `\\AxiomC{$\\langle ${jsonToLatex(node.body[0])}, s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates]) - 1} \\rangle \\rightarrow s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates])}$}\n`),
      `\\BinaryInfC{$\\langle ${jsonToLatex(node)}, s_${iterationThroughStates === 0 ? iterationThroughStates : startIterationForWhile} \\rangle \\rightarrow s_${/*conditionsArray.length - 2 +*/ iterationThroughStates}$}\n`
  );

  if (historyOfTree.length !== 0) {
    let previousElementInTreeHistory = historyOfTree[historyOfTree.length - 1];
    const lastAxiomCIndex = previousElementInTreeHistory.indexOf('\\AxiomC{}');

    if (lastAxiomCIndex !== -1) {
      previousElementInTreeHistory = previousElementInTreeHistory.substring(0, lastAxiomCIndex) +
        `\\AxiomC{}\\AxiomC{}\\BinaryInfC{$\\langle ${jsonToLatex(node)}, s_${iterationThroughStates === 0 ? iterationThroughStates : iterationThroughStates - 1}
      \\rangle \\rightarrow s_${conditionsArray.length - 2 + iterationThroughStates}$}\n` +
        previousElementInTreeHistory.substring(lastAxiomCIndex + '\\AxiomC{}'.length);

      historyOfTree.push(previousElementInTreeHistory);

      let singleWhileIteration = `\\langle ${jsonToLatex(node)}, s_${iterationThroughStates === 0 ? iterationThroughStates : iterationThroughStates - 1} \\rangle \\rightarrow s_${conditionsArray.length - 2 + iterationThroughStates}`;
      arrayOfIterationsInTree.push(singleWhileIteration);
    }
  }

  for (let i = 1; i < conditionsArray.length; i++) {
    if (conditionsArray[i] === true) {
      if(node.body[0].body[0].type !== 'if' && node.body[0].body[0].type !== 'semicolon') {
        iterationThroughStates++;
      }
      const lastBinaryIndex = latexCodeWhile.findIndex(line => line.startsWith("\\BinaryInfC"));

      latexCodeWhile.splice(lastBinaryIndex, 0, (node.body[0].body[0].type === 'if' || node.body[0].body[0].type === 'semicolon') ? '' : `\\AxiomC{$\\langle ${jsonToLatex(node.body[0])}, s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates]) - 1} \\rangle \\rightarrow s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates])}$}\n`,
        `\\BinaryInfC{$\\langle ${whileWithConditionResultToLatex(node, conditionsArray[i], iterationThroughStates, false)}$}\n`);

      if (historyOfTree.length !== 0) {
        let previousElementInTreeHistory = historyOfTree[historyOfTree.length - 1];
        const lastAxiomCIndex = previousElementInTreeHistory.indexOf('\\AxiomC{}');

        if (lastAxiomCIndex !== -1) {
          previousElementInTreeHistory = previousElementInTreeHistory.substring(0, lastAxiomCIndex) +
            `\\AxiomC{$\\langle ${jsonToLatex(node.body[0])}, s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates]) - 2} \\rangle \\rightarrow s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates]) - 1}$}\n ` +
            previousElementInTreeHistory.substring(lastAxiomCIndex + '\\AxiomC{}'.length);
          historyOfTree.push(previousElementInTreeHistory);

          let singleWhileIteration = `\\langle ${jsonToLatex(node.body[0])}, s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates]) - 2} \\rangle \\rightarrow s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates]) - 1}`;
          arrayOfIterationsInTree.push(singleWhileIteration);
        }
      }

      if (historyOfTree.length !== 0) {
        let previousElementInTreeHistory = historyOfTree[historyOfTree.length - 1];
        const lastAxiomCIndex = previousElementInTreeHistory.indexOf('\\AxiomC{}');

        if (lastAxiomCIndex !== -1) {
          previousElementInTreeHistory = previousElementInTreeHistory.substring(0, lastAxiomCIndex) +
            `\\AxiomC{}\\AxiomC{}\\BinaryInfC{$\\langle ${whileWithConditionResultToLatex(node, conditionsArray[i], iterationThroughStates, false)}$}\n` +
            previousElementInTreeHistory.substring(lastAxiomCIndex + '\\AxiomC{}'.length);
          historyOfTree.push(previousElementInTreeHistory);

          let singleWhileIteration = `\\langle ${whileWithConditionResultToLatex(node, conditionsArray[i], iterationThroughStates, false)}`;
          arrayOfIterationsInTree.push(singleWhileIteration);
        }
      }
      if(conditionsArray[i + 1] === false) {
        if (historyOfTree.length !== 0) {
          let previousElementInTreeHistory = historyOfTree[historyOfTree.length - 1];
          const lastAxiomCIndex = previousElementInTreeHistory.indexOf('\\AxiomC{}');

          if (lastAxiomCIndex !== -1) {
            previousElementInTreeHistory = previousElementInTreeHistory.substring(0, lastAxiomCIndex) +
              `\\AxiomC{$\\langle ${jsonToLatex(node.body[0])}, s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates]) - 1} \\rangle \\rightarrow s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates])}$}\n ` +
              previousElementInTreeHistory.substring(lastAxiomCIndex + '\\AxiomC{}'.length);
            historyOfTree.push(previousElementInTreeHistory);

            let singleWhileIteration = `\\langle ${jsonToLatex(node.body[0])}, s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates]) - 1} \\rangle \\rightarrow s_${stackOfStates.indexOf(stackOfStates[iterationThroughStates])}`;
            arrayOfIterationsInTree.push(singleWhileIteration);
          }
        }
      }
      if(conditionsArray[i + 1] === false) {
        if (historyOfTree.length !== 0) {
          let previousElementInTreeHistory = historyOfTree[historyOfTree.length - 1];
          const lastAxiomCIndex = previousElementInTreeHistory.indexOf('\\AxiomC{}');

          if (lastAxiomCIndex !== -1) {
            previousElementInTreeHistory = previousElementInTreeHistory.substring(0, lastAxiomCIndex) +
              `\\AxiomC{}\n \\UnaryInfC{$\\langle ${whileWithConditionResultToLatex(node, conditionsArray[i], iterationThroughStates, true)}$}\n` +
              previousElementInTreeHistory.substring(lastAxiomCIndex + '\\AxiomC{}'.length);

            historyOfTree.push(previousElementInTreeHistory);

            let lastTree = historyOfTree[historyOfTree.length - 1];
            const emptyAxiomIndex = lastTree.indexOf('\\AxiomC{}');

            if (emptyAxiomIndex !== -1) {
              const filledTree =
                lastTree.substring(0, emptyAxiomIndex) +
                `\\AxiomC{$ ${whileWithConditionResultToLatex(node, conditionsArray[i + 1], iterationThroughStates, false)} $}` +
                lastTree.substring(emptyAxiomIndex + '\\AxiomC{}'.length);

              historyOfTree.push(filledTree);
            }
            let singleWhileIterationSecond = `\\langle ${whileWithConditionResultToLatex(node, conditionsArray[i], iterationThroughStates, true)}`;
            arrayOfIterationsInTree.push(singleWhileIterationSecond);

            let singleWhileIterationFirst = `${whileWithConditionResultToLatex(node, conditionsArray[i + 1], iterationThroughStates, false)}`;
            arrayOfIterationsInTree.push(singleWhileIterationFirst);

          }
        }
      }
    } else {
      const lastBinaryIndex = latexCodeWhile.findIndex(line => line.startsWith("\\BinaryInfC"));

      if (lastBinaryIndex !== -1) {
        latexCodeWhile.splice(lastBinaryIndex, 0, ((node.body[0].body[0].type === 'if' || node.body[0].body[0].type === 'semicolon') ? '' : `\\AxiomC{$ ${whileWithConditionResultToLatex(node, conditionsArray[i], iterationThroughStates, false)} $}\n`),
          `\\UnaryInfC{$\\langle ${whileWithConditionResultToLatex(node, conditionsArray[i - 1], iterationThroughStates, true)}$}\n`);
      }
    }
  }
  latexCode += latexCodeWhile.join("");
}

function isDarkTheme() {
  return document.documentElement.classList.contains('dark-theme');
}

function updateSwitchPosition(activeButtonId) {
  const activeButton = document.getElementById(activeButtonId);
  const switchElement = document.getElementById('button-switch');

  const buttonWidth = activeButton.offsetWidth;
  const buttonLeft = activeButton.offsetLeft;

  switchElement.style.width = `${buttonWidth}px`;
  switchElement.style.left = `${buttonLeft}px`;
}

function leftClick() {
  updateSwitchPosition('left-click-button');

  if (isDarkTheme()) {
    document.getElementById('left-click-button').style.color = 'black';
    document.getElementById('right-click-button').style.color = 'white';
  } else {
    document.getElementById('left-click-button').style.color = 'white';
    document.getElementById('right-click-button').style.color = 'black';
  }

  document.getElementById('outputResultArea').style.display = 'none';
  document.getElementById('interactiveResultArea').style.display = 'block';
  document.getElementById('interactive-buttons').style.display = 'block';
  document.getElementById('monaco-editor-container-single').style.visibility = 'hidden';
  document.getElementById('math-keyboard').style.display = 'none';
  document.getElementById('enterAllStates').style.display = 'none';

  const guessNextState = document.getElementById('guessNextState');
  const guessAllStatesButton = document.getElementById('guessAllStatesButton');

  guessNextState.disabled = false;
  guessNextState.style.opacity = '1';

  if (currentIndex > 0) {
    guessAllStatesButton.disabled = false;
    guessAllStatesButton.style.opacity = '1';
  } else {
    guessAllStatesButton.disabled = true;
    guessAllStatesButton.style.opacity = '0.5';
  }

  const backButton = document.getElementById('backButton');
  const forwardButton = document.getElementById('forwardButton');
  backButton.disabled = false;
  backButton.style.opacity = '1';
  forwardButton.disabled = false;
  forwardButton.style.opacity = '1';


  const statesPanel = document.querySelector('.states-panel-container');
  if (statesPanel) {
    statesPanel.classList.remove('active');
  }
}


function rightClick() {
  updateSwitchPosition('right-click-button');

  if (isDarkTheme()) {
    document.getElementById('left-click-button').style.color = 'white';
    document.getElementById('right-click-button').style.color = 'black';
  } else {
    document.getElementById('left-click-button').style.color = 'black';
    document.getElementById('right-click-button').style.color = 'white';
  }

  document.getElementById('outputResultArea').style.display = 'block';
  document.getElementById('interactiveResultArea').style.display = 'none';
  document.getElementById('interactive-buttons').style.display = 'none';
  document.getElementById('monaco-editor-container-single').style.visibility = 'hidden';
  document.getElementById('math-keyboard').style.display = 'none';
  document.getElementById('enterAllStates').style.display = 'none';
  document.getElementById('check-button').style.display = 'none';


  const statesPanel = document.querySelector('.states-panel-container');
  if (statesPanel) {
    statesPanel.classList.add('active');
    updateStatesList();
  }
}

document.getElementById('right-click-button').addEventListener('click', rightClick);
document.getElementById('left-click-button').addEventListener('click', leftClick);

export function updateGuessAllStatesButton() {
  const guessAllStatesButton = document.getElementById('guessAllStatesButton');
  if (guessAllStatesButton) {
    if (currentIndex < 2) {
      guessAllStatesButton.disabled = true;
      guessAllStatesButton.style.opacity = '0.5';
    } else {
      guessAllStatesButton.disabled = false;
      guessAllStatesButton.style.opacity = '1';
    }
  }
}

document.getElementById('right-click-button').addEventListener('click', function() {

  const guessFinalStates = document.getElementById('guessFinalStates');
  const mathKeyboard = document.getElementById('math-keyboard');
  const monacoSingleLine = document.getElementById('monaco-editor-container-single');
  const checkButton = document.getElementById('check-button');

  if (guessFinalStates) {
    guessFinalStates.style.display = 'none';
  }
  if (mathKeyboard) {
    mathKeyboard.style.display = 'none';
    mathKeyboard.classList.remove('visible');
  }
  if (monacoSingleLine) {
    monacoSingleLine.style.visibility = 'hidden';
  }
  if (checkButton) {
    checkButton.style.display = 'none';
    checkButton.classList.remove('visible');
  }
  updateGuessAllStatesButton();
});


document.getElementById('left-click-button').addEventListener('click', function() {
  const guessFinalStates = document.getElementById('guessFinalStates');
  if (guessFinalStates && guessFinalStates.classList.contains('visible')) {
    guessFinalStates.style.display = 'block';
  }
  updateGuessAllStatesButton();
});


document.getElementById('forwardButton').addEventListener('click', function() {
  setTimeout(updateGuessAllStatesButton, 0);
});


document.getElementById('backButton').addEventListener('click', function() {
  setTimeout(updateGuessAllStatesButton, 0);
});

// *********** ASSIGNMENT ***********

function createAssignmentStructure(node) {
  if (isOnlyOneAssignment === false) {
    let assignmentStructure = `\\AxiomC{$\\langle ${jsonToLatex(node)}, s_${iterationThroughStates}
        \\rangle \\rightarrow s_${iterationThroughStates + 1}$}\n`

    latexCode += assignmentStructure;
    if (historyOfTree.length !== 0) {
      let previousElementInTreeHistory = historyOfTree[historyOfTree.length - 1];
      let elementOfHistory = previousElementInTreeHistory.replace('\\AxiomC{}', assignmentStructure);
      historyOfTree.push(elementOfHistory);
    }
  } else {
    latexCode += `\\AxiomC{}\n`;
    latexCode += `\\UnaryInfC{$\\langle ${jsonToLatex(node)}, s_${iterationThroughStates}
        \\rangle \\rightarrow s_${iterationThroughStates + 1}$}\n`;

    historyOfTree.push(emptyAxiom + `\\UnaryInfC{$\\langle ${jsonToLatex(node)}, s_${iterationThroughStates}
        \\rangle \\rightarrow s_${iterationThroughStates + 1}$}\n`)
    document.getElementById('switch-element').style.visibility = 'hidden';
  }
  let assignmentSingleIteration = `\\langle ${jsonToLatex(node)}, s_${iterationThroughStates}
        \\rangle \\rightarrow s_${iterationThroughStates + 1}`
  arrayOfIterationsInTree.push(assignmentSingleIteration);

  assignmentRule(node);
  iterationThroughStates++;
}


function deleteAllLatexElements(array) {
  return array.map(str =>
    str.replace(/\\texttt{([^}]*)}/g, '$1')
      .replace(/\\textbf{([^}]*)}/g, '$1')
      .replace(/\\:/g, '')
      .replace(/\\,/g, '')
      .replace(/\\!/g, '')
      .replace(/\\(?!mathscr|rightarrow|langle|rangle)[a-zA-Z]+(\{[^}]*\})?/g, '')
      .replace(/\s+/g, '')
  );
}

document.getElementById('guessNextState').addEventListener('click', function() {

    const monacoSingleLine = document.getElementById('monaco-editor-container-single');
    monacoSingleLine.style.visibility = 'visible';
    const keyboard = document.getElementById('math-keyboard');
    keyboard.classList.add('visible');
    keyboard.style.display = 'flex';

    const checkButton = document.getElementById('check-button');
    checkButton.style.display = 'inline-flex';
    checkButton.classList.add('visible');

    if (editorSecond) {
        editorSecond.setValue('');
    }

    const guessAllStatesButton = document.getElementById('guessAllStatesButton');
    guessAllStatesButton.disabled = true;
    guessAllStatesButton.style.opacity = '0.5';

    const backButton = document.getElementById('backButton');
    const forwardButton = document.getElementById('forwardButton');
    backButton.disabled = true;
    backButton.style.opacity = '0.5';
    forwardButton.disabled = true;
    forwardButton.style.opacity = '0.5';
});

document.getElementById('guessAllStatesButton').addEventListener('click', function() {
    const guessNextState = document.getElementById('guessNextState');
    guessNextState.disabled = true;
    guessNextState.style.opacity = '0.5';

    const backButton = document.getElementById('backButton');
    const forwardButton = document.getElementById('forwardButton');
    backButton.disabled = true;
    backButton.style.opacity = '0.5';
    forwardButton.disabled = true;
    forwardButton.style.opacity = '0.5';
});

// *********** IF ***********

function createIfStructure(node) {
  const {isConditionTrue, thenOrElseStructure} = ifRule(node);
  let wrappedStructure = wrapInStatements(thenOrElseStructure);

  let stateBeforeIfBody = iterationThroughStates;

  if (historyOfTree.length !== 0) {
    let previousElementInTreeHistory = historyOfTree[historyOfTree.length - 1];
    const lastAxiomCIndex = previousElementInTreeHistory.indexOf('\\AxiomC{}');

    if (lastAxiomCIndex !== -1) {
      previousElementInTreeHistory = previousElementInTreeHistory.substring(0, lastAxiomCIndex) +
        `\\AxiomC{}\\AxiomC{}\\BinaryInfC{$\\langle ${jsonToLatex(node)}, s_${stateBeforeIfBody}
      \\rangle \\rightarrow s_#$}\n` +
        previousElementInTreeHistory.substring(lastAxiomCIndex + '\\AxiomC{}'.length);
      historyOfTree.push(previousElementInTreeHistory);
    }
  }

  let ifSingleIteration = `\\langle ${jsonToLatex(node)}, s_${stateBeforeIfBody}
      \\rangle \\rightarrow s_#\n`;
  arrayOfIterationsInTree.push(ifSingleIteration);

  let indexOfThisElement = arrayOfIterationsInTree.length - 1;

  createDerivationTree(
    wrappedStructure.body.length === 1 ? wrappedStructure.body[0] : wrappedStructure
  );

  if (historyOfTree.length !== 0) {

    let previousElementInTreeHistory = historyOfTree[historyOfTree.length - 1];

    const lastAxiomCIndex = previousElementInTreeHistory.indexOf('\\AxiomC{}');

    if (lastAxiomCIndex !== -1) {
      previousElementInTreeHistory = previousElementInTreeHistory.substring(0, lastAxiomCIndex) +
        `\\AxiomC{$ ${ifConditionResultToLatex(node.condition, isConditionTrue, stateBeforeIfBody)}$}\n` +
        previousElementInTreeHistory.substring(lastAxiomCIndex + '\\AxiomC{}'.length);
      historyOfTree.push(previousElementInTreeHistory);
    }
  }

  pairsOfStates.push(iterationThroughStates);
  arrayOfIterationsInTree[indexOfThisElement] = replaceStars(arrayOfIterationsInTree[indexOfThisElement], pairsOfStates);

  let resultIfSingleIteration = `${ifConditionResultToLatex(node.condition, isConditionTrue, stateBeforeIfBody)}`;

  arrayOfIterationsInTree.push(resultIfSingleIteration);

  latexCode += `\\AxiomC{$ ${ifConditionResultToLatex(node.condition, isConditionTrue, stateBeforeIfBody)}$}\n`;
  latexCode += `\\BinaryInfC{$\\langle ${jsonToLatex(node)}, s_${stateBeforeIfBody}
      \\rangle \\rightarrow s_${iterationThroughStates}$}\n`;
}

// *********** STATEMENTS ***********

function iterateThroughRules(node) {
  node.body.forEach(() => {
    if (node.body.length === 1) {
      createDerivationTree(node.body[0]);
    } else {
      node.body.forEach((childNode) => {
        createDerivationTree(childNode);
      });
    }
  });
}

// *********** SKIP ***********

function createSkipStructure() {
  if (isOnlyOneSkip === false) {
    let skipStructure = `\\AxiomC{$\\langle\\texttt{skip}, s_${iterationThroughStates}\\rangle \\rightarrow s_${iterationThroughStates}$}\n`;

    latexCode += skipStructure;

    if (historyOfTree.length !== 0) {
      let previousElementInTreeHistory = historyOfTree[historyOfTree.length - 1];
      let elementOfHistory = previousElementInTreeHistory.replace('\\AxiomC{}', skipStructure);
      historyOfTree.push(elementOfHistory);
    }
  } else {
    latexCode += `\\AxiomC{}\n`;
    latexCode += `\\UnaryInfC{$\\langle \\texttt{skip}, s_${iterationThroughStates}
        \\rangle \\rightarrow s_${iterationThroughStates}$}\n`;

    historyOfTree.push(emptyAxiom + `\\UnaryInfC{$\\langle \\texttt{skip}, s_${iterationThroughStates}
        \\rangle \\rightarrow s_${iterationThroughStates}$}\n`)
    document.getElementById('switch-element').style.visibility = 'hidden';
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeLanguage();
  setupLanguagePicker();
  leftClick();

  const toggleButton = document.getElementById('toggleStatesButton');
  if (toggleButton) {
  toggleButton.addEventListener('click', function() {
    const panel = document.getElementById('statesPanel');
    const isActive = panel.classList.contains('active');

    if (isActive) {
      panel.classList.remove('active');
      this.textContent = 'Показати стани';
    } else {
      panel.classList.add('active');
      this.textContent = 'Приховати стани';
      updateStatesList();
    }
  });
  }
});

function updateStatesList() {
  const statesList = document.getElementById('statesList');
  if (!statesList) return;

  statesList.innerHTML = '';

  const initialStateElement = document.createElement('div');
  initialStateElement.className = 'state-item';

  const initialEntries = Array.from(stackOfStates[0]);
  const initialAssignments = initialEntries.map(([key, value]) => `${key} = ${value}`).join(', ');
  let initialLatexContent = `\\[s_0 = ${initialAssignments}\\]`;

  initialStateElement.innerHTML = initialLatexContent;
  statesList.appendChild(initialStateElement);

  for (let i = 1; i < stackOfStates.length; i++) {
    const stateElement = document.createElement('div');
    stateElement.className = 'state-item';

    const changes = Array.from(stackOfStates[i])
      .map(([key, value]) => `${key} \\mathrel{\\mapsto} ${value}`).join(", ");

    const mathExpression = `\\[s_{${i}} = s_{${i-1}} [ ${changes} ]\\]`;
    stateElement.innerHTML = mathExpression;
    statesList.appendChild(stateElement);
  }

  MathJax.typesetPromise([statesList]).then(() => {
  }).catch((err) => {
    console.error('MathJax rendering error:', err);
  });
}

const styleSheet = document.styleSheets[0];
const stateItemStyles = [
  `.state-item {
    background: #f8f9fa;
    border: 1px solid #4CAF50;
    border-radius: 8px;
    padding: 20px;
    margin: 15px 0;
    transition: all 0.3s ease;
    cursor: pointer;
  }`,
  `.state-item:hover {
    transform: translateX(-5px);
    box-shadow: 2px 2px 8px rgba(76, 175, 80, 0.2);
  }`,
  `html.dark-theme .state-item,
   body.dark-theme .state-item {
     background: #2a2d3e;
     border-color: #9370DB;
     color: #ffffff;
  }`,
  `html.dark-theme .state-item:hover,
   body.dark-theme .state-item:hover {
     box-shadow: 2px 2px 8px rgba(147, 112, 219, 0.2);
  }`,
  `.state-item .MathJax {
    font-size: 16px !important;
    margin: 0 !important;
  }`
];

stateItemStyles.forEach(rule => {
  styleSheet.insertRule(rule, styleSheet.cssRules.length);
});

document.getElementById('check-button').addEventListener('click', function() {
    const backButton = document.getElementById('backButton');
    const forwardButton = document.getElementById('forwardButton');
    backButton.disabled = false;
    backButton.style.opacity = '1';
    forwardButton.disabled = false;
    forwardButton.style.opacity = '1';

    const resultElement = document.getElementById("result");
    if (resultElement && resultElement.innerText.includes("✅")) {
        const monacoSingleLine = document.getElementById('monaco-editor-container-single');
        const guessAllStatesButton = document.getElementById('guessAllStatesButton');
        if (monacoSingleLine && monacoSingleLine.style.visibility === 'hidden') {
            guessAllStatesButton.disabled = false;
            guessAllStatesButton.style.opacity = '1';
        }
        forwardButton.click();
    }
});

document.getElementById('forwardButton').addEventListener('click', function() {
  setupGuessAllStatesButton();
});

document.getElementById('backButton').addEventListener('click', function() {
  setupGuessAllStatesButton();
});

function setupGuessAllStatesButton() {
  const guessAllStatesButton = document.getElementById('guessAllStatesButton');
  if (guessAllStatesButton) {
    if (currentIndex === 0) {
      guessAllStatesButton.disabled = true;
      guessAllStatesButton.style.opacity = '0.5';
    } else {
      guessAllStatesButton.disabled = false;
      guessAllStatesButton.style.opacity = '1';
    }
  }
}
