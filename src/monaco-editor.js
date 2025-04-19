import * as monaco from "monaco-editor";
import antlr4 from "antlr4";
import JaneLexer from "../myAntlr/JaneLexer";
import JaneParser from "../myAntlr/JaneParser";
import { model } from "./index";
import { arrayOfIterationsInTree } from './index';
import { currentIndex } from './interactive-mode';

let editor;
export let editorSecond;


function isDarkTheme() {
  return document.documentElement.classList.contains('dark-theme') ||
    document.body.classList.contains('dark-theme');
}

function applyThemeToEditors() {
  const theme = isDarkTheme() ? 'myCustomDarkTheme' : 'myCustomTheme';
  monaco.editor.setTheme(theme);

  const editorContainer = document.getElementById('monaco-editor');
  const singleEditorContainer = document.getElementById('monaco-editor-single');

  if (editorContainer) {
    editorContainer.style.border = isDarkTheme()
      ? "2px solid #9370DB"
      : "2px solid #209434";
  }

  if (singleEditorContainer) {
    singleEditorContainer.style.border = isDarkTheme()
      ? "2px solid #9370DB"
      : "2px solid #209434";
  }
}

export function setupMonacoErrorSyntaxHighlighting() {
  editor.onDidChangeModelContent(() => {
    let inputText = model.getValue();
    monaco.editor.setModelMarkers(editor.getModel(), 'jane-language', []);

    let hasErrors;
    let resolveButton = document.getElementById("visualizeButton");

    if (inputText.trim() !== "") {
      try {
        let chars = new antlr4.InputStream(inputText);
        let lexer = new JaneLexer(chars);
        lexer.removeErrorListeners();
        lexer.addErrorListener({
          syntaxError: function (recognizer, offendingSymbol, line, column, msg) {
            displayError(`line ${line}:${column}: ${msg}`, line, column, offendingSymbol);
            hasErrors = true;
          }
        });
        let tokens = new antlr4.CommonTokenStream(lexer);
        let parser = new JaneParser(tokens);
        parser.removeErrorListeners();
        parser.addErrorListener({
          syntaxError: function (recognizer, offendingSymbol, line, column, msg) {
            displayError(`line ${line}:${column}: ${msg}`, line, column, offendingSymbol);
            hasErrors = true;
          }
        });
        parser.program();
        resolveButton.disabled = hasErrors;
      } catch (e) {
        alert("An error occurred while parsing: " + e.message);
      }
    }
  });
}


export function insertSymbol(symbol) {
  if (!editorSecond) return;

  const position = editorSecond.getPosition();
  editorSecond.executeEdits("", [{
    range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
    text: symbol,
    forceMoveMarkers: true
  }]);

  editorSecond.focus();
}

export function initializeSingleLineMonacoEditor() {
  if (!editorSecond) {
    const editorOptions = {
      value: '',
      language: 'jane-language',
      fontSize: 18,
      renderLineHighlight: 'line',
      lineNumbers: 'off',
      scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 0,
      lineHeight: 20,
      scrollBeyondLastLine: false,
      fixedOverflowWidgets: true
    };

    monaco.languages.register({ id: 'jane-language' });
    editorSecond = monaco.editor.create(document.getElementById('monaco-editor-single'), editorOptions);

    monaco.editor.defineTheme('myCustomTheme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.lineHighlightBackground': '#eef3fc',
        'editor.lineHighlightBorder': '#afe8c1',
        'editor.background': '#ffffff',
        'editor.foreground': '#000000'
      }
    });

    monaco.editor.defineTheme('myCustomDarkTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.lineHighlightBackground': '#2a2d3e',
        'editor.lineHighlightBorder': '#4a6b8a',
        'editor.background': '#1e1e2f',
        'editor.foreground': '#d4d4d4',
        'editorCursor.foreground': '#ff79c6',
        'editor.selectionBackground': '#44475a',
        'editorGutter.background': '#1e1e2f'
      }
    });

    applyThemeToEditors();

    editorSecond.onDidChangeModelContent((event) => {
      const value = editorSecond.getValue();
      if (value.includes("\n")) {
        editorSecond.setValue(value.replace(/\n/g, ''));
      }
    });
  }

  const editorContainer = document.getElementById('monaco-editor-single');
  editorContainer.style.width = "900px";
  editorContainer.style.height = "24px";
  editorContainer.style.boxSizing = "border-box";
  editorContainer.style.minWidth = "150px";

  if (editorSecond) {
    editorSecond.layout();
  }

  const resizeObserver = new ResizeObserver(() => {
    if (editorSecond) {
      editorSecond.layout();
    }
  });
  resizeObserver.observe(editorContainer);

  return editorSecond;
}

export function initializeMonacoEditor() {
  if (!editor) {
    const editorOptions = {
      value: '',
      language: 'jane-language',
      fontSize: 18,
      renderLineHighlight: 'line'
    };

    monaco.languages.register({ id: 'jane-language' });
    editor = monaco.editor.create(document.getElementById('monaco-editor'), editorOptions);

    monaco.editor.defineTheme('myCustomTheme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.lineHighlightBackground': '#eef3fc',
        'editor.lineHighlightBorder': '#afe8c1',
        'editor.background': '#ffffff',
        'editor.foreground': '#000000'
      }
    });

    monaco.editor.defineTheme('myCustomDarkTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.lineHighlightBackground': '#2a2d3e',
        'editor.lineHighlightBorder': '#4a6b8a',
        'editor.background': '#1e1e2f',
        'editor.foreground': '#d4d4d4',
        'editorCursor.foreground': '#ff79c6',
        'editor.selectionBackground': '#44475a',
        'editorGutter.background': '#1e1e2f'
      }
    });

    applyThemeToEditors();
  }
  return editor;
}

export function getModel() {
  if (!editor) {
    return null;
  }
  return editor.getModel();
}

export function getEditor() {
  if (!editor) {
    return null;
  }
  return editor;
}

export function resizeMonacoEditor() {
  const editorContainer = document.getElementById('monaco-editor');
  editorContainer.style.minWidth = "200px";
  editorContainer.style.width = "756px";
  editorContainer.style.height = "208px";
  editorContainer.style.boxSizing = "border-box";

  if (editor) {
    editor.layout();
  }

  const resizeObserver = new ResizeObserver(() => {
    if (editor) {
      editor.layout();
    }
  });
  resizeObserver.observe(editorContainer);

  applyThemeToEditors();
}

function setupThemeSwitchListener() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        applyThemeToEditors();
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });
  observer.observe(document.body, { attributes: true });
}

setupThemeSwitchListener();

function displayError(message, line, column, offendingSymbol) {
  const startColumn = column;
  const endColumn = column + (offendingSymbol ? offendingSymbol.text.length : 1);

  const errorMarker = {
    severity: monaco.MarkerSeverity.Error,
    startLineNumber: line,
    startColumn: startColumn,
    endLineNumber: line,
    endColumn: endColumn,
    message: message
  };

  monaco.editor.setModelMarkers(editor.getModel(), 'jane-language', [errorMarker]);

  const resolveButton = document.getElementById('visualizeButton');
  resolveButton.disabled = true;
}
