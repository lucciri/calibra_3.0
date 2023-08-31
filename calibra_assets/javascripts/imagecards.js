$(document).ready(function() {    
    var iC = $('.img-card'),
    iCContent = $('.img-card .content');

    if(iC.length === 0) return;

    iC.each(function(){
        var o = $(this);
        if (o.find('.img-card-hover-content').length > 0) {
            o.addClass('hover-card').find('.img-card-content').addClass('border-t sm:border-t-0 border-gray-200');  
        }
    });

    $('.hover-card .dropdown').on("click", function (e) {
        if ($(window).width() < 768) {
            e.stopPropagation();
            var o = $(this);
            o.closest('.img-card').find('.content, .img-card-footer').slideToggle(250);
            o.find('.img-card-caret').toggleClass('rotate');
        };
    });    

    resizeCards();
    
    $(window).on("orientationchange", function() {resizeCards();});

    var rtime, timeout = false, delta = 200;
    $(window).on("resize", function() {
        rtime = new Date(); if (timeout === false) {timeout = true; setTimeout(resizeend, delta);}
    });

    function resizeend() {if (new Date() - rtime < delta) {setTimeout(resizeend, delta);} else {timeout = false; resizeCards();}}

    function resizeCards() {
        var maxHeight = 0,
        footerSel = $('.hover-card .content, .hover-card .img-card-footer');
        iCContent.removeAttr('style');

        if ($(window).width() < 768 ) {
            footerSel.hide();
        } else {            
            footerSel.show();

            $('section.HorizontalCards, section.CascadingCards').each(function(){  
                var parent = $(this);
                maxHeight = 0;
                                
                parent.find(iC).each(function(){
                    var o = $(this);
                    hoverContentH = o.find('.img-card-list').height(),
                    staticContentH = o.find('.img-card-content').height(); 
                    if (hoverContentH > maxHeight) {maxHeight = hoverContentH;}
                    if (staticContentH > maxHeight) {maxHeight = staticContentH;} 
                    if (parent.hasClass('CascadingCards')){
                        var thisC = o.find('.content');
                        if (staticContentH > hoverContentH) {thisC.css('height',staticContentH);} else {thisC.css('height',hoverContentH);}
                    }
                }); 
                if (parent.hasClass('HorizontalCards')){
                    parent.find('.content').each(function(){
                        $(this).css('height', maxHeight  - $(".img-card-footer").height());
                    });
                }                   
            });           
        }
    }
});