// import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:3030');

import io from 'socket.io-client';
const socket = io('/');

console.log('client socket is: ', socket);

export default socket;
