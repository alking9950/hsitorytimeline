const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_username',
    password: 'your_mysql_password',
    database: 'timeline_history'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

// الحصول على جميع الأحداث
app.get('/api/events', (req, res) => {
    const sql = 'SELECT * FROM events';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// إضافة حدث جديد
app.post('/api/events', (req, res) => {
    const { title, date, category, description, image } = req.body;
    const sql = 'INSERT INTO events (title, date, category, description, image) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [title, date, category, description, image], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, ...req.body });
    });
});

// تحديث حدث
app.put('/api/events/:id', (req, res) => {
    const { title, date, category, description, image } = req.body;
    const sql = 'UPDATE events SET title = ?, date = ?, category = ?, description = ?, image = ? WHERE id = ?';
    db.query(sql, [title, date, category, description, image, req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ id: req.params.id, ...req.body });
    });
});

// حذف حدث
app.delete('/api/events/:id', (req, res) => {
    const sql = 'DELETE FROM events WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Event deleted successfully' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
