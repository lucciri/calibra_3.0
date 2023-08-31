$(document).ready(function () {
    var cardSet = $('.CascadingCards .item'), 
    visClass = 'opacity-50',
    tempVis = 'ccvis',
    CCHeaderClass = '.HeaderComponent',
    parentClass = '.CascadingCards',
    tick = false,
    mobile = true;

    if ($(window).width() > 767 ) {mobile = false;}
    if (mobile == false) {vis(cardSet.first());} else {vis(cardSet);}

    cardSet.mouseenter(function() {
        if (mobile == false) {
            var o = $(this);
            o.closest(parentClass).find(cardSet).addClass(visClass);        
            if (o.hasClass(visClass)){vis(o);}
        }
    }).mouseleave(function() {
        if (mobile == false) {
            var o = $(this);
            o.addClass(visClass);
            var theseCards = o.closest(parentClass).find(cardSet);
            theseCards.each(function (index) { 
                var o = $(this);
                if (o.hasClass(tempVis)){o.removeClass(visClass);}
            });
        }
    });    

    function scrollTargetArea(){
        cardSet.each(function (index) { 
            var o = $(this),
            ccParentHead = o.closest(parentClass).find(CCHeaderClass).children(':first'),
            ccPHHeight = ccParentHead.outerHeight(),
            scrollTop = $(window).scrollTop(),
            hOffset = ccParentHead.offset().top,
            eOffset = o.offset().top,
            hDistance = (hOffset - scrollTop),
            eDistance = (eOffset - scrollTop),
            //hXDistance = hDistance + (ccPHHeight/2); //if you want the detection to start halfway
            hXDistance = hDistance + (ccPHHeight); //using full height

            if (eDistance <= hXDistance) {
                unVis(o);
                vis(o);
                o.addClass(tempVis);             
            }                                        
        });
    }

    $(window).on('resize scroll', function (e) {       
        if (!tick) {
            setTimeout(function () {
                if ($(window).width() > 767 ) {mobile = false;} else {mobile = true;}
                if (mobile == false) {
                    stickyHeader();
                    scrollTargetArea();
                } else {
                    vis(cardSet);
                }
                tick = false;
            }, 100);
        }
        tick = true;
    });  

    function vis(o) {o.removeClass(visClass);} 
    function unVis(o){o.closest(parentClass).find(cardSet).removeClass(tempVis).addClass(visClass);} 

    function stickyHeader(){
        $(".top-nav-offset").attr("style", "top: " + ( $(".n5b-grid-wrap").first().height() + 64 ) + "px;");
    }

});