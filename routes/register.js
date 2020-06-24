const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const secret = process.env.JWT_SECRET;

const { User, AccountToken } = require('../src/database');

module.exports = (router) => {
	router.post(
		'/register',
		// Limit registration to 5 requests per hour
		rateLimit({
			windowMS: 60 * 60 * 1000,
			max: 5,
		}),
		[
			check('username').isString().isLength({ min: 3, max: 32 }),
			check('password').isString().isLength({ min: 5, max: 256 }),
		],
		async (req, res) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			const { username, password, email } = req.body;

			if (await User.exists({ username })) {
				return res.status(423).json({ error: 'Username already exists' });
			}

			if (await User.exists({ email })) {
				return res.status(423).json({ error: 'Email already in use' });
			}

			const passwordHash = await bcrypt.hash(password, 10);
			const averageWPM = 0;
			const racesCompleted = 0;
			const racesWon = 0;
			const user = await User.create({
				username,
				passwordHash,
				email,
				averageWPM,
				racesCompleted,
				racesWon,
			});

			const accountToken = await AccountToken.create({
				userId: user._id,
				token: crypto.randomBytes(16).toString('hex'),
			});

			const msg = {
				to: 'kirkwong33@gmail.com',
				from: 'typedash.register@gmail.com',
				subject: 'Typedash Account Verification',
				html:
					'Hello ' +
					username +
					',' +
					'<br><br>' +
					'Please verify your account by clicking the link: <br>' +
					// 'http://typedash.live' +
					'http://localhost:3000' +
					'/verify/' +
					accountToken.token +
					'<br>',
			};

			sgMail.send(msg).then(
				(response) => {
					console.log('Email successfully sent!');
				},
				(error) => {
					console.error(error);

					if (error.response) {
						console.error(error.response.body);
					}
				}
			);

			// const token = jwt.sign(
			// 	{
			// 		userId: user._id,
			// 	},
			// 	secret
			// );

			res.json({
				// token,
				user: {
					_id: user._id,
					username: user.username,
				},
			});
		}
	);
};
