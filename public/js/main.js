(function($) {

	"use strict";

	/* loader */
	var loader = function() {
		setTimeout(function() { 
			if($('#loader').length > 0) {
				$('#loader').removeClass('show');
			}
		}, 1);
	};
	loader();
	
    /* Counter */
	$('.counter').counterUp({
		delay: 15,
		time: 2000
	});
    
    /* Smooth Scroll */

    $('a[href^="#"]').on('click', function(event) {
        var target = $( $(this).attr('href') );
        if( target.length ) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });
    
	$(function() {
			$( '#dl-menu' ).dlmenu();
    });
    
    /* Swiper Slider */
    
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        paginationClickable: true,
        centeredSlides: true,
        autoplay: 3500,
        speed: 2500,
        loop: true,
        autoplayDisableOnInteraction: false
    });

  
})(jQuery);