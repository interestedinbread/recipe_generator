const resultsContainer = document.querySelector('.results-container')
const storedRecipes = localStorage.getItem('recipes');
const recipes = JSON.parse(storedRecipes);

// need to fix this display toggle feature
window.addEventListener('DOMContentLoaded', () => {
    const toggleBtns = document.querySelectorAll('.recipe-toggle-btn');
    const saveBtns = document.querySelectorAll('.recipe-save-btn');
    toggleBtns.forEach(button => {
        button.addEventListener('click', function(e) {
            const recipeDetailsContainers = document.querySelectorAll('.recipe-details-container');
            recipeDetailsContainers.forEach(container => {
                container.classList.remove('hidden');
            })

            saveBtns.forEach(button => {
                button.classList.remove('hidden');
            })

            const btnsContainer = this.parentElement;
            detailsContainer = btnsContainer.nextElementSibling;
            detailsContainer.classList.toggle('hidden');

            const saveBtn = this.nextElementSibling;
            saveBtn.classList.add('hidden');
        })
    })

    saveBtns.forEach(button => {
        button.addEventListener('click', async function() {
            const recipeContainer = this.parentElement.parentElement
            const index = recipeContainer.id;
            const recipe = recipes[index];

            console.log(recipe);
            
            try{
                const response = await fetch('/recipe/save', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ recipe })
                })
                if (!response.ok){
                    throw new Error('Failed to save recipe')
                }
                const data = await response.json();
                console.log(data)
            } catch(err) {
                console.error('Error:', err)
            }

            
        })
    })
})

    

if(storedRecipes){
    recipes.forEach((recipe, index) =>{
        const recipeContainer = document.createElement('div')
        recipeContainer.id = index;
        recipeContainer.classList.add('recipe-container')
        const ingredients = recipe.ingredients.join(', ');

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

        resultsContainer.append(recipeContainer);

    })

} else {
    resultsContainer.innerHTML = "<p>No results found</p>";
}
