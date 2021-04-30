import React, { useState, useEffect } from 'react';
import validator from 'validator';
import { Redirect } from 'react-router';
import axios from 'axios';
import checkIsAuth from '../tools/isAuth';
const LoginComponent = () => {
	const [Email, setEmail] = useState('');
	const [Password, setPassword] = useState('');
	const [isError, setIsError] = useState(false);
	const [errorMessage, seterrorMessage] = useState('');
	const [IsAuth, setIsAuth] = useState();
	useEffect(() => {
		let authBool = checkIsAuth();
		console.log(authBool);
		setIsAuth(authBool);
	}, []);

	const validateAndLogin = (e) => {
		e.preventDefault();
		if (!validator.isEmail(Email)) {
			seterrorMessage('Invalid Email');
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
		let loginData = {
			email: Email,
			password: Password,
		};
		axios.post('/login', loginData).then(
			(data) => {
				localStorage.setItem('jwt_token', data.data.jwtToken);
				setIsAuth(true);
			},
			(error) => {
				console.log(error, { ...error });
				setIsError(true);
				seterrorMessage('error');
			},
		);
	};

	return (
		<>
			{IsAuth ? (
				<Redirect to='/' />
			) : (
				<>
					<form>
						<h3>Email: {Email}</h3>
						<h3>Password: {Password}</h3>

						<label>Email</label>
						<input
							onChange={(e) => setEmail(e.target.value)}
							type='text'
						/>
						<label>Password: </label>
						<input
							onChange={(e) => setPassword(e.target.value)}
							type='password'
						/>
						<button onClick={(e) => validateAndLogin(e)}>
							Login
						</button>
					</form>
					{isError ? <h1>{errorMessage}</h1> : null}
				</>
			)}
		</>
	);
};

export default LoginComponent;
