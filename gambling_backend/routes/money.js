const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const pool = require('../db');
const admin_auth = require('../middleware/admin_auth');
router.post('/addMoney', authorize, async (req, res) => {
	const { id, newMoney } = req.body;
	try {
		const user = await pool.query(
			'SELECT * FROM users WHERE user_id = $1',
			[id],
		);
		// return res.status(200).json(user);
		newBal = user.rows[0].current_bal + newMoney;
		moneyUpdate = await pool.query(
			'UPDATE users SET current_bal= $1 WHERE user_id= $2 RETURNING username, email, phone_number, current_bal',
			[newBal, id],
		);
		return res.status(200).json(moneyUpdate);
	} catch (error) {
		console.error(error.message);
		return res.json(error);
	}
});

router.post('/withdrawMoney', authorize, async (req, res) => {
	const { id, ammountToWithdraw } = req.body;
	try {
		const user = await pool.query(
			'SELECT * FROM users WHERE user_id = $1',
			[id],
		);
		current_bal = user.rows[0].current_bal;
		if (ammountToWithdraw > current_bal) {
			return res.status(400).json('Insuffcient Balance');
		}

		newBal = user.rows[0].current_bal - ammountToWithdraw;

		moneyUpdate = await pool.query(
			'UPDATE users SET current_bal = $1 WHERE user_id = $2 RETURNING current_bal, email',
			[newBal, id],
		);
		return res.status(200).json(moneyUpdate.rows[0]);
	} catch (error) {
		console.error(error.message);
		return res.status(500).json(error);
	}
});

module.exports = router;
