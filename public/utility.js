export const renderRecipes = (data, isSavedRecipe = false) => {
  return data
    .map((recipe, index) => {
      const recipeContainer = document.createElement("div");
      recipeContainer.id = isSavedRecipe ? recipe.id : index;
      recipeContainer.classList.add("recipe-container");

      const ingredients = recipe.ingredients.join(", ");

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

export const btnSetup = (data, isSavedRecipe = false) => {

    // select all toggle, save, and delete btns
    const toggleBtns = document.querySelectorAll('.recipe-toggle-btn');
    const saveBtns = document.querySelectorAll('.recipe-save-btn');
    const deleteBtns = document.querySelectorAll('.recipe-delete-btn')

    // add event listener to each toggle btn and set up display toggle functionality
    toggleBtns.forEach(button => {
        button.addEventListener('click', function(e) {
            // select all of the containers and hide them. We are using a backwards configuration so hidden means not hidden lol.
            const recipeDetailsContainers = document.querySelectorAll('.recipe-details-container');
            recipeDetailsContainers.forEach(container => {
                container.classList.remove('hidden');
            })

            // if we are working with saved recipes, hide all of the delete btns
            if(isSavedRecipe){
                deleteBtns.forEach(button => {
                    button.classList.remove('hidden')
                })   
                // select the target element's corresponding delete btn and display it
                const deleteBtn = this.nextElementSibling;
                deleteBtn.classList.add('hidden')
            } else {  
                // if we aren't working with saved recipes then we're working with results. In that case hide all of the save buttons. 
                saveBtns.forEach(button => {
                    button.classList.remove('hidden');
                })
                //  select the target element's corresponding save button and display it.
                const saveBtn = this.nextElementSibling;
                saveBtn.classList.add('hidden');
            }

            // this block should select recipe details container in both saved and results pages and display it.
            const btnsContainer = this.parentElement;
            const detailsContainer = btnsContainer.nextElementSibling;
            detailsContainer.classList.add('hidden');
        })


    })
    // set up front end save request using fetch api
    if(!isSavedRecipe){
        saveBtns.forEach(button => {
            button.addEventListener('click', async function() {
                
                if(this.dataset.clicked === "true"){
                    return
                }

                const recipeContainer = this.parentElement.parentElement
                const index = recipeContainer.id;
                const recipe = data[index];

                const buttonEl = this;
                this.dataset.clicked = "true";
                this.innerHTML = '<img src="../img/noun-check-mark-6493011-E63946.png" class="check-mark-icon">Saved';
                
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
                    
                    console.log('recipe saved');
                } catch(err) {
                    console.error('Error:', err)
                }
            })
        })
    } else {
        // Set up delete request using fetch api
        deleteBtns.forEach(button => {
            button.addEventListener('click', async function() {
                const recipeId = this.dataset.id;

                try{
                    const response = await fetch(`/recipe/delete/${recipeId}`, {
                        method: "DELETE",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    if(response.ok){
                        document.getElementById(recipeId).remove();
                        // window.location.reload(); 
                     
                        console.log('Recipe deleted')
                    } else {
                        console.error('Failed to delete recipe');
                    }
                } catch (error) {
                    console.error("Error deleting recipes:", error)
                }
            })
        })
    }
    
}
