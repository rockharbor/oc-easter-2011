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
			$.oceaster.update({}, true);
		},

		update: function(event, force) {
			if (force == undefined) { 
				force = false;
			}
			var scrollY = $(window).scrollTop();
			$('#debug').html(scrollY);
			$('[data-scrolltrigger]').filter(function() {
				if (force) {
					return true;
				}
				var self = $(this);
				if (scrollY > self.data('oceaster.start') - $.oceaster.threshold && scrollY < self.data('oceaster.end') + $.oceaster.threshold) {
					return true;
				}
			}).each(function() {
				var self = $(this);
				var amt = self.data('oceaster.end') - self.data('oceaster.start');
				var scrolled = scrollY - self.data('oceaster.start');
				var percent = scrolled / amt;
				if (percent < 0) {
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
					opacity: .7 - c*10/100
				}).removeAttr('id').addClass('opacsplit');
				section.append(clone);
				if (i%2==0) {
					c++;
				}
				clone.data('starttop', clone.position().top);
			}
			$('#opacsplit').css({visibility: 'hidden'});
		},

		section1Trigger: function(section, percent) {
			var dest = $('#opacsplit');
			$('div.opacsplit', section).each(function(i) {
				var self = $(this);
				var dist = dest.position().top - self.data('starttop');
				if (percent < .5) {
					self.css({
						top: self.data('starttop') + percent/.5*dist,
						visibility: 'visible'
					});
					$('#opacsplit').css({
						visibility: 'hidden'
					});
				} else {
					self.css({
						visibility: 'hidden'
					});
					$('#opacsplit').css({
						visibility: 'visible'
					});
				}
			});
		},
		
		section2Trigger: function(section, percent) {
		}

	}	

})(jQuery);