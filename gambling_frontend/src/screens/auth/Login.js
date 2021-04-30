import { useState, useEffect } from 'react';
import checkIsAuth from '../../tools/isAuth';
import { Redirect } from 'react-router';
import LoginComponent from '../../components/LoginComponent';

const Login = () => {
	const [isAuth, setIsAuth] = useState(false);
	useEffect(() => {
		let authBool = checkIsAuth();
		console.log(authBool);
		setIsAuth(authBool);
	});

	return (
		<>
			{isAuth ? (
				<Redirect to='/' />
			) : (
				<>
					<LoginComponent />
				</>
			)}
		</>
	);
};

export default Login;
