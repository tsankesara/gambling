const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");
const cloudinary = require("../utils/cloudinary");
// TODO
// Join Match DONE
// Win Claim
// Dispuit
// ADD FUNDING AND START MATCH! DONE

router.post("/proposeMatch", authorize, async (req, res) => {
	const { id, match_desc, game, requested_bet } = req.body;
	// req_bet, player_1,
	//ADD isFunding
	try {
		checkStuff = await pool.query(
			"SELECT current_bal, is_frozen FROM users WHERE user_id = $1",
			[id]
		);

		const { current_bal, is_frozen } = checkStuff.rows[0];
		if (is_frozen) {
			return res
				.status(300)
				.json("YOur account is frozon you cannot start a match");
		}

		if (requested_bet > current_bal) {
			return res.status(300).json("Insufficent Balancec");
		}

		let commission_amount = 0;
		if (requested_bet <= 100) {
			commission_amount = (7 / 100) * requested_bet;
			console.log(commission_amount);
			console.log("1");
		} else if (requested_bet < 500) {
			commission_amount = (10 / 100) * requested_bet;
			console.log(commission_amount, "2");
		} else {
			commission_amount = (11 / 100) * requested_bet;
			console.log(commission_amount, "4");
		}
		commission_amount = Math.floor(commission_amount);

		const winable_amount = requested_bet * 2 - commission_amount;
		const newMatch = await pool.query(
			"INSERT into matches (player_1, match_desc, game, requested_bet, commission_amount, winable_amount, status, match_created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
			[
				id,
				match_desc,
				game,
				requested_bet,
				commission_amount,
				winable_amount,
				"I",
				Date.now(),
			]
		);

		return res.status(200).json(newMatch.rows[0]);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

router.get("/getAvailableMatch", authorize, async (req, res) => {
	const { id } = req.body;
	try {
		const getMatch = await pool.query(
			"SELECT * FROM matches WHERE status = $1 AND player_1 <> $2",
			["I", id]
		);
		return res.status(200).json(getMatch);
	} catch (error) {
		console.error(error.message);
		return res.status(500).json(error);
	}
});

router.patch("/joinMatch", authorize, async (req, res) => {
	const { match_id, id } = req.body;
	try {
		const Match = await pool.query(
			"SELECT * FROM matches WHERE match_id = $1",
			[match_id]
		);
		const getCurrBal = await pool.query(
			"SELECT current_bal FROM users WHERE user_id = $1",
			[id]
		);
		if (getCurrBal.rows[0].current_bal < Match.rows[0].requested_bet) {
			return res.status(201).json("Insufficent Balance For Joining Match");
		}
		const updateMatch = await pool.query(
			"UPDATE matches SET player_2 = $1, status = $2 WHERE match_id = $3 RETURNING *",
			[id, "Joined", match_id]
		);
		return res.status(200).json(updateMatch.rows[0]);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
});

router.patch("/fundMatch", authorize, async (req, res) => {
	const { id, match_id } = req.body;
	try {
		const getMatch = await pool.query(
			"SELECT * FROM matches WHERE match_id = $1",
			[match_id]
		);
		let user;
		if (getMatch.rows[0].player_1 === id) {
			user = getMatch.rows[0].player_1;
			let queryHelp = "player_1_funded";
		} else if (getMatch.rows[0].player_2 === id) {
			user = getMatch.rows[0].player_2;
			let queryHelp = "player_2_funded";
		} else {
			return res
				.status(201)
				.json("User not matched with match", getMatch.rows[0], id);
		}
		const getUser = await pool.query("SELECT * FROM users WHERE user_id = $1", [
			user,
		]);
		if (getUser.rows[0].is_frozen) {
			return res.status(201).json("Your account is frozen, contact Admin");
		}
		if (getUser.rows[0].current_bal < getMatch.rows[0].requested_bet) {
			return res.status(201).json("Insufficent Balance for funding the match.");
		}
		const updateUserBal = await pool.query(
			"UPDATE users SET current_bal = $1 WHERE user_id = $2 RETURNING current_bal, username, email",
			[getUser.rows[0].current_bal - getMatch.rows[0].requested_bet, user]
		);
		console.log(user, queryHelp);
		const fundMatch = await pool.query(
			`UPDATE matches SET ${queryHelp} = $1 WHERE match_id = $2 RETURNING *`,
			["true", match_id]
		);
		return res.status(200).json({
			message: "Match Has Been Funded",
			...fundMatch.rows[0],
			...updateUserBal.rows[0],
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
});
router.patch("/startMatch", authorize, async (req, res) => {
	const { id, match_id } = req.body;
	try {
		const getMatch = await pool.query(
			"SELECT player_1, player_2, player_1_funded, player_2_funded FROM matches WHERE match_id = $1",
			[match_id]
		);
		if (getMatch.rows[0].player_1_funded && getMatch.rows[0].player_1_funded) {
			const startMatch = await pool.query(
				"UPDATE matches SET status = $1 WHERE match_id = $2 RETURNING *",
				["InProgress", match_id]
			);
			return res
				.status(200)
				.json("Match has been Started!", startMatch.rows[0]);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
});

router.post("/win_claim", authorize, async (req, res) => {
	const { id, image, match_id } = req.body;
	try {
		const getMatch = await pool.query(
			"SELECT * FROM win_claim WHERE match_id =  $1",
			[match_id]
		);
		if (getMatch.rowCount > 0) {
			return res
				.status(201)
				.json(
					"Opponent has filled a winning claim, if you suspect something wrong with result file dispute"
				);
		}
		const addImage = await cloudinary.uploader.upload(image);
		const insertImage = await pool.query(
			"INSERT into images (cloudinary_id, image_url) VALUES ($1, $2) RETURNING *",
			[addImage.public_id, addImage.secure_url]
		);
		const image_id = insertImage.rows[0].image_id;
		const insertClaim = await pool.query(
			"INSERT into win_claim (match_id, claim_by, winner_proof) VALUES($1, $2, $3) RETURNING *",
			[match_id, id, image_id]
		);
		return res.status(200).json({
			message: "Claim has been filed",
			...insertClaim.rows[0],
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
});
module.exports = router;
