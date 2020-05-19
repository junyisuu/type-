import React, { PureComponent, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import AbortController from 'abort-controller';

export default class Login extends PureComponent {
	state = {
		loading: false,
		failed: false,
		username: '',
		password: '',
	};

	controller = new AbortController();

	async getAccount(username, password) {
		const { apiPath } = this.props;

		const res = await fetch(`${apiPath}/login`, {
			signal: this.controller.signal,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
				password,
			}),
		});
		if (!res.ok) throw res.status;

		return await res.json();
	}

	async login() {
		this.setState({
			loading: true,
			failed: false,
		});

		const { setSelfUser } = this.props;

		const { username, password } = this.state;

		try {
			const { token, user } = await this.getAccount(username, password);

			localStorage.setItem('token', token);
			setSelfUser(user);
		} catch (err) {
			if (err.name !== 'AbortError') {
				console.error(err);

				this.setState({
					loading: false,
					failed: true,
				});
			}
		}
	}

	onUsernameChange(event) {
		this.setState({ username: event.target.value });
	}

	onPasswordChange(event) {
		this.setState({ password: event.target.value });
	}

	componentWillUnmount() {
		this.controller.abort();
	}

	render() {
		const { selfUser } = this.props;

		if (selfUser) {
			return <Redirect to='/' />;
		}

		const { loading, failed, username, password } = this.state;

		return (
			<Fragment>
				<h1>Login</h1>
				<p>This is a placeholder</p>
				<div className='ui input'>
					<input
						type='text'
						placeholder='Username'
						maxLength='32'
						autoFocus
						value={username}
						onChange={this.onUsernameChange.bind(this)}
					/>
				</div>
				<div className='ui input'>
					<input
						type='password'
						placeholder='Password'
						maxLength='256'
						value={password}
						onChange={this.onPasswordChange.bind(this)}
					/>
				</div>
				<button
					className='ui primary button'
					onClick={() => this.login()}
					disabled={loading}
				>
					Log In
				</button>
				{failed ? <p>Failed to log in</p> : null}
			</Fragment>
		);
	}
}
