const jwt = require('jsonwebtoken');
require('dotenv').config();

//middleware will continue if the token is inside the local storage
module.exports = function (req, res, next) {
	// Get token from header
	const token = req.header('jwt_token');

	// return if there is no token
	if (!token) {
		return res.status(403).json({ msg: 'authorization denied' });
	}

	// Verify token
	try {
		//it is going to give the user id (user:{id: user.id})
		const verify = jwt.verify(token, process.env.jwtSecret);
		req.body.id = verify.user.id;
		req.body.is_admin = verify.user.is_admin;
		next();
	} catch (err) {
		res.status(401).json({
			jwtAuth: false,
			message: 'Session Expired! Login Again',
		});
	}
};
