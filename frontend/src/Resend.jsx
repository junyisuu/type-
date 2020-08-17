import React, { PureComponent, Fragment } from 'react';
import { Segment, Button, Grid, Form, Header } from 'semantic-ui-react';

export default class Resend extends PureComponent {
	constructor(props) {
		super(props);
		this.onEmailChange = this.onEmailChange.bind(this);
		this.onUsernameChange = this.onUsernameChange.bind(this);
		this.resendToken = this.resendToken.bind(this);
	}

	state = {
		failed: false,
		errorMessage: '',
		username: '',
		email: '',
		resend: false,
	};

	async regenerateToken(username, email) {
		const { apiPath } = this.props;

		// Call /resend API route to resend the verification email
		const res = await fetch(`${apiPath}/resend`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
				email,
			}),
		});
		if (!res.ok) {
			const errorMsg = await res.json();
			this.setState({
				errorMessage: errorMsg,
			});
			throw res.status;
		}
		return await res.json();
	}

	async resendToken() {
		const { username, email } = this.state;

		try {
			await this.regenerateToken(username, email);

			// If no errors were thrown, set resend state to True
			this.setState({
				resend: true,
			});
		} catch (err) {
			if (err.name !== 'AbortError') {
				console.error('Resend error: ', err);

				this.setState({
					loading: false,
					failed: true,
				});
			}
		}
	}

	componentDidMount() {
		// Get token from url and set it in state
		const { pathname } = this.props.location;
		let token = pathname.substring(pathname.length - 32, pathname.length);
		this.setState({
			token: token,
		});
	}

	onEmailChange(event) {
		this.setState({ email: event.target.value });
	}

	onUsernameChange(event) {
		this.setState({ username: event.target.value });
	}

	render() {
		const { failed, errorMessage, email, resend, username } = this.state;

		return (
			<Fragment>
				<Grid
					textAlign='center'
					style={{ height: '80vh' }}
					verticalAlign='middle'
				>
					<Grid.Column style={{ maxWidth: 450 }}>
						<Header as='h2' color='teal' textAlign='center'>
							Resend email verification
						</Header>
						<Form size='large'>
							<Segment stacked>
								{failed ? (
									<div className='ui pointing below red basic label'>
										{errorMessage.msg}
									</div>
								) : null}

								{resend ? (
									<div className='ui pointing below green basic label'>
										Email verification has been re-sent!
									</div>
								) : null}

								<Form.Input
									autoFocus
									fluid
									icon='user'
									iconPosition='left'
									placeholder='Username'
									maxLength='32'
									value={username}
									onChange={this.onUsernameChange}
								/>

								<Form.Input
									fluid
									icon='envelope'
									iconPosition='left'
									placeholder='Email'
									maxLength='32'
									value={email}
									onChange={this.onEmailChange}
								/>

								{!resend ? (
									<Button
										color='teal'
										fluid
										size='large'
										onClick={this.resendToken}
									>
										Resend Email
									</Button>
								) : (
									<Button color='teal' fluid size='large' disabled>
										Resend Email
									</Button>
								)}
							</Segment>
						</Form>
					</Grid.Column>
				</Grid>
			</Fragment>
		);
	}
}
