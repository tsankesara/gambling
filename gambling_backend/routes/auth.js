const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validSignUp = require('../middleware/validInfo');
router.post('/signup', validSignUp, async (req, res) => {
	const { email, phone_number, password } = req.body;

	try {
		if (email) {
			const checkEmail = await pool.query(
				'SELECT * FROM users WHERE email = $1',
				[email],
			);
			if (checkEmail.rowCount > 0) {
				return res.status(401).json('Email Already in Use');
			}
		}
		const checkPhone = await pool.query(
			'SELECT * FROM users WHERE phone_number = $1',
			[phone_number],
		);
		if (checkPhone.rowCount > 0) {
			return res.status(401).json('Phone Already in Use');
		}
		const salt = await bcrypt.genSalt(10);
		const bcryptPassword = await bcrypt.hash(password, salt);
		let newUser = await pool.query(
			'INSERT INTO users (email, phone_number, password) VALUES ($1, $2, $3) RETURNING *',
			[email, phone_number, bcryptPassword],
		);
		const jwtToken = jwtGenerator(
			newUser.rows[0].user_id,
			newUser.rows[0].is_admin,
		);
		return res.json({ jwtToken });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await pool.query(
			'SELECT * FROM users WHERE email = $1',
			[email],
		);
		if (user.rowCount === 0) {
			return res.status(401).json('Invalid Email');
		}
		const validPassword = await bcrypt.compare(
			password,
			user.rows[0].password,
		);
		if (!validPassword) {
			return res.status(401).json('Invalid password');
		}
		const jwtToken = jwtGenerator(
			user.rows[0].user_id,
			user.rows[0].is_admin,
		); //ADD is ADMIN
		return res.json({ jwtToken });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

router.get('/signout', (req, res) => {
	res.clearCookie('jwt_token');
	res.json({
		message: 'Signout success',
	});
});

module.exports = router;
