export const renderRecipes = (data) => {
    data.forEach((recipe, index) =>{
        const recipeContainer = document.createElement('div')
        recipeContainer.id = index;
        recipeContainer.classList.add('recipe-container')
        const ingredients = recipe.ingredients;

        const recipeStepsArray = recipe.instructions.split(/\d+\.\s*/).filter(step => step.trim() !== "");
        const instructions = `<ul>${recipeStepsArray.map(step => `<li class="recipe-step">${step}</li>`).join('')}</ul>`
    
        recipeContainer.innerHTML = `
        <div class="recipe-btns-container">
            <button class="recipe-toggle-btn">${recipe.title}</button>
            <button class="recipe-save-btn">
                <img src="../img/noun-bag-2149786-E63946.png" class="shopping-basket-icon"></img>
                Save
            </button>
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

        return recipeContainer;

    })
}

