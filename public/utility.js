export const renderRecipes = (data, isSavedRecipe = false) => {
  return data
    .map((recipe, index) => {
      const recipeContainer = document.createElement("div");
      recipeContainer.id = isSavedRecipe ? recipe.id : index;
      recipeContainer.classList.add("recipe-container");

      const ingredients = isSavedRecipe
        ? recipe.ingredients.join(", ")
        : recipe.ingredients;

      const recipeStepsArray = recipe.instructions
        .split(/\d+\.\s*/)
        .filter((step) => step.trim() !== "");
      const instructions = `<ul>${recipeStepsArray
        .map((step) => `<li class="recipe-step">${step}</li>`)
        .join("")}</ul>`;

      const buttonHtml =
        isSavedRecipe
          ? `<button class='recipe-delete-btn' data-id='${recipe.id}'>
            <img src="../img/noun-delete-5866435-E63946.png" class="trash-can-icon"></img>
            Delete
            </button>`
          : `<button class="recipe-save-btn">
            <img src="../img/noun-bag-2149786-E63946.png" class="shopping-basket-icon"></img>
                Save
            </button>`;

      recipeContainer.innerHTML = `
        <div class="recipe-btns-container">
            <button class="recipe-toggle-btn">${recipe.title}</button>
            ${buttonHtml}
        </div>
        <div class="recipe-details-container">
            <div class="time-required-container">
                <img src="../img/noun-clock-7574786-E63946.png" class="clock-icon">
                <p class="time-required-text">about ${recipe.time_required} minutes</p>
            </div>
            <div class="recipe-instructions-container">
                <div class="instructions-title-container">
                    <img src="../img/noun-checklist-445258-E63946.png" class="handbook-icon">
                    <h4 class="instructions-title">Instructions</h4>
                </div>
                <div class="instructions-steps-container">
                    ${instructions}
                </div>
            </div>
            <div class="recipe-ingredients-container">
                <div class="ingredients-title-container">
                <img src="../img/noun-275627-E63946.png" class="grocery-bag-icon">
                <h4 class="ingredients-title">Ingredients</h4>
                </div>
                <p class="recipe-ingredients">${ingredients}</p>
            </div>
            
        </div>
        `;

      return recipeContainer.outerHTML;
    })
    .join("");
};
