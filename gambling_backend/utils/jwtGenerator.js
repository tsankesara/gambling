const jwt = require('jsonwebtoken');
require('dotenv').config();

function jwtGenerator(user_id, is_admin) {
	const payload = {
		//ADD ADMIN
		user: {
			id: user_id,
			is_admin: is_admin,
		},
	};

	return jwt.sign(payload, process.env.jwtSecret, { expiresIn: '1Y' });
}

module.exports = jwtGenerator;
