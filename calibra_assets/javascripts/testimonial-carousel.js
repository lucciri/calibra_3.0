$(document).ready(function () {
    $('section.testimonial-carousel .testimonial-carousel-container .testimonial-carousel-grid-cell-quote .testimonial-carousel-quote-grid')
        .on('init', function (event, slick, currentSlide, nextSlide) {
            $('section.testimonial-carousel .testimonial-carousel-container .testimonial-carousel-grid-cell-quote').removeClass('init');
        })
        .not('.slick-initialized').slick({
            zindex: 0,
            speed: 1000,
            dots: true,
            swipe: true,
            arrows: true,
            prevArrow: '<button type="button" aria-label="Previous" class="slick-prev"></button>',
            nextArrow: '<button type="button" aria-label="Next" class="slick-next"></button>',
            infinite: true,
            slidesToShow: 1,
            touchMove: true,
            autoplay: true,
            slidesToScroll: 1,
            accessibility: true,
            adaptiveWidth: true,
            adaptiveHeight: true,
            waitForAnimate: false,
            pauseOnHover: true
        });
});