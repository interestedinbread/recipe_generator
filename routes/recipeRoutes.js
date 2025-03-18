const express = require('express');
const OpenAi = require('openai');
const pool = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const openAi = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.redirect('/');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.redirect('/');

        req.user = user;
        next();
    })
}


router.get('/mealType', authenticateToken, (req, res) => {
    res.render('pages/mealType', {title: 'Select Mealtype', page: 'select-mealtype'})
})

router.get('/ingredients', authenticateToken, (req, res) => {
    res.render('pages/ingredients', {title: 'Select Ingredients', page: 'ingredients'})
})

router.post('/generate', authenticateToken, async (req, res) => {

    try {
        const { mealType, ingredients } = req.body;

        const response = await openAi.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "you are an AI that gives recipe recommendations based on ingredients. Return results in json format only."},
                { role: "user", content: `Generate 5 ${mealType} recipes using ONLY these ingredients: ${JSON.stringify(ingredients)}.`}
            ],
            functions: [
            {
                "name": "generate_recipes",
                "description": "Generate 5 recipes based on provided ingredients",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "recipes": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "title": { "type": "string"},
                                    "ingredients": { "type": "array", "items": { "type": "string" } },
                                    "time_required": { "type": "integer" },
                                    "instructions": { "type": "string" }
                                },
                                "required" : ["title", "ingredients", "time_required", "instructions"]
                            }
                        }
                    },
                    "required": ["recipes"]
                }
            }
            ],
            function_call: { name: "generate_recipes" }
        })
        const recipes = response.choices[0].message.function_call.arguments;
        res.status(200).json(JSON.parse(recipes));
        
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to generate recipes" });
    }
})

router.get('/results', authenticateToken, (req, res) => {
    const mealType = req.query.mealType;
    res.render('pages/results', {title: 'Results Page', page: 'results', mealType})
})

router.post('/save', authenticateToken, async (req, res) => {

    try {
        let { title, ingredients, time_required, instructions } = req.body.recipe;
        const userId = req.user.userId

        if(!userId || !title || !ingredients || !time_required || !instructions){
            return res.status(400).json({ message: "Missing request parameter" })
        }

        if(Array.isArray(ingredients)){
            ingredients = JSON.stringify(ingredients);
        }

        const query = `
            INSERT INTO saved_recipes (user_id, title, ingredients, time_required, instructions)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;

        const values = [userId, title, ingredients, time_required, instructions];

        const result = await pool.query(query, values);
        console.log('Recipe saved:', result.rows[0]);

        res.json({ success: true, savedRecipe: result.rows[0] })
    } catch (err) {
        console.error('Error saving recipe', err)
        res.status(500).json({ message: err.message })
    } 
    
})

router.get('/saved', authenticateToken, async (req, res) => {

    try{
        const userId = req.user.userId;

        const query = `
            SELECT * FROM saved_recipes
            WHERE user_id = $1;
            `;

        const result = await pool.query(query, [userId])

        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'No recipes found'})
        }

        const recipes = result.map(recipe => ({
            ...recipe,
            ingredients: JSON.parse(recipe.ingredients)
        }));

        res.render('pages/savedRecipes', { title: "Saved Recipes", page: 'savedRecipes', recipes });
    } catch (err){
        console.error('An error occurred:', err)
        res.status(500).json({ message: err.message})
    }
})

router.delete('/delete/:id', authenticateToken, async (req, res) => {

    try {
        const userId = req.user.userId;
        const recipeId = req.params.id;

        const query = `
            DELETE FROM saved_recipes
            WHERE user_id = $1 AND id = $2
            RETURNING *;
        `;

        const result = await pool.query(query, [userId, recipeId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Recipe not found or unauthorized'});
        }

        console.log('Recipe deleted:', result.rows[0]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting recipe:', err.message);
        res.status(500).json({ error: err.message });
    }   
})

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

module.exports = router;