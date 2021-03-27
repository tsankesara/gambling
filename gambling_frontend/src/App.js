import { Route, BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import User from './components/User';
import Login from './components/Login';
import SignUp from './components/Signup';
import checkIsAuth from './tools/isAuth';
import ProtectedRoute from './protected.route';
const App = () => {
	let authBool = checkIsAuth();
	console.log(authBool);
	return (
		<>
			<Switch>
				<ProtectedRoute path='/user' exact component={User} />
				<Route path='/signup' exact component={SignUp}></Route>
				<Route path='/login' component={Login} exact />
			</Switch>
		</>
	);
};
export default App;
