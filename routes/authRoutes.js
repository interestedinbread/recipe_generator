const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// set up register route
router.post('/register', async (req, res) => {
    
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) =>{
        if (err) return res.status(500).json({ message: err.message });
        if(result.length > 0) return res.status(400).json({ message: 'Sorry, this email is already registered!'});
    })

    db.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err, result) => {
            if (err) return res.status(500).json({ message: err.message });
            console.log(`New user registered: ${username}`);
            res.status(200).redirect('/login');
        }
    )
})

// set up login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async(err, results) =>{
        if(err) return res.status(500).json({ message: err.message });
        if(results.length === 0) return res.status(400).json({ message: 'Invalid email'});

        const user = results[0];

        const isMatch = bcrypt.compare(password, user.password_hash);
        if(!isMatch) return res.status(400).json({ message: 'Invalid password'});

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h'});
        console.log('login successful');

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/recipe/mealType') 
    })
})

module.exports = router;