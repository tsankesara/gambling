import axios from 'axios';
import { useState, useEffect } from 'react';
import checkIsAuth from '../tools/isAuth';
const Login = () => {
	const [isAuth, setIsAuth] = useState(false);
	const [username, setUsername] = useState('');
	const [Password, setPassword] = useState('');
	const [isError, setIsError] = useState(false);
	const [errorMessage, seterrorMessage] = useState('');
	const [isUpdate, setIsUpdate] = useState(false);
	useEffect(() => {
		let authBool = checkIsAuth();
		setIsAuth(authBool);
	}, [isUpdate]);

	const validateAndLogin = (e) => {
		e.preventDefault();
		if (!username) {
			seterrorMessage('Empty Username');
			setIsError(true);
			return;
		}
		setIsError(false);
		if (!Password) {
			seterrorMessage('Empty Password');
			setIsError(true);
			return;
		}
		setIsError(false);
	};

	return (
		<>
			<form>
				<h3>Username: {username}</h3>
				<h3>Password: {Password}</h3>

				<label>username</label>
				<input
					onChange={(e) => setUsername(e.target.value)}
					type='text'
				/>
				<label>Password: </label>
				<input
					onChange={(e) => setPassword(e.target.value)}
					type='password'
				/>
				<button onClick={(e) => validateAndLogin(e)}>Login</button>
			</form>

			{isError ? <h1>{errorMessage}</h1> : null}
		</>
	);
};

export default Login;
