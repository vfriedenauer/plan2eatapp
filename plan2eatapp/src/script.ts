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

 
  const deleteListBtn = document.getElementById("deleteListBtn") as HTMLButtonElement; // <--- das brauchen wir

  let recipeLists: string[] = JSON.parse(localStorage.getItem("recipeLists") || "[]");
  let selectedList: string = listSelection.value || recipeLists[0] || "";

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


  deleteListBtn.addEventListener("click", () => {
    if (recipeLists.length === 0) {
      alert("Keine Liste zum Löschen vorhanden.");
      return;
    }

    const listToDelete = prompt(`Welche Liste möchtest du löschen?\nVorhandene Listen:\n${recipeLists.join("\n")}`);
    if (listToDelete && recipeLists.includes(listToDelete)) {
      if (confirm(`Bist du sicher, dass du die Liste "${listToDelete}" löschen möchtest?`)) {
     
        recipeLists = recipeLists.filter(list => list !== listToDelete);
        localStorage.setItem("recipeLists", JSON.stringify(recipeLists));

        localStorage.removeItem(listToDelete);

  
        if (selectedList === listToDelete) {
          selectedList = recipeLists[0] || "";
        }
        updateListSelection();
      }
    } else if (listToDelete) {
      alert("Liste nicht gefunden!");
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
    listSelection.value = selectedList;
    loadRecipesForSelectedList();
  }

  function loadRecipesForSelectedList() {
    recipeList.innerHTML = "";
    if (!selectedList) return;
    const storedRecipes = JSON.parse(localStorage.getItem(selectedList) || "[]");
    storedRecipes.forEach((recipeName: string) => {
      addRecipeToDOM(recipeName);
    });
  }

  addBtn.addEventListener("click", () => {
    form.classList.toggle("hidden");
    input.focus();
  });

  saveBtn.addEventListener("click", () => {
    const recipeName = input.value.trim();
    if (recipeName === "") return;

    if (selectedList) {
      const storedRecipes = JSON.parse(localStorage.getItem(selectedList) || "[]");
      storedRecipes.push(recipeName);
      localStorage.setItem(selectedList, JSON.stringify(storedRecipes));
      addRecipeToDOM(recipeName);
    }

    input.value = "";
    form.classList.add("hidden");
  });

  function addRecipeToDOM(name: string) {
    const div = document.createElement("div");
    div.className = "recipe";
    div.textContent = name;
    div.draggable = true;
    div.dataset.name = name;
    div.dataset.list = selectedList;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Entfernen";
    removeBtn.className = "remove-btn";
    removeBtn.addEventListener("click", () => {
      removeRecipeFromList(name);
      div.remove();
    });

    div.appendChild(removeBtn);

    div.addEventListener("dragstart", (e: DragEvent) => {
      e.dataTransfer?.setData("text/plain", name);
    });
    recipeList.appendChild(div);
  }

  function removeRecipeFromList(recipeName: string) {
    const storedRecipes = JSON.parse(localStorage.getItem(selectedList) || "[]");
    const filteredRecipes = storedRecipes.filter((recipe: string) => recipe !== recipeName);
    localStorage.setItem(selectedList, JSON.stringify(filteredRecipes));
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

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Entfernen";
        removeBtn.className = "remove-btn";
        removeBtn.addEventListener("click", () => {
          recipeEl.remove();
        });

        recipeEl.appendChild(removeBtn);
        day.appendChild(recipeEl);
      }
    });
  });

  listSelection.addEventListener("change", () => {
    selectedList = listSelection.value;
    loadRecipesForSelectedList();
  });

  updateListSelection();
});