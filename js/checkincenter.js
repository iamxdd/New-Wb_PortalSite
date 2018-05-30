$(document).ready(function() {

	//
	$(".ucl-menus ul").on("click", "li", function() {
		$(this).addClass("active").siblings().removeClass("active");
		var n = $(this).index();
		$(".ck-rights .panels .panel").eq(n).show().siblings().hide();
		$("#now-pos").html(n === 0 ? "个人入住" : "个人认证");
	});
});