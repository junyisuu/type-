require('dotenv').config();

const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const { mongoose } = require('./src/database');

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

const http = require('http').Server(app);
const io = require('socket.io')(http);

const socketHandler = require('./src/socket');

var username_socket_pair = {};

io.on('connection', function (socket) {
	socketHandler(socket, io, username_socket_pair);
});
io.listen(8000);

app.use(require('./routes/index'));

const mongoUrl = process.env.MONGO_URL;
mongoose
	.connect(mongoUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log('MongoDB successfully connected'))
	.catch((err) => console.log(err));

const port = process.env.APP_PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
