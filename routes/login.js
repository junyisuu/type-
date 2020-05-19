const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

const { User } = require('../src/database');

module.exports = (router) => {
	router.post(
		'/login',
		// Limit to 20 requests per hour
		rateLimit({
			windowMS: 60 * 60 * 1000,
			max: 20,
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

			const user = await User.findOne({ username }, '_id username passwordHash')
				.lean()
				.exec();
			if (!user) {
				return res.status(404).json({ error: 'User does not exist' });
			}

			const isMatch = await bcrypt.compare(password, user.passwordHash);
			if (!isMatch) {
				return res.status(403).json({ error: 'Password does not match' });
			}

			const token = jwt.sign(
				{
					userId: user._id,
				},
				secret
			);

			delete user.passwordHash;
			res.json({
				token,
				user,
			});
		}
	);
};
