const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

const { User } = require('../src/database');

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

			const { username, password } = req.body;

			if (await User.exists({ username })) {
				return res.status(423).json({ error: 'Username already exists' });
			}

			const passwordHash = await bcrypt.hash(password, 10);
			const user = await User.create({
				username,
				passwordHash,
			});

			const token = jwt.sign(
				{
					userId: user._id,
				},
				secret
			);

			res.json({
				token,
				user: {
					_id: user._id,
					username: user.username,
				},
			});
		}
	);
};
