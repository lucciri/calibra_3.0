window.addEventListener("DOMContentLoaded", function () {

    //initialize slider
    $('.logos-module .slider-container').slick({
        lazyLoad: 'ondemand',
        arrows: false,
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        adaptiveHeight: true,
        adaptiveWidth: false,
        pauseOnHover: false,
        swipeToSlide: true,
        variableWidth: true,
        centerMode: false,
        autoplay: true,
        autoplaySpeed: 2500, 	
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 3
            }
        }, {
            breakpoint: 1024,
            settings: {
                slidesToShow: 5
            }
        }]
    });
});