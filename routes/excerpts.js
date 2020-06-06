const { Excerpt } = require('../src/database');

module.exports = (router) => {
	router.get('/excerpts', async (req, res) => {
		const excerpts = await Excerpt.aggregate().sample(10).exec();
		console.log(excerpts);
		res.json({ excerpts });
	});

	router.get('/excerpt', async (req, res) => {
		const excerpt = await Excerpt.aggregate().sample(1).exec();
		console.log(excerpt);
		res.json({ excerpt });
	});
};
