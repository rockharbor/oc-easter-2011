<?php
if (!isset($_GET['url'])) {
	$_GET['url'] = 'scroll';
}
$url = $_GET['url'].'.php';
?><!DOCTYPE html>
<html>
	<head>
		<title>OC Easter</title>
		<meta charset="utf-8" />
		<meta name="title" content="OC Easter" />
		<meta name="description" content="An Easter celebration of Jesus and His freedom at the OC Fairgrounds in Costa Mesa, California." />
		<meta name="keywords" content="oc, orange county, easter, fairgrounds, francis chan, rockharbor, oc easter, pacific amphitheatre, freedom, jesus" />
		<script type="text/javascript" src="js/jquery.js"></script>
		<?php if(!(isset($_GET['url']) && $_GET['url'] != 'scroll')): ?>
		<script type="text/javascript" src="js/timeline.js"></script>
		<script type="text/javascript">
			var hint;
			function hideHint() {
				clearTimeout(hint);
				$('#scroll').fadeOut();
				$(window).unbind('scroll', hideHint);
			}
			function showHint() {
				if ($(window).scrollTop() > 0) {
					return;
				}
				$('#scroll').show().css({
					bottom: $('#scroll').css('bottom') - 20,
					opacity: 0
				});
				$('#scroll').animate({
					bottom: 0,
					opacity: 1
				});
			}
				
			$(document).ready(function() {
				window.setTimeout(function() {
					$.oceaster.init();
					$(window).bind('scroll', $.oceaster.update);
				}, 1);
				
				hint = setTimeout('showHint()', 2000);
				$(window).bind('scroll', hideHint);
			});
		</script>
		<?php endif; ?>
		<script type="text/javascript">
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-7415608-5']);
			_gaq.push(['_trackPageview']);

			(function() {
			 var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			 ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			 var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		</script>
		<link rel="stylesheet" type="text/css" href="css/reset.css" />
		<link rel="stylesheet" type="text/css" href="css/960.css" />
		<link rel="stylesheet" type="text/css" href="css/fonts.css" />
		<link rel="stylesheet" type="text/css" href="css/styles.css" />
	</head>
	<body>
		<div id="wrapper" class="<?php echo $url != 'scroll.php' ? 'page' : 'scroll'; ?>">
			<div id="content">
				<header id="header"><?php
				echo $url != 'scroll.php' ? '<a href="/"><h1>OC Easter</h1></a>' : '<h1>OC Easter</h1>';
				?></header>
				<?php include 'nav.php'; ?>
				<?php
				if (file_exists("pages/$url")) {
					include "pages/$url";
				} else {
					include "pages/404.php";
				}
				?>
			</div>
		</div>
	</body>
</html>
