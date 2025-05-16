import {arrayOfIterationsInTree, historyOfTree, pairsOfStates, updateGuessAllStatesButton} from "./index";
import {editorSecond} from "./monaco-editor.js";
import {getCurrentTranslations} from "./language-switcher";

const forwardButton = document.getElementById("forwardButton");
const backButton = document.getElementById("backButton");
const interactiveResultArea = document.getElementById("interactiveResultArea");

export let iterationThroughHistoryOfTree = 1;
export let currentIndex = 0;

let isGuessing = false;

export function replaceStars(historyOfTree, pairsOfStates) {
  const starRegex = /\#/g;
  const reversedPairs = [...pairsOfStates].reverse();
  let result = historyOfTree;
  const occurrences = [...result.matchAll(starRegex)].map(match => match.index).reverse();

  occurrences.forEach(index => {
    if (reversedPairs.length > 0) {
      const replacement = `{${reversedPairs.shift()}}`;
      result = result.substring(0, index) + replacement + result.substring(index + 1);
    }
  });

  return result;
}

function checkInput() {
  if (!editorSecond || currentIndex >= arrayOfIterationsInTree.length) return;

  const symbolMap = {
    "→": "\\rightarrow",
    "⟨": "\\langle",
    "⟩": "\\rangle",
    "B": "\\mathscrB",
    "⟦": "[[",
    "⟧": "]]",
    "s_?": "s_?"
  };

  function removeCurlyBraces(input) {
    return input.replace(/[{}]/g, '');
  }

  function convertToLatex(input) {
    return input.replace(/\s+/g, '').replace(/→|⟨|⟩|⟦|⟧|tt|ff|s_\?|B/g, match => symbolMap[match] || match);
  }

  let userInput = convertToLatex(editorSecond.getValue());
  const resultElement = document.getElementById("result");

  if (userInput === removeCurlyBraces(arrayOfIterationsInTree[currentIndex].replace(/\s+/g, ''))) {
    resultElement.innerText = "✅ Correct answer!";
    resultElement.style.color = "green";

    setTimeout(() => {
      hideElements();
    }, 5000);

  } else {
    const t = getCurrentTranslations();
    resultElement.innerHTML = `❌ ${t.incorrectAnswer || 'Неправильно. Спробуйте ще раз!'} ` +
      `<button id='retryInlineBtn' class='retry-inline-btn'></button>`;
    resultElement.style.color = "red";
    document.getElementById('retryInlineBtn').onclick = function() {
      resultElement.innerText = '';
    };
  }
}

function hideElements() {
  const monacoSingleLine = document.getElementById('monaco-editor-container-single');
  const keyboard = document.getElementById('math-keyboard');
  const checkButton = document.getElementById('check-button');
  const resultElement = document.getElementById("result");

  monacoSingleLine.style.visibility = 'hidden';
  keyboard.style.display = 'none';
  keyboard.classList.remove('visible');
  checkButton.style.display = 'none';
  checkButton.classList.remove('visible');
  resultElement.innerText = '';
}



document.getElementById('check-button').addEventListener('click', function() {
    checkInput();

    const resultElement = document.getElementById("result");
    if (resultElement && resultElement.innerText.includes("✅")) {
        const backButton = document.getElementById('backButton');
        const forwardButton = document.getElementById('forwardButton');
        backButton.disabled = false;
        backButton.style.opacity = '1';
        forwardButton.disabled = false;
        forwardButton.style.opacity = '1';

        isGuessing = false;
        const guessAllStatesButton = document.getElementById('guessAllStatesButton');
        if (currentIndex > 1) {
            guessAllStatesButton.disabled = false;
            guessAllStatesButton.style.opacity = '1';
        }
        forwardButton.click();
    }
});

function forwardButtonLogic() {
    if (iterationThroughHistoryOfTree + 1 < historyOfTree.length) {
        historyOfTree[iterationThroughHistoryOfTree + 1] = replaceStars(historyOfTree[iterationThroughHistoryOfTree + 1], pairsOfStates)
    }

    if (iterationThroughHistoryOfTree < historyOfTree.length - 1) {
        iterationThroughHistoryOfTree++;
        currentIndex = iterationThroughHistoryOfTree;

        interactiveResultArea.innerHTML = "\\begin{prooftree}" + historyOfTree[iterationThroughHistoryOfTree] + "\\end{prooftree}";

        const guessAllStatesButton = document.getElementById('guessAllStatesButton');
        if (!isGuessing) {
            guessAllStatesButton.disabled = iterationThroughHistoryOfTree === 0;
            guessAllStatesButton.style.opacity = iterationThroughHistoryOfTree === 0 ? '0.5' : '1';
        }

        MathJax.typesetPromise([interactiveResultArea]).then(() => {
        }).catch((err) => {
            console.error("MathJax error:", err);
        });
    }
}

function backButtonLogic() {
  if (iterationThroughHistoryOfTree > 1) {
    const guessAllStatesButton = document.getElementById('guessAllStatesButton');
    if (iterationThroughHistoryOfTree === 2) {
      guessAllStatesButton.disabled = true;
      guessAllStatesButton.style.opacity = '0.5';
    }

    iterationThroughHistoryOfTree--;
    currentIndex = iterationThroughHistoryOfTree;
    interactiveResultArea.innerHTML = "\\begin{prooftree}" + historyOfTree[iterationThroughHistoryOfTree] + "\\end{prooftree}";

    MathJax.typesetPromise([interactiveResultArea]).then(() => {

    }).catch((err) => {
      console.error("MathJax error:", err);
    });
  }
}

export function setupInteractiveMode() {
  const guessAllStatesButton = document.getElementById('guessAllStatesButton');
  guessAllStatesButton.disabled = true;
  guessAllStatesButton.style.opacity = '0.5';

  forwardButton.removeEventListener("click", forwardButtonLogic);
  forwardButton.addEventListener("click", forwardButtonLogic);

  backButton.removeEventListener("click", backButtonLogic);
  backButton.addEventListener("click", backButtonLogic);

  document.getElementById('outputResultArea').style.display = 'none';
  document.getElementById('interactiveResultArea').style.display = 'block';
  document.getElementById('interactive-buttons').style.display = 'block';

  const interactiveResultArea = document.getElementById("interactiveResultArea");
  if (1 < historyOfTree.length) {
    historyOfTree[1] = replaceStars(historyOfTree[1], pairsOfStates)
  }

  if (1 < historyOfTree.length - 1) {
    interactiveResultArea.innerHTML = "\\begin{prooftree}" + historyOfTree[1] + "\\end{prooftree}";
  }
}

const guessNextStateButton = document.getElementById('guessNextState');
if (guessNextStateButton) {
  let cancelGuessButton = document.getElementById('cancelGuessButton');
  if (!cancelGuessButton) {
    cancelGuessButton = document.createElement('button');
    cancelGuessButton.id = 'cancelGuessButton';
    cancelGuessButton.className = 'button cancel-button';
    cancelGuessButton.textContent = getCurrentTranslations().cancelButton;
    cancelGuessButton.style.marginLeft = '15px';
    cancelGuessButton.style.display = 'none';
    guessNextStateButton.parentNode.appendChild(cancelGuessButton);
  }
  cancelGuessButton.onclick = function() {
    const monacoSingleLine = document.getElementById('monaco-editor-container-single');
    monacoSingleLine.style.visibility = 'hidden';
    const keyboard = document.getElementById('math-keyboard');
    keyboard.classList.remove('visible');
    keyboard.style.display = 'none';
    const checkButton = document.getElementById('check-button');
    checkButton.style.display = 'none';
    checkButton.classList.remove('visible');
    cancelGuessButton.style.display = 'none';
    const resultElement = document.getElementById('result');
    if (resultElement) {
      resultElement.innerHTML = '';
    }
    updateGuessAllStatesButton();
    const backButton = document.getElementById('backButton');
    const forwardButton = document.getElementById('forwardButton');
    backButton.disabled = false;
    backButton.style.opacity = '1';
    forwardButton.disabled = false;
    forwardButton.style.opacity = '1';
  };
}

const origGuessNextStateHandler = document.getElementById('guessNextState').onclick;
document.getElementById('guessNextState').addEventListener('click', function() {
  const cancelGuessButton = document.getElementById('cancelGuessButton');
  if (cancelGuessButton) cancelGuessButton.style.display = 'inline-flex';
  if (typeof origGuessNextStateHandler === 'function') origGuessNextStateHandler();
});

