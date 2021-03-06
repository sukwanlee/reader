var express = require('express'),
    sites = require('../resources/sites'),
    getPosts = require('../lib/list'),
    getPostContent = require('../lib/post');

var router = express.Router();


/* GET home page */
router.get('/', function(req, res) {
    res.render('home', {
        sites: sites
    });
});


/* GET post list */
router.get('/:siteSlug', function(req, res) {
    var posts;

    if (req.params.siteSlug === 'hn') {
        getPosts('http://api.ihackernews.com/page', req.params.siteSlug, function(posts) {
            res.render('hnList', {
                posts: posts,
                title: 'Hacker News',
            });
            return;
        });
    } else if (req.params.siteSlug === 'theverge') {
        getPosts('http://theverge.com/', req.params.siteSlug, function(posts) {
        	res.render('list', {
        		posts: posts,
        		title: 'The Verge'
        	});
        });
    } else {
        res.status(404).send('That page is not yet supported :(');
    }
});

/* GET site posts list in JSON format  */
router.get('/api/:siteSlug', function(req, res) {

    if (req.params.siteSlug === 'hn') {
        getPosts('http://api.ihackernews.com/page', req.params.siteSlug, function(posts) {
            res.json(posts);
            return;
        });
    } else if (req.params.siteSlug === 'theverge') {
        getPosts('http://theverge.com/', req.params.siteSlug, function(posts) {
            res.json(posts);
            return;
        });
    } else {
        res.jsonp(404, { error: "No posts available. Wrong API Endpoint."});
    }
});

router.get('/api/:siteSlug/:postSlug', function(req, res) {
    getPostContent(req.params.siteSlug, req.params.postSlug, function(post) {
        res.json(post);
        return;
    });
});

/* GET post */
router.get('/:siteSlug/:postTitle', function(req, res) {
    getPostContent(req.params.siteSlug, req.params.postTitle, function(post) {
        res.render('detail', {
            post: post
        });
    });
});

module.exports = router;
