/*
React component for verification page.
*/

import React, { PureComponent, Fragment } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Segment, Button, Grid, Form, Header } from 'semantic-ui-react';

export default class Verify extends PureComponent {
	constructor(props) {
		super(props);
		this.onEmailChange = this.onEmailChange.bind(this);
		this.verifyAccount = this.verifyAccount.bind(this);
	}

	state = {
		failed: false,
		errorMessage: '',
		email: '',
		token: '',
		verified: false,
	};

	// Verifies a token given a token and email
	async verifyToken(token, email) {
		const { apiPath } = this.props;

		console.log('fetching...');

		// Pass the token and email to /verify API route
		const res = await fetch(`${apiPath}/verify`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				token,
				email,
			}),
		});
		// If there was an error, throw it
		if (!res.ok) {
			const errorMsg = await res.json();
			this.setState({
				errorMessage: errorMsg,
			});
			throw res.status;
		}
		return;
	}

	async verifyAccount() {
		const { email, token } = this.state;
		console.log('email, token', email, token);
		try {
			await this.verifyToken(token, email);

			// If verifyToken() didn't throw any errors, then the account has been verified. Change verified state to redirect back to home page
			this.setState({
				verified: true,
			});
		} catch (err) {
			if (err.name !== 'AbortError') {
				console.error('Login error: ', err);

				this.setState({
					loading: false,
					failed: true,
				});
			}
		}
	}

	componentDidMount() {
		// Get the token string from the url
		const { pathname } = this.props.location;
		let token = pathname.substring(pathname.length - 32, pathname.length);

		// Set the token in state
		this.setState({
			token: token,
		});
	}

	// Handle email input and set it in state
	onEmailChange(event) {
		this.setState({ email: event.target.value });
	}

	render() {
		const { failed, errorMessage, email, verified } = this.state;

		// Once the account is verified, redirect to home page
		if (verified) {
			return <Redirect to='/' />;
		}

		return (
			<Fragment>
				<Grid
					textAlign='center'
					style={{ height: '80vh' }}
					verticalAlign='middle'
				>
					<Grid.Column style={{ maxWidth: 450 }}>
						<Header as='h2' color='teal' textAlign='center'>
							Enter email to verify your account
						</Header>
						<Form size='large'>
							<Segment stacked>
								{failed ? (
									<div className='ui pointing below red basic label'>
										{errorMessage.msg}
										<p>
											<br />
											Verification not working? &nbsp;
											<Link to='/resend'>Resend Verification</Link>
										</p>
									</div>
								) : null}

								<Form.Input
									autoFocus
									fluid
									icon='envelope'
									iconPosition='left'
									placeholder='Email'
									maxLength='32'
									value={email}
									onChange={this.onEmailChange}
								/>

								<Button
									color='teal'
									fluid
									size='large'
									onClick={this.verifyAccount}
								>
									Verify Account
								</Button>
							</Segment>
						</Form>
					</Grid.Column>
				</Grid>
			</Fragment>
		);
	}
}
