import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import validator from 'validator';
import { Redirect } from 'react-router-dom';
import SignUpComponent from '../../components/SignUpComponent';
import checkIsAuth from '../../tools/isAuth';

const SignUp = () => {
	const [isAuth, setIsAuth] = useState(false);

	useEffect(() => {
		let authBool = checkIsAuth();
		setIsAuth(authBool);
	});

	// const signUp = axios.post(`${process.env.API_URI}/signup`, )

	return <>{isAuth ? <Redirect to='/' /> : <SignUpComponent />}</>;
};

export default SignUp;
