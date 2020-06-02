import React, { PureComponent, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

export default class Navbar extends PureComponent {
	state = { activeItem: 'home' };
	handleItemClick = (e, { name }) => this.setState({ activeItem: name });

	render() {
		const { activeItem } = this.state;

		const { selfUser, setSelfUser, inLobby } = this.props;

		return (
			<div>
				<Menu pointing secondary style={{ fontSize: '120%' }}>
					<Menu.Item
						as={NavLink}
						exact
						to='/'
						name='type'
						active={activeItem === 'home'}
						onClick={this.handleItemClick}
					>
						Type-
					</Menu.Item>

					{selfUser ? (
						<Menu.Item
							as={NavLink}
							exact
							to='/profile'
							name='profile'
							active={activeItem === 'profile'}
							onClick={this.handleItemClick}
						>
							Profile
						</Menu.Item>
					) : null}

					{inLobby ? (
						<Menu.Item
							as={NavLink}
							exact
							to='/lobby'
							name='lobby'
							active={activeItem === 'lobby'}
							onClick={this.handleItemClick}
						>
							Lobby
						</Menu.Item>
					) : (
						<Menu.Item
							as={NavLink}
							exact
							to='/play'
							name='play'
							active={activeItem === 'play'}
							onClick={this.handleItemClick}
						>
							Play
						</Menu.Item>
					)}

					<Menu.Menu position='right'>
						{selfUser ? (
							<Menu.Item
								name='logout'
								active={activeItem === 'logout'}
								onClick={() => {
									setSelfUser(null);
									localStorage.removeItem('token');
								}}
							>
								Log Out
							</Menu.Item>
						) : (
							<Fragment>
								<Menu.Item
									as={NavLink}
									exact
									to='/register'
									name='register'
									active={activeItem === 'register'}
									onClick={this.handleItemClick}
									style={{ marginRight: '.5em' }}
								>
									Register
								</Menu.Item>

								<Menu.Item
									as={NavLink}
									exact
									to='/login'
									name='login'
									active={activeItem === 'login'}
									onClick={this.handleItemClick}
								>
									Log In
								</Menu.Item>
							</Fragment>
						)}
					</Menu.Menu>
				</Menu>
			</div>

			// <div className='ui large secondary stackable menu'>
			// 	<div className='item'>
			// 		<b>Type-</b>
			// 	</div>
			// 	<Link className='item' to='/'>
			// 		Home
			// 	</Link>
			// 	{selfUser ? (
			// 		<Link className='item' to='/profile'>
			// 			Profile
			// 		</Link>
			// 	) : null}
			// 	<Link className='item' to='/about'>
			// 		About Us
			// 	</Link>
			// 	<div className='right menu'>
			// 		<div className='item'>
			// 			{selfUser ? (
			// 				<button
			// 					className='ui violet button'
			// 					onClick={() => {
			// 						setSelfUser(null);
			// 						localStorage.removeItem('token');
			// 					}}
			// 				>
			// 					Log Out
			// 				</button>
			// 			) : (
			// 				<Fragment>
			// 					<Link
			// 						className='ui blue button'
			// 						to='/login'
			// 						style={{ marginRight: '.5em' }}
			// 					>
			// 						Log In
			// 					</Link>
			// 					<Link className='ui green button' to='/register'>
			// 						Register
			// 					</Link>
			// 				</Fragment>
			// 			)}
			// 		</div>
			// 	</div>
			// </div>
		);
	}
}
