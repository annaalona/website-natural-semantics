import {model, stackOfStates} from "./index";
import {editor} from "./index";
import {makeGuessOfFinalStates} from "./generate-latex";
import {arrayOfIterationsInTree} from "./index";
import {currentIndex} from "./interactive-mode";
import {translations} from "./language-switcher";

const modal = document.getElementById("myModal");
const btn = document.getElementById("helpButton");
const span = document.getElementsByClassName("close")[0];
const uploadButton = document.getElementById('uploadProgramButton');
const fileInput = document.getElementById('fileInput');

let uniqueIdInputField = 1;

let currentInputs = [];


function setupPasteExampleTool() {
  const Example1 = document.getElementById("Example1");
  const Example2 = document.getElementById("Example2");
  const Example3 = document.getElementById("Example3");

  function setupInitialState() {
    const parentContainer = document.getElementById("inputsParentContainer");
    if (!parentContainer) return;

    const inputContainers = parentContainer.getElementsByClassName("input-container");

    if (inputContainers.length > 0) {
      const container = inputContainers[0];
      container.style.display = "flex";
      const inputs = container.getElementsByTagName("input");
      if (inputs.length >= 2) {
        inputs[0].value = 'x';
        inputs[1].value = '1';
      }
    } else {
      const plusButton = document.getElementById("plusButton");
      if (plusButton) {
        plusButton.click();

        setTimeout(() => {
          const container = parentContainer.getElementsByClassName("input-container")[0];
          if (container) {
            container.style.display = "flex";
            const newInputs = container.getElementsByTagName("input");
            if (newInputs.length >= 2) {
              newInputs[0].value = 'x';
              newInputs[1].value = '1';
            }
          }
        }, 100);
      }
    }

    const guessFinalStates = document.getElementById('guessFinalStates');
    if (guessFinalStates) {
      guessFinalStates.style.display = 'block';
    }
  }

  Example1.onclick = function () {
    editor.setValue(`x := x + 1;
while(x < 5) {
  x := x + 1
};
if(x < 6) {
  x := x + 1
} else {
  x := x + 1
}
`);
    setupInitialState();
  };

  Example2.onclick = function () {
    editor.setValue(`x := x + 1
`);
    setupInitialState();
  };

  Example3.onclick = function () {
    editor.setValue(`
if(x < 6) {
  x := x + 1
} else {
  x := x + 1
}
`);
    setupInitialState();
  };
}

export function setupHelpMenuAndPasteExampleFeature() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');


  tabButtons.forEach(button => {
    button.addEventListener('click', () => {

      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      const content = document.getElementById(`${tabId}-content`);

      if (content) {
        content.classList.add('active');
      } else {
        console.error('Content element not found for tab:', tabId);
      }
    });
  });

  btn.onclick = function () {

    modal.style.display = "block";
  }

  span.onclick = function () {
    modal.style.display = "none";
  }

window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
    }
  }

  setupPasteExampleTool();
}

export function setupFileUploadListeners() {
  uploadButton.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();


      reader.onload = function (e) {
        const fileContent = e.target.result;

        model.setValue(fileContent);
      };

      reader.readAsText(file);
    }
  });
}

export function setupEnterGuessOfFinalStates() {
  const enterAllStatesButton = document.getElementById('enterAllStates');
  if (!enterAllStatesButton) {
    console.error("Button 'enterAllStates' not found!");
    return;
  }

  enterAllStatesButton.addEventListener('click', function() {
    const guessFinalStates = document.getElementById('guessFinalStates');
    if (!guessFinalStates) {
      console.error("guessFinalStates container not found!");
      return;
    }

    currentInputs = guessFinalStates.querySelectorAll('input[type="text"]');
    let allCorrect = true;

    currentInputs.forEach(input => {
      const expectedValue = input.getAttribute('data-expected');
      if (expectedValue && input.value.trim() !== expectedValue) {
        allCorrect = false;
        input.style.borderColor = 'red';
      } else {
        input.style.borderColor = 'green';
      }
    });

    if (allCorrect) {
    compareFinalStates();
    } else {
      const retryModal = document.getElementById('retryModal');

      if (retryModal) {
        retryModal.style.display = 'block';

        const retryYes = document.getElementById('retryYes');
        if (retryYes) {
          retryYes.onclick = function() {
            retryModal.style.display = 'none';
            currentInputs.forEach(input => {
              input.style.borderColor = '';
              if (input.id.startsWith('varValue')) {
                input.value = '';
              }
            });
          };
        }

        const retryNo = document.getElementById('retryNo');
        if (retryNo) {
          retryNo.onclick = function() {
            retryModal.style.display = 'none';
            hideInteractiveElements();
            const backButton = document.getElementById('backButton');
            const forwardButton = document.getElementById('forwardButton');
            backButton.disabled = false;
            backButton.style.opacity = '1';
            forwardButton.disabled = false;
            forwardButton.style.opacity = '1';

            const guessNextState = document.getElementById('guessNextState');
            if (guessNextState) {
              guessNextState.disabled = false;
              guessNextState.style.opacity = '1';
            }
          };
        }

        const modalContent = retryModal.querySelector('.modal-content');
        if (modalContent) {
          retryModal.onclick = function(event) {
            if (event.target === retryModal) {
              retryModal.style.display = 'none';
              hideInteractiveElements();
              const backButton = document.getElementById('backButton');
              const forwardButton = document.getElementById('forwardButton');
              backButton.disabled = false;
              backButton.style.opacity = '1';
              forwardButton.disabled = false;
              forwardButton.style.opacity = '1';
            }
          };
        }
      } else {
        console.error("Retry modal element not found in DOM");
      }
    }
  });
}

export function setupGuessOfFinalStates() {
  document.getElementById("guessAllStatesButton").addEventListener('click', function () {

    const currentIteration = arrayOfIterationsInTree[currentIndex-1];

    if (!currentIteration) {
      return;
    }

    const enterAllStatesButton = document.getElementById('enterAllStates');
    if (enterAllStatesButton) {
      enterAllStatesButton.style.display = 'inline-flex';
    }

    const checkButton = document.getElementById('check-button');
    if (checkButton) {
      checkButton.style.display = 'none';
    }

    const stateToGuess = analyzeStateForGuessing(currentIteration);

    if (!stateToGuess) {
      return;
    }

    const stateNumberMatch = stateToGuess.match(/s_(\d+)/);
    if (!stateNumberMatch) return;
    const stateNumber = stateNumberMatch[1];
    const state = stackOfStates[stateNumber];
    if (!state) {
      return;
    }

    const guessFinalStates = document.getElementById('guessFinalStates');
    if (!guessFinalStates) {
      console.error("guessFinalStates element not found!");
      return;
    }

    guessFinalStates.innerHTML = '';

    const inputDiv = document.createElement('div');
    inputDiv.style.marginBottom = '10px';

    const stateLabel = document.createElement('span');
    stateLabel.setAttribute('data-i18n-dynamic', 'guessStateLabel');
    stateLabel.setAttribute('data-state', stateToGuess);
    updateStateLabelText(stateLabel, stateToGuess);
    stateLabel.style.marginRight = '10px';
    inputDiv.appendChild(stateLabel);

    Array.from(state.entries()).forEach(([varName, varValue], index) => {
      const varContainer = document.createElement('div');
      varContainer.style.marginBottom = '5px';

      const varNameInput = document.createElement('input');
      varNameInput.type = 'text';
      varNameInput.id = `varName-${stateNumber}-${index}`;
      varNameInput.value = varName;
      varNameInput.style.marginRight = '10px';
      varNameInput.readOnly = true;

      const varValueInput = document.createElement('input');
      varValueInput.type = 'text';
      varValueInput.id = `varValue-${stateNumber}-${index}`;
      varValueInput.placeholder = getCurrentTranslations().valuePlaceholder;
      varValueInput.setAttribute('data-expected', varValue);

      varContainer.appendChild(varNameInput);
      varContainer.appendChild(varValueInput);
      inputDiv.appendChild(varContainer);
    });

    guessFinalStates.appendChild(inputDiv);

    guessFinalStates.style.display = 'block';

    MathJax.typeset([stateLabel]);
  });
}

 function compareFinalStates() {

  const currentIteration = arrayOfIterationsInTree[currentIndex-1];

  if (!currentIteration) {
    return;
  }

  const stateToGuess = analyzeStateForGuessing(currentIteration);

  if (!stateToGuess) {
    return;
  }

  const stateNumberMatch = stateToGuess.match(/s_(\d+)/);
  if (!stateNumberMatch) {
    return;
  }
  const stateNumber = stateNumberMatch[1];

  const state = stackOfStates[stateNumber];
  if (!state) {
    return;
  }

  let allCorrect = true;

  Array.from(state.entries()).forEach(([varName, correctValue], index) => {
    const varValueInputs = document.querySelectorAll(`[id^="varValue-${stateNumber}-"]`);
    const varValueInput = varValueInputs[index];

    if (!varValueInput) {
      return;
    }

    const userValue = varValueInput.value.trim();

    let existingFeedback = document.getElementById(`feedback-${stateNumber}-${index}`);
    if (existingFeedback) {
      existingFeedback.remove();
    }

    const feedback = document.createElement("span");
    feedback.id = `feedback-${stateNumber}-${index}`;
    feedback.style.marginLeft = "10px";
    feedback.style.fontWeight = "bold";

    if (correctValue.toString() === userValue) {
      feedback.textContent = "✅";
      feedback.style.color = "green";
    } else {
      feedback.textContent = "❌";
      feedback.style.color = "red";
      allCorrect = false;
    }

    varValueInput.parentNode.appendChild(feedback);
  });

  if (allCorrect) {
    const backButton = document.getElementById('backButton');
    const forwardButton = document.getElementById('forwardButton');
    backButton.disabled = false;
    backButton.style.opacity = '1';
    forwardButton.disabled = false;
    forwardButton.style.opacity = '1';

    if (document.getElementById('left-click-button').classList.contains('active')) {
      const guessNextState = document.getElementById('guessNextState');
      const guessAllStatesButton = document.getElementById('guessAllStatesButton');

      guessNextState.disabled = false;
      guessNextState.style.opacity = '1';

      if (currentIndex > 0) {
        guessAllStatesButton.disabled = false;
        guessAllStatesButton.style.opacity = '1';
      }
    }

    setTimeout(() => {
      const guessFinalStates = document.getElementById('guessFinalStates');
      const enterAllStatesButton = document.getElementById('enterAllStates');

      if (guessFinalStates) {
        guessFinalStates.style.display = 'none';
      }
      if (enterAllStatesButton) {
        enterAllStatesButton.style.display = 'none';
      }
    }, 5000);
  } else {
    const retryModal = document.getElementById('retryModal');
    const retryMessage = document.getElementById('retryMessage');
    const retryYes = document.getElementById('retryYes');
    const retryNo = document.getElementById('retryNo');

    if (retryModal && retryMessage && retryYes && retryNo) {
      retryMessage.textContent = 'Incorrect answer. Would you like to try again?';
      retryModal.style.display = 'block';

      const newRetryYes = retryYes.cloneNode(true);
      retryYes.parentNode.replaceChild(newRetryYes, retryYes);
      const newRetryNo = retryNo.cloneNode(true);
      retryNo.parentNode.replaceChild(newRetryNo, retryNo);

      newRetryYes.addEventListener('click', function() {
        retryModal.style.display = 'none';

        const guessFinalStates = document.getElementById('guessFinalStates');
        if (guessFinalStates) {
          const inputs = guessFinalStates.querySelectorAll('input[type="text"]');

          inputs.forEach(input => {
            input.value = '';
            input.style.borderColor = '';
          });
        } else {
          console.error("guessFinalStates element not found!");
        }
      });

      newRetryNo.addEventListener('click', function() {
        retryModal.style.display = 'none';
        hideInteractiveElements();
        const backButton = document.getElementById('backButton');
        const forwardButton = document.getElementById('forwardButton');
        backButton.disabled = false;
        backButton.style.opacity = '1';
        forwardButton.disabled = false;
        forwardButton.style.opacity = '1';
      });

      window.addEventListener('click', function(event) {
        if (event.target === retryModal) {
          retryModal.style.display = 'none';
          hideInteractiveElements();
          const backButton = document.getElementById('backButton');
          const forwardButton = document.getElementById('forwardButton');
          backButton.disabled = false;
          backButton.style.opacity = '1';
          forwardButton.disabled = false;
          forwardButton.style.opacity = '1';
        }
      });
    }
  }
}

function analyzeStateForGuessing(iteration) {
  const cleanIteration = iteration.replace(/[{}]/g, '');

  if (cleanIteration.includes('while') || cleanIteration.includes('if') || cleanIteration.includes(';')) {
    const stateMatch = cleanIteration.match(/s_(\d+)/);
    if (stateMatch) {
      return stateMatch[0];
    }
  }


  const allStates = cleanIteration.match(/s_(\d+)/g);
  if (allStates && allStates.length > 0) {
    return allStates[allStates.length - 1];
  }

  return null;
}

function checkInput() {
  if (!editorSecond || currentIndex >= arrayOfIterationsInTree.length) return;

  const currentIteration = arrayOfIterationsInTree[currentIndex-1];

  const stateToGuess = analyzeStateForGuessing(currentIteration);
  if (!stateToGuess) return;

  const symbolMap = {
    "→": "\\rightarrow",
    "⟨": "\\langle",
    "⟩": "\\rangle",
    "B": "\\mathscr{B}",
    "⟦": "[[",
    "⟧": "]]",
    "s_?": "s_?"
  };

  function convertToLatex(input) {
    return input.replace(/\s+/g, '').replace(/→|⟨|⟩|⟦\?\⟧|tt|ff|s_\?|B/g, match => symbolMap[match] || match);
  }

  let userInput = convertToLatex(editorSecond.getValue());
  const resultElement = document.getElementById("result");

  const stateNumber = stateToGuess.match(/s_(\d+)/);
  const stateMap = stackOfStates[stateNumber];

  let expectedState = '';
  if (stateMap) {
    expectedState = Array.from(stateMap.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
  }


  if (userInput === expectedState) {
    resultElement.innerText = "✅ Correct! State matched: " + userInput;
    resultElement.style.color = "green";
    currentIndex++;
    document.getElementById('forwardButton').click();
  } else {
    resultElement.innerText = "❌ Incorrect. Try again!";
    resultElement.style.color = "red";
  }
}

export function setupPlusMinusInputButtons() {
  document.getElementById("plusButton").addEventListener("click", function () {
    let parentContainer = document.getElementById("inputsParentContainer");
    let originalContainer = document.getElementById("inputContainer");

    if (originalContainer.style.display === "none") {
      originalContainer.style.display = "flex";
    } else {
      let newContainer = originalContainer.cloneNode(true);

      newContainer.classList.add("input-container");
      newContainer.id = "inputContainer-" + uniqueIdInputField++;

      let inputs = newContainer.getElementsByTagName("input");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
        inputs[i].id = inputs[i].id + "-" + uniqueIdInputField;
      }

      newContainer.style.display = "flex";
      parentContainer.appendChild(newContainer);
      uniqueIdInputField++;
    }
  });
}

document.getElementById("minusButton").addEventListener("click", function () {
  let parentContainer = document.getElementById("inputsParentContainer");

  if (parentContainer.children.length > 1) {
    parentContainer.removeChild(parentContainer.lastChild);
  } else {
    parentContainer.firstChild.display = "none";
  }
});

const themeSwitcher = document.getElementById("theme-switcher");
let currentTheme = localStorage.getItem("theme") || "light";

if (currentTheme === "dark") {
  document.body.classList.add("dark-theme");
  themeSwitcher.checked = true;
}

themeSwitcher.addEventListener("change", () => {
  if (themeSwitcher.checked) {
    document.body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
  }
});

function getCurrentTranslations() {
  const currentLang = localStorage.getItem("selectedLanguage") || "english";
  return translations[currentLang];
}

function updateStateLabelText(label, state) {
  const currentLang = localStorage.getItem("selectedLanguage") || "english";
  const t = translations[currentLang];
  label.innerHTML = `${t.guessStateLabel} \\(${state}\\): `;
}

function hideInteractiveElements() {
  const guessFinalStates = document.getElementById('guessFinalStates');
  const mathKeyboard = document.getElementById('math-keyboard');
  const monacoSingleLine = document.getElementById('monaco-editor-container-single');
  const checkButton = document.getElementById('check-button');
  const enterAllStatesButton = document.getElementById('enterAllStates');

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
  if (enterAllStatesButton) {
    enterAllStatesButton.style.display = 'none';
  }
}

function createInputContainer() {
  const container = document.createElement('div');
  container.className = 'input-container';

  const varNameInput = document.createElement('input');
  varNameInput.type = 'text';
  varNameInput.className = 'input-var';
  varNameInput.placeholder = translations[localStorage.getItem("selectedLanguage") || "english"].variableNamePlaceholder;

  const varValueInput = document.createElement('input');
  varValueInput.type = 'text';
  varValueInput.className = 'input-value';
  varValueInput.placeholder = translations[localStorage.getItem("selectedLanguage") || "english"].valuePlaceholder;

  container.appendChild(varNameInput);
  container.appendChild(varValueInput);

  return container;
}

