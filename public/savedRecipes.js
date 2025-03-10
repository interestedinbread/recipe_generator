import { renderRecipes } from "./utility.js";
import { btnSetup } from "./utility.js";

const savedRecipesContainer = document.querySelector('.saved-recipes-container');

savedRecipesContainer.innerHTML = `${renderRecipes(savedRecipes, true)}`

btnSetup(savedRecipes, true);
