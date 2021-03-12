const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const pool = require('../db');

// TODO
// Join Match
// Win Claim
// Dispuit

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
		let commission_amount = 0;
		if (requested_bet <= 100) {
			commission_amount = (7 / 100) * requested_bet;
			console.log(commission_amount);
			console.log('1');
		} else if (requested_bet < 500) {
			commission_amount = (10 / 100) * requested_bet;
			console.log(commission_amount, '2');
		} else {
			commission_amount = (11 / 100) * requested_bet;
			console.log(commission_amount, '4');
		}
		commission_amount = Math.floor(commission_amount);

		const winable_amount = requested_bet * 2 - commission_amount;
		const newMatch = await pool.query(
			'INSERT into matches (player_1, match_desc, game, requested_bet, commission_amount, winable_amount, status) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
			[
				id,
				match_desc,
				game,
				requested_bet,
				commission_amount,
				winable_amount,
				'I',
			],
		);

		return res.status(200).json(newMatch.rows[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

router.get('/getAvailableMatch', authorize, async (req, res) => {
	const { id } = req.body;
	try {
		const getMatch = await pool.query(
			'SELECT * FROM matches WHERE status = $1 AND player_1 <> $2',
			['I', id],
		);
		return res.status(200).json(getMatch);
	} catch (error) {
		console.error(error.message);
		return res.status(500).json(error);
	}
});
module.exports = router;
