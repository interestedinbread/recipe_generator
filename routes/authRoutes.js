const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// set up register route
router.post('/register', async (req, res) => {
    
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // check if the email is already registered
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if(result.rows.length > 0){
            return res.status(400).json({message: 'Sorry, this email is already registered'})
        }

        // add the new info to the users table
        await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );

        console.log(`New user registered: ${username}`);
        res.status(200).redirect('/')
    } catch (err) {
        console.error(err);
        res.status(500).json({ mesage: 'Database error occurred'})
    }      
})

// set up login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if(result.rows.length === 0){
            return res.status(400).json({ message: 'Sorry, that email was not found'});
        }

        const user = result.rows[0];

        const isMatch = bcrypt.compare(password, user.password_hash);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid password'})
        }

        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login successful');

        res.cookie('token', token, { httpOnly: true });

        res.redirect('/recipe/mealType');
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Database error occurred' });
    }

    
})

module.exports = router;