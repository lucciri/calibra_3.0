$(document).ready(function () {
	$(function () {
		$(".pc-carousel-wrap").slick({
			infinite: true,
			arrows: false,
			dots: true,
			autoplay: true,
			speed: 1000,
			slidesToShow: 1,
			slidesToScroll: 1,
			prevArrow: ".pc-icon-previous",
			nextArrow: ".pc-icon-next",
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						centerMode: true,
						arrows: true,
						dots: false
					},
				},
			],
		});
	});
});