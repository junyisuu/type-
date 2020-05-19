import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends PureComponent {
	render() {
		const { selfUser, setSelfUser } = this.props;

		return (
			<div className='ui large secondary stackable menu'>
				<div className='item'>
					<b>Type-</b>
				</div>
				<Link className='item' to='/'>
					Home
				</Link>
				{selfUser ? (
					<Link className='item' to='/profile'>
						Profile
					</Link>
				) : null}
				<Link className='item' to='/about'>
					About Us
				</Link>
				<div className='right menu'>
					<div className='item'>
						{selfUser ? (
							<button
								className='ui violet button'
								onClick={() => {
									setSelfUser(null);
									localStorage.removeItem('token');
								}}
							>
								Log Out
							</button>
						) : (
							<Fragment>
								<Link
									className='ui blue button'
									to='/login'
									style={{ marginRight: '.5em' }}
								>
									Log In
								</Link>
								<Link className='ui green button' to='/register'>
									Register
								</Link>
							</Fragment>
						)}
					</div>
				</div>
			</div>
		);
	}
}
