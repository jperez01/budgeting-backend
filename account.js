const express = require('express');
const accounts = express.Router();
const cors = require('cors');
const Pool = require('pg').Pool;

accounts.use(cors());

const pool = new Pool({
	user: "postgres",
	password: "redacted",
	host: "localhost",
	port: 5432,
	database: "budgeting"
});

accounts.get('/', async (req, res) => {
    try {
        const getAllAccounts = await pool.query('SELECT * FROM accounts');
        res.send(getAllAccounts.rows);
    } catch (err) {
        console.log(err);
    }
});

accounts.get('/:user_id', async (req, res) => {
    try {
        const getAccounts = await pool.query('SELECT * FROM accounts WHERE user_id = $1', [
            req.params.user_id
        ]);
        res.send(getAccounts.rows);
    } catch (err) {
        console.log(err);
    }
});

accounts.post('/create', async (req, res) => {
    try {
        const createAccount = await pool.query('INSERT INTO accounts (user_id, name, balance, type) VALUES($1, $2, $3, $4) RETURNING acc_id', [
            req.body.user_id,
            req.body.name,
            req.body.balance,
            req.body.type
        ]);
        res.send(createAccount.rows);
    } catch (err) {
        console.log(err);
    }
});

accounts.put('/update', async (req, res) => {
    try {
        const updateAccount = await pool.query('UPDATE accounts SET name = $1, balance = $2, type = $3 WHERE acc_id = $4', [
            req.body.name,
            req.body.balance,
            req.body.type,
            req.body.acc_id
        ]);
        res.send(updateAccount);
    } catch (err) {
        console.log(err);
    }
});

accounts.delete('/delete/:acc_id', async (req, res) => {
    try {
        const deleteAccount = await pool.query('DELETE FROM accounts WHERE acc_id = $1', [
            req.params.acc_id
        ]);
        res.send(deleteAccount);
    } catch (err) {
        console.log(err);
    }
});

module.exports = accounts;