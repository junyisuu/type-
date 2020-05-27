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
		url: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		excerpt: {
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
