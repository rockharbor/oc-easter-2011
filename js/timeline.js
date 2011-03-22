(function($) {

	$.oceaster = {

		init: function() {
			$.oceaster._insection = $('section:first');
			$('[data-scrolltrigger]').each(function(i) {
				var self = $(this);
				self.data('oceaster.start', Number(self.attr('data-triggerstart')));
				self.data('oceaster.end', Number(self.attr('data-triggerend')));
				if ($.oceaster[self.attr('data-scrolltrigger')+'Init'] != undefined) {
					$.oceaster[self.attr('data-scrolltrigger')+'Init'](self);
				}
			});
			$.oceaster.update();
		},

		update: function(event) {
			var scrollY = $(window).scrollTop();
			$('#debug').html(scrollY);
			$('[data-scrolltrigger]').each(function() {
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

		section1TriggerInit: function(section) {
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


		html5Trigger1Init: function(section) {	$.oceaster._html5triggerInit(section);	},
		html5Trigger1: function(section, percent) { $.oceaster._html5trigger(section, percent); },
		html5Trigger2Init: function(section) { $.oceaster._html5triggerInit(section); },
		html5Trigger2: function(section, percent) { $.oceaster._html5trigger(section, percent); },
		html5Trigger3Init: function(section) { $.oceaster._html5triggerInit(section);	},
		html5Trigger3: function(section, percent) { $.oceaster._html5trigger(section, percent); },
		html5Trigger4Init: function(section) { $.oceaster._html5triggerInit(section);	},
		html5Trigger4: function(section, percent) { $.oceaster._html5trigger(section, percent); },

		_html5triggerInit: function(section) {
			var p = $('p', section);
			p.data('starttop', p.position().top);
		},
		_html5trigger: function(section, percent) {
			var p = $('p', section);
			if ($.oceaster.withinSection(section)) {
				p.css({
					top: p.data('starttop') + 200*percent
				});

				$('#html5 p').data('html5ptop', p.offset().top);
			}
		},

		html5TriggerInit : function(section) {
			var p = $('p', section);
			p.data('starttop', p.position().top);
			p.css({
				opacity: 0
			});
		},
		
		html5Trigger: function(section, percent) {
			if (!$.oceaster.withinSection(section)) {
				$('#html5 p').data('html5ptop', -100);
			}
			var p = $('p', section);
			p.css({
				top: p.data('html5ptop'),
				opacity: 1
			});
		},

		withinSection: function(section) {
			var scrollY = $(window).scrollTop();
			return scrollY > section.data('oceaster.start') && scrollY < section.data('oceaster.end');
		}

	}	

})(jQuery);