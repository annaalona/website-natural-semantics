import {model, stackOfStates} from "./index";
import {editor} from "./index";
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
      // Inline error message with retry button
      const t = getCurrentTranslations();
      const resultElement = document.getElementById("result");
      if (resultElement) {
        resultElement.innerHTML = `❌ ${t.incorrectAnswer || 'Неправильно. Спробуйте ще раз!'} ` +
          `<button id='retryInlineBtn' class='retry-inline-btn'></button>`;
        resultElement.style.color = "red";
        document.getElementById('retryInlineBtn').onclick = function() {
          currentInputs.forEach(input => {
            input.style.borderColor = '';
          });
          resultElement.innerText = '';
        };
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

export function setupPlusMinusInputButtons() {
  const plusButton = document.getElementById("plusButton");
  if (!plusButton) return;

  plusButton.addEventListener("click", function () {
    let parentContainer = document.getElementById("inputsParentContainer");
    let originalContainer = document.getElementById("inputContainer");

    if (!parentContainer || !originalContainer) {
      if (!parentContainer) {
        parentContainer = document.createElement("div");
        parentContainer.id = "inputsParentContainer";
        document.body.appendChild(parentContainer);
      }

      if (!originalContainer) {
        originalContainer = document.createElement("div");
        originalContainer.id = "inputContainer";
        originalContainer.className = "input-container";
        originalContainer.style.display = "none";

        const varInput = document.createElement("input");
        varInput.type = "text";
        varInput.id = "inpVar";
        varInput.className = "input-var";
        varInput.placeholder = translations[localStorage.getItem("selectedLanguage") || "english"].variableNamePlaceholder;

        const valueInput = document.createElement("input");
        valueInput.type = "text";
        valueInput.id = "inp";
        valueInput.className = "input-value";
        valueInput.placeholder = translations[localStorage.getItem("selectedLanguage") || "english"].valuePlaceholder;

        originalContainer.appendChild(varInput);
        originalContainer.appendChild(valueInput);
        parentContainer.appendChild(originalContainer);
      }
    }

    if (originalContainer.style.display === "none") {
      originalContainer.style.display = "flex";
      if (!originalContainer.querySelector('.delete-input-button')) {
        addDeleteButton(originalContainer);
      }
    } else {
      let newContainer = originalContainer.cloneNode(true);
      newContainer.classList.add("input-container");
      newContainer.id = "inputContainer-" + uniqueIdInputField++;

      let inputs = newContainer.getElementsByTagName("input");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
        inputs[i].id = inputs[i].id + "-" + uniqueIdInputField;
      }

      const existingDeleteButton = newContainer.querySelector('.delete-input-button');
      if (existingDeleteButton) {
        existingDeleteButton.remove();
      }

      newContainer.style.display = "flex";
      addDeleteButton(newContainer);
      parentContainer.appendChild(newContainer);
      uniqueIdInputField++;
    }
  });
}

function addDeleteButton(container) {
  if (container.querySelector('.delete-input-button')) {
    return;
  }

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-input-button";
  deleteButton.innerHTML = "-";
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", "Delete input");

  function updateButtonTheme() {
    const isDarkTheme = document.body.classList.contains("dark-theme");
    if (isDarkTheme) {
      deleteButton.style.backgroundColor = "#9370DB";
      deleteButton.addEventListener("mouseover", function() {
        this.style.backgroundColor = "#8A2BE2";
      });
      deleteButton.addEventListener("mouseout", function() {
        this.style.backgroundColor = "#9370DB";
      });
    } else {
      deleteButton.style.backgroundColor = "#4CAF50";
      deleteButton.addEventListener("mouseover", function() {
        this.style.backgroundColor = "#45a049";
      });
      deleteButton.addEventListener("mouseout", function() {
        this.style.backgroundColor = "#4CAF50";
      });
    }
  }

  // Apply all styles directly
  Object.assign(deleteButton.style, {
    width: "20px",
    height: "20px",
    padding: "0",
    lineHeight: "1",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    minWidth: "20px",
    minHeight: "20px"
  });

  // Initial theme setup
  updateButtonTheme();

  // Listen for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        updateButtonTheme();
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });

  deleteButton.addEventListener("click", function() {
    const parentContainer = document.getElementById("inputsParentContainer");
    container.remove();

    // If this was the last container, create a new hidden one
    if (parentContainer.children.length === 0) {
      const newContainer = document.createElement("div");
      newContainer.id = "inputContainer";
      newContainer.className = "input-container";
      newContainer.style.display = "none";

      const varInput = document.createElement("input");
      varInput.type = "text";
      varInput.id = "inpVar";
      varInput.className = "input-var";
      varInput.placeholder = translations[localStorage.getItem("selectedLanguage") || "english"].variableNamePlaceholder;

      const valueInput = document.createElement("input");
      valueInput.type = "text";
      valueInput.id = "inp";
      valueInput.className = "input-value";
      valueInput.placeholder = translations[localStorage.getItem("selectedLanguage") || "english"].valuePlaceholder;

      newContainer.appendChild(varInput);
      newContainer.appendChild(valueInput);
      parentContainer.appendChild(newContainer);
    }
  });

  container.appendChild(deleteButton);
}

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



const guessAllStatesButton = document.getElementById('guessAllStatesButton');
if (guessAllStatesButton) {
  let cancelGuessAllStatesButton = document.getElementById('cancelGuessAllStatesButton');
  if (!cancelGuessAllStatesButton) {
    cancelGuessAllStatesButton = document.createElement('button');
    cancelGuessAllStatesButton.id = 'cancelGuessAllStatesButton';
    cancelGuessAllStatesButton.className = 'button cancel-button';
    cancelGuessAllStatesButton.textContent = getCurrentTranslations().cancelButton;
    cancelGuessAllStatesButton.style.marginLeft = '15px';
    cancelGuessAllStatesButton.style.display = 'none';
    guessAllStatesButton.parentNode.appendChild(cancelGuessAllStatesButton);
  }
  cancelGuessAllStatesButton.onclick = function() {
    const guessFinalStates = document.getElementById('guessFinalStates');
    const enterAllStatesButton = document.getElementById('enterAllStates');
    guessFinalStates.innerHTML = '';
    guessFinalStates.style.display = 'none';
    if (enterAllStatesButton) enterAllStatesButton.style.display = 'none';
    cancelGuessAllStatesButton.style.display = 'none';
    const resultElement = document.getElementById('result');
    if (resultElement) {
      resultElement.innerHTML = '';
    }
    const guessNextState = document.getElementById('guessNextState');
    if (guessNextState) {
      guessNextState.disabled = false;
      guessNextState.style.opacity = '1';
    }
    guessAllStatesButton.disabled = false;
    guessAllStatesButton.style.opacity = '1';
    const backButton = document.getElementById('backButton');
    const forwardButton = document.getElementById('forwardButton');
    if (backButton) {
      backButton.disabled = false;
      backButton.style.opacity = '1';
    }
    if (forwardButton) {
      forwardButton.disabled = false;
      forwardButton.style.opacity = '1';
    }
  };
}

if (guessAllStatesButton) {
  guessAllStatesButton.addEventListener('click', function() {
    const cancelGuessAllStatesButton = document.getElementById('cancelGuessAllStatesButton');
    if (cancelGuessAllStatesButton) cancelGuessAllStatesButton.style.display = 'inline-flex';
  });
}

const leftButton = document.getElementById('left-click-button');
const rightButton = document.getElementById('right-click-button');

if (leftButton) {
  leftButton.addEventListener('click', function() {
    setupCancelButton();
  });
}

if (rightButton) {
  rightButton.addEventListener('click', function() {
    setupCancelButton();
  });
}

function setupCancelButton() {
  const cancelGuessButton = document.getElementById('cancelGuessButton');
  if (cancelGuessButton) cancelGuessButton.style.display = 'none';
  const cancelGuessAllStatesButton = document.getElementById('cancelGuessAllStatesButton');
  if (cancelGuessAllStatesButton) cancelGuessAllStatesButton.style.display = 'none';
  const resultElement = document.getElementById('result');
  if (resultElement) {
    resultElement.innerHTML = '';
  }
}

export function downloadMathAsSVG() {
  if (typeof MathJax === 'undefined') {
    console.error('MathJax is not loaded yet.');
    return;
  }

  const element = document.getElementById('outputResultArea');
  if (!element) {
    console.error('Element #outputResultArea not found.');
    return;
  }

  MathJax.typesetPromise([element])
    .then(() => {
      const clone = element.cloneNode(true);
      const svg = clone.querySelector('svg');

      const assistiveElements = clone.querySelectorAll('.mjx-assistive-mml');
      assistiveElements.forEach(el => el.remove());

      const lines = svg.querySelectorAll('.mjx-line, line, path, .mjx-path');
      lines.forEach(line => {
        line.setAttribute('stroke', '#000000');
        line.setAttribute('stroke-width', '35');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('opacity', '1');
      });

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      rect.setAttribute('fill', 'white');
      svg.insertBefore(rect, svg.firstChild);

      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'math-content.svg';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    })
    .catch(err => console.error('Error:', err));
}

export function setupExportLatexModal() {
  document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.getElementById("exportButton");
    exportButton.disabled = true;

    const checkMathJax = setInterval(() => {
      if (typeof MathJax !== 'undefined' && MathJax.startup && MathJax.startup.promise) {
        clearInterval(checkMathJax);
        exportButton.disabled = false;
      }
    }, 100);

    exportButton.onclick = function () {
      downloadMathAsSVG();
    };

    const latexModal = document.createElement('div');
    latexModal.id = 'latexModal';
    latexModal.className = 'modal latex-modal';
    latexModal.style.display = 'none';
    latexModal.style.position = 'fixed';
    latexModal.style.top = '50%';
    latexModal.style.left = '50%';
    latexModal.style.transform = 'translate(-50%, -50%)';
    latexModal.style.background = '#fff';
    latexModal.style.border = '1px solid #ccc';
    latexModal.style.padding = '20px';
    latexModal.style.zIndex = '1000';
    latexModal.style.maxWidth = '90%';
    latexModal.style.maxHeight = '80%';
    latexModal.style.overflow = 'auto';

    latexModal.innerHTML = `
    <h3>LaTeX Export</h3>
    <pre id="latexContent" style="white-space:pre-wrap; color: black"></pre>
    <button class="button" id="copy-latex">Copy</button>
  `;

    document.body.appendChild(latexModal);
    document.getElementById('copy-latex').onclick = copyLatexContent;
  });
}

export function copyLatexContent() {
  const latexContent = document.getElementById('latexContent').innerText;
  navigator.clipboard.writeText(latexContent).then(() => {
    alert("LaTeX code copied to clipboard!");
  }).catch(err => {
    console.error("Failed to copy text: ", err);
  });
}

