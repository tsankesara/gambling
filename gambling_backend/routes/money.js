const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const pool = require('../db');
const admin_auth = require('../middleware/admin_auth');
const cloudinary = require('../utils/cloudinary');
router.post('/addMoneyClaim', authorize, async (req, res) => {
	const { id, newMoney, image } = req.body;
	try {
		const addImage = await cloudinary.uploader.upload(image);
		const insertImage = await pool.query(
			'INSERT into images (cloudinary_id, image_url) VALUES ($1, $2) RETURNING *',
			[addImage.public_id, addImage.secure_url],
		);
		const addMoneyClaim = await pool.query(
			'INSERT into money_claim (amount, request_by, proof) VALUES ($1, $2, $3) RETURNING *',
			[newMoney, id, insertImage.rows[0].image_id],
		);
		return res.status(200).json(addMoneyClaim.rows[0]);
	} catch (error) {
		console.error(error);
		return res.json(error.message);
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
