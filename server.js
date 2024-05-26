const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/prediction');

const app = express();
const port = 3001;

const pool = new Pool({
    user: 'nailgpuser',
    host: 'localhost',
    database: 'nailgp',
    password: 'password',
    port: 5432,
});

app.use(cors({
    origin: 'http://localhost:3000', // Ensure this matches your frontend URL
    credentials: true,
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
    store: new pgSession({
        pool: pool, // Connection pool
        tableName: 'session' // Use another table-name if needed
    }),
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use('/auth', authRoutes);
app.use('/predictions', predictionRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
