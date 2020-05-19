import React, { PureComponent, Fragment } from 'react';
import { Redirect } from 'react-router-dom';

export default class Register extends PureComponent {
	state = {
		loading: false,
		failedUsername: false,
		failedPassword: false,
		checked: false,
		username: '',
		password: '',
		passwordConfirmed: '',
		errorMessage: '',
	};

	controller = new AbortController();

	async validateAccount(username, password) {
		const { apiPath } = this.props;

		const res = await fetch(`${apiPath}/register`, {
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
		if (!res.ok) throw await res.json();

		return await res.json();
	}

	async createAccount() {
		this.setState({
			loading: true,
			failedUsername: false,
			failedPassword: false,
		});

		const { setSelfUser } = this.props;

		const { username, password, passwordConfirmed } = this.state;
		console.log(username, password);

		if (username.length < 3 || username.length > 32) {
			this.setState({
				failedUsername: true,
				loading: false,
				errorMessage:
					'Your username must be at least 3 characters and can not be more than 32 characters.',
			});
			return;
		}

		if (password.length < 5 || password.length > 256) {
			this.setState({
				failedPassword: true,
				loading: false,
				errorMessage:
					'Your password must be at least 5 characters and can not be more than 256 characters.',
			});
			return;
		}

		if (passwordConfirmed !== password) {
			this.setState({
				failedPassword: true,
				loading: false,
				errorMessage: 'The passwords you typed in does not match.',
			});
			return;
		}

		try {
			const { token, user } = await this.validateAccount(username, password);

			localStorage.setItem('token', token);
			setSelfUser(user);

			this.setState({
				loading: false,
				failed: false,
			});
		} catch (err) {
			if (err.name !== 'AbortError') {
				this.setState({
					loading: false,
					failedUsername: true,
					errorMessage: err.error,
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

	onPasswordConfirmedChange(event) {
		this.setState({ passwordConfirmed: event.target.value });
	}

	handleCheckboxChange = (event) =>
		this.setState({ checked: event.target.checked });

	render() {
		const { selfUser } = this.props;

		if (selfUser) {
			return <Redirect to='/' />;
		}

		const {
			username,
			password,
			passwordConfirmed,
			loading,
			failedUsername,
			failedPassword,
			errorMessage,
		} = this.state;

		return (
			<Fragment>
				{failedUsername ? (
					<div class='ui pointing below red basic label'>{errorMessage}</div>
				) : null}

				<form className='ui form'>
					<div className='field'>
						<label>Username</label>
						<input
							type='text'
							ame='username'
							placeholder='Username'
							value={username}
							onChange={this.onUsernameChange.bind(this)}
						/>
					</div>

					{failedPassword ? (
						<div class='ui pointing below red basic label'>{errorMessage}</div>
					) : null}

					<div className='field'>
						<label>Password</label>
						<input
							type='password'
							name='password'
							placeholder='Password'
							value={password}
							onChange={this.onPasswordChange.bind(this)}
						/>
					</div>

					<div className='field'>
						<label>Confirm Password</label>
						<input
							type='password'
							name='password-confirm'
							placeholder='Confirm Password'
							value={passwordConfirmed}
							onChange={this.onPasswordConfirmedChange.bind(this)}
						/>
					</div>

					<button
						className='ui primary button'
						type='button'
						onClick={() => this.createAccount()}
						disabled={loading}
					>
						Submit
					</button>
				</form>
			</Fragment>
		);
	}
}
