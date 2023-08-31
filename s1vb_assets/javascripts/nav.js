$(function () {// ------------ Regional Nav: svbn5a
    var tClose = 'Close';
    var tOpen = 'Open';

    function regionProcess() { // -------- parse region from url and instantiate- loads united states by default unless specified
        var pA = window.location.pathname.split('index.html'); // 'path array' 
        var fC = 'flag-icon-us'; // 'flag class' default flag class on element corresponding to region
        var fB = fC; // 'flag base' grabs the default flag class to store for comparison

        switch (pA[1]) { // looks at first directory in URL path
            case 'canada': fC = 'flag-icon-ca'; break;
            case 'israel': fC = 'flag-icon-il'; break;
            case 'uk': fC = 'flag-icon-gb'; break;
            case 'denmark': fC = 'flag-icon-dk'; break;
            case 'nordic': fC = 'flag-icon-dk,flag-icon-se'; break;
            case 'sweden': fC = 'flag-icon-se'; break;
            case 'de': fC = 'flag-icon-de'; break;
            case 'germany': fC = 'flag-icon-de'; break;
            case 'china': fC = 'flag-icon-cn'; break;
            case 'cn': fC = 'flag-icon-cn'; break;
        }

        if (fC != fB) {// if fC changed, update icon in nav and footer
            $('nav.svbn5a .n5a-regional-selector span.flag-icon').removeClass(fB).addClass(fC); // nav
            $('footer #changeRegionBtn .' + fB).removeClass(fB).addClass(fC); // footer
        }
    }

    $('.n5a-localizer .n5a-indicator').on('click', function () {// click/touch event for caret indicator
        $('.col-2, .col-3, .col-4, .col-5').toggleClass('n5a-mobile-slide-alt');
        $('.n5a-localizer .n5a-caret').toggleClass('n5a-flip');
        if ($('.n5a-localizer .n5a-caret').hasClass('n5a-flip')) { $('.n5a-localizer .n5a-caret').attr('title', tClose); } else { $('.n5a-localizer .n5a-caret').attr('title', tOpen); }
        return false;
    });

    $('a.n5a-regional-selector').on('click', function () {// click of flag button
        $('#regionModal').show(); // activate modal
        $('#regionModal a').first().trigger("focus");
        return false;
    });

    regionProcess();

    var regionModal = $('#regionModal');

    $('.N01__region-toggle').on('click', function () {// click of flag button

        regionModal.show(); // activate modal
        $('#regionModal a').first().trigger("focus");
        return false;
    });

    $('#close-region-modal').on('click', function () {
        //event.preventDefault();
        regionModal.hide();

        $('.N01__region--active').removeClass('N01__region--active');
        $('.N01--region-active').removeClass('N01--region-active');

        $('#changeRegionBtn').trigger("focus");
        return false;
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == regionModal) {
            event.preventDefault();
            regionModal.hide();
        }
    }
});

$(function () { // ------------ Global Nav: svbn5b
    var navbar_selector = 'nav.svbn5b',
        dAC = 'n5b-active',
        tOpen = 'Open',
        tClose = 'Close',
        tSearch = 'Search',
        tLogin = 'Login';

    var navbar = $(navbar_selector),
        initLoc = navbar[0].offsetTop;

    $(window).on("scroll", function (e) { lockBar(navbar); });

    function navTrack(val) {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
            "Value": val.replace("&amp;", "&"),
            'event': 'MainNav'
        });
    }

    function lockBar(navbar) {
        nX = 'n5c-notice-m';
        nY = 'n5c-notice-t';
        if (window.innerWidth > 768) { nX = 'n5c-notice-t'; nY = 'n5c-notice-m'; }
        if (window.pageYOffset >= initLoc) {
            if ($('.svbn5c').length > 0 && sessionStorage.getItem('svbMsg') != 0) { $('.svbn5b').removeClass(nY).addClass(nX); }
            if (!$('.n5b-grid-wrap').hasClass('nav-fixed')) { $('.n5b-grid-wrap').addClass('nav-fixed'); }
        } else { $('.n5b-grid-wrap' + '.' + 'nav-fixed').removeClass('nav-fixed'); }
    }

    function activator(o, acN) { // toggle active-class
        var nS = $(navbar_selector + ' *');
        if ($(o).parent().hasClass(acN)) {
            nS.removeClass(acN);
        } else {
            nS.removeClass(acN);
            $(o).parent().addClass(acN);
            if ($(o).attr('title') == tSearch) { $(this).attr('title', tClose + ' ' + tSearch) }
        }
        if ($('.search a.link-search').attr('title') == tClose + ' ' + tSearch) { $('.search a.link-search').attr('title', tSearch) }
    }

    function resetMobileMenu() {
        function remClass(tC) { $('.' + tC).removeClass(tC); }
        function openMenu(tS) { $('.' + tS + ' a.n5bM-ll-category').first().trigger("click"); }
        remClass('n5bM-ll-content-active');
        remClass('n5bM-menu-active');
        remClass('n5bM-ll-category .n5bM-link-active');
        remClass('n5b-recede');
        openMenu('n5bM-products');
        openMenu('n5bM-expertise');
        openMenu('n5bM-insights');
        openMenu('n5bM-about');
        $('input#mobile-site-search').val($('input#mobile-site-search').attr('title'));
        setMobileIconTitles();
    }

    function setMobileIconTitles() {
        if ($('.n5b-bars').hasClass(dAC)) { $('a.n5b-link-icon-mobile').attr('title', tClose); }
        else { $('a.n5b-link-icon-mobile').attr('title', tOpen); }
        if ($('.n5b-login a.n5b-link-login').hasClass(dAC)) { $('.n5b-login a.n5b-link-login').attr('title', tClose); }
        else { $('.n5b-login a.n5b-link-login').attr('title', tLogin); }
    }

    $('.n5b-searchfield-icon').on("click", function () { // mobile search btn
        $('input#mobile-site-search').val($('input#mobile-site-search').val().trim());
        if ($('input#mobile-site-search').val().trim() == $('input#mobile-site-search').attr('title') || $('input#mobile-site-search').val().trim().length < 1) { return false; }
        $('#mobile-search-form').trigger("submit");
        return false;
    });

    $('.n5bM-link-set a.n5b-link-close').on("click", function () { // mobile login close
        $(' .n5bM-link-set').toggleClass(dAC); return false;
    });

    $('.n5b-login a.n5b-link-login, a.n5bM-menu-login-link, .n5bM-link-set-container a.n5bM-link-close').on("click", function () {
        var o = $(this);
        if (window.innerWidth > 768) {
            activator(o, dAC);
            if ($(this).parent().hasClass('n5b-active')) {
                navTrack("Login Open");
            } else {
                navTrack("Login Close");
            }
        } else {
            $(navbar_selector + ' *.' + dAC + ':not(.' + 'n5bM-link-set-container' + ')').toggleClass(dAC);
            if (o.hasClass('n5b-link-login')) {
                resetMobileMenu();
            } 
            $('.' + 'n5bM-link-set-container').toggleClass(dAC).scrollTop(0);
            if ($('.' + 'n5bM-link-set-container').hasClass(dAC)) {
                $('body').addClass('n5b-noScroll');
                if (o.hasClass('n5b-link-login')) { o.toggleClass(dAC); }
                if (o.hasClass('n5bM-menu-login-link')) { $('.' + 'n5b-link-login').toggleClass(dAC); }
                navTrack("Login Open");
            } else {
                $('body').removeClass('n5b-noScroll');
                navTrack("Login Close");
            }
            
        }
        setMobileIconTitles();
        return false;
    });

    $('a.n5bM-ll-category').on("click", function () { // mobile menu link-list accordion functionality
        var o = $(this);
        if (o.next('div.n5bM-ll-content').hasClass('n5bM-ll-content-active')) {
            navTrack("Sub Close: " + $(this).text());
            o.removeClass('n5bM-link-active').next('div.n5bM-ll-content').removeClass('n5bM-ll-content-active');
            $('.' + o.closest('.' + 'n5bM-menu').attr('class').split(' ').join('.') + ' .' + 'n5b-trans').removeClass('n5b-trans');
        } else {
            navTrack("Sub Open: " + $(this).text());
            $('.' + o.closest('.' + 'n5bM-menu').attr('class').split(' ').join('.') + ' .' + 'n5b-trans').removeClass('n5b-trans');
            o.closest('.' + 'n5bM-menu').children().children().removeClass('n5bM-link-active').removeClass('n5bM-ll-content-active');
            o.addClass('n5bM-link-active').next('div.n5bM-ll-content').addClass('n5bM-ll-content-active').closest('.' + 'n5bM-ll').addClass('n5b-trans');
        }
        return false;
    });

    $('.n5bM-link-close, .n5bM-menu-main> a').on("click", function () { // utility links for mobile menus
        var o = $(this);
        if (o.hasClass('n5bm-link-direct')) { window.location.href = o.attr('href'); return false; }
        if (o.hasClass('n5bM-link-close')) {
            navTrack("Sub Close: " + $(this).text());
            $('.n5bM-' + o.attr('data-ref')).removeClass('n5bM-menu-active');
            $('.n5bM-' + o.attr('data-ref') + ' a').attr('tabindex', '-1');
            $('.n5bM-main').removeClass('n5b-recede').css('width', '100%');
            $('.n5bM-main a').removeAttr('tabindex');
        } else {
            navTrack("Sub Open: " + $(this).text());
            $('.n5bM-main').css('width', window.innerWidth);
            $('.n5bM-' + o.attr('data-ref')).addClass('n5bM-menu-active');
            $('.n5bM-' + o.attr('data-ref') + ' a').removeAttr('tabindex');
            $('.n5bM-main').addClass('n5b-recede'); $('.n5bM-main a').attr('tabindex', '-1');
        }
        return false;
    });

    $('a.n5b-link-icon-mobile, a.n5bM-link-close2').on("click", function (e) { // mobile button
        var o = $(this);
        if ($('.' + 'n5bM-link-set-container').hasClass(dAC)) {
            navTrack("Login Close");
        }
        activator(o, dAC);
        if (o.closest('.n5b-bars').hasClass('n5b-active')) {
            navTrack("Main Open");
            $('.n5bM').addClass(dAC); o.attr('title', tClose); $('body').addClass('n5b-noScroll');
        } else {
            navTrack("Main Close");
            o.attr('title', tOpen); $('body').removeClass('n5b-noScroll');
        }
        resetMobileMenu();
        return false;
    });

    $('a.n5b-link-nav').on("click keyup", function (e) { // things that use the activator
        var enableLinkNavClick = false, // true: top nav menu can be clicked and held open
            enableLinkNavEnter = true, // true: clicking enter on kybd when focused will activate        
            o = $(this);

        if (o.hasClass('n5b-link-nav-direct')) {//--
            if (e.type == 'keyup') { return false; }
            window.location.href = o.attr('href');
            return false;
        }
        if (o.hasClass('n5b-link-nav')) {
            if (!enableLinkNavClick) {
                if (e.type == 'click') { return false; }
            }
            if (e.key) { // key was pressed
                if (enableLinkNavEnter && e.key == 'Enter') {
                    activator(o, dAC); return false;
                } else { return false; }
            }
        }
        activator(o, dAC); return false;
    });

    $('.menu-login-select .n5b-selected a').on("click", function () { // show/hide login menu
        $('.menu-login-select').toggleClass(dAC); return false;
    });

    $('.menu-login-link-list-main-container a').on("click", function () { // login links in the desktop container
        var o = $(this);
        window.open(o.attr('href'), o.attr('target'));
        $('.menu-login-select' + ' .n5b-selected a').attr('href', o.attr('href')).attr('target', o.attr('target')).html(o.html());
        $('.menu-login-select' + '.' + dAC).removeClass(dAC);
        $('.n5b-login.' + dAC).removeClass(dAC);
        //$('#n5b-login-go').trigger("click"); Commenting out, can open two windows on certain browsers.  MH 9.14.2022
        return false;
    });

    $('.menu-login-form-container #n5b-login-go').on("click", function () { // clicking top login go btn
        var o = $('.menu-login-select .n5b-selected a');
        window.open(o.attr('href'), o.attr('target'));
        $('.menu-login-select.' + dAC).removeClass(dAC);
        $('.n5b-login.' + dAC).removeClass(dAC);
        return false;
    });

    $('.menu-login').on("click", function () { var aC = 'n5b-active'; $('.menu-login-select.' + aC).removeClass(aC); }); // unfocus for login dropdown

    $(document).on("click", function (e) { // lost focus events- clicking outside of base
        var rAC = false;
        if (!$(e.target).closest(navbar_selector).length) { rAC = true; }
        if (rAC) { $(navbar_selector + ' *.' + dAC).removeClass(dAC); }
    });

    $('.n5bM-link-search, a.n5b-link-search').on("click", function () {showSearch();return false;});
    $('a.search-bar-close').on("click", function () {
        if (window.innerWidth > 768) {
            hideSearch(0);
            if (window.location.href.indexOf('?') > -1) {
                window.history.pushState({ "html": window.location.pathname, "pageTitle": '' }, "", window.location.pathname);
            }
        } else { hideSearch(1); } return false;
    });

    function showSearch() { $('.search-modal').addClass('active'); $('body').addClass('n5b-noScroll'); $("input#searchBarInput").trigger("focus"); navTrack("Search Open");}
    function hideSearch(scroll) { $('.search-modal').removeClass('active'); if (scroll == 0) { $('body').removeClass('n5b-noScroll'); } navTrack("Search Close");}
});

$(function () { // ------------ Nav Notice: svbn5c
    var dAC = 'n5c-active', // default active class
        sVT = 'svbMsg', // session storage flag
        sVM = sessionStorage.getItem(sVT), // grab flag (binary)
        xF = 1;

    if ($('.svbn5c').length < 1) { return false; }
    if (!sVM || sVM == 1) { setTimeout(noticeVis, 2000); }

    $('a.n5b-link-icon-mobile, a.n5b-link-login, a.n5bM-link-close2').on("click", function (e) { // hide if mobile menus
        if (xF == 0 || sVM == 0) { return false; }
        if ($('a.n5b-link-login').hasClass('n5b-active') || $('a.n5b-link-icon-mobile').parent().hasClass('n5b-active')) {
            $('.n5c-grid').removeClass(dAC);
        } else {
            $('.n5c-grid').addClass(dAC);
        }
        return false;
    });

    $('a.n5c-link-close').on("click", function () {
        $(this).addClass('n5c-nofocus');
        $('.n5c-grid').removeClass(dAC);
        $('.svbn5b').removeClass('n5c-notice-' + 'm').removeClass('n5c-notice-' + 't');
        sessionStorage.setItem(sVT, 0);
        xF = 0;
        return false;
    });

    function noticeVis() { $('.n5c-grid').addClass(dAC); }
});