import { initializeCanvas, redrawCanvas } from "./modules/drawing.js";
import { addEventListeners } from "./modules/events.js";
import { initializeHistory } from "./modules/history.js";
import { loadComponents, saveComponents } from "./modules/components.js";

export let components = [];
export let currentTool = null;

const canvas = document.getElementById("canvas");

function initialize() {
  console.log("Initializing САПР...");
  initializeCanvas(canvas);
  addEventListeners(canvas);
  initializeHistory();

  document.querySelectorAll(".tool-btn").forEach((button) => {
    button.addEventListener("click", () => {
      currentTool = button.id;
      updateCurrentTool();
      document
        .querySelectorAll(".tool-btn")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      console.log("Current tool set to:", currentTool);
    });
  });

  document.getElementById("save").addEventListener("click", () => {
    console.log("Saving components...");
    saveComponents(components);
  });
  document.getElementById("load").addEventListener("click", () => {
    console.log("Triggering file load...");
    document.getElementById("load-file").click();
  });
  document.getElementById("load-file").addEventListener("change", (event) => {
    console.log("Loading components from file...");
    loadComponents(event.target.files[0]).then((loadedComponents) => {
      components = loadedComponents;
      console.log("Components loaded:", components.length);
      redrawCanvas();
    });
  });

  updateCurrentTool();
  redrawCanvas();
  console.log("САПР initialized");
}

function updateCurrentTool() {
  const currentToolSpan = document.getElementById("current-tool");
  if (currentToolSpan) {
    currentToolSpan.textContent = `Поточний інструмент: ${
      currentTool || "Немає"
    }`;
  }
}

initialize();
