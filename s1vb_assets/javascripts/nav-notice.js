"use strict";

var isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
if (!isIE11) {
    var ie11Notice = document.getElementById("notice-25898");
    if (ie11Notice != null) {
        ie11Notice.remove();
    }
}

window.Notice = function (id) {
    if (!isIE11 && id === 25898) return; // ie 11 notice
    
    // svbn5c
    var dAC = 'n5c-active',
        // default active class
        sVT = 'svbMsg' + id,
        // session storage flag
        sVM = localStorage.getItem(sVT),
        // grab flag (binary)
        xF = 1,
        initLoc = $('nav.svbn5b')[0].offsetTop;

    if ($('.svbn5c').length < 1) {
        return false;
    }

    if (!sVM || sVM == 1) {
        noticeVis();
    } else {
        removenNotice(id);
    } // toggle notice classes


    $(window).on("scroll", function () {
        var nX = 'n5c-notice-m';
        var nY = 'n5c-notice-t';

        if (window.innerWidth > 768) {
            nX = 'n5c-notice-t';
            nY = 'n5c-notice-m';
        }

        if (window.pageYOffset >= initLoc) {
            if ($('.svbn5c').length > 0 && localStorage.getItem(sVT) != 0) {
                $('.svbn5b').removeClass(nY).addClass(nX);
            }
        }
    });
    $('a.n5b-link-icon-mobile, a.n5b-link-login, a.n5bM-link-close2').on("click", function (e) {
        // hide if mobile menus
        if (xF == 0 || sVM == 0) {
            return false;
        }

        if ($('a.n5b-link-login').hasClass('n5b-active') || $('a.n5b-link-icon-mobile').parent().hasClass('n5b-active')) {
            if (!$('.n5c-grid').hasClass(dAC)) $('.n5c-grid').addClass(dAC);
        } else if (window.innerWidth < 768) {
            $('.n5c-grid').removeClass(dAC);
        }

        return false;
    });
    $('#n5c-link-close-' + id).on("click", function () {
        $(this).addClass('n5c-nofocus');
        $(this).parent().removeClass(dAC);
        localStorage.setItem(sVT, 0);
        removenNotice(id);
        xF = 0;
        setTimeout(n01UpdateMargin, 100); // give time for the transition
        return false;
    });

    function removenNotice(id) {
        $('#n5c-link-close-' + id).parent().remove();
        if ($('.n5c-grid').length < 1) {
            $('.svbn5b').removeClass('n5c-notice-m');
            $('.svbn5b').removeClass('n5c-notice-t');
        }
    }

    function noticeVis() {
        $('#notice-' + id).addClass(dAC);
        setTimeout(n01UpdateMargin, 100); // give time for the transition
    }

    // Special Update for old header main nav
    function n01UpdateMargin() {
        var $nav = $('nav.n01-compatabilty');
        if ($nav.length) {
            var height = $nav.outerHeight();
            $('.N01').css('margin-top', height + 'px');
        }
    }
};



