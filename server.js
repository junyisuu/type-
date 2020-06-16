require('dotenv').config();

const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const { mongoose } = require('./src/database');
const path = require('path');
const socketHandler = require('./src/socket');

const app = express();

// Allow 100 requests every 15 minutes
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 100,
	})
);

app.use(cors());

app.use(compression());
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.use('/api', require('./routes/index'));

const server = require('http').createServer(app);
const io = require('socket.io')(server);

var username_socket_pair = {};
var all_rooms = {};

io.on('connection', function (socket) {
	socketHandler(socket, io, username_socket_pair, all_rooms);
});
// io.listen(8000);

const mongoUrl = process.env.MONGO_ATLAS;
mongoose
	.connect(mongoUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log('MongoDB successfully connected'))
	.catch((err) => console.log(err));

const port = process.env.APP_PORT || 5000;
server.listen(port, () =>
	console.log(`Server up and running on port ${port} !`)
);
