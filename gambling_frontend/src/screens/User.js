import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import UserComponent from '../components/UserComponent';

const User = () => {
	const [isAuth, setIsAuth] = useState(true);

	useEffect(() => {
		axios.get('/isAuth').then(
			(data) => {
				setIsAuth(data.data.isAuth);
			},
			(err) => {
				setIsAuth(false);
			},
		);
	}, []);

	// const signUp = axios.post(`${process.env.API_URI}/signup`);

	return <>{isAuth ? <UserComponent /> : <Redirect to='/' />}</>;
};

export default User;
