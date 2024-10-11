import { components, currentTool } from "../main.js";
import { addComponent, moveComponent } from "./components.js";
import { redrawCanvas, drawTemporaryWire } from "./drawing.js";
import { saveState } from "./history.js";
import { findNearestConnector, calculateWirePath } from "./utils.js";

let isDrawing = false;
let isDragging = false;
let startX, startY;
let selectedComponent = null;
let wireStartConnector = null;
let isCreatingWire = false;

export function addEventListeners(canvas) {
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mouseout", handleMouseUp);
  canvas.addEventListener("dblclick", handleDoubleClick);
}

function handleMouseDown(e) {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  if (currentTool === "wire") {
    const nearestConnector = findNearestConnector(mouseX, mouseY);
    if (nearestConnector) {
      if (!isCreatingWire) {
        wireStartConnector = nearestConnector;
        isCreatingWire = true;
      } else {
        const newWire = addComponent(
          "wire",
          wireStartConnector,
          nearestConnector
        );
        if (newWire) {
          components.push(newWire);
          saveState();
        }
        isCreatingWire = false;
        wireStartConnector = null;
      }
    }
  } else {
    selectedComponent = components.find(
      (component) =>
        mouseX >= component.x &&
        mouseX <= component.x + component.width &&
        mouseY >= component.y &&
        mouseY <= component.y + component.height
    );

    if (selectedComponent) {
      isDragging = true;
      startX = mouseX - selectedComponent.x;
      startY = mouseY - selectedComponent.y;
    } else if (currentTool) {
      isDrawing = true;
      startX = mouseX;
      startY = mouseY;
    }
  }
}

function handleMouseMove(e) {
  if (isDragging && selectedComponent) {
    const dx = e.offsetX - startX - selectedComponent.x;
    const dy = e.offsetY - startY - selectedComponent.y;
    moveComponent(selectedComponent, dx, dy);
    redrawCanvas();
  } else if (isCreatingWire && wireStartConnector) {
    redrawCanvas();
    const endConnector = findNearestConnector(e.offsetX, e.offsetY);
    const endX = endConnector ? endConnector.x : e.offsetX;
    const endY = endConnector ? endConnector.y : e.offsetY;
    const path = calculateWirePath(wireStartConnector, { x: endX, y: endY });
    drawTemporaryWire(path);
  }
}

function handleMouseUp(e) {
  if (isDrawing && currentTool && currentTool !== "wire") {
    const newComponent = addComponent(currentTool, { x: startX, y: startY });
    components.push(newComponent);
    saveState();
  }
  isDrawing = false;
  isDragging = false;
  selectedComponent = null;
  if (!isCreatingWire) {
    redrawCanvas();
  }
}

function handleDoubleClick(e) {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  const clickedComponent = components.find(
    (component) =>
      mouseX >= component.x &&
      mouseX <= component.x + component.width &&
      mouseY >= component.y &&
      mouseY <= component.y + component.height
  );

  if (clickedComponent && clickedComponent.type !== "wire") {
    openModalForComponent(clickedComponent);
  }
}

function openModalForComponent(component) {
  const modal = document.getElementById("componentModal");
  const valueInput = document.getElementById("componentValue");
  const saveButton = document.getElementById("saveComponentValue");

  valueInput.value = component.value || "";
  modal.style.display = "block";

  saveButton.onclick = function () {
    component.value = valueInput.value;
    modal.style.display = "none";
    redrawCanvas();
    saveState();
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}
