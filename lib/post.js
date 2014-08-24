var request = require('request'),
	NodeCache = require('node-cache'),
	Post = require('../models/post');

// postCache settings, in seconds
var POST_TTL = 2*24*60*60,
    POST_CHECK_PERIOD = 60*60;

var postCache = new NodeCache({
    stdTTL: POST_TTL,
    checkperiod: POST_CHECK_PERIOD
});


function isEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
			return false;
	}
	return true;
}


var getPostContent = function(siteSlug, postTitle, callback) {
	postCache.get(siteSlug + '/' + postTitle, function(err, post) {
		if(!(err) && !isEmpty(post)) {
			callback(post[siteSlug + '/' + postTitle]);
		} else if(!err){
			getPostFromDB(siteSlug, postTitle, callback);
		} else {
			res.status(500).send('Something went wrong while getting the cache value for ' + siteSlug + '/' + postTitle);
		}
	});
}

var getPostFromDB = function(siteSlug, postTitle, callback) {
	var post = {};

	Post.findOne({
		slug: postTitle, 
		website: siteSlug
	}, function(err, result) {
		if (err || !result) {
			post['error'] = "Article does not exist";
			callback(post);
		} else {
			request({
			    url: 'http://readability.com/api/content/v1/parser?url=' + result['url'] + '&token=38d99fa737228f98b6e6ccdf236ed1b6fcb2a184',
			    json: true
			}, function(err, readabilityRes, body) {
			    var body = readabilityRes.body;

			    post['title'] = body['title'];
			    post['content'] = body['content'];
			    post['url'] = result['url'];

			    postCache.set(siteSlug + '/' + postTitle, post, function(err, success) {
			    	if(err) {
							console.log(err);
						} else if(success) {
							console.log('Successfully saved article ' + siteSlug + '/' + postTitle + 'to post cache.');
						}
			    });
			    
			    callback(post);
			});
		}
	});
}

module.exports = getPostContent;