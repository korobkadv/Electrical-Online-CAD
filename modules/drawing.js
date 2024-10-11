import { components } from "../main.js";
import { drawResistor } from "./components/resistor.js";
import { drawCapacitor } from "./components/capacitor.js";
import { drawInductor } from "./components/inductor.js";

let ctx;

export function initializeCanvas(canvas) {
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 100;
}

export function redrawCanvas() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  components.forEach(drawComponent);
}

function drawComponent(component) {
  if (component.type === "wire") {
    if (component.path && component.path.length > 1) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(component.path[0].x, component.path[0].y);
      for (let i = 1; i < component.path.length; i++) {
        ctx.lineTo(component.path[i].x, component.path[i].y);
      }
      ctx.stroke();
    }
  } else {
    if (typeof component.x !== "number" || typeof component.y !== "number") {
      console.error("Invalid component coordinates:", component);
      return;
    }

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    switch (component.type) {
      case "resistor":
        drawResistor(ctx, component.x, component.y);
        break;
      case "capacitor":
        drawCapacitor(ctx, component.x, component.y);
        break;
      case "inductor":
        drawInductor(ctx, component.x, component.y);
        break;
    }

    if (component.value) {
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        component.value,
        component.x + component.width / 2,
        component.y - 5
      );
    }

    if (component.connectors) {
      ctx.fillStyle = "red";
      component.connectors.forEach((connector) => {
        ctx.beginPath();
        ctx.arc(connector.x, connector.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }
}

export function drawTemporaryWire(path) {
  ctx.strokeStyle = "gray";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.stroke();
  ctx.setLineDash([]);
}
