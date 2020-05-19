const requireToken = require('../src/requireToken');
const requireUser = require('../src/requireUser');

module.exports = (router) => {
	router.get('/users/self', requireToken, requireUser, (req, res) => {
		const { user } = req;
		res.json({
			user,
		});
	});
};
