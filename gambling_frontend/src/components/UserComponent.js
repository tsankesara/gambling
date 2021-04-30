import React, { useEffect, useState } from 'react';
import axios from 'axios';
import validator from 'validator';

const UserComponent = () => {
	const [userInfo, setuserInfo] = useState('');
	const [isError, setisError] = useState(false);
	const [errorMessage, seterrorMessage] = useState('');
	const [WhatsApp, setWhatsApp] = useState('');
	useEffect(() => {
		axios.get('/userDetails').then(
			(data) => {
				console.log(data.data);
				setuserInfo(data.data);
			},
			(err) => {
				seterrorMessage('');
				setisError(true);
			},
		);
	}, []);

	const submitWhatsApp = (e) => {
		e.preventDefault();
		if (!validator.isMobilePhone(WhatsApp, ['en-IN'])) {
			seterrorMessage('Invalid Phone');
			setisError(true);
			return;
		} else {
			setisError(false);
		}
		axios.post('/updateWhatsapp', { newWhatsapp: WhatsApp }).then(
			(data) => {
				console.log(data);
				setuserInfo({
					...userInfo,
					whats_app_no: data.data.whats_app_no,
				});
			},
			(err) => {
				setisError(true);
				seterrorMessage(err);
			},
		);
	};

	return (
		<>
			<h3>{userInfo.username}</h3>
			<h1>{`TODO Show User Details`}</h1>
			{isError ? <h1>{errorMessage}</h1> : null}
			{userInfo.whats_app_no ? null : (
				<>
					<input onChange={(e) => setWhatsApp(e.target.value)} />
					<h1>{WhatsApp}</h1>
					<button onClick={(e) => submitWhatsApp(e)}>
						Set WhatsApp
					</button>
				</>
			)}

			{isError ? <h1>{errorMessage}</h1> : null}
		</>
	);
};

export default UserComponent;
