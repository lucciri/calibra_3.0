$(function () {
    var buttonLeft = $("#cc-icon-previous")[0];
    var buttonRight = $("#cc-icon-next")[0];
    var container = $("#card-grid")[0];
    var maxScrollLeft = container.scrollWidth - container.clientWidth;
    buttonLeft.ariaDisabled = "true";
    buttonLeft.disabled = true;
    $("#card-grid").addClass("right-gradient");

    $("#cc-icon-next").on("click", function () {
        sideScroll(container, "right", 25, 200, 20);
    });

    $("#cc-icon-previous").on("click", function () {
        sideScroll(container, "left", 25, 200, 20);

    });

    var carouselScrollTimer = -1;
    var carouselArrowClicked = false;

    $("#card-grid").on("mouseup, scroll", function (e) {
        if (container.scrollLeft === 0) {
            buttonLeft.disabled = true;
            buttonLeft.ariaDisabled = "true";
            buttonRight.disabled = false;
            buttonRight.ariaDisabled = "false";
            $("#card-grid")
                .addClass("right-gradient")
                .removeClass("left-gradient")
                .removeClass("left-right-gradient");
        } else if (container.scrollLeft >= maxScrollLeft - 1) {
            buttonRight.disabled = true;
            buttonRight.ariaDisabled = "true";
            buttonLeft.disabled = false;
            buttonLeft.ariaDisabled = "false";
            $("#card-grid")
                .addClass("left-gradient")
                .removeClass("right-gradient")
                .removeClass("left-right-gradient");
        } else {
            buttonLeft.disabled = false;
            buttonLeft.ariaDisabled = "false";
            buttonRight.disabled = false;
            buttonRight.ariaDisabled = "false";
            $("#card-grid")
                .addClass("left-right-gradient")
                .removeClass("left-gradient")
                .removeClass("right-gradient");
        }

        // Track the scroll after they're done scrolling
        if (carouselScrollTimer !== -1) {
            clearTimeout(carouselScrollTimer);
        }
        carouselScrollTimer = setTimeout(function () {
            if (!carouselArrowClicked) {
                window.dataLayer = window.dataLayer || [];
                dataLayer.push({
                    "event": "CollectionCarouselScrollClick"
                });
            }
            carouselArrowClicked = false;
        }, 500);
    });

    function sideScroll(element, direction, speed, distance, step) {
        scrollAmount = 0;

        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
            "event": "CollectionCarouselArrowClick"
        });
        carouselArrowClicked = true;

        var slideTimer = setInterval(function () {
            if (direction == "left") {
                element.scrollLeft -= step;
            } else {
                element.scrollLeft += step;
            }

            if (container.scrollLeft === 0) {
                buttonLeft.disabled = true;
                buttonLeft.ariaDisabled = "true";
                buttonRight.disabled = false;
                buttonRight.ariaDisabled = "false";
                $("#card-grid")
                    .addClass("right-gradient")
                    .removeClass("left-gradient")
                    .removeClass("left-right-gradient");
            } else if (container.scrollLeft >= maxScrollLeft - 1) {
                buttonRight.disabled = true;
                buttonRight.ariaDisabled = "true";
                buttonLeft.disabled = false;
                buttonLeft.ariaDisabled = "false";
                $("#card-grid")
                    .addClass("left-gradient")
                    .removeClass("right-gradient")
                    .removeClass("left-right-gradient");
            } else {
                buttonLeft.disabled = false;
                buttonLeft.ariaDisabled = "false";
                buttonRight.disabled = false;
                buttonRight.ariaDisabled = "false";
                $("#card-grid")
                    .addClass("left-right-gradient")
                    .removeClass("left-gradient")
                    .removeClass("right-gradient");
            }

            scrollAmount += step;
            if (scrollAmount >= distance) {
                window.clearInterval(slideTimer);
                
            }
        }, speed);
    }
});