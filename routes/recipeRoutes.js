const express = require('express');
const OpenAi = require('openai');
const db = require('../db');
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
        res.json(JSON.parse(recipes));
        
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to generate recipes" });
    }
})

router.get('/results', authenticateToken, (req, res) => {
    const mealType = req.query.mealType;
    res.render('pages/results', {title: 'Results Page', page: 'results', mealType})
})

router.post('/save', authenticateToken, (req, res) => {
    let { title, ingredients, time_required, instructions } = req.body.recipe;
    const userId = req.user.userId

    console.log(title, ingredients, time_required, instructions);

    if(!userId || !title || !ingredients || !time_required || !instructions){
        return res.status(400).json({ message: "Missing request parameter" })
    }

    if(Array.isArray(ingredients)){
        ingredients = JSON.stringify(ingredients);
    }

    db.query('INSERT INTO saved_recipes (user_id, title, ingredients, time_required, instructions) VALUES (?, ?, ?, ?, ?)',
        [userId, title, ingredients, time_required, instructions],
        (err, result) => {
            if(err) return res.status(500).json({ message: err.message })
            console.log('recipe saved!')
        }
    )
})

router.get('/saved', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    db.query('SELECT * FROM saved_recipes WHERE user_id = ?', [userId], (err, result) => {
        if(err) return res.status(500).json({ message: err.message });
        recipes = result;
        res.render('pages/savedRecipes', { title: "Saved Recipes", page: 'savedRecipes', recipes });
    } )
})

module.exports = router;