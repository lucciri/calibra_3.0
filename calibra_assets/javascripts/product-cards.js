$.ProductCards = function (blockname, props) {
    var $this = $(blockname);
    var _this = this;
    this.props = props;

    var minAllowedHeight = 369;

    new SimpleBar($this.find(".scroll-area")[0], {
        forceVisible: true
    });

    $this.find(".front:not(.noflip)").on("click", function () {
        $this.find(".front").removeClass('rotate-front');
        $this.find(".back").removeClass('rotate-back');
        $(this).addClass('rotate-front');
        $(this).next(".back").addClass('rotate-back');
        TrackFlip($(this).parent());
    })

    $this.find(".close-btn span").on("click", function () {
        $this.find(".front").removeClass('rotate-front');
        $this.find(".back").removeClass('rotate-back');
    })

    if (typeof document.fonts === 'undefined') {
        SetHeights();
    } else {
        document.fonts.ready.then(function () {
            SetHeights();
        });
    }

    $(window).on('resized', function () {
        SetHeights();
    });

    if ($().hoverIntent) {
        $(".flip").hoverIntent({ timeout: 100, interval: 700, over: FlipHoverOver, out: function () { } });
    }

    $this.find(".back-content, .desc").FontAwesomeUnorderedList("fal fa-check");

    var SetHeights = function () {
        var $flip = $this.find(".flip");
        $flip.css('height', '');

        $this.find(".card-main").EqualizeHeights();

        var $front = $this.find(".front");
        $front.css('position', 'relative'); // set position to relative so we can calculate the heights
        $front.EqualizeOuterHeights(minAllowedHeight);
        $front.css('position', ''); // revert back to default

        var $back = $this.find(".back");
        $back.css('position', 'relative');  // set position to relative so we can calculate the heights
        $back.EqualizeOuterHeights(minAllowedHeight);
        $back.css('position', ''); // revert back to default

        var frontHeight = $front.first().height();
        var backHeight = $back.first().height();

        if (frontHeight > backHeight) {
            $back.css('min-height', frontHeight + 'px');
            $flip.height(frontHeight);
        } else {
            $front.css('min-height', backHeight + 'px');
            $flip.height(backHeight);
        }

        SetDiagonalSize($this);
    }

    var SetDiagonalSize = function () {
        var h1 = 0;
        if (_this.props.version == "ticker") {
            h1 = $this.find(".P06__content").outerHeight();
        }
        var $pcards = $this.find(".product-cards");
        var h2 = $pcards.outerHeight();
        var height = h1 + h2;

        var width = $pcards.outerWidth();
        if (height > width) {
            height = width;
        }

        var $dbl = $this.find(".diagonal-bottom-left");
        var $dbr = $this.find(".diagonal-bottom-right");
        // Check if we're bigger than the 48em breakpoint
        if ($(window).innerWidth() > 768) {
            $dbl.css({
                "border-bottom-width": height + "px",
                "border-right-width": height + "px"
            });
            $dbr.css({
                "border-bottom-width": height + "px",
                "border-left-width": height + "px"
            });
        } else {
            // Clear the css
            $dbl.css({
                "border-bottom-width": "",
                "border-right-width": ""
            });
            $dbr.css({
                "border-bottom-width": "",
                "border-left-width": ""
            });
        }
    }
}

var flipped = flipped || [];
var TrackFlip = function (obj) {
    var id = $(obj).attr('id');
    if (flipped.includes(id)) return;

    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        "Value": $(obj).data("content"),
        "event": "ProductCardFlip"
    });

    flipped.push(id);
}

var FlipHoverOver = function () {
    TrackFlip(this);
}