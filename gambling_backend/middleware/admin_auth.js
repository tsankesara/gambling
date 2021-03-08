module.exports = function (req, res, next) {
	const { is_admin } = req.body.is_admin;
	if (req.body.is_admin) {
		next();
	} else {
		return res.status(401).json('Admin Access Denied');
	}
};
