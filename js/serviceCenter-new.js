$(document).ready(function() {
	
	
	//
	$(".ucl-menus ul").on("click", "li", function() {
		$(this).addClass("active").siblings().removeClass("active");
		var n = $(this).index() + 1;
		console.log(n);
		switch (n) {
			case 1:
				$(".pane1").show();
				$(".pane2").hide();
				$(".pane3").hide();
				$(".pane4").hide();
				$(".deitais-serviece").hide();
				$("#now-pos").html("常见问题");

				break
			case 2:
				$(".pane2").show();
				$(".pane1").hide();
				$(".pane3").hide();
				$(".pane4").hide();
				$(".deitais-serviece").hide();
				$("#now-pos").html("用户手册");
				break;
			case 3:
				$(".pane3").show();
				$(".pane1").hide();
				$(".pane2").hide();
				$(".pane4").hide();
				$(".deitais-serviece").hide();
				$("#now-pos").html("需求发布须知");
				break
			case 4:
				$(".pane4").show();
				$(".pane1").hide();
				$(".pane3").hide();
				$(".pane2").hide();
				$(".deitais-serviece").hide();
				$("#now-pos").html("供需匹配");
				break;
			default:
				break;
		}
		
	});
	$(".pane1").on("click","li",function(){
		$(".deitais-serviece").show();
		$(".pane1").hide();
	})
});