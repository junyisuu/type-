const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

const { AccountToken, User } = require('../src/database');

module.exports = (router) => {
	router.post('/resend', async (req, res) => {
		const { username, email } = req.body;

		console.log('in resend: ', username, email);

		User.findOne({ username: username, email: email }, async function (
			err,
			user
		) {
			if (!user) {
				return res.status(400).send({ msg: 'Unable to find the user.' });
			}
			if (user.isVerified) {
				return res
					.status(400)
					.send({ msg: 'The account has already been verified.' });
			}
			const accountToken = await AccountToken.create({
				userId: user._id,
				token: crypto.randomBytes(16).toString('hex'),
			});

			const msg = {
				to: 'kirkwong33@gmail.com',
				from: 'typedash.register@gmail.com',
				subject: 'Typedash Account Verification Resend',
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
					res.status(200).send({ msg: 'Email was re-sent' });
				},
				(error) => {
					console.error(error);

					if (error.response) {
						console.error(error.response.body);
					}

					res.status(500).send({
						msg:
							'Server error: Unable to resend token. Please try again later.',
					});
				}
			);
		});
	});
};
