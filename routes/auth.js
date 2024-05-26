const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const session = require('express-session');

const pool = new Pool({
    user: 'nailgpuser',
    host: 'localhost',
    database: 'nailgp',
    password: 'password',
    port: 5432,
});

router.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
            [email, hashedPassword]
        );
        res.status(201).send('User registered');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).send('Error registering user');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) return res.status(400).send('User not found');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid password');

        req.session.userId = user.id;
        res.send('User logged in');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(400).send('Error logging in');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Error logging out');
        res.send('User logged out');
    });
});

module.exports = router;
