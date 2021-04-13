<?php
	@mkdir('build/js');
	@mkdir('build/css');
	@mkdir('build/images');
	@mkdir('build/images/button');	
	@mkdir('build/images/slider');

	@unlink('build/images/navigation-back.png');
	@unlink('build/images/button/center.png');
	@unlink('build/images/button/left-down.png');
	@unlink('build/images/button/left.png');
	@unlink('build/images/button/right-down.png');	
	@unlink('build/images/button/right.png');
	
	@unlink('build/images/slider/handler.png');
	@unlink('build/images/slider/track-left.png');
	@unlink('build/images/slider/track-right.png');
	@unlink('build/images/slider/track.png');

	@unlink('build/css/protocal.css');
	@unlink('build/css/protocal.js');
	
	@copy('images/navigation-back.png', 'build/images/navigation-back.png');
	@copy('images/button/center.png', 'build/images/button/center.png');
	@copy('images/button/left-down.png', 'build/images/button/left-down.png');
	@copy('images/button/left.png', 'build/images/button/left.png');
	@copy('images/button/right-down.png', 'build/images/button/right-down.png');	
	@copy('images/button/right.png', 'build/images/button/right.png');
	
	@copy('index.html', 'build/index.html');	

	$protocal = file_get_contents('js/protocal.js');	
	$protocal_nav = file_get_contents('js/protocal-nav.js');	
	$protocal_class = file_get_contents('js/protocal-class.js');
	$protocal_month = file_get_contents('js/protocal-month.js');
	$protocal_week = file_get_contents('js/protocal-week.js');

	$style = file_get_contents('css/protocal.css');	
	$pcal_input = file_get_contents('css/protocal-input.css');
	$pcal_month_view = file_get_contents('css/protocal-month-view.css');
	$pcal_week_view = file_get_contents('css/protocal-week-view.css');

	$desc_js = fopen('build/js/protocal.js', "w+");	
	$js = $protocal.
				$protocal_class.
				$protocal_month.
				$protocal_week.
				$protocal_nav;
	
	flock($desc_js, LOCK_EX);
    fputs($desc_js, $js);
    flock($desc_js, LOCK_UN);
	fclose($desc_js);


	$desc_css = fopen('build/css/protocal.css', "w+");	
	$css = $style. 
				$pcal_input.
				$pcal_month_view.
				$pcal_week_view;
	
	flock($desc_css, LOCK_EX);
    fputs($desc_css, $css);
    flock($desc_css, LOCK_UN);
	fclose($desc_css);
	
?>