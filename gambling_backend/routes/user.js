const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const pool = require('../db');

router.get('/userDetails', authorize, async (req, res) => {
	const { id } = req.body;
	try {
		const user = await pool.query(
			'SELECT * FROM users WHERE user_id = $1',
			[id],
		);
		user.rows[0].password = 'Not Visiable';
		return res.status(200).json(user.rows[0]);
	} catch (error) {
		console.log(error.message);
		res.status(500).json(error);
	}
});
router.post('/setUsername', authorize, async (req, res) => {
	const { id, newUsername } = req.body;
	try {
		const checkUsername = await pool.query(
			'SELECT * FROM users WHERE username = $1',
			[newUsername],
		);
		if (checkUsername.rowCount > 0) {
			return res.status(400).json('username exists');
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
	try {
		user = await pool.query(
			'UPDATE users SET username = $1 WHERE user_id = $2 RETURNING username, email, phone_number',
			[newUsername, id],
		);
		return res.status(200).json(user.rows[0]);
	} catch (error) {
		console.log(error.message);
		return res.status(500).json(error);
	}
});

router.post('/updateWhatsapp', authorize, async (req, res) => {
	const { id, newWhatsapp } = req.body;
	try {
		updateWhatapp = await pool.query(
			'UPDATE users SET whats_app_no = $1 WHERE user_id = $2 RETURNING whats_app_no, username, email',
			[newWhatsapp, id],
		);
		return res.status(200).json(updateWhatapp.rows[0]);
	} catch (error) {
		console.log(error.message);
		return res.status(500).json(error);
	}
});

module.exports = router;
