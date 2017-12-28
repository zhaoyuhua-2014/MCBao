
define(function(require, exports, module){
	
	require('jquery');
	require("swiper")
	var common = require('../dist/common');

	// 命名空间

	var pub = {};
	pub.logined = common.isLogin(); // 是否登录
	
	pub.weixinCode = common.getUrlParam("code");
	
	pub.openId = common.openId.getItem();
	
	pub.local_websiteNode = common.websiteNode.getItem();//本地存储的websiteNode
	
    if( pub.logined ){
    	pub.userId = common.user_datafn().cuserInfo.id;
    	pub.source = "userId" + pub.userId;
    	pub.sign = md5( pub.source + "key" + common.secretKeyfn() ).toUpperCase();
    	pub.tokenId = common.tokenIdfn();
    	pub.user_websiteNode = common.user_datafn().cuserInfo.websiteNode;//用户的websiteNode
    	//pub.user_websiteNode = "3301";//用户的websiteNode
    }else{
    	$("#foot .footer_item").eq(2).attr("data-url","html/login.html");
    }
	pub.userBasicParam = {
		userId : pub.userId,
		source : pub.source,
		sign : pub.sign,
		tokenId : pub.tokenId
	};
	
	pub.options = {}
	pub.options.websiteNode = pub.local_websiteNode ? pub.local_websiteNode : common.WebsiteNode;
	
	pub.options.websiteNodeData = localStorage.getItem("websiteNodeData") ? JSON.parse(localStorage.getItem("websiteNodeData")) : null;
	// 接口处理命名空间
	pub.apiHandle = {
		init:function(){
			pub.apiHandle.page_show.init();
			!pub.openId && common.isWeiXin() && pub.weixinCode && pub.apiHandle.get_weixin_code.init();
			if (pub.options.websiteNodeData == null) {
				$(".header_left").html("杭州站")
			}else{
				console.log(pub.options.websiteNode)
				for (var i in pub.options.websiteNodeData) {
					if (pub.options.websiteNodeData[i].websiteNode == pub.options.websiteNode) {
						$(".header_left").html(pub.options.websiteNodeData[i].websiteName)
					}
				}
			}
		},
		get_code : {
			init:function(){
				common.ajaxPost({
					method:'business_city_get_by_area_code',
					areaCode:pub.options.websitNode,
				 },function( d ){
					d.statusCode == "100000" && pub.apiHandle.get_code.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function( d ){
				var o = d.data;
				pub.options.websitNode = o.websiteNode;
				$(".index_left").html(o.websiteName)
			}
		},
		get_weixin_code : {
			init:function(){
				common.ajaxPost({
					method:'get_weixin_code',
					weixinCode:pub.weixinCode,
				 },function( d ){
					d.statusCode == "100000" && pub.apiHandle.get_weixin_code.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				if (d.data.fromWX == 1 ) {
					pub.openId = d.data.openId;
					common.openId.setItem(pub.openId);
				}
			}
		},
		page_show : {
			init:function(){
				common.ajaxPost({
					method:'main_page_show',
					websiteNode:pub.options.websiteNode,
					sign:pub.sign,
					source:pub.source,
				 },function( d ){
					d.statusCode == "100000" && pub.apiHandle.page_show.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function( d ){
				var adInfoList = d.data.adInfoList;
					mainActivityList = d.data.mainActivityList;
				pub.apiHandle.page_show.adInfo.init(adInfoList);
				
				for (var i = 0; i < mainActivityList.length; i++) {
					pub.apiHandle.page_show.mainActivity.init(mainActivityList[i])
				}
				
				
			},
			adInfo:{
				init:function(d){
					var html = '';
					for (var i in d) {
						html += '<div class="swiper-slide"><img src="'+d[i].adPic+'"/></div>'
					}
					$(".banner_wrap .index_banner .swiper-wrapper").html(html);
					pub.apiHandle.page_show.adInfo.apiData();
				},
				apiData:function(){
					var swiper = new Swiper (".index_banner", {
					    direction: 'horizontal',
					    loop: true,
					    loopAdditionalSlides :2,
					    autoplay:5000,
					    //autoplayDisableOnInteraction : false,
					    //spaceBetween : 34,
					    slidesPerView : 1.4,
						centeredSlides : true,
					    //width:618,
					});
				},
			},
			mainActivity:{
				init:function(d){
					console.log(d);
					var html = '',List = d.activityDetailsList;
					
					html += '<div class="index_module">'
					html += '	<h3 class="title">'+d.activityTitle+'</h3>'
					html += '	<div class="module_box">'
						for (var i in List) {
							html += pub.apiHandle.page_show.mainActivity.listDetaile(List[i])
						}
					html += '	</div>'
					html += '</div>'
					
					$(".index_module_box").append(html);
				},
				listDetaile:function(d){
					var str = '';
					str += '<dl class="module_item clearfloat" data="'+d.id+'">'
					str += '	<dt><img src="'+d.goodsInfo.goodsLogo+'"/></dt>'
					str += '	<dd>'
					str += '		<h4>'+d.goodsInfo.goodsName+'</h4>'
					str += '		<div class="description">'+d.goodsInfo.goodsDescribe+'</div>'
					str += '	</dd>'
					str += '</dl>'
					return str;
				},
				apiData:function(){
					
				},
			}
		}
	};
	
	//事件处理
	pub.eventHandle = {
		//时间初始化
		init:function(){
			
			/*点击切换主菜单*/
			$("#foot").on("click",".footer_item",function(){
				var isActive = $(this).is(".actived");
				if (!isActive) {
					common.jumpLinkPlain($(this).attr("data-url"))
				}
			})
			/*点击进入车详情*/
			$(".index_module_box").on("click",'.module_item',function(){
				var nood = $(this);
				common.jumpLinkPlain( "html/car_mall.html"+"?id="+nood.attr("data") )
			})
			/*点击进入客服中心*//*点击进入城市定位*/
			$(".index_left,.index_right").on("click",function(){
				var nood = $(this);
				if (nood.attr("data-url")) {
					common.jumpLinkPlain( $(this).attr("data-url") )
				}else{
					//alert("暂缺，待定");
					common.prompt("内测中，暂未开放！")
				}
			});
			/*点击进入子菜单*/
			$(".menu_nav dl.item").on("click",function(){
				var nood = $(this);
				if (nood.attr("data-url")) {
					common.jumpLinkPlain( $(this).attr("data-url") )
				}else{
					//alert("暂缺，待定");
					common.prompt("内测中，暂未开放！")
				}
			});
		}
	}
	pub.init = function(){
		pub.apiHandle.init();
		pub.eventHandle.init();
	};
	module.exports = pub;
})