(function($) {

	$.fn.stickUp = function(options) {

		var $el = $(this),
				$window = $(window),
				el_top = $el.offset().top,
				el_margin_top = $el.css('margin-top'),
				el_height = $el.height(),
				$empty_box = $('<div class="stickup-filler"></div>').css({
					'display':'block',
					'height': el_height + +el_margin_top.replace('px',''),
				});

		haha = $el
		var settings = $.extend({
			emptyBox: true,
		}, options);

		$window.scroll(function() {
			if ($window.scrollTop() > el_top) {
				if (settings.emptyBox) {
					$empty_box.insertAfter($el);
				}
				$el.css({
					'position': 'fixed',
					'top': 0,
					'margin-top':0,
				});
				$el.addClass('stuckup');
			} else {
				$empty_box.remove();
				$el.css({
					'display': 'block',
					'position':'',
					'margin-top': el_margin_top,
				});
				$el.removeClass('stuckup');
			}
		});

		return this;
	}


})(jQuery);