$(document).ready(function () {
	if (window.matchMedia("(min-width: 1024px)").matches) {
		$(".hover-gallery-images").each(function () {
			$(this).children().eq(0).css("display", "block");
		});
		$(".hover-item-text").on("mouseover", function () {
			if ($(window).width() > 1024) {
				(o = $(this)),
					(thisIndex = o.index()),
					(thisParent = o.closest(".hover-items-block")),
					(thisImagesDiv = thisParent.find(".hover-gallery-images"));

				thisParent.find(".hover-item-text").removeClass("active");
				thisParent.find(".hover-item-text-lg").removeClass("active");

				thisImagesDiv.find("img").hide();
				thisImagesDiv.find("img:eq(" + thisIndex + ")").show();

				o.addClass("active");
				o.find(".hover-item-text-lg").addClass("active");
				return false;
			}
		});
	}
});