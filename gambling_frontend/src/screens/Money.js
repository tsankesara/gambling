import React, { useEffect, useState } from 'react';
import axios from 'axios';
import checkIsAuth from '../tools/isAuth';
import { Redirect } from 'react-router';
import MoneyComponent from '../components/MoneyComponent';

const Money = () => {
	const [isAuth, setisAuth] = useState(true);

	useEffect(() => {
		let authBool = checkIsAuth();
		if (!authBool) {
			setisAuth(false);
		}
	});
	return (
		<>
			<>{isAuth ? <MoneyComponent /> : <Redirect to='/login' />}</>
		</>
	);
};

export default Money;
