// import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:3030');

import io from 'socket.io-client';

// For deployment
const socket = io('/');

// For local development
// const socket = io(process.env.REACT_APP_API_PATH);

export default socket;
