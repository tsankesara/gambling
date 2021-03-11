const express = require('express');
const authorize = require('../middleware/authorize');
const admin_auth = require('../middleware/admin_auth');
const router = express.Router();
const pool = require('../db');
router.get('/getMoneyClaims', authorize, admin_auth, async (req, res) => {
	try {
		const getMoneyClaims = await pool.query(
			'SELECT * FROM money_claim INNER JOIN images ON images.image_id = money_claim.proof INNER JOIN users ON users.user_id = money_claim.request_by WHERE is_approved = $1 and is_declined = $2',
			['false', 'false'],
		);
		return res.status(200).json(getMoneyClaims.rows);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
});
router.patch('/approveMoneyClaim', authorize, admin_auth, async (req, res) => {
	const { payment_id } = req.body;
	try {
		const getNewMoneyandUser = await pool.query(
			'SELECT amount, request_by FROM money_claim WHERE payment_id = $1',
			[payment_id],
		);
		user = getNewMoneyandUser.rows[0].request_by;
		addingAmount = getNewMoneyandUser.rows[0].amount;
		const oldBal = await pool.query(
			'SELECT current_bal FROM users WHERE user_id = $1',
			[user],
		);
		newBal = oldBal.rows[0].current_bal + addingAmount;
		const UpdateBalance = await pool.query(
			'UPDATE users SET current_bal = $1 WHERE user_id = $2 RETURNING current_bal, username, email',
			[newBal, user],
		);
		const update_claim = await pool.query(
			'UPDATE money_claim SET is_approved = $1, is_declined = $2 WHERE payment_id = $3 RETURNING *',
			['true', 'false', payment_id],
		);
		const return_result = {
			...UpdateBalance.rows[0],
			...update_claim.rows[0],
		};

		return res.status(200).json(return_result);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
});

router.put('/approveMoney', authorize, admin_auth, async (req, res) => {});

module.exports = router;
