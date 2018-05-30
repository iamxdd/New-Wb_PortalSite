$(document).ready(function() {
	if($('.swiper-slide').children('a').length > 1) {
		var mySwiper = new Swiper('.swiper-container', {
			autoplay: 2500, //可选选项，自动滑动
			loop: true, //可选选项，开启循环
			pagination: '.pagination',
			paginationClickable: true,
			autoplayDisableOnInteraction: false,
			mousewheelControl: true

		});
		$('.arrow-left').on('click', function(e) {
			e.preventDefault();
			mySwiper.swipePrev();
		});
		$('.arrow-right').on('click', function(e) {
			e.preventDefault();
			mySwiper.swipeNext();
		})
	} else {
		$('.device a').hide();
	}

	//信息公开（政策文件、通知公告）鼠标滑动切换
	$(".common-title .right-nav").on("mousemove", "li", function() {
		var n = $(this).index();
		$(this).addClass("active").siblings().removeClass("active");
		$(".publicInfo-content .my-newinfo").eq(n).show().siblings().hide();
		$(".publicInfo-content .my-newinfo").eq(n).addClass("active").siblings().removeClass("active");
	});

	//滑动右侧内容显示不同的左侧图片
	$(".my-newinfo-right li").on("mousemove", function() {
		var n = $(this).index();
		$(".publicInfo-content .active .my-newinfo-left img").eq(n).show().siblings().hide();;
	});

	//信息公开（政策文件、通知公告）点击切换
	$(".common-title .right-nav").on("click", "li", function(e) {
		e.stopPropagation();
		var n = $(this).index();
		window.LS.setItem('type', n + 1);
	});

	/*banner显示隐藏*/
	$(".banner-box .banner").on("mousemove", function() {
		$(".device a").show();
	}).on("mouseout", function() {
		$(".device a").hide();
	});
});