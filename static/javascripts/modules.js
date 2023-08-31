$(document).ready(function () {
    // race-track starts 

    if ($('.racetrack').length) {

        addRemoveRaceTrackDiv();
        $(window).on('resize', function () {
            addRemoveRaceTrackDiv();
        });

        $('.floatingContent .itm-btn').on('click', function () {
            let parent = $(this).closest('.racetrack.global-component');
            let showDetailsLabel = $(this).attr('show-lbl');
            parent.find('.itm-btn').removeClass('active');
            parent.find('.raceCourse-details > div > label').hide();
            parent.find('.raceCourse-details > div > a').hide();
            parent.find('.raceCourse-details > div > i').hide();
            $(this).addClass('active');
            parent.find('.raceCourse-details > div > .' + showDetailsLabel).show();
        });
        if ($('.floatingContent .itm-btn').length) {
            //initialize racecourse
            $('.racetrack').each(function() {
                $(this).find('.floatingContent .itm-btn').first().click();
            })
        }
    }
    // race-track end

    $(".story-slider").slick({
        infinite: true,
        // speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        adaptiveHeight: true
    });

    $("#series").slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 786,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    infinite: true,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $(".persona").slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 786,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $(".tl-carousel").slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 786,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    infinite: true,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    // show-more-show-less start
    $('.show-more-show-less').each(function () {
        let showItems = $(this).attr('data-showrows') * 2;
        if (showItems === 0) {
            // show everything
            $(this).find('.grid-item').show();
        } else {
            $(this).find('.grid-item:lt(' + showItems + ')').show();
            let itemSize = $(this).find('.grid-item').length;
            if (itemSize > showItems)
                $(this).find('.show-more').show();
        }
    });

    $(".show-more-show-less .show-more").on('click', function () {
        // show everything
        let module = $(this).parents('.card-grid');
        module.find('.grid-item').show();
        module.find('.show-less').css({ 'display': 'flex' });
        module.find('.show-more').hide();
    });

    $('.show-more-show-less .show-less').on('click', function () {
        let module = $(this).parents('.card-grid');
        let showItems = module.attr('data-showrows') * 2;

        module.find('.grid-item').slice(showItems).hide();
        module.find('.show-more').show();
        module.find('.show-less').hide();
    });

    // show-more-show-less end

    if($('.with-left-aligned-content .grid-container .grid-item').length == 3){
        $('.with-left-aligned-content .grid-container').addClass('grid-container-three-col');
    }

    if($('.with-left-aligned-content .grid-container .grid-item').length <= 2){
        $('.with-left-aligned-content .grid-container').addClass('grid-container-two-col');
    }

    //   change normal select to jquery ui select start
    $("select").selectmenu();
    //   change normal select to jquery ui select end

    opentab('default', 'tab-1', 'true');

    //removed gradient when items are 4 or less than 4
    var $myTLSlider = $(".tl-carousel" > ".slick-arrow");
    if ($myTLSlider.length) {
        if ($(".tl-carousel .slick-slide").length <= 4) {
            $(".tl-carousel .slick-list.draggable").css('-webkit-mask-image', 'none');
        }

    }

    // makes the icon and top bar the same color
    if ($(".card-grid .column .color-icon-sea-green").length > 0) {
        $(".card-grid .column .color-icon-sea-green").closest('.grid-item').css('border-top', '4px solid #00c381');
    }
    if ($(".card-grid .icon .color-icon-sea-green").length > 0) {
        $(".card-grid .icon .color-icon-sea-green").closest('.grid-item').css('border-top', '4px solid #00c381');
    }

    if ($(".card-grid .column .color-icon-dark-blue").length > 0) {
        $(".card-grid .column .color-icon-dark-blue").closest('.grid-item').css('border-top', '4px solid #0B3047');
    }
    if ($(".card-grid .icon .color-icon-dark-blue").length > 0) {
        $(".card-grid .icon .color-icon-dark-blue").closest('.grid-item').css('border-top', '4px solid #0B3047');
    }

    if ($(".card-grid .column .color-icon-light-blue").length > 0) {
        $(".card-grid .column .color-icon-light-blue").closest('.grid-item').css('border-top', '4px solid #00bdff');
    }
    if ($(".card-grid .icon .color-icon-light-blue").length > 0) {
        $(".card-grid .icon .color-icon-light-blue").closest('.grid-item').css('border-top', '4px solid #00bdff');
    }

    //removed gradient from mobile view in tabs section when litems are less
    if ($(window).width() < 992) {
        var li_width = 0;
        $('.tab-links li').each(function () {
            li_width += $(this).innerWidth() + 32;
        });
        var tablinks_width = $(".tab-links").width();
        if (li_width < tablinks_width) {
            $(".tab-links").css('-webkit-mask-image', 'none');
        }
    }
});

$(function () {
    var width = $(window).width();
    if (width <= 768) {
        $('.card-flip').click(function () {
            $('.front').css('opacity', '1');
            $('.back').css('opacity', '0');

            if ($(this).find('.back').css('opacity') == 0) {
                $(this).find('.front').css('opacity', '0');
                $(this).find('.back').css('opacity', '1');
            }
            else {
                $(this).find('.back').css('opacity', '0');
                $(this).find('.front').css('opacity', '1');
            }
        });
    }
});

// race-tack responsive starts
function addRemoveRaceTrackDiv() {
    var wW = $(window).width();
    let racingManual = '<div class="racingManual-m"></div>';
    // If window width is greater than 980.
    if (wW <= 980 && !$('.racingManual-m').length) {
        $('.racetrack-container').after(racingManual);
        $('.racingManual-m').append($('.raceCourse .racingManual-lg'));
        $('.raceCourse .racingManual-lg').remove();
        // else if window is less than 980.
    } else if (wW > 980) {
        $('.raceCourse').append($('.racingManual-m .racingManual-lg'));
        $('.racingManual-m').remove();
    }
}
// race-tack responsive end

/* tab content starts*/
function opentab(evt, tabName, isStart, blockname) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName(blockname + " tabcontent");
    if (isStart) {
        for (i = 1; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName(blockname + " tablinks");
        for (i = 1; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
    }
    else {
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName(blockname + " tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        var element = document.getElementById(evt);
        element.classList.add("active");
    }
}
  /* tab content end */