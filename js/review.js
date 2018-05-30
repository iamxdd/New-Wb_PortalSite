
window.url = pageConfig.ajaxUrl;
$(document).ready(function() {

	/*推荐人才or企业*/
	var getTalentRecommend = function(url, dom, type) {
		/*type： 1为人才 2为企业*/
		GetAjax(url).done(function(response) {
			var Code = response.State.Code;
			var Message = response.State.Message;
			if(Code === 0) {
				var talentListHtml = "";
				$.each(response.Content, function(index, item) {
					switch(type) {
						case 1:
							var Tags = item.Tags;
							var TagsHtml = "";
							$.each(Tags, function(n, v) {
								TagsHtml += '<span>' + v.Name + '</span>';
							});
							if(item.AvatarUrl==null || item.AvatarUrl=="/img/zz_39.png"){
								item.AvatarUrl="../img/zz_39.png";
							}
							talentListHtml +=
								'<li class="clearfix">' +
								'<a href="/supplyanddemand/talentsdetail/' + item.Id + '.html" >' +
								'<div class="spr-image">' +
								'<img src=' + item.AvatarUrl + ' />' +
								'</div>' +
								'<div class="spr-text">' +
								'<h4 class="clearfix"><i class="fr">' + (item.WorkingYears ? item.WorkingYears : 0) + '年从业经验</i>' + item.NickName + '</h4>' +
								'<div class="sprt-tags">' + TagsHtml + '</div>' +
								'</div>' +
								'</a>' +
								'</li>';
							break;
						case 2:
							talentListHtml +=
								'<a href="/supplyanddemand/corporationdetail/' + item.Id + '.html">' +
								'<dl>' +
								'<dt class="clearfix">' +
								'<i>' + item.NatureName + '</i>' +
								item.Name +
								'</dt>' +
								'<dd>规模：' + item.ScaleName +
								'</dl>' +
								'</a>';
							break;
						default:
							break;
					}

				});
				if(!!talentListHtml) {
					dom.html(talentListHtml);
				}
			} else {

			}
		}).error(function(err) {

		});
	};
	getTalentRecommend(window.url.getTalentRecommend, $("#talentList"), 1);
});