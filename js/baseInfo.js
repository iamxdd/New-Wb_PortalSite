$(document).ready(function() {

	window.url = pageConfig.ajaxUrl;
	var _accountInfo = window.LS.getItem('accountInfo');
	var _token = '';
	var _header = {};
	if(_accountInfo) {
		_token = $.parseJSON(_accountInfo).Token;
		_header = {
			'Content-Type': "application/json",
			"Authorization": "Bearer " + _token,
			"Accept": "application/json"
		};
	}

	$("#CertificateState").hide();
	//在职状态
	var StaffStates = [{
		Id: 0,
		Name: "未知"
	}, {
		Id: 1,
		Name: "在职"
	}, {
		Id: 2,
		Name: "准备换工作"
	}, {
		Id: 3,
		Name: "离职"
	}];

	/*工作性质*/
	var WorkingNatures = [{
		Id: 0,
		Name: "全职"
	}, {
		Id: 1,
		Name: "兼职"
	}, {
		Id: 2,
		Name: "实习"
	}];

	/*写别lieb*/

	var Genders = [{
		Id: 0,
		Name: "未知"
	}, {
		Id: 1,
		Name: "男"
	}, {
		Id: 2,
		Name: "女"
	}];

	var IndustryCodes = [{
		Id: 1,
		Name: "工业"
	}, {
		Id: 2,
		Name: "制造业"
	}, {
		Id: 3,
		Name: "IT行业"
	}];

	//性质
	var EnterpriseNatures = [{
		Id: 0,
		Name: "国有企业"
	}, {
		Id: 1,
		Name: "集体企业"
	}, {
		Id: 2,
		Name: "联营企业"
	}, {
		Id: 3,
		Name: "中外合作企业"
	}, {
		Id: 4,
		Name: "中外合资企业"
	}, {
		Id: 5,
		Name: "外商独资企业"
	}, {
		Id: 6,
		Name: "私营企业"
	}];

	//获取行业列表
	var industrylist = function() {
		GetAjax(window.url.industrylist, _header, ".sp-lefts").done(function(res) {
			if(res.State.Code == 0) {
				IndustryCodes = res.Content;
				$.each(IndustryCodes, function(index, item) {
					item.OldId = item.Id;
					item.Id = item.Code;
				});
				getMyInfo();
			} else {
				console.log(res.State.Message);
			}
		}).fail(function() {
			console.log('fail');
		})
	};

	industrylist();

	/*获取我的个人信息*/
	var getMyInfo = function() {
		GetAjax(window.url.mytrainBaseUrl, _header, ".sp-lefts").done(function(res) {
			if(res.State.Code == 0) {
				var baseInfo = res.Content;
				if(!baseInfo) {
					return;
				}

				/*个人成就*/
				if(baseInfo.Achievements == null) {
					baseInfo.Achievements = '暂无成就!';
				} else {
					var Achievements = baseInfo.Achievements.split("，");
					var AchievementsHtml = "";
					$.each(Achievements, function(index, item) {
						AchievementsHtml += "<p>" + (index + 1) + "、" + item + "</p>";
					});
					$("#Achievements").html(AchievementsHtml);
				}

				$("#NickName").html(baseInfo.NickName);
				$("#Gender").html(numberToText(baseInfo.Gender, Genders));
				$("#AvatarUrl").html('<img src=' + (baseInfo.AvatarUrl ? baseInfo.AvatarUrl : '../img/zz_39.png') + '>');
				$("#Birthday").html(baseInfo.Birthday);
				$("#Age").html(Math.floor((new Date() - new Date(baseInfo.Birthday)) / (3600 * 24 * 365 * 1000)));
				$("#Phone").html(baseInfo.Phone);
				$("#Email").html(baseInfo.Email);
				$("#GraduatedFrom").html(baseInfo.GraduatedFrom);
				$("#Profession").html(baseInfo.Profession);
				$("#Address").html(baseInfo.Address);
				$("#StaffState").html(numberToText(baseInfo.StaffState, StaffStates));
				if(baseInfo.CertificateState !== 2) {
					$("#CertificateState").hide();
				}
				if(baseInfo.Tags && baseInfo.Tags.length > 0) {
					var TagsHtml = "";
					for(var i = 0; i < baseInfo.Tags.length; i++) {
						TagsHtml += "<span>" + baseInfo.Tags[i].Tag + "</span>";
					}
					$("#Tags").html(TagsHtml);
				} else {
					$("#Tags").html("<p>暂无数据</p>");
				}

				/*行业*/
				var Industries = baseInfo.Industries ? baseInfo.Industries : [];
				if(Industries.length !== 0) {
					var IndustriesHtml = "";
					$.each(Industries, function(index, item) {
						IndustriesHtml += '<span>' + item.IndustryName + '</span>';
					});
					$("#myIndustry").html(IndustriesHtml);
				}

				$("#Description").html("<p>" + (baseInfo.Description ? baseInfo.Description : "暂无数据") + "</p>");
				if(baseInfo.WorkExperiences && baseInfo.WorkExperiences.length > 0) {
					var WorkExperiencesHtml = "";
					for(var i = 0; i < baseInfo.WorkExperiences.length; i++) {
						var we = baseInfo.WorkExperiences[i];
						WorkExperiencesHtml +=
							'<div class="workexperience-item">' +
							'<p><span>' + we.CompanyName + '</span> ' + dateFormat(we.WorkStart, 'yyyy-MM-dd') + '～' + dateFormat(we.WorkEnd, 'yyyy-MM-dd') + ' </p>' +
							'<p>' + we.JobTitle + ' </p>' +
							'<p>' + we.JobDescription + '</p>' +
							'<p>&nbsp;</p>' +
							'</div>';
					}
					$("#WorkExperiences").html(WorkExperiencesHtml);
				} else {
					$("#WorkExperiences").html("<p>暂无数据!</p>");
				}
				/*exceptJob期望工作*/
				var ExpectedJobHtml = "";
				if(baseInfo.ExpectedJob && baseInfo.ExpectedJob.length > 0) {
					var ExceptIndustryHtml = "";
					for(var i = 0; i < baseInfo.ExpectedJob.length; i++) {
						ExceptIndustryHtml += "<span>" + numberToText(baseInfo.ExpectedJob[i].IndustryCode, IndustryCodes) + "</span>";
					}
					ExpectedJobHtml =
						'<p>期望行业： ' + ExceptIndustryHtml + '</p>' +
						'<p class="clearfix"><b>工作地点：' + baseInfo.ExpectedJob[0].ExpectedWorkingPlaceName + ' </b><b>期望企业：' + numberToText(baseInfo.ExpectedJob[0].EnterpriseNature, EnterpriseNatures) +
						'</b><b>工作性质：' + numberToText(baseInfo.ExpectedJob[0].WorkingNature, WorkingNatures) + '</b></p>';

				} else {
					ExpectedJobHtml =
						'<p>期望行业： 无</p>' +
						'<p class="clearfix"><b>工作地点：暂无 </b><b>期望企业：暂无</b></p>';
				}
				$("#ExpectedJob").html(ExpectedJobHtml);

			} else {
				console.log(res.State.Message);
			}
		}).fail(function() {
			console.log('fail');
		})
	};

	//getMyInfo();

	/*编辑按钮点击事件*/
	$("#editInfo").on("click", function() {
		window.location.href = "editInfo.html";
	});
});