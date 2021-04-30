import { Route, Switch } from 'react-router-dom';
import User from './screens/User';
import Login from './screens/auth/Login';
import SignUp from './screens/auth/Signup';
import Home from './screens/Home';
import Money from './screens/Money';
const App = () => {
	return (
		<>
			<Switch>
				<Route path='/' exact component={Home} />
				<Route path='/user' exact component={User} />
				<Route path='/signup' exact component={SignUp}></Route>
				<Route path='/login' component={Login} exact />
				<Route path='/money' component={Money} exact />

				{/* <Route component={Home} /> Error404  */}
			</Switch>
		</>
	);
};
export default App;
