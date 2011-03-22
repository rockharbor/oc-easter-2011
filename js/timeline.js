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


		html5TriggerInit: function(section) {
			var p = $('p', section);
			p.data('starttop', p.position().top);
		},
		html5Trigger: function(section, percent) {
			var p = $('p', section);
			if ($.oceaster.withinSection(section)) {
				p.css({
					top: p.data('starttop') + 200*percent
				});

				$('#html5 p').data('html5ptop', p.offset().top);
			}
		},

		html5FollowTriggerInit : function(section) {
			var p = $('p', section);
			p.data('starttop', p.position().top);
			p.css({
				opacity: 0
			});
		},
		
		html5FollowTrigger: function(section, percent) {
			if (!$.oceaster.withinSection(section)) {
				$('#html5 p').data('html5ptop', -100);
			}
			var p = $('p', section);
			p.css({
				top: p.data('html5ptop'),
				opacity: 1
			});
		},

		flipLinesTriggerInit: function(section) {
			$('#fliplines div').each(function() {
				$(this).data('starttop', $(this).position().top);
			});
		},

		flipLinesTrigger: function(section, percent) {
			var threshold = 1/$('#fliplines div').length;
			$('#fliplines div').each(function(i) {
				var perc = i/$('#fliplines div').length;
				//console.log(perc+' < '+percent+' && '+perc+' > '+(percent-threshold));
				if (perc < percent && perc > percent-threshold) {
					var self = $(this);
					console.log('scrolling to '+self.position().top);
					self.parent(':not(:animated)').animate({scrollTop: self.data('starttop')});
				}
			})
		},

		fadeInOutTriggerInit: function(section) {
			$('p', section).hide();
		},

		fadeInOutTrigger: function(section, percent) {
			percent < 1 ? $('p', section).fadeIn() : $('p', section).fadeOut();
		},

		withinSection: function(section) {
			var scrollY = $(window).scrollTop();
			return scrollY > section.data('oceaster.start') && scrollY < section.data('oceaster.end');
		}

	}	

})(jQuery);