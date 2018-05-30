$(document).ready(function() {
	var atype = GetQueryString('atype');
	if(atype == 1 || atype == 0) {
		$('#locationspan').text('政策文件');
		$('.pubactive').children('li').eq(0).addClass('active');
	} else if(atype == 2) {
		$('#locationspan').text('通知公告');
		$('.pubactive').children('li').eq(1).addClass('active');
	}

});