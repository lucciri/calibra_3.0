$(document).ready(function () {
    $('.flexslider').flexslider({
        animation: "slide"
    });
    $('.MR .MR__object .MR__slider').flexslider({
        animation: "slide",
        directionNav: false,
        animationLoop: false,
        controlNav: false,
        slideshow: false,
        smoothHeight: true,
        selector: ".MR__slides > li",
        startAt: $('.MR .MR__object .MR__slider').data("starttab"),
        start: function (e) {
            MR_focusNavItem();
            $(e).removeClass("flexslider--loading");
            $(e).data('flexslider').trigger("resize");
        },
        before: function (e) {
            MR_focusNavItem();
            var elem_flexslider = $(e).data('flexslider');
            if (elem_flexslider.animatingTo > elem_flexslider.currentSlide) {
                $(e).find(".MR__slides > li:eq(" + elem_flexslider.animatingTo + ") .MR__slider-heading").css("float", "left");
                $(e).find(".MR__slides > li:eq(" + elem_flexslider.animatingTo + ")").prev().find(".MR__slider-heading").css("float", "");
            }
            var animatingTo_slide = $(e).find(".MR__slides > li:eq(" + elem_flexslider.animatingTo + ")");
            $(e).find(".flex-before-active-slide").removeClass("flex-before-active-slide");
            $(animatingTo_slide).prev().addClass("flex-before-active-slide");
        }
    });
    function MR_focusNavItem() {
        var elem_tabbing = $('.MR');
        var elem_controls = $(elem_tabbing).find(".MR__controls");
        var elem_flexslider = $('.MR').find('.MR__slider').data('flexslider');
        var control_item_elem = $(elem_controls).find("ol > li:eq(" + elem_flexslider.animatingTo + ")");
        var isV2 = $(elem_tabbing).hasClass("MR__V2");
        if (isV2) {
            $(elem_controls).find("ol > li").each(function () {
                var img = $(this).find("img");
                $(img).attr("src", img.data("img"));
            });
            var control_item_elem_img = $(control_item_elem).find("img");
            $(control_item_elem_img).attr("src", control_item_elem_img.data("imgsel"));
        }
        MR_goto($(control_item_elem).find("a"));
        // if ($(elem_controls).find(".MR__controls__pointer").length === 0) {
        //     $("<div />", { class: 'MR__controls__pointer' }).appendTo(elem_controls);
        // }
        var t = $(control_item_elem).position().left + $(control_item_elem).width() / 2;
        // $(elem_controls).find(".MR__controls__pointer").css("left", t);
    }
    function MR_goto(elem_control_a) {
        var _this = elem_control_a;
        var elem_controls = $(_this).closest(".MR__controls");
        var elem_controls_ol = $(elem_controls).find("ol");
        var num_li = elem_controls_ol.find("li").length;
        var elem_this_li = $(_this).closest("li");
        var slide_index = $(_this).parent().index();
        var elem_slider = $(elem_controls).parent().find('.MR__slider').data('flexslider');
        var scrollTo = $(elem_controls_ol).scrollLeft() + $(_this).position().left
            - ($(elem_controls_ol).width() - $(_this).parent().width()) / 2;

        var elem_tabbing = $('.MR');
        var isV2 = $(elem_tabbing).hasClass("MR__V2");
        if (isV2) {
            elem_controls.removeClass("MR__controls--hideleft");
            elem_controls.removeClass("MR__controls--hideright");

            if (slide_index === 0) {
                elem_controls.addClass("MR__controls--hideleft");
            }
            if (slide_index === num_li - 1) {
                elem_controls.addClass("MR__controls--hideright");
            }
        }

        $(elem_controls_ol).stop().animate({ scrollLeft: scrollTo }, elem_slider.vars.animationSpeed, 'swing');

        elem_slider.flexAnimate(slide_index);

        $(elem_this_li).addClass("MR__tab--active");
        $(elem_controls_ol).find('li').not(elem_this_li).removeClass("MR__tab--active");
    }
    $('.MR__controls > ol > li > a').on('click', function (e) {
        e.preventDefault();
        MR_goto($(this));
    });
    $('.MR__slider .MR__slider-heading').on('click', function (e) {
        e.preventDefault();
        var elem_controls = $(this).closest('.MR').find(".MR__controls");
        var go_to_slide_index = $(this).closest("li").index();
        var control_item_elem = $(elem_controls).find("ol > li:eq(" + go_to_slide_index + ")");
        MR_goto($(control_item_elem).find("a"));
    });
    $(window).on("resize", function () {
        if ($('.MR').length === 0) {
            return;
        }
        var slider = $('.MR__slider').data('flexslider');
        $('.MR__controls > ol').stop();
        MR_focusNavItem();
    });
});