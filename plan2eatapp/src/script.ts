window.addEventListener("DOMContentLoaded", () => {
  const days = document.querySelectorAll(".day");
  const recipeList = document.getElementById("recipe-list") as HTMLDivElement;
  const listSelection = document.getElementById("listSelection") as HTMLSelectElement;
  const addBtn = document.getElementById("addRecipeBtn") as HTMLButtonElement;
  const form = document.getElementById("addRecipeForm") as HTMLDivElement;
  const input = document.getElementById("newRecipeInput") as HTMLInputElement;
  const saveBtn = document.getElementById("saveRecipeBtn") as HTMLButtonElement;
  const menuToggle = document.getElementById("menuToggle") as HTMLButtonElement;
  const burgerMenu = document.getElementById("burgerMenu") as HTMLDivElement;
  const addListBtn = document.getElementById("addListBtn") as HTMLButtonElement;

  let recipeLists: string[] = JSON.parse(localStorage.getItem("recipeLists") || "[]");

 
  menuToggle.addEventListener("click", () => {
    burgerMenu.classList.toggle("hidden");
  });

  
  addListBtn.addEventListener("click", () => {
    const newListName = prompt("Name der neuen Liste:");
    if (newListName && !recipeLists.includes(newListName)) {
      recipeLists.push(newListName);
      localStorage.setItem("recipeLists", JSON.stringify(recipeLists));
      updateListSelection();
    }
  });


  function updateListSelection() {
    listSelection.innerHTML = "";
    recipeLists.forEach((listName) => {
      const option = document.createElement("option");
      option.value = listName;
      option.textContent = listName;
      listSelection.appendChild(option);
    });
  }

  
  addBtn.addEventListener("click", () => {
    form.classList.toggle("hidden");
    input.focus();
  });

  
  saveBtn.addEventListener("click", () => {
    const recipeName = input.value.trim();
    if (recipeName === "") return;

    const selectedList = listSelection.value;
    if (selectedList) {
      
      const storedRecipes = JSON.parse(localStorage.getItem(selectedList) || "[]");
      storedRecipes.push(recipeName);
      localStorage.setItem(selectedList, JSON.stringify(storedRecipes));
      addRecipeToDOM(recipeName, selectedList);
    }

    input.value = "";
    form.classList.add("hidden");
  });

  
  function addRecipeToDOM(name: string, listName: string) {
    const div = document.createElement("div");
    div.className = "recipe";
    div.textContent = name;
    div.draggable = true;
    div.dataset.name = name;
    div.dataset.list = listName;
    div.addEventListener("dragstart", (e: DragEvent) => {
      e.dataTransfer?.setData("text/plain", name);
    });
    recipeList.appendChild(div);
  }

  
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

  
  function loadStoredData() {
    const storedRecipes = JSON.parse(localStorage.getItem("recipeLists") || "[]");
    storedRecipes.forEach((listName: string) => {
      const recipes = JSON.parse(localStorage.getItem(listName) || "[]");
      recipes.forEach((recipeName: string) => {
        addRecipeToDOM(recipeName, listName);
      });
    });
  }

  loadStoredData();
  updateListSelection();
});