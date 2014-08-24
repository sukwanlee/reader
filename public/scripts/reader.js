'use strict';

var Reader = {

    init: function() {

        this.setUpBindings();

    },

    setUpBindings: function() {

        $(".site-item-link").click(Reader.home.clickSiteHandler);

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
                console.log(res);
            });
        },
    },

    list: {
    },

    detail: {
    },

    // get: {



    //     hn: function() {

    //         var url = "hn",
    //             data: {};

    //         var request = this.get(url, data);

    //         request.done(function(res) {
    //             console.log(res);
    //         });

    //         request.fail(function(error) {
    //             console.log(error);
    //         });

    //     },

    //     theVerge: function() {

    //     }

    // },

   
};

$(document).ready(function() {
    Reader.init();
});