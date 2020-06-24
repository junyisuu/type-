const { AccountToken, User } = require('../src/database');

module.exports = (router) => {
	router.post('/verify', async (req, res) => {
		console.log('verifying: ', req.body);
		AccountToken.findOne({ token: req.body.token }, function (err, token) {
			if (!token) {
				return res.status(400).send({
					msg:
						'We were unable to find a valid token. Your token may have expired.',
				});
			}

			User.findOne({ _id: token.userId, email: req.body.email }, function (
				err,
				user
			) {
				if (!user) {
					return res
						.status(400)
						.send({ msg: 'Unable to find a user for this token.' });
				}
				if (user.isVerified) {
					return res
						.status(400)
						.send({ msg: 'The account has already been verified.' });
				}

				user.isVerified = true;
				user.save(function (err) {
					if (err) {
						return res.status(500).send({ msg: err.message });
					}
					res.status(200).send('Account has been verified!');
				});
			});
		});
	});
};
