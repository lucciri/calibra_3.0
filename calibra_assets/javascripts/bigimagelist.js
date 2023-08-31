$(function() {
    bigImageList(1);

    $(window).on( "orientationchange scroll", function( event ) {bigImageList(0);});   

	var rtime, timeout = false, delta = 200;
    $(window).on("resize", function() {
        rtime = new Date();
        if (timeout === false) {timeout = true; setTimeout(resizeend, delta);}
    });

    function resizeend() {
        if (new Date() - rtime < delta) {setTimeout(resizeend, delta);} else {timeout = false; bigImageList(1);}               
    }

    function bigImageList(init){        
        $("section.bigImageList").each(function(index) {
            var navA = $('nav.svbn5a'),
            navB = $('nav.svbn5b'),
            nAH = 0,
            nBH = 0;

            if(navA.length > 0 ){nAH = navA.outerHeight();} 
            if(navB.length > 0 ){nBH = navB.outerHeight();}            
            
            var o = $(this),
            bD = o.find('.bigImageList-bg'),
            eT = bD.offset().top,
            eB = eT + bD.outerHeight(),
            sP = $(window).scrollTop() + nAH + nBH,
            sB = sP + $(window).height();

            if((eB > sP && eT < sB) == true || init==1){                
                var sT = o.find('.bigImageList-wrap').offset().top,
                cS = sT - sP,
                wH = $(window).height();
                if(window.innerHeight < window.innerWidth){wH = $(window).width();}

                var tS = o.find('.bigImageList-header').height(),
                bS = 300,
                aS = wH - (tS + bS),
                x2 = ((cS * 100)/aS);

                if (x2<0){x2=0;}
                if (x2>100){x2=100;}

                o.find('.bigImageList-slideUp').css({'top': (x2)  + '%'});
            }
        });
    }
});




