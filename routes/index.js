var express = require('express'),
        request = require('request'),
        NodeCache = require('node-cache'),
        mongoose = require('mongoose'),
        sites = require('../resources/sites'),
        Post = require('../models/post');

var router = express.Router();

mongoose.connect('mongodb://localhost/reader');

/* Initialize Caches */

// postCache settings, in seconds
var POST_TTL = 2*24*60*60,
        POST_CHECK_PERIOD = 60*60;

var postCache = new NodeCache({
    stdTTL: POST_TTL,
    checkperiod: POST_CHECK_PERIOD
});

// listCache settings, in seconds
var LIST_TTL = 5*60,
        LIST_CHECK_PERIOD = 30;

var listCache = new NodeCache({
    stdTTL: LIST_TTL,
    checkperiod: LIST_CHECK_PERIOD,
});





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
        getPostsHackerNews(function(posts) {
            res.render('list', {
                posts: posts,
                title: 'Hacker News',
            });
            return;
        });
    } else if (req.params.slug === 'theverge') {
        posts = getPostsTheVerge();
        title = 'The Verge';
    } else {
        res.status(404).send('That page is not yet supported :(');
    }
    
});


var getPostsHackerNews = function(callback) {
    var hnUrl = 'http://api.ihackernews.com/page';

    listCache.get('hacker-news', function(err, posts) {
        if (!err && posts.length > 0) {
            // if cache is not empty, execute callback using the cached posts
            callback(posts);
        } else if (!err) {
            // if cache is empty, request for a new list of posts, store them in db if doesn't already exist
            request({
                url: hnUrl,
                json: true
            }, function(err, res, body) {
                if (err) {
                    res.status(500).send('Internal Error!');
                    return {};
                }
                var posts = res.body.items,
                            i;

                for (i = 0; i < posts.length; i++) {
                    Post.findOne({
                        'title': posts[i].title,
                        'url': posts[i].url
                    }, function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        if (result) {
                            new Post({
                                title: result.title,
                                url: result.url,
                                website: 'hacker-news',
                                slug: result.title.replace(/ /g, '-').trim().toLowerCase()
                            }).save(function(err) {
                                if(err) {
                                    console.log(err);
                                }
                            });
                        }
                    });
                }
                callback(posts);
            });
        } else {
            res.status(500).send('Something went wrong while getting the cache value for hacker news');
        }
    });
};

var getPostsTheVerge = function() {

};




/* GET home page. */
router.get('/sdf', function(req, res) {
    request({
        url: 'http://readability.com/api/content/v1/parser?url=http://gizmodo.com/the-chainsmokers-kanye-1622738472&token=38d99fa737228f98b6e6ccdf236ed1b6fcb2a184',
        json: true
    }, function(err, res1, body) {
        var body = res1.body;

        postCache.set("tempBody", body, function(err, success) {
            if(!err && success) {
                console.log("Saved in memory using node-cache.");
            }
        });

        postCache.get("tempBody", function(err, value) {
            if(!err) {
                console.log(value);
            }
        });

        setTimeout(function() {
            postCache.get("tempBody", function(err, value) {
                console.log(value);
                console.log("This should be a null");
            });
        }, 10000);

        var html = "<html><head><title>" + body.title + "</title></head><body>" + "<h1>" + body.title + "</h1>" + body.content + "</body></html>";
        res.send(html);
    });
    // read('http://gizmodo.com/the-chainsmokers-kanye-1622738472', function(err, article, meta) {
    //  var html = "<html><head><title>" + article.title + "</title></head><body>" + "<h1>" + article.title + "</h1>" + article.content + "</body></html>";
    //  res.send(html);
    //  // res.render('index', { title: 'Express' });
    // });
});

module.exports = router;
