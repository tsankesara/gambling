// const axios = require('axios');
let checkIsAuth = function () {
	if (localStorage.getItem('jwt_token') === null) {
		return false;
	}
	// axios.get('/isAuth', { timeout: 100 }).then(
	// 	(data) => {
	// 		console.log(data);
	// 		return true;
	// 	},
	// 	(err) => {
	// 		console.log(err);
	// 		return false;
	// 	},
	// );
	else return true;
};
export default checkIsAuth;
