const recipes = document.querySelectorAll('.recipe');
const days = document.querySelectorAll('.day');

recipes.forEach(recipe => {
  recipe.addEventListener('dragstart', (e) => {
    e.dataTransfer?.setData('text/plain', (e.target as HTMLElement).dataset.name || '');
  });
});

days.forEach(day => {
  day.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  day.addEventListener('drop', (e) => {
    e.preventDefault();
    const recipeName = e.dataTransfer?.getData('text/plain');
    if (recipeName) {
      const recipeEl = document.createElement('div');
      recipeEl.textContent = recipeName;
      recipeEl.classList.add('recipe');
      day.appendChild(recipeEl);
    }
  });
});