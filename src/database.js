const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const excerptSchema = new Schema(
	{
		URL: {
			type: String,
			required: true,
		},
		Title: {
			type: String,
			required: true,
		},
		// Author: {
		// 	type: String,
		// 	required: true,
		// },
		Excerpt: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model('User', userSchema);
const Excerpt = mongoose.model('Excerpt', excerptSchema);

module.exports = {
	mongoose,
	User,
	Excerpt,
};
