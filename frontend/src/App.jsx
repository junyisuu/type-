import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './Navbar';
import Landing from './Landing';
import Play from './Play';
import Login from './Login';
import Profile from './Profile';
import Register from './Register';

export default class App extends PureComponent {
	state = {
		apiPath: process.env.REACT_APP_API_PATH,
		selfUser: null,
		loadingSelf: true,
	};

	async componentDidMount() {
		const token = localStorage.getItem('token');
		if (!token) {
			return this.setState({
				loadingSelf: false,
			});
		}

		const { apiPath } = this.state;

		try {
			const res = await fetch(`${apiPath}/users/self`, {
				headers: {
					Authorization: token,
				},
			});
			if (!res.ok) throw res.status;
			const { user } = await res.json();

			this.setState({
				selfUser: user,
				loadingSelf: false,
			});
		} catch (err) {
			console.log(err);
			this.setState({
				loadingSelf: false,
			});
		}
	}

	setSelfUser(selfUser, token) {
		this.setState({
			selfUser,
		});
	}

	render() {
		const { apiPath, selfUser, loadingSelf } = this.state;

		if (loadingSelf) {
			return <div className='ui massive active loader' />;
		}

		const setSelfUser = this.setSelfUser.bind(this);

		return (
			<div
				className='ui container'
				style={{
					paddingTop: '1em',
					paddingBottom: '1em',
				}}
			>
				<Router>
					<Navbar selfUser={selfUser} setSelfUser={setSelfUser} />
					<Switch>
						<Route
							exact
							path='/'
							render={() => <Landing selfUser={selfUser} />}
						/>
						<Route exact path='/play' render={() => <Play />} />
						<Route
							exact
							path='/login'
							render={() => (
								<Login
									apiPath={apiPath}
									selfUser={selfUser}
									setSelfUser={setSelfUser}
								/>
							)}
						/>
						<Route
							exact
							path='/profile'
							render={() => <Profile apiPath={apiPath} selfUser={selfUser} />}
						/>
						<Route
							exact
							path='/register'
							render={() => (
								<Register
									apiPath={apiPath}
									selfUser={selfUser}
									setSelfUser={setSelfUser}
								/>
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}
