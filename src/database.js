/*
Defines all document schemas used in MongoDB database. 
*/

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
		email: {
			type: String,
			unique: true,
			required: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		averageWPM: {
			type: Number,
			default: 0,
		},
		racesCompleted: {
			type: Number,
			default: 0,
		},
		racesWon: {
			type: Number,
			default: 0,
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
		leaderboard: {
			type: Array,
			required: true,
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

// https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb
const tokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		// Token document will automatically delete itself after 12 hours
		expires: 43200,
	},
});

const User = mongoose.model('User', userSchema);
const Excerpt = mongoose.model('Excerpt', excerptSchema);
const AccountToken = mongoose.model('AccountToken', tokenSchema);

module.exports = {
	mongoose,
	User,
	Excerpt,
	AccountToken,
};
