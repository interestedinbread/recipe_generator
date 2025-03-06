import { renderRecipes } from "./utility.js";
const savedRecipesContainer = document.querySelector('.saved-recipes-container');

savedRecipesContainer.innerHTML = `${renderRecipes(savedRecipes)}`
