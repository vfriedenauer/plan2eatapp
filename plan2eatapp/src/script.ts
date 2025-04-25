window.addEventListener("DOMContentLoaded", () => {
  const days = document.querySelectorAll(".day");
  const recipeList = document.getElementById("recipe-list") as HTMLDivElement;

  
  days.forEach(day => {
    day.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    day.addEventListener("drop", (e) => {
      e.preventDefault();
      const recipeName = e.dataTransfer?.getData("text/plain");
      if (recipeName) {
       
        if (!isRecipeInDay(day, recipeName)) {
          const recipeEl = document.createElement("div");
          recipeEl.textContent = recipeName;
          recipeEl.classList.add("recipe");

          
          const removeBtn = document.createElement("button");
          removeBtn.textContent = "Entfernen";
          removeBtn.classList.add("remove-btn");
          removeBtn.addEventListener("click", () => {
            removeRecipeFromDay(recipeEl, day);
          });

          recipeEl.appendChild(removeBtn);
          day.appendChild(recipeEl);
        }
      }
    });
  });

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

    const stored = localStorage.getItem("recipes");
    const recipes = stored ? JSON.parse(stored) : [];

    
    if (!recipes.includes(recipeName)) {
      recipes.push(recipeName);
      localStorage.setItem("recipes", JSON.stringify(recipes));

      addRecipeToDOM(recipeName);
    }
    input.value = "";
    form.classList.add("hidden");
  });

  const stored = localStorage.getItem("recipes");
  if (stored) {
    const recipes = JSON.parse(stored);
    recipes.forEach((name: string) => addRecipeToDOM(name));
  }

  
  function addRecipeToDOM(name: string) {
    const div = document.createElement("div");
    div.className = "recipe";
    div.textContent = name;
    div.draggable = true;
    div.dataset.name = name;

    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Löschen";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      removeRecipe(name, div);
    });

    div.appendChild(deleteBtn);

   
    div.addEventListener("dragstart", (e: DragEvent) => {
      e.dataTransfer?.setData("text/plain", name);
    });

    recipeList.appendChild(div);
  }

 
  function removeRecipe(recipeName: string, recipeElement: HTMLElement) {
    recipeElement.remove();

    const stored = localStorage.getItem("recipes");
    if (stored) {
      const recipes = JSON.parse(stored);
      const updatedRecipes = recipes.filter((recipe: string) => recipe !== recipeName);
      localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    }
  }

 
  function removeRecipeFromDay(recipeElement: HTMLElement, day: Element) {
    recipeElement.remove();
  }

 
  function isRecipeInDay(day: Element, recipeName: string): boolean {
    const dayRecipes = Array.from(day.querySelectorAll(".recipe"));
    return dayRecipes.some(recipe => recipe.textContent === recipeName);
  }
});