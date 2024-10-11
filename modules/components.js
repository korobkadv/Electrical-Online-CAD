import { saveState } from "./history.js";
import { calculateWirePath } from "./utils.js";
import { components } from "../main.js";

export function addComponent(type, startPoint, endPoint) {
  let component = {
    type,
    width: 60,
    height: 30,
    value: "",
    connectors: [],
  };

  switch (type) {
    case "resistor":
    case "capacitor":
    case "inductor":
      component.x = startPoint.x;
      component.y = startPoint.y;
      component.connectors = [
        { x: startPoint.x, y: startPoint.y + 15 },
        { x: startPoint.x + 60, y: startPoint.y + 15 },
      ];
      break;
    case "wire":
      component.startConnector = startPoint;
      component.endConnector = endPoint;
      component.x = Math.min(startPoint.x, endPoint.x);
      component.y = Math.min(startPoint.y, endPoint.y);
      component.width = Math.abs(endPoint.x - startPoint.x);
      component.height = Math.abs(endPoint.y - startPoint.y);
      component.path = calculateWirePath(
        component.startConnector,
        component.endConnector
      );
      break;
  }

  component.id = generateUniqueId();
  return component;
}

export function moveComponent(component, dx, dy) {
  component.x += dx;
  component.y += dy;

  if (component.connectors) {
    component.connectors.forEach((connector) => {
      connector.x += dx;
      connector.y += dy;
    });
  }

  if (component.type === "wire") {
    component.startConnector.x += dx;
    component.startConnector.y += dy;
    component.endConnector.x += dx;
    component.endConnector.y += dy;
    component.path = calculateWirePath(
      component.startConnector,
      component.endConnector
    );
  }

  components.forEach((wire) => {
    if (wire.type === "wire") {
      if (wire.startConnector.component === component) {
        wire.startConnector.x += dx;
        wire.startConnector.y += dy;
      }
      if (wire.endConnector.component === component) {
        wire.endConnector.x += dx;
        wire.endConnector.y += dy;
      }
      if (
        wire.startConnector.component === component ||
        wire.endConnector.component === component
      ) {
        wire.path = calculateWirePath(wire.startConnector, wire.endConnector);
      }
    }
  });

  saveState();
}

export function saveComponents(components) {
  const schemeData = JSON.stringify(components, (key, value) => {
    if (key === "component" && value && typeof value === "object") {
      return { id: value.id };
    }
    return value;
  });
  const blob = new Blob([schemeData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "scheme.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function loadComponents(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const loadedComponents = JSON.parse(e.target.result);
        const componentMap = new Map(loadedComponents.map((c) => [c.id, c]));
        loadedComponents.forEach((component) => {
          if (component.type === "wire") {
            component.startConnector.component = componentMap.get(
              component.startConnector.component.id
            );
            component.endConnector.component = componentMap.get(
              component.endConnector.component.id
            );
          }
        });
        resolve(loadedComponents);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        reject(
          "Помилка при завантаженні файлу. Переконайтеся, що це правильний JSON файл схеми."
        );
      }
    };
    reader.readAsText(file);
  });
}

let nextId = 1;
export function generateUniqueId() {
  return nextId++;
}
