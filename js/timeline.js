(function($) {

	$.oceaster = {

		threshold: 20,

		init: function() {
			$('[data-scrolltrigger]').each(function(i) {
				var self = $(this);
				self.data('oceaster.start', Number(self.attr('data-triggerstart')));
				self.data('oceaster.end', Number(self.attr('data-triggerend')));
				if ($.oceaster['section'+(i+1)+'Init'] != undefined) {
					$.oceaster['section'+(i+1)+'Init'](self);
				}
			});
		},

		update: function(event) {
			var scrollY = $(window).scrollTop();
			$('#debug').html(scrollY);
			$('[data-scrolltrigger]').filter(function() {
				var self = $(this);
				if (scrollY > self.data('oceaster.start') - $.oceaster.threshold && scrollY < self.data('oceaster.end') + $.oceaster.threshold) {
					return true;
				}
			}).each(function() {
				var self = $(this);
				var amt = self.data('oceaster.end') - self.data('oceaster.start');
				var scrolled = scrollY - self.data('oceaster.start');
				var percent = (scrolled - amt) / amt;
				if (percent < 1) {
					percent = 0;
				}
				if (percent > 1) {
					percent = 1;
				}
				$.oceaster[self.attr('data-scrolltrigger')](self, percent);
			});
		},

		section1Init: function(section) {
			var c = 1;
			for (var i=1; i<7; i++) {
				var clone = $('#opacsplit').clone();
				clone.css({
					top: $('#opacsplit').position().top + (i%2>0 ? 10*c : -10*c),
					opacity: 1 - (i%2>0 ? (i+1)/7 : i/7)
				});
				section.append(clone);
				if (i%2==0) {
					c++;
				}
			}
		},

		section1Trigger: function(section, percent) {			
		},
		
		section2Trigger: function(section, percent) {
		}

	}	

})(jQuery);