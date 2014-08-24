"use strict";

var Reader = {

    init: function() {

        this.setUpBindings();

    },

    setUpBindings: function() {

        $(".site-item-link").click(Reader.home.clickSiteHandler);
        $(".list-item-link a").click(Reader.list.clickPostHandler);
        $(".nav").click(Reader.nav.clickHandler);
        $(".container").on({
            click: Reader.detail.clickImageButtonHandler
        }, ".detail-image-show");
        $(".container").on({
            click: function(e) {
                e.preventDefault();
                return false;
            }
        }, ".no-click");
    },

    _get: function(url) {
        var request = $.ajax({
            type: "GET",
            url: url,
        });
        return request;
    },

    _updateHistory: function(title, url) {
        window.history.pushState(null, title, url);
    },

    nav: {
        clickHandler: function(e) {
            Reader.nav.goBack($(this).children().attr("data-nav"));
        },

        goBack: function(dest) {
            if (dest === "hnList") {
                Reader.home.getList("/hn");
            } else if (dest === "home") {
                var req = Reader._get("/");
                req.done(function(res) {
                    $("body").html(res);
                    Reader._updateHistory("READER", "/");
                });
            }
        },

        historyStack: []
    },

    home: {
        clickSiteHandler: function(e) {
            Reader.home.getList($(this).attr("data-url"));
            return false;
        },
    
        getList: function(url) {
            var req = Reader._get(url);

            req.done(function(res) {
                $("body").hide().html(res).fadeIn(200);
                Reader._updateHistory("Hacker News", "/hn");
                window.scrollTo(0, 0);
            });

            req.fail(function(res) {
                alert("Fail");
                console.log(res);
            });
        }
    },

    list: {
        clickPostHandler: function(e) {
            Reader.list.getPost(
                $(this).attr("href"),
                $(this).text());
            e.preventDefault();
            return false;
        },

        getPost: function(url, title) {
            var req = Reader._get(url);

            req.done(function(res) {
                $("body").hide().html(res);
                var imgs = $("img");
                imgs.parent().addClass('no-click').prepend("<button class='detail-image-show' data-action='show'>Click to show image</button>");
                imgs.attr("data-src", imgs.attr("src")).attr("src", "").hide();
                $("body").fadeIn(200);
                Reader._updateHistory(title, url);
                window.scrollTo(0, 0);
            });

            req.fail(function(res) {
                alert("Fail");
                console.log(res);
            });
        },
    },

    detail: {
        clickImageButtonHandler: function(e) {
            var $button = $(this);
            if ($button.attr("data-action") === "show") {
                Reader.detail.showImage($button, $button.siblings('img'));
            } else {
                Reader.detail.hideImage($button, $button.siblings('img'));
            }
            e.preventDefault();
            return false;
        },

        showImage: function($button, $imgs) {
            $imgs.attr('src', $imgs.attr("data-src")).show();
            $button.text("Click to hide image").attr("data-action", "hide");
        },

        hideImage: function($button, $imgs) {
            $imgs.hide();
            $button.text("Click to show image").attr("data-action", "show");
        }
    }

};

$(document).ready(function() {
    Reader.init();
    $(".nav").stickUp();
});