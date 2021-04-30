import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import validator from 'validator';
import checkIsAuth from '../tools/isAuth';

const SignUpComponent = () => {
	const [isAuth, setIsAuth] = useState(false);
	const [Username, setUsername] = useState('');
	const [Email, setEmail] = useState('');
	const [PhoneNumber, setPhoneNumber] = useState('');
	const [Password, setPassword] = useState('');
	const [isError, setIsError] = useState(false);
	const [errorMessage, seterrorMessage] = useState('');
	const [isUpdate, setIsUpdate] = useState(false);
	useEffect(() => {
		let authBool = checkIsAuth();
		setIsAuth(authBool);
	}, [isUpdate]);

	const validateAndSignUp = (e) => {
		e.preventDefault();

		if (!Username) {
			seterrorMessage('Invalid username');
			setIsError(true);
			return;
		} else {
			setIsError(false);
		}
		if (!validator.isMobilePhone(PhoneNumber, ['en-IN'])) {
			seterrorMessage('Invalid Phone');
			setIsError(true);
			return;
		} else {
			setIsError(false);
		}
		if (!validator.isEmail(Email)) {
			seterrorMessage('Invalid Email');
			setIsError(true);
			return;
		} else {
			setIsError(false);
		}
		if (Password) {
			if (Password.length < 5) {
				seterrorMessage('Password Must be of six degits');
				setIsError(true);
				return;
			} else {
				setIsError(false);
			}
		} else {
			seterrorMessage('You cannot have empty password');
			setIsError(true);
		}
		setIsError(false);
		seterrorMessage('');

		const apiData = {
			username: Username,
			email: Email,
			phone_number: PhoneNumber,
			password: Password,
		};
		console.log(apiData);
		axios.post('/signup', apiData).then(
			(data) => {
				console.log(data);
				console.log(data.data.jwtToken);
				localStorage.setItem('jwt_token', data.data.jwtToken);
				setIsUpdate(true);
			},
			(error) => {
				console.log(error);
				setIsUpdate(!isUpdate);
			},
		);
	};

	return (
		<>
			{isAuth ? (
				<Redirect to='/' />
			) : (
				<>
					<form>
						<h3>Sign Up</h3>

						<div className='form-group'>
							<label>
								{Username} {Email} {typeof PhoneNumber}
							</label>
							<input
								type='text'
								className='form-control'
								placeholder='Username'
								onChange={(event) =>
									setUsername(event.target.value)
								}
							/>
						</div>

						<div className='form-group'>
							<label>PhoneNo</label>
							<input
								onChange={(event) =>
									setPhoneNumber(event.target.value)
								}
								type='text'
								className='form-control'
								placeholder='PhoneNo'
							/>
						</div>

						<div className='form-group'>
							<label>Email address</label>
							<input
								onChange={(event) =>
									setEmail(event.target.value)
								}
								type='email'
								className='form-control'
								placeholder='Enter email'
							/>
						</div>

						<div className='form-group'>
							<label>Password</label>
							<input
								onChange={(event) =>
									setPassword(event.target.value)
								}
								type='password'
								className='form-control'
								placeholder='Enter password'
							/>
						</div>

						<button
							onClick={(e) => validateAndSignUp(e)}
							className='btn btn-primary btn-block'>
							Sign Up
						</button>
						<p className='forgot-password text-right'>
							Already registered <a href='#'>sign in?</a>
						</p>
					</form>
					{isError ? { errorMessage } : null}
				</>
			)}
		</>
	);
};

export default SignUpComponent;
