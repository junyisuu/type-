// import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:3030');

import io from 'socket.io-client';
const socket = io();

export default socket;
