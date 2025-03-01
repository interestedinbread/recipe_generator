// set up toggle buttons for ingredient inputs
window.addEventListener('DOMContentLoaded', () => {
    const toggleBtns = document.querySelectorAll('.toggle-button');
    
    toggleBtns.forEach(button => {
        button.addEventListener('click', function() {
            const container = this.closest('.category');
            const inputContainer = container.querySelector('.input-container');
            if(inputContainer.classList.contains('hidden')){
                inputContainer.classList.remove('hidden');
                return;
            }

            const inputContainers = document.querySelectorAll('.input-container');
            inputContainers.forEach(container => {
                if(container.classList.contains('hidden')){
                  container.classList.remove('hidden');  
                }
            })

            inputContainer.classList.toggle('hidden');
        })
    })
})

// store ingredient inputs

const ingredientInput = []

const ingredientForms = document.querySelectorAll('.ingredient-form');
ingredientForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const input = form.querySelector('.ingredient-input')
        const value = input.value;
        // const category = input.getAttribute('data-category');

        if (!value) return;

        ingredientInput.push(value);
        
        input.value = "";
        console.log(ingredientInput);
    })
})

document.querySelector('.submit-ingredients-btn').addEventListener('click', async (req, res) => {
    const selectedIngredients = ingredientInput;
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