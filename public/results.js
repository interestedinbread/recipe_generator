import { renderRecipes } from "./utility.js";

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
            const detailsContainer = btnsContainer.nextElementSibling;
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

    resultsContainer.innerHTML = renderRecipes(recipes);
    
} else {

    resultsContainer.innerHTML = "<p>No results found</p>";

}
