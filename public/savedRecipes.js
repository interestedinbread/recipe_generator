import { renderRecipes } from "./utility.js";
const savedRecipesContainer = document.querySelector('.saved-recipes-container');

console.log(savedRecipes)

savedRecipesContainer.innerHTML = `${renderRecipes(savedRecipes)}`
