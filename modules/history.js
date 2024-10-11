import { components } from "../main.js";
import { redrawCanvas } from "./drawing.js";

let history = [];
let historyIndex = -1;

export function initializeHistory() {
  document.getElementById("undo").addEventListener("click", undo);
  document.getElementById("redo").addEventListener("click", redo);
  updateUndoRedoButtons();
}

export function saveState() {
  historyIndex++;
  history = history.slice(0, historyIndex);
  history.push(JSON.parse(JSON.stringify(components)));
  updateUndoRedoButtons();
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    components.length = 0;
    components.push(...JSON.parse(JSON.stringify(history[historyIndex])));
    redrawCanvas();
    updateUndoRedoButtons();
  }
}

function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    components.length = 0;
    components.push(...JSON.parse(JSON.stringify(history[historyIndex])));
    redrawCanvas();
    updateUndoRedoButtons();
  }
}

function updateUndoRedoButtons() {
  document.getElementById("undo").disabled = historyIndex <= 0;
  document.getElementById("redo").disabled = historyIndex >= history.length - 1;
}
