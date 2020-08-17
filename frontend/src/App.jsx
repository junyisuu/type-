import React, { PureComponent } from 'react';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// https://stackoverflow.com/a/56562801
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import Navbar from './Navbar';
import Landing from './Landing';
import Login from './Login';
import Profile from './Profile';
import Register from './Register';
import Verify from './Verify';
import Resend from './Resend';
import About from './About';

import Play from './Play';
import Lobby from './Lobby';
import Type from './Type';

export default class App extends PureComponent {
	constructor(props) {
		super(props);
		this.updateLobbyStatus = this.updateLobbyStatus.bind(this);
	}

	state = {
		// REACT_APP_API_PATH = localhost:3030 <- use this when running in local environment to avoid building frontend
		// apiPath: process.env.REACT_APP_API_PATH + '/api',

		// Use this when having backend server frontend (when deploying on AWS)
		apiPath: '/api',

		selfUser: null,
		loadingSelf: true,
		inLobby: false,
	};

	async componentDidMount() {
		// Try to retrieve the login token
		const token = localStorage.getItem('token');
		if (!token) {
			return this.setState({
				loadingSelf: false,
			});
		}

		const { apiPath } = this.state;

		try {
			// Authenticate the token and user using API route
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

	// https://stackoverflow.com/questions/34734301/passing-data-between-two-sibling-react-js-components
	// updateLobbyStatus is a function that is passed between the lobby, play, and type components so that there is synchronization of the user's inLobby status
	updateLobbyStatus(status) {
		this.setState({
			inLobby: status,
		});
	}

	render() {
		const { apiPath, selfUser, loadingSelf, inLobby } = this.state;

		// If still loading, render a loader on the page
		if (loadingSelf) {
			return <div className='ui massive active loader' />;
		}

		const setSelfUser = this.setSelfUser.bind(this);

		return (
			<Container className='app_container'>
				<BrowserRouter>
					<Navbar
						selfUser={selfUser}
						setSelfUser={setSelfUser}
						inLobby={inLobby}
					/>
					<Switch>
						<Route
							exact
							path='/'
							render={(props) => (
								<Landing {...props} apiPath={apiPath} selfUser={selfUser} />
							)}
						/>
						<Route
							exact
							path='/login'
							render={(props) => (
								<Login
									{...props}
									apiPath={apiPath}
									selfUser={selfUser}
									setSelfUser={setSelfUser}
								/>
							)}
						/>
						<Route
							exact
							path='/about'
							render={(props) => (
								<About {...props} apiPath={apiPath} selfUser={selfUser} />
							)}
						/>
						<Route
							exact
							path='/profile'
							render={(props) => (
								<Profile {...props} apiPath={apiPath} selfUser={selfUser} />
							)}
						/>
						<Route
							exact
							path='/register'
							render={(props) => (
								<Register
									{...props}
									apiPath={apiPath}
									selfUser={selfUser}
									setSelfUser={setSelfUser}
								/>
							)}
						/>
						<Route
							path='/verify/:id'
							render={(props) => (
								<Verify
									{...props}
									apiPath={apiPath}
									selfUser={selfUser}
									setSelfUser={setSelfUser}
								/>
							)}
						/>
						<Route
							exact
							path='/resend'
							render={(props) => (
								<Resend
									{...props}
									apiPath={apiPath}
									selfUser={selfUser}
									setSelfUser={setSelfUser}
								/>
							)}
						/>
						<Route
							exact
							path='/play'
							render={(props) => (
								<Play
									{...props}
									apiPath={apiPath}
									selfUser={selfUser}
									setSelfUser={setSelfUser}
									inLobby={inLobby}
									updateLobbyStatus={this.updateLobbyStatus}
								/>
							)}
						/>
						<Route
							exact
							path='/lobby'
							render={(props) => (
								<Lobby
									{...props}
									apiPath={apiPath}
									selfUser={selfUser}
									setSelfUser={setSelfUser}
									inLobby={inLobby}
									updateLobbyStatus={this.updateLobbyStatus}
								/>
							)}
						/>
						<Route
							exact
							path='/type'
							render={(props) => (
								<Type
									{...props}
									apiPath={apiPath}
									selfUser={selfUser}
									setSelfUser={setSelfUser}
									inLobby={inLobby}
									updateLobbyStatus={this.updateLobbyStatus}
								/>
							)}
						/>
					</Switch>
				</BrowserRouter>
			</Container>
		);
	}
}
