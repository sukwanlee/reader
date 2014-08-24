var request = require('request'),
	NodeCache = require('node-cache'),
	Post = require('../models/post');

// listCache settings, in seconds
var LIST_TTL = 5*60,
    LIST_CHECK_PERIOD = 30;

var listCache = new NodeCache({
    stdTTL: LIST_TTL,
    checkperiod: LIST_CHECK_PERIOD
});


function isEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
			return false;
	}
	return true;
}

var getPosts = function(url, siteSlug, callback) {
	listCache.get(siteSlug, function(err, posts) {
		if (!err && !isEmpty(posts)) {
			// if cache is not empty, execute callback using the cached posts
			callback(posts[siteSlug]);
		} else if (!err) {
			// if cache is empty, request for a new list of posts, store them in db if doesn't already exist
			generateHackerNewsPosts(url, siteSlug, callback);
		} else {
			res.status(500).send('Something went wrong while getting the cache value for ' + siteSlug);
		}
	});
};

var generateHackerNewsPosts = function(url, slug, callback) {
	request({
		url: url,
		json: true
	}, function(err, res, body) {
		if (err) {
			res.status(500).send('Internal Error!');
			return {};
		}
		var posts = res.body.items,
			i;

		if(!posts) {
			posts = {};
			callback(posts);
			return;
		}

		for (i = 0; i < posts.length; i++) {
			posts[i].slug = posts[i].title.replace(/[^\w\s]/gi, '').replace(/ /g, '-').trim().toLowerCase();
			(function(i) {
				Post.findOne({
					title: posts[i].title,
					url: posts[i].url
				}, 
				function(err, result) {
					if (err) {
						console.log(err);
					} else if(!result) {
						new Post({
							title: posts[i].title,
							url: posts[i].url,
							website: slug,
							slug: posts[i].slug
						}).save(function(err) {
							if(err) {
								console.log(err);
							}
						});
					} 
				});
			})(i);
		}

		listCache.set(slug, posts, function(err, success) {
			if(err) {
				console.log(err);
			} else if(success) {
				console.log("Successfully saved " + slug + " list to list cache.");
			}
		});

		callback(posts);
	});
}

module.exports = getPosts;