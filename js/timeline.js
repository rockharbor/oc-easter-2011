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

		implodeTriggerInit: function(section) {
			var c = 1;
			for (var i=1; i<7; i++) {
				var clone = $('h1[class!="opacsplit"]', section).clone();
				clone.css({
					top:  $('h1', section).position().top + (i%2>0 ? 50*c : -50*c),
					opacity: c*20/100/.7
				}).removeAttr('id').addClass('opacsplit');
				section.append(clone);
				if (i%2==0) {
					c++;
				}
				clone.data('startopac', clone.css('opacity'));
				clone.data('starttop', clone.position().top);
			}
			 $('h1', section).css({visibility: 'hidden'});
		},

		implodeTrigger: function(section, percent) {
			var dest = $('h1', section);
			$('h1.opacsplit', section).each(function() {
				var self = $(this);
				var dist = dest.position().top - self.data('starttop');
				if (percent < .5) {
					self.css({
						top: self.data('starttop') + percent/.5*dist,
						visibility: 'visible',
						opacity: percent / self.data('startopac')
					});
					 $('h1[class!="opacsplit"]', section).css({
						visibility: 'hidden'
					});
				} else {
					self.css({
						visibility: 'hidden'
					});
					$('h1[class!="opacsplit"]', section).css({
						visibility: 'visible'
					});
				}
			});
		},

		followerTriggerInit: function(section) {
			section.data('starttop', section.position().top);
		},

		followerTrigger: function(section, percent) {
			if ($.oceaster.withinSection(section)) {

				section.css({
					top: section.data('starttop') + 500*percent,
					opacity: percent / .6
				});
				section.siblings('h1').css({
					top: section.position().top
				});
			} else {
				section.css({
					opacity: 0
				});
			}
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
			img.src = 'img/degression.png';

			img.onload = function() {
				$('canvas', section)[0].width = img.width;
				$('canvas', section)[0].height = img.height;
				
				ctx.beginPath();
				ctx.rect(0, img.height*percent + 1, img.width, 80);
				ctx.clip();
				ctx.drawImage(img, 0, 0);
			}
		},

		maskTriggerInit: function(section) {
			var mask = $('canvas', section);
			var ctx = mask[0].getContext('2d');
			section.data('context', ctx);
		},

		maskTrigger: function(section, percent) {
			var ctx = section.data('context');

			var brush = new Image();
			brush.src = 'img/big_brush.png';
			

			var img = new Image();
			img.src = 'img/splatter_4.png';

			img.onload = function() {
				if (brush.height == undefined || brush.height == 0) {
					return;
				}
				$('canvas', section)[0].width = img.width;
				$('canvas', section)[0].height = img.height + brush.height;

				ctx.drawImage(img, 0, 0);
				ctx.globalCompositeOperation = 'destination-out';
				ctx.fillRect(0, img.height*percent, img.width, img.height*(1-percent) - 1);
				ctx.drawImage(brush, 0, img.height*percent - brush.height + 2);
			}

			brush.onload = function() {
				img.onload();
			}
		},

		fadeInOutTrigger: function(section, percent) {
			if ($.oceaster.withinSection(section)) {
				percent < 1 ? section.fadeIn('slow') : section.fadeOut('slow');
			} else {
				section.fadeOut('slow');
			}
		},

		scratchTriggerInit: function(section) {
			$.oceaster.scratch = $('canvas', section);

			$.oceaster.scratch.css({position: 'absolute', zIndex: 3});
			$.oceaster.scratch.parent().append($.oceaster.scratch.clone().attr('id', 'secret').css({zIndex:2}));
			$.oceaster.scratch.parent().append($.oceaster.scratch.clone().attr('id', 'background').css({zIndex:1}));

			if ($.oceaster.scratch[0].getContext) {
				var bkgContext = $('#background', section)[0].getContext('2d');
				var secretContext = $('#secret', section)[0].getContext('2d');
				var scratchContext = $.oceaster.scratch[0].getContext('2d');

				var bkg = new Image();
				bkg.src = 'img/scratch_background.png';
				bkg.onload = function() {
					bkgContext.drawImage(bkg, 0, 0);
					$.oceaster.scratch.width = bkg.width;
					$.oceaster.scratch.height = bkg.height;
				}

				var secret = new Image();
				secret.src = 'img/scratch.png';
				secret.onload = function() {
					secretContext.drawImage(secret, 0, 0);
				}

				scratchContext.fillStyle = 'white';
				scratchContext.fillRect(0, 0, $.oceaster.scratch.width(), $.oceaster.scratch.height());

				$.oceaster.scratch.click($.oceaster._draw);
				$.oceaster.scratch.mousedown($.oceaster._startDrag);
				$.oceaster.scratch.mouseup($.oceaster._stopDrag);
				$.oceaster.scratch.mouseleave($.oceaster._stopDrag);
			}
		},

		scratchTrigger: function() {

		},

		rotateTriggerInit: function(section) {
			var img = new Image();
			img.src = 'img/paintmedication.png';
			var cycle = $('#cycle', section);
			cycle.children('p').fadeOut();

			img.onload = function() {
				var canvas = cycle.children('canvas');
				var time = 1;
				var context = canvas[0].getContext('2d');
				context.save();

				var _rotate = function() {
					var _drawRotate = function(amt) {
						context.restore();
						context.save();
						context.clearRect(0, 0, canvas.width(), canvas.height());

						context.beginPath();
						context.fillStyle = 'rgba(200,0,0,.2);'
						context.rect(0, 0, canvas.width(), canvas.height()/2);
						context.clip();

						context.translate(canvas.width()/2, canvas.height()/2);
						context.rotate((Math.PI/180) * amt);
						context.translate(-canvas.width()/2, -canvas.height()/2);

						context.drawImage(img, canvas.width()/2-img.width/2, canvas.height()/2-img.height-50);
						context.save();
						context.translate(canvas.width(), canvas.height());
						context.scale(-1, -1);
						context.drawImage(img, canvas.width()/2-img.width/2, canvas.height()/2-img.height-50);
						context.restore();

						amt += 1;
						if (amt >= 180) {
							cycle.children('p').fadeOut(function() {
								setTimeout(_rotate, 5000);
							});
							return;
						}
						setTimeout(_drawRotate, time, amt);
					}

					cycle.children('p').fadeIn();
					cycle.children('p').animate({marginTop: '-=20px'}, function() {
						_drawRotate(0);
					});
				}
				_rotate();
			}
		},

		rotateTrigger: function() {

		},

		withinSection: function(section) {
			var scrollY = $(window).scrollTop();
			return scrollY > section.data('oceaster.start') && scrollY < section.data('oceaster.end');
		},

		_startDrag: function() {
			$.oceaster.scratch.mousemove($.oceaster._draw);
		},

		_stopDrag: function() {
			$.oceaster.scratch.unbind('mousemove', $.oceaster._draw);
		},

		_draw: function(event) {
			var context = $.oceaster.scratch[0].getContext('2d');
			context.globalCompositeOperation = 'destination-out';

			var mouseX = event.pageX - $.oceaster.scratch.offset().left;
			var mouseY = event.pageY - $.oceaster.scratch.offset().top;

			if ($.oceaster.brush == undefined) {
				$.oceaster.brush = new Image();
				$.oceaster.brush.src = 'img/small_brush.png';
				$.oceaster.brush.onload = function() {
					context.drawImage($.oceaster.brush, mouseX-this.width/2, mouseY-this.height/2);
				}
			} else {
				console.log($.oceaster.brush.width);
				context.drawImage($.oceaster.brush, mouseX-$.oceaster.brush.width/2, mouseY-$.oceaster.brush.height/2);
			}
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