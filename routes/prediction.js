const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');

const pool = new Pool({
    user: 'nailgpuser',
    host: 'localhost',
    database: 'nailgp',
    password: 'password',
    port: 5432,
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

router.post('/save', upload.single('image'), async (req, res) => {
    if (!req.session.userId) return res.status(401).send('Unauthorized');
    try {
        const { title, confidence } = req.body;
        const imageSrc = path.join('/uploads', req.file.filename);
        const result = await pool.query(
            'INSERT INTO predictions (user_id, image_src, title, confidence) VALUES ($1, $2, $3, $4) RETURNING id',
            [req.session.userId, imageSrc, title, confidence]
        );
        res.send('Prediction saved');
    } catch (error) {
        console.error('Error saving prediction:', error); // Log the error
        res.status(500).send('Error saving prediction');
    }
});

router.get('/user-predictions', async (req, res) => {
    if (!req.session.userId) return res.status(401).send('Unauthorized');
    try {
        const result = await pool.query('SELECT * FROM predictions WHERE user_id = $1', [req.session.userId]);
        res.send(result.rows);
    } catch (error) {
        console.error('Error fetching predictions:', error);
        res.status(400).send('Error fetching predictions');
    }
});

module.exports = router;
