const ingredientsList = document.querySelector('.ingredients-list');

let ingredients = []

const ingredientInput = document.querySelector('.ingredients-input');

const displayList = () => {
    if(ingredients.length === 0){
        document.querySelector('.ingredients-list-container').classList.remove('hidden');
        return
    }

    ingredientsList.innerHTML = "";

    document.querySelector('.ingredients-list-container').classList.add('hidden');

    ingredients.forEach((ingredient, index) => {
        const ingredientEl = document.createElement('li');
        ingredientEl.textContent = ingredients[index];
        ingredientEl.id = index;
        ingredientsList.append(ingredientEl);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('ingredient-delete-btn');
        deleteBtn.innerHTML = "x";
        ingredientEl.append(deleteBtn);
    })
}

document.querySelector('.add-ingredient-btn').addEventListener('click', (e) => {
    e.preventDefault();
    if(ingredientInput.value.length === 0){
        return
    }
    ingredients.push(ingredientInput.value);
    ingredientInput.value = "";
    console.log(ingredients);
    displayList()
})

document.querySelector('.generate-recipes-btn').addEventListener('click', async (req, res) => {
    const selectedIngredients = ingredients;
    const urlParams = new URLSearchParams(window.location.search);
    const mealType = urlParams.get("mealType");

        try{
            const response = await fetch('/recipe/generate', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    mealType,
                    ingredients: selectedIngredients })
                })
            if (!response.ok) {
                throw new Error("Failed to fetch recipes")
            }
            const data = await response.json();
            console.log(data);

            localStorage.setItem('recipes', JSON.stringify(data.recipes));

            window.location.href=`/recipe/results?mealType=${mealType}`;

        } catch (error){
            console.error("Error:", error);
        }
    
})

window.addEventListener('DOMContentLoaded', () => {
    ingredientsList.addEventListener('click', function(e) {
        if(e.target.classList.contains('ingredient-delete-btn')){
            if(ingredients.length === 1){
                ingredientsList.innerHTML = "";
            }
            targetEl = e.target.closest('li');
            index = targetEl.id;
            ingredients.splice(index, 1);
            displayList();
        }
    })
})