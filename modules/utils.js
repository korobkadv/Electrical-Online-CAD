import { components } from "../main.js";

export function findNearestConnector(x, y) {
  let nearestConnector = null;
  let minDistance = Infinity;

  components.forEach((component) => {
    if (component.type !== "wire" && component.connectors) {
      component.connectors.forEach((connector) => {
        const distance = Math.sqrt(
          Math.pow(x - connector.x, 2) + Math.pow(y - connector.y, 2)
        );
        if (distance < minDistance && distance < 15) {
          // Збільшено поріг до 15 пікселів
          minDistance = distance;
          nearestConnector = {
            x: connector.x,
            y: connector.y,
            component: component,
          };
        }
      });
    }
  });

  return nearestConnector;
}

export function calculateWirePath(start, end) {
  if (!start || !end) {
    console.error(
      "Не вдалося обчислити шлях проводу: відсутні початкова або кінцева точка"
    );
    return [];
  }

  const path = [];
  path.push({ x: start.x, y: start.y });

  if (Math.abs(start.x - end.x) > Math.abs(start.y - end.y)) {
    path.push({ x: end.x, y: start.y });
  } else {
    path.push({ x: start.x, y: end.y });
  }

  path.push({ x: end.x, y: end.y });
  return path;
}
