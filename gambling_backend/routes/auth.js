const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validSignUp = require("../middleware/validInfo");
router.post("/signup", validSignUp, async (req, res) => {
	const { email, phone_number, password, username } = req.body;

	try {
		if (email) {
			const checkEmail = await pool.query(
				"SELECT * FROM users WHERE email = $1",
				[email]
			);
			if (checkEmail.rowCount > 0) {
				return res.status(401).json("Email Already in Use");
			}
		}
		const checkPhone = await pool.query(
			"SELECT * FROM users WHERE phone_number = $1",
			[phone_number]
		);
		if (checkPhone.rowCount > 0) {
			return res.status(401).json("Phone Already in Use");
		}

		const checkUsername = await pool.query(
			"SELECT * FROM users WHERE username = $1",
			[username]
		);
		if (checkUsername.rowCount > 0) {
			return res.status(401).json("Username in use.");
		}

		const salt = await bcrypt.genSalt(10);
		const bcryptPassword = await bcrypt.hash(password, salt);
		let newUser = await pool.query(
			"INSERT INTO users (email, phone_number, password, username) VALUES ($1, $2, $3, $4) RETURNING *",
			[email, phone_number, bcryptPassword, username]
		);
		const jwtToken = jwtGenerator(
			newUser.rows[0].user_id,
			newUser.rows[0].is_admin
		);
		return res.json({ jwtToken });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("server error");
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await pool.query("SELECT * FROM users WHERE email = $1", [
			email,
		]);
		if (user.rowCount === 0) {
			return res.status(401).json("Invalid Email");
		}
		const validPassword = await bcrypt.compare(password, user.rows[0].password);
		if (!validPassword) {
			return res.status(401).json("Invalid password");
		}
		const jwtToken = jwtGenerator(user.rows[0].user_id, user.rows[0].is_admin); //ADD is ADMIN
		return res.json({ jwtToken });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("server error");
	}
});

router.get("/signout", (req, res) => {
	res.clearCookie("jwt_token");
	res.json({
		message: "Signout success",
	});
});

router.get("/isAuth", (req, res) => {
	const token = req.header("jwt_token");

	// return if there is no token
	if (!token) {
		return res.status(401).json({ message: "authorization denied" });
	}

	// Verify token
	try {
		//it is going to give the user id (user:{id: user.id})
		const verify = jwt.verify(token, process.env.jwtSecret);
		req.body.id = verify.user.id;
		req.body.is_admin = verify.user.is_admin;
		return res.status(200).json({ isAuth: true });
	} catch (err) {
		console.log(err);
		return res.status(401).json({ isAuth: false });
	}
});

module.exports = router;
