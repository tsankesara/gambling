const axios = require('axios');
let checkIsAuth = function () {
	if (localStorage.getItem('jwt_token') === null) {
		return false;
	}

	axios.get('/isAuth').then((data) => {
		const isAuth = data.data.isAuth;
		if (isAuth) {
			return true;
		} else {
			return false;
		}
	});
};
export default checkIsAuth;
