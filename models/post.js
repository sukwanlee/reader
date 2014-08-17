var mongoose = require('mongoose'),
		sites = require('../resources/sites');

var Post = new mongoose.Schema({
	title: { type: String },
	url: { type: String },
	dateCreated: { type: Date, default: Date.now },
	slug: { type: String },
	website: { type: String, enum: Object.keys(sites) }
});

module.exports = mongoose.model('Post', Post);