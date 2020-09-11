const express = require('express');
const transactions = express.Router();
const cors = require('cors');
const Pool = require('pg').Pool;

transactions.use(cors());

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


transactions.get('/', async (req, res) => {
    try {
        const getAllTrans = await pool.query('SELECT * FROM transactions');
        res.json(getAllTrans.rows);
    } catch (err) {
        console.log(err);
    }
})
transactions.get('/:user_id', async (req, res) => {
    try {
        const getTrans = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC', [
            req.params.user_id
        ]);
        res.json(getTrans.rows);
    } catch (err) {
        console.log(err);
    }
});

transactions.post('/create', async (req, res) => {
    try {
        const createTrans = await pool.query('INSERT INTO transactions (user_id, account, date, category, description, outflow, inflow) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING trans_id',
            [
                req.body.user_id,
                req.body.account,
                req.body.date,
                req.body.category,
                req.body.description,
                req.body.outflow,
                req.body.inflow
            ]);
            res.json(createTrans.rows);
    } catch (err) {
        console.log(err);
    }
});

transactions.put('/update', async (req, res) => {
    try {
        const updateTrans = await pool.query('UPDATE transactions SET account = $1, date = $2, category = $3, description = $4, outflow = $5, inflow = $6 WHERE trans_id = $7', [
            req.body.account,
            req.body.date,
            req.body.category,
            req.body.description,
            req.body.outflow,
            req.body.inflow,
            req.body.trans_id
        ])
    } catch (err) {
        console.log(err);
    }
})

transactions.delete('/delete/:trans_id', async (req, res) => {
    try {
        const deleteTrans = await pool.query('DELETE FROM transactions WHERE trans_id = $1', [
            req.params.trans_id
        ]);
        res.json(deleteTrans);
    } catch (err) {
        console.log(err);
    }
})

module.exports = transactions;