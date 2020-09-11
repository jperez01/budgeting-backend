const express = require('express');
const items = express.Router();
const cors = require('cors');
const Pool = require('pg').Pool;

items.use(cors());

const pool = new Pool({
	user: "postgres",
	password: "redacted",
	host: "localhost",
	port: 5432,
	database: "budgeting"
});


items.get('/', async (req, res) => {
    try {
        const getAllItems = await pool.query('SELECT * FROM budget_item');
        res.json(getAllItems.rows);
    } catch (err) {
        console.log(err);
    }
});

items.get('/:group_id', async (req, res) => {
    try {
        const getItems = await pool.query('SELECT * FROM budget_item WHERE group_id = $1', [
            req.params.group_id
        ]);
        res.json(getItems.rows);
    } catch (err) {
        console.log(err);
    }
});

items.post('/create', async (req, res) => {
    try {
        const createItem = await pool.query('INSERT INTO budget_item (name, budgeted, received, group_id) VALUES($1, $2, $3, $4) RETURNING item_id', [
            req.body.name,
            req.body.budgeted,
            0.00,
            req.body.group_id
        ]);
        res.json(createItem.rows);
    } catch (err) {
        console.log(err);
    }
});

items.put('/update', async (req, res) => {
    try {
        const updateItem = await pool.query('UPDATE budget_item SET budgeted = $1, received = $2, name = $3 WHERE item_id = $4', [
            req.body.budgeted,
            req.body.received,
            req.body.name,
            req.body.item_id
        ]);
        res.json(updateItem);
    } catch (err) {
        console.log(err);
    }
});

items.delete('/delete/:item_id', async (req, res) => {
    try {
        const deleteItem = await pool.query('DELETE FROM budget_item WHERE item_id = $1', [
            req.params.item_id
        ]);
        res.json(deleteItem);
    } catch (err) {
        console.log(err);
    }
});

module.exports = items;