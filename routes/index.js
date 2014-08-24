var express = require('express'),
    sites = require('../resources/sites'),
    getPosts = require('../lib/lists'),
    getPostContent = require('../lib/post');

var router = express.Router();


/* GET home page */
router.get('/', function(req, res) {
    res.render('home', {
        sites: sites
    });
});


/* GET site posts list */
router.get('/:slug', function(req, res) {
    var posts;

    if (req.params.slug === 'hn') {
        getPosts('http://api.ihackernews.com/page', req.params.slug, function(posts) {
            res.render('hnList', {
                posts: posts,
                title: 'Hacker News',
            });
            return;
        });
    } else if (req.params.slug === 'theverge') {
        getPosts('http://theverge.com/', req.params.slug, function(posts) {
        	res.render('list', {
        		posts: posts,
        		title: 'The Verge'
        	});
        });
    } else {
        res.status(404).send('That page is not yet supported :(');
    }
});

router.get('/:slug/:postTitle', function(req, res) {
	getPostContent(req.params.slug, req.params.postTitle, function(post) {
		res.render('detail', {
			post: post
		});
	});
});

/* GET site posts list in JSON format  */
router.get('/api/:slug', function(req, res) {

    if (req.params.slug === 'hn') {
        getPosts('http://api.ihackernews.com/page', 'hn', function(posts) {
            res.json(posts);
            return;
        });
    } else if (req.params.slug === 'theverge') {
        getPosts('http://theverge.com/', 'the-verge', function(posts) {
            res.json(posts);
            return;
        });
    } else {
        res.jsonp(404, { error: "No posts available. Wrong API Endpoint."});
    }


});

module.exports = router;
