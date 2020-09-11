const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const Pool = require('pg').Pool;
const transRoutes = require('./transactions');
const groupsRoutes = require('./budget-group');
const itemsRoutes = require('./budget_item');
const accRoutes = require('./account');

app.use(cors());

const pool = new Pool({
	user: "postgres",
	password: "redacted",
	host: "localhost",
	port: 5432,
	database: "budgeting"
});
app.use(express.json());
app.use('/transactions', transRoutes);
app.use('/groups', groupsRoutes);
app.use('/items', itemsRoutes);
app.use('/accounts', accRoutes);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to your server.');
});

app.get('/users', async (req, res) => {
    try {
        const getAllUsers = await pool.query("SELECT * FROM users");
        res.json(getAllUsers);
    } catch (err) {
        console.log(err);
    }
});

app.get('/login/:username/:password', async (req, res) => {
    try {
        const getUser = await pool.query("SELECT * FROM users WHERE username = $1 AND password = $2",
        [
            req.params.username,
            req.params.password
        ]);
        res.json(getUser.rows);
    } catch (err) {
        console.log(err);
    }
});

app.post('/register', async (req, res) => {
    try {
        const newUser = await pool.query("INSERT INTO users (username, password, email) VALUES($1, $2, $3)",
        [
            req.body.username,
            req.body.password,
            req.body.email
        ]);
        res.json(newUser);
    } catch (err) {
        console.log(err);
    }
});

app.put('/login/update', async (req, res) => {
    try {
        const updateUser = await pool.query("UPDATE users SET username = $1, password = $2, email = $3 WHERE user_id = $4",
        [
            req.body.username,
            req.body.password,
            req.body.email,
            req.body.user_id
        ]);
        res.json(updateUser);
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, () => {console.log(`Listening on port ${port}`)});