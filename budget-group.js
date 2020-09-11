const express = require('express');
const groups = express.Router();
const cors = require('cors');
const Pool = require('pg').Pool;

groups.use(cors());

const pool = new Pool({
	user: "postgres",
	password: "redacted",
	host: "localhost",
	port: 5432,
	database: "budgeting"
});
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


groups.get('/', async (req, res) => {
    try {
        const getAllGroups = await pool.query('SELECT * FROM budget_group');
        res.json(getAllGroups.rows);
    } catch (err) {
        console.log(err);
    }
});

groups.get('/:user_id', async (req, res) => {
    try {
        const getGroups = await pool.query('SELECT * FROM budget_group WHERE user_id = $1', [
            req.params.user_id
        ]);
        res.json(getGroups.rows);
    } catch (err) {
        console.log(err);
    }
});

groups.post('/create', async (req, res) => {
    try {
        const createGroup = await pool.query('INSERT INTO budget_group (title, total_budgeted, total_received, user_id) VALUES($1, $2, $3, $4) RETURNING group_id', [
            req.body.title,
            0.00,
            0.00,
            req.body.user_id
        ]);
        res.json(createGroup.rows);
    } catch (err) {
        console.log(err);
    }
});

groups.put('/update', async (req, res) => {
    try {
        const updateGroup = await pool.query('UPDATE budget_group SET total_budgeted = $1, total_received = $2 WHERE group_id = $3', [
            req.body.total_budgeted,
            req.body.total_received,
            req.body.group_id
        ]);
        res.json(updateGroup);
    } catch (err) {
        console.log(err);
    }
});

groups.delete('/delete/:group_id', async (req, res) => {
    try {
        const deleteGroup = await pool.query('DELETE FROM budget_group WHERE group_id = $1', [
            req.params.group_id
        ]);
        res.json(deleteGroup);
    } catch (err) {
        console.log(err);
    }
});

module.exports = groups;