function IEVersion() {

}
var layerAlert = layerAlert;
/************************************************内容宽度变化的iframe高度自适应*******************************************/
function reinitIframe() {
	var iframe = document.getElementById("rightFrame");
	try {
		var bHeight = iframe.contentWindow.document.body.scrollHeight;
		var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
		var height = Math.min(bHeight, dHeight);
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
		var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
		var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
		var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
		if(isIE) {
			var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
			reIE.test(userAgent);
			var fIEVersion = parseFloat(RegExp["$1"]);
			if(fIEVersion <= 8) {
				iframe.style.height = height;
			} else {
				iframe.height = height;
			}
		} else {
			iframe.height = height;
		}
		/*		console.log(height)*/
	} catch(ex) {}
}

window.setInterval("reinitIframe()", 200);
/******************************其他*******************************/
window.url = pageConfig.ajaxUrl;
var _accountInfo = window.LS.getItem('accountInfo');
var _token = '',
	_userName = "";
var _header = {};
if(_accountInfo) {
	_token = $.parseJSON(_accountInfo).Token;
	_header = {
		'Content-Type': "application/json",
		"Authorization": "Bearer " + _token,
		"Accept": "application/json"
	};
	_userName = $.parseJSON(_accountInfo).LoginName;
}

//在职状态
var StaffStates = [{
	Id: 0,
	Name: "在职"
}, {
	Id: 1,
	Name: "未知"
}, {
	Id: 3,
	Name: "离职"
}, {
	Id: 2,
	Name: "准备换工作"
}];

$(document).ready(function() {

	if(_userName == "") {
		window.location = "login.html";
		return;
	}
	$("#CertificateState").hide();
	/*****************************************培训课程统计****************************************/
	getpersonalfavoriteCounts(pageConfig.ajaxUrl.trainstudy, $("#trainstudy"), 'allCount');

	/*****************************************我的收藏统计****************************************/
	getpersonalfavoriteCounts(pageConfig.ajaxUrl.personalfavoriteCount, $('#collectCount'));

	/*****************************************我的分享统计****************************************/
	getpersonalfavoriteCounts(pageConfig.ajaxUrl.personalsharedCount, $("#sharedCount"));

	/*****************************************我的关注统计****************************************/
	getpersonalfavoriteCounts(pageConfig.ajaxUrl.personalfollowcount, $("#followCount"));
	/*****************************************我的投递统计****************************************/
	getpersonalfavoriteCounts(pageConfig.ajaxUrl.delivercount, $("#DeliverBox"));
	var _userNavIndex = window.LS.getItem('userNavIndex');
	var _iframeHTML = '';
	var _iframeArr = ['personCenter/baseInfo.html', 'personCenter/myFollow.html', 'personCenter/myFavorite.html', 'personCenter/myShare.html', 'personCenter/delivery.html', 'personCenter/modifyPassword.html'];
	if(_userNavIndex) {
		_iframeHTML = '';
		$(".ucl-menus ul>li").removeClass("active");
		$(".ucl-menus ul>li").eq(0).addClass("active");
		$('.uc-rights').html('');
		_iframeHTML = '<iframe name="rightFrame" id="rightFrame" scrolling="no" frameborder="no" class="ucr-bodys" onload="this.height=rightFrame.document.body.scrollHeight" src=' + _iframeArr[_userNavIndex] + '></iframe>';
		$('.uc-rights').html(_iframeHTML);
	} else {
		_iframeHTML = ''
		$('.uc-rights').html('');
		$(".ucl-menus ul>li").removeClass("active");
		$(".ucl-menus ul>li").eq(0).addClass("active");
		_iframeHTML = '<iframe name="rightFrame" id="rightFrame" scrolling="no" frameborder="no" class="ucr-bodys" onload="this.height=rightFrame.document.body.scrollHeight" src=' + _iframeArr[0] + '></iframe>';
		$('.uc-rights').html(_iframeHTML);

	}

	$(".ucl-menus ul").on("click", "li", function() {
		$(this).addClass("active").siblings().removeClass("active");
		var _index = $(this).index();
		window.LS.setItem('userNavIndex', _index);
	});

	/*获取我的个人信息*/
	var getMyInfo = function() {
		GetAjax(window.url.mytrainBaseUrl, _header).done(function(res) {
			if(res.State.Code == 0) {
				var baseInfo = res.Content;
				if(!baseInfo) {
					$(".caret").hide();
					return;
				}
				$("#Achievements").html("<p>" + baseInfo.Achievements + "</p>");
				$(".NickName").html(baseInfo.NickName);
				$(".AvatarUrl").html('<div class="caret"></div><img src=' + (baseInfo.AvatarUrl ? baseInfo.AvatarUrl : 'img/zz_39.png') + '>');
				$("#Birthday").html(baseInfo.Birthday);
				$("#Age").html(baseInfo.Age);
				$('#WorkDate').html(baseInfo.Age);
				$("#Phone").html(baseInfo.Phone);
				$("#Email").html(baseInfo.Email);
				$("#GraduatedFrom").html(baseInfo.GraduatedFrom);
				$("#Profession").html(baseInfo.Profession);
				$("#Address").html(baseInfo.Address);
				$("#StaffState").html(numberToText(baseInfo.StaffState, StaffStates));
				var CertificateState = baseInfo.CertificateState;
				if(CertificateState !== 2) {
					$(".caret").hide();
				}

				var WorkExperiences = baseInfo.WorkExperiences;
				var WorkExperiencesArray = [];
				if(WorkExperiences.length > 0) {
					for(var i = 0; i < WorkExperiences.length; i++) {
						WorkExperiencesArray.push({
							CompanyName: WorkExperiences[i].CompanyName,
							WorkStart: WorkExperiences[i].WorkStart,
							WorkEnd: WorkExperiences[i].WorkEnd,
							JobTitle: WorkExperiences[i].JobTitle
						});
					}
					var longDate = new Date(),
						shirtDate = new Date("1970-01-01");
					$.each(WorkExperiencesArray, function(index, item) {
						longDate = new Date(item.WorkStart) <= longDate ? item.WorkStart : longDate;
						shirtDate = new Date(item.WorkEnd) >= shirtDate ? item.WorkStart : shirtDate;
					});

					//var WorkDate = parseInt((new Date() - new Date(longDate)) / (3600 * 24 * 365 * 1000));
					var WorkDate = baseInfo.WorkingYears;
					var Company = "",
						JobTitle = "";
					$("#WorkDate").html(WorkDate);
					$.each(WorkExperiencesArray, function(ix, im) {
						if(im.WorkEnd === shirtDate) {
							Company = im.CompanyName;
							JobTitle = im.JobTitle;
						}
					});
					$("#JobTitle").html(JobTitle);
					$("#Company").html(Company);

				} else {

				}

			} else {
				layerAlert.autoclose(res.State.Message);
			}
		}).fail(function(res) {
			layerAlert.autoclose(res);
		})
	};

	getMyInfo();

});

/**
 * [getpersonalfavoriteCount 获取我的收藏数 分享个数]
 * @param  {[type]} url [地址]
 * @param  {[type]} dom [dom元素]
 * @return {[type]}     [description]
 */
function getpersonalfavoriteCounts(url, dom, text) {
	GetAjax(url, _header).done(function(res) {
		if(res.State.Code == 0) {
			if(text == undefined) {
				dom.text(res.Content);
			} else {
				dom.text(res.Content[text]);
			}

		}
	}).fail(function() {
		console.log('fail')
	})
};

$(".sure-bt").on("click", function() {
	$(".fixed-div").toggle();
});

$(".fixed-box h4 .close").on("click", function() {
	$(".fixed-div").toggle();
});