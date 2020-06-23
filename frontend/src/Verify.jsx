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

	async verifyToken(token, email) {
		const { apiPath } = this.props;

		console.log('fetching...');

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
		if (!res.ok) {
			const errorMsg = await res.json();
			this.setState({
				errorMessage: errorMsg,
			});
			throw res.status;
		}
		// return await res.json();
		return;
	}

	async verifyAccount() {
		const { email, token } = this.state;
		console.log('email, token', email, token);
		try {
			await this.verifyToken(token, email);

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
		const { pathname } = this.props.location;
		let token = pathname.substring(pathname.length - 32, pathname.length);
		this.setState({
			token: token,
		});
	}

	onEmailChange(event) {
		this.setState({ email: event.target.value });
	}

	render() {
		const { failed, errorMessage, email, verified } = this.state;

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
							Enter your email to verify your account.
						</Header>
						<Form size='large'>
							<Segment stacked>
								{failed ? (
									<div className='ui pointing below red basic label'>
										{errorMessage.msg}
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
