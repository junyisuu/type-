import React, { PureComponent, Fragment } from 'react';
import { Redirect, Link } from 'react-router-dom';
import AbortController from 'abort-controller';
import {
	Segment,
	Button,
	Grid,
	Form,
	Header,
	Message,
} from 'semantic-ui-react';

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
		console.log('apiPath: ', apiPath);

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
				<Grid
					textAlign='center'
					style={{ height: '80vh' }}
					verticalAlign='middle'
				>
					<Grid.Column style={{ maxWidth: 450 }}>
						<Header as='h2' color='teal' textAlign='center'>
							{/* <Image src='/logo.png' />  */}
							Log-in to your account
						</Header>
						<Form size='large'>
							<Segment stacked>
								{failed ? (
									<p style={{ color: 'red' }}>
										Incorrect username or password.
									</p>
								) : null}
								<Form.Input
									autoFocus
									fluid
									icon='user'
									iconPosition='left'
									placeholder='Username'
									maxLength='32'
									value={username}
									onChange={this.onUsernameChange.bind(this)}
								/>

								<Form.Input
									fluid
									icon='lock'
									iconPosition='left'
									placeholder='Password'
									type='password'
									maxLength='256'
									value={password}
									onChange={this.onPasswordChange.bind(this)}
								/>

								<Button
									color='teal'
									fluid
									size='large'
									disabled={loading}
									onClick={() => this.login()}
								>
									Login
								</Button>
							</Segment>
						</Form>
						<Message>
							Don't have an account? <Link to='/register'>Sign Up</Link>
						</Message>
					</Grid.Column>
				</Grid>
			</Fragment>
		);
	}
}
