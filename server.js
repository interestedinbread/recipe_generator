const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');

const app = express();

dotenv.config();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts)
app.use(cors());


app.set('layout', 'layouts/main');

app.use((req, res, next) => {
    console.log(`Method: ${req.method} URL:${req.url}`);
    next();
})

app.get('/', (req, res) => {
    res.render('pages/login', {title: 'Login Page', page: 'login'})
})

app.get('/register', (req, res) => {
    res.render('pages/register', {title: 'Register page', page: 'register'})
})


app.use('/auth', authRoutes)
app.use('/recipe', recipeRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))