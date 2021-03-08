const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const pool = require('../db');
router.post('/proposeMatch', authorize, async (req, res) => {
	const { id, match_desc, game, requested_bet } = req.body;
	// req_bet, player_1,
	try {
		checkStuff = await pool.query(
			'SELECT current_bal, is_frozen FROM users WHERE user_id = $1',
			[id],
		);

		const { current_bal, is_frozen } = checkStuff.rows[0];
		if (is_frozen) {
			return res
				.status(300)
				.json('YOur account is frozon you cannot start a match');
		}

		if (requested_bet > current_bal) {
			return res.status(300).json('Insufficent Balancec');
		}

		const newMatch = await pool.query(
			'INSERT into matches (player_1, match_desc, game, requested_bet) VALUES($1, $2, $3, $4) RETURNING *',
			[id, match_desc, game, requested_bet],
		);

		return res.status(200).json(newMatch.rows[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

module.exports = router;
