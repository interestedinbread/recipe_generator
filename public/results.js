import { renderRecipes } from "./utility.js";
import { btnSetup } from "./utility.js";

const resultsContainer = document.querySelector('.results-container')
const storedRecipes = localStorage.getItem('recipes');
const recipes = JSON.parse(storedRecipes);

if(storedRecipes){

    resultsContainer.innerHTML = renderRecipes(recipes);
    
} else {

    resultsContainer.innerHTML = "<p>No results found</p>";

}

btnSetup(recipes); 

