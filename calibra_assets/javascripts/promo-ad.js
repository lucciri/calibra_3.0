$(document).ready(function () {
    $('.promo-ad').each(function () {
        var $this = $(this);
        var $lastPromo = $this.find(".promo-text-last")
        var $img = $this.find(".promo-img");

        if ($img.length && $lastPromo.length) {
            var pos = $lastPromo.position();
            var tileHeight = $lastPromo.height();
            var tileBottom = pos.top + tileHeight;

            var imgPos = $img.position();

            // Make sure the image and the last card don't come withing 15px of each other.
            if (imgPos.top < (tileBottom + 15)) {
                $img.css("top", tileBottom + 20);  // Move the image down 20px
            };
        }
    });
});