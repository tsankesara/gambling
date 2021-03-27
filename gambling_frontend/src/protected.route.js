import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import checkIsAuth from './tools/isAuth';
const ProtectedRoute = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				let authBool = checkIsAuth();
				if (authBool) {
					console.log('false but not redirectling');

					return <Component {...props} />;
				} else {
					console.log('false but not redirectling');
					return <Redirect to='/login' />;
				}
			}}
		/>
	);
};

export default ProtectedRoute;
