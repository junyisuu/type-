module.exports = (router) => {
	router.post('/createRoom', async (req, res) => {
		// Do socket create room
		// return room id
		// redirect to lobby page
		console.log('crate');
		res.json({ created: 'created room!' });
	});
};
