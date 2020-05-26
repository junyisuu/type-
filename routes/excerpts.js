const { Excerpt } = require('../src/database');

module.exports = (router) => {
	router.get('/excerpts', async (req, res) => {
		const excerpts = await Excerpt.aggregate().sample(10).exec();
		console.log(excerpts);
		res.json({ excerpts });
	});
};
