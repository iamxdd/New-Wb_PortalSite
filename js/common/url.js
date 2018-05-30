var basePath = "../json/";
var apiPath = "http://192.168.1.101:9006/";
var apiPath_a = "http://192.168.1.101:9009/";
var apiPath_b = "http://192.168.1.101:9010/";
window.pageConfig = {
	"token": '',
	"ajaxUrl": {
		"indexUrl": basePath + 'index.json',
		"footerUrl": basePath + 'footer.json',
		"traincourseUrl": apiPath + 'api/train/traincategory/list',
		"trainlistUrl": apiPath + 'api/train/training/list',
		"leadInfomation": basePath + 'leadInfomation.json',
		"regestImgurl": apiPath + 'api/portal/',
		"trainBaseUrl": apiPath + 'talent', //获取人才培训类型
		'mytrainBaseUrl': apiPath + 'mytalent', //获取我的基本信息
		"supplyUrl": basePath + 'supply.json',
		"personalfavoriteCount": apiPath_a + "api/personalfavorite/count", //获取个人收藏数量
		"personalfavoriteList": apiPath_a + "api/personalfavorite/list", //分页获取个人收藏
		"personalfavoriteDetail": apiPath_a + "api/personalfavorite/detail", //获取个人收藏详情
		"deletepersonalfavorite": apiPath_a + "api/personalfavorite", //删除个人收藏
		"favoriteUrl": apiPath_a + 'api/personalfavorite', //新增个人收藏
		"personalsharedCount": apiPath_a + "api/personalshared/count", //获取个人分享数量
		"personalsharedList": apiPath_a + "api/personalshared/list", //分页获取个人分享
		"deletepersonalsharee": apiPath_a + "api/personalshared", //删除个人分享
		"shareUrl": apiPath_a + 'api/personalshared', //新增个人分享
		"personalshareDetail": apiPath_a + "api/personalshared/detail", //获取个人收藏详情	
		"trainstudy": apiPath_a + "api/trainstudy/statistics", //培训课程统计	
		"trainstudyAdd": apiPath_a + "api/browsestatistics/trainstudy", //课程学习量增加
		"updatedemandinfo": apiPath + "api/corporation/updatedemandinfo", //修改企业发布需求
		"adddemandinfo": apiPath + "api/corporation/adddemandinfo", //新增企业发布需求
		"locationlist": apiPath + "api/shared/locationlist", //获取地点列表
		"sublocationlist": apiPath + "api/shared/sublocationlist", //获取城市列表
		"industrylist": apiPath + "api/shared/industrylist", //获取行业列表
		"mycorporation": apiPath + "api/corporation/mycorporation", //获取我的企业信息
		"addcorporation": apiPath + "api/corporation/addcorporation", //增加企业信息
		"updatecorporation": apiPath + "api/corporation/updatecorporation", //修改企业
		"alltalengtags": apiPath + "alltalengtags", //获取标签列表
		"fileUpLoad": apiPath_b + "mediafile/api/upload", //图片上传
		"talentmatchingsupplylist": apiPath + "talentmatchingsupply/list", //人才供需匹配列表
		"corporationsupplydemandlist": apiPath + "api/corporation/corporationsupplydemandlist", //企业供需匹配列表
		"demanddeliver": apiPath + "api/corporation/demanddeliver", //需求投递
		"gertalentbyid": apiPath + "gertalentbyid", //根据Id获取人才供需匹配详情
		"corporationbyid": apiPath + "api/corporation/corporationbyid", //根据id获取企业供需匹配详情
		"getparentlocation": apiPath + "api/shared/getparentlocation", //获取父元素code
		"colectionStates": apiPath_a + "api/personalfavorite/states", //获取当前源收藏状态
		"modifypassword": apiPath + "api/portal/modifypassword", //修改密码
		"personalfollow": apiPath_a + "api/personalfollow/states", //获取当前源收藏关注状态
		"deletepersonalfollow": apiPath_a + "api/personalfollow", //删除关注状态

		"personalfollowcount": apiPath_a + "api/personalfollow/count", //获取关注数量
		"personalfollowList": apiPath_a + "api/personalfollow/list", //关注列表

		"getTalentRecommend": apiPath + "talentrecommend", //供需匹配推荐（人才)
		"getcorporationsRecommend": apiPath + "api/corporation/corporationrecommend", //供需匹配推荐（企业)





		"delivercount":apiPath+"api/corporation/delivercount",//个人中心获取投递数量
		"captchaValidate":apiPath+"api/portal/captcha/validate",//验证用户输入的验证码
		"corporationstatistics": apiPath + "api/corporation/corporationstatistics", //获取企业统计信息
		"deleteattention": apiPath_a + "api/personalfollow", //取消关注
		"attention": apiPath_a + "api/personalfollow", //关注
		"attentionState": apiPath_a + "api/personalfollow/states", //获取当前源关注状态
		"delivercorporation": apiPath + "api/corporation/delivercorporation", //投递详情
		"demandDetail": apiPath + "api/corporation/detail", //获取需求详情
		"deletemyreceivedeliver": apiPath + "api/corporation/deletemyreceivedeliver", //接收箱删除
		"deliversetallreadstate": apiPath + "api/corporation/deliversetallreadstate", //设置所有为已读
		"deliverreceivelist": apiPath + "api/corporation/deliverreceivelist", //获取接收箱列表
		"deletemydeliver": apiPath + "api/corporation/deletemydeliver", //删除自己投递的信息
		"deliverinfolist": apiPath + "api/corporation/deliverinfolist", //获取投递箱列表
		"deletedemands": apiPath + "api/corporation/deletedemands", //删除企业需求
		"releaseOpenstate": apiPath + "api/corporation/openstate", //企业发布需求的开启和关闭
		"demandlist": apiPath + "api/corporation/demandlist", //获取需求列表数据
		"getalllocation": apiPath + "api/shared/getalllocation" //获取所有的地点
	}

}