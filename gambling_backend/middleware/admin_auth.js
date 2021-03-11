module.exports = function (req, res, next) {
	const { is_admin } = req.body;
	if (is_admin) {
		next();
	} else {
		return res.status(401).json('Admin Access Denied');
	}
};
