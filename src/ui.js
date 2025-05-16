import {insertSymbol} from "./monaco-editor";

const symbols = [
  { display: '\\( \\rightarrow \\)', insert: '→' },
  { display: '\\( \\langle \\)', insert: '⟨' },
  { display: '\\( \\rangle \\)', insert: '⟩' },
  { display: '\\( \\mathscr{B} \\)', insert: 'B' },
  { display: '\\( \\left[\\!\\left[ \\right]\\!\\right] \\)', insert: '⟦?⟧' },
  { display: '\\( \\textbf{tt} \\)', insert: 'tt' },
  { display: '\\( \\textbf{ff} \\)', insert: 'ff' },
  { display: '\\( s_? \\)', insert: 's_?' },
  { display: '\\( := \\)', insert: ':=' },
];

export function createKeyboard() {
  const keyboardContainer = document.getElementById("math-keyboard");

  symbols.forEach(symbol => {
    const button = document.createElement("button");
    button.className = "math-button";
    button.innerHTML = symbol.display;
    button.onclick = () => insertSymbol(symbol.insert);
    keyboardContainer.appendChild(button);
  });
}
