window.addEventListener("DOMContentLoaded", () => {
  const days = document.querySelectorAll(".day");
  const recipeList = document.getElementById("recipe-list") as HTMLDivElement;

  // Drag & Drop Logik
  days.forEach(day => {
    day.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    day.addEventListener("drop", (e) => {
      e.preventDefault();
      const recipeName = e.dataTransfer?.getData("text/plain");
      if (recipeName) {
        const recipeEl = document.createElement("div");
        recipeEl.textContent = recipeName;
        recipeEl.classList.add("recipe");
        day.appendChild(recipeEl);
      }
    });
  });

  // Hinzufügen-Formular Logik
  const addBtn = document.getElementById("addRecipeBtn") as HTMLButtonElement;
  const form = document.getElementById("addRecipeForm") as HTMLDivElement;
  const input = document.getElementById("newRecipeInput") as HTMLInputElement;
  const saveBtn = document.getElementById("saveRecipeBtn") as HTMLButtonElement;

  addBtn.addEventListener("click", () => {
    form.classList.toggle("hidden");
    input.focus();
  });

  saveBtn.addEventListener("click", () => {
    const recipeName = input.value.trim();
    if (recipeName === "") return;

    // Aus localStorage holen
    const stored = localStorage.getItem("recipes");
    const recipes = stored ? JSON.parse(stored) : [];

    recipes.push(recipeName);
    localStorage.setItem("recipes", JSON.stringify(recipes));

    addRecipeToDOM(recipeName);
    input.value = "";
    form.classList.add("hidden");
  });

  // Rezepte beim Start laden
  const stored = localStorage.getItem("recipes");
  if (stored) {
    const recipes = JSON.parse(stored);
    recipes.forEach((name: string) => addRecipeToDOM(name));
  }

  // Rezept-Karte zur DOM hinzufügen
  function addRecipeToDOM(name: string) {
    const div = document.createElement("div");
    div.className = "recipe";
    div.textContent = name;
    div.draggable = true;
    div.dataset.name = name; // ← wichtig für Drag & Drop
    div.addEventListener("dragstart", (e: DragEvent) => {
      e.dataTransfer?.setData("text/plain", name);
    });
    recipeList.appendChild(div);
  }
});