var express = require('express'),
    sites = require('../resources/sites'),
    listHelper = require('../lib/lists');

var router = express.Router();


/* GET home page */
router.get('/', function(req, res) {
	listCache.get('hacker-news', function(err, value) {
		console.log(value);
	});
    res.render('home', {
        sites: sites
    });
});


/* GET site posts list */
router.get('/:slug', function(req, res) {
    var posts;

    if (req.params.slug === 'hn') {
        listHelper('http://api.ihackernews.com/page', 'hacker-news', function(posts) {
            res.render('list', {
                posts: posts,
                title: 'Hacker News',
            });
            return;
        });
    } else if (req.params.slug === 'theverge') {
        listHelper('http://theverge.com/', 'the-verge', function(posts) {
        	res.render('list', {
        		posts: posts,
        		title: 'The Verge'
        	});
        });
    } else {
        res.status(404).send('That page is not yet supported :(');
    }
    
});



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
