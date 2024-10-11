export function saveScheme(components) {
  const schemeData = JSON.stringify(components);
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

export function loadScheme(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const components = JSON.parse(e.target.result);
        resolve(components);
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
