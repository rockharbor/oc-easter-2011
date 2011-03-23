(function($) {

	$.oceaster = {

		_debug: true,

		init: function() {
			$.oceaster._setupDebug();
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
			if ($.oceaster._debug) {
				$('#_section').html('');
				$('#_line').html(scrollY);
			}
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
				if ($.oceaster._debug && $.oceaster.withinSection(self)) {
					var msg = '['+self.attr('data-scrolltrigger')+']<br />'+self.data('oceaster.start')+'-'+self.data('oceaster.end')+'<br />'+Math.floor(percent*100)+'%<br />';
					$('#_section').html($('#_section').html()+msg);
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

		scrollDownTriggerInit: function(section) {
			section.children('h1').data('starttop', section.children('h1').position().top);
		},

		scrollDownTrigger: function(section, percent) {
			var perc = 1-percent;
			section.children('h1').css({
				top: section.children('h1').data('starttop') - 500*perc
			});
		},

		flipLinesTriggerInit: function(section) {
			$(section).children().each(function() {
				$(this).data('starttop', $(this).position().top);
			});
		},

		flipLinesTrigger: function(section, percent) {
			var children = $(section).children();
			var threshold = 1/children.length;
			children.each(function(i) {
				var perc = i/children.length;
				if (perc < percent && perc > percent-threshold) {
					var self = $(this);
					self.parent(':not(:animated)').animate({scrollTop: self.data('starttop')});
				}
			})
		},

		viewportTriggerInit: function(section) {
			var mask = $('canvas', section);
			var ctx = mask[0].getContext('2d');
			section.data('context', ctx);
		},

		viewportTrigger: function(section, percent) {
			var ctx = section.data('context');
			
			if (!$.oceaster.withinSection(section)) {
				ctx.clearRect(0, 0, 1000, 1000);
				return;
			}

			var img = new Image();
			img.src = 'img/coming_soon.png';

			img.onload = function() {
				$('canvas', section)[0].width = img.width;
				$('canvas', section)[0].height = img.height;
				
				ctx.beginPath();
				ctx.rect(0, img.height*percent + 1, img.width, 80);
				ctx.clip();
				ctx.drawImage(img, 0, 0);
			}
		},

		fadeInOutTrigger: function(section, percent) {
			if ($.oceaster.withinSection(section)) {
				percent < 1 ? section.fadeIn('slow') : section.fadeOut('slow');
			} else {
				section.fadeOut('slow');
			}
		},

		withinSection: function(section) {
			var scrollY = $(window).scrollTop();
			return scrollY > section.data('oceaster.start') && scrollY < section.data('oceaster.end');
		},

		_setupDebug: function() {
			if (!$.oceaster._debug) {
				return;
			}
			$('body').append('<div id="_debug"><span id="_line">0</span><span id="_section"></span></div>');
			$('body').append('<div id="_trigger"></div>');
			$('#_debug').css({
				position:'fixed',
				top: 0,
				right: 0,
				background: '#ff0000',
				color: '#fff',
				padding: 5,
				fontWeight: 'bold'
			});
			$('#_debug span').css({
				display:'block',
				textAlign:'right'
			});
			$('[data-scrolltrigger]').each(function(i) {
				$('body').append('<div id="_trigger'+i+'"></div>');
				$('#_trigger'+i).css({
					height: 1,
					width: '100%',
					position:'fixed',
					background: '1px solid #ff0000',
					top: $(this).attr('data-triggerstart')
				});
			});
		}

	}	

})(jQuery);