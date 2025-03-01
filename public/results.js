const resultsContainer = document.querySelector('.results-container')
const storedRecipes = localStorage.getItem('recipes');

window.addEventListener('DOMContentLoaded', () => {
    const toggleBtns = document.querySelectorAll('.recipe-toggle-btn');
    toggleBtns.forEach(button => {
        button.addEventListener('click', function() {
            const detailsContainer = this.nextElementSibling;
            detailsContainer.classList.toggle('hidden');
        })
    })
})

if(storedRecipes){
    const recipes = JSON.parse(storedRecipes);
    
    recipes.forEach(recipe =>{
        const recipeContainer = document.createElement('div')
        
        recipeContainer.innerHTML = `
        <button class="recipe-toggle-btn">${recipe.title}</button>
        <div class="recipe-details-container">
            <p>Takes about ${recipe.time_required} minutes</p>
            <p>Ingredients: ${recipe.ingredients}</p>
            <p>Instructions: ${recipe.instructions}</p>
        </div>
        `;

        resultsContainer.append(recipeContainer);
    })

} else {
    resultsContainer.innerHTML = "<p>No results found</p>";
}
