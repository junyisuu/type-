import React, { PureComponent, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Image } from 'semantic-ui-react';
import './Navbar.css';
import logo from './images/typedash_logo3.png';

export default class Navbar extends PureComponent {
	state = { activeItem: 'home' };
	handleItemClick = (e, { name }) => this.setState({ activeItem: name });

	render() {
		const { activeItem } = this.state;

		const { selfUser, setSelfUser, inLobby } = this.props;

		return (
			<div>
				<Menu
					pointing
					secondary
					// style={{ fontSize: '120%' }}
					className='navbar_items'
				>
					<Menu.Item
						as={NavLink}
						exact
						to='/'
						name='home'
						active={activeItem === 'home'}
						onClick={this.handleItemClick}
						className='navbar_logo'
					>
						<Image src={logo} size='small' />
					</Menu.Item>

					<Menu.Menu position='right'>
						{selfUser ? (
							inLobby ? (
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
									className='navbar_play'
									exact
									to='/play'
									name='play'
									active={activeItem === 'play'}
									onClick={this.handleItemClick}
								>
									Play
								</Menu.Item>
							)
						) : null}
						<Menu.Item
							as={NavLink}
							exact
							to='/about'
							name='about'
							active={activeItem === 'about'}
							onClick={this.handleItemClick}
						>
							About
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
									Sign Up
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
