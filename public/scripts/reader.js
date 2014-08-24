'use strict';

var Reader = {

    init: function() {

        this.setUpBindings();

    },

    setUpBindings: function() {

        $(".site-item-link").click(Reader.home.clickSiteHandler);
        $(".list-item-link a").click(Reader.list.clickPostHandler);

    },

    _get: function(url) {
        var request = $.ajax({
            type: "GET",
            url: url,
        });
        return request;
    },

    _updateHistory: function(title, url) {
        window.history.replaceState(null, title, url);
    },

    home: {
        clickSiteHandler: function(e) {
            Reader.home.getList($(this).attr("data-url"));
            return false;
        },
    
        getList: function(url) {
            var req = Reader._get(url);

            req.done(function(res) {
                $('body').html(res);
                Reader._updateHistory("Hacker News", "/hn");
            });

            req.fail(function(res) {
                alert('Fail');
                console.log(res);
            });
        }
    },

    list: {
        clickPostHandler: function(e) {
            Reader.list.getPost(
                $(this).attr('href'),
                $(this).text());
            e.preventDefault();
            return false;
        },

        getPost: function(url, title) {
            var req = Reader._get(url);

            req.done(function(res) {
                $('body').html(res);
                Reader._updateHistory(title, url);
            });

            req.fail(function(res) {
                alert('Fail');
                console.log(res);
            });
        },
    },

    detail: {
    },

};

$(document).ready(function() {
    Reader.init();
});