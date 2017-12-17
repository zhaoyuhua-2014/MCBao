
define(function(require, exports, module){
	
	require('jquery');
	require("swiper")
	var common = require('../dist/common');

	// 命名空间

	var pub = {};
	pub.logined = common.isLogin(); // 是否登录
	
    if( pub.logined ){
    	pub.userId = common.user_datafn().cuserInfo.id;
    	pub.source = "userId" + pub.userId;
    	pub.sign = md5( pub.source + "key" + common.secretKeyfn() ).toUpperCase();
    	pub.tokenId = common.tokenIdfn();
    }
	pub.userBasicParam = {
		userId : pub.userId,
		source : pub.source,
		sign : pub.sign,
		tokenId : pub.tokenId
	};
	pub.options = {
		websitNode:'',
		
	}
	
	// 接口处理命名空间
	pub.apiHandle = {
		init:function(){
			if (pub.logined) {
				pub.apiHandle.page_show.init();
			}else{
				pub.apiHandle.get_code.init();
			}
			pub.apiHandle.get_code.init();
			//系统常量接口
			pub.apiHandle.system_config_constant.init();
		},
		get_code : {
			init:function(){
				common.ajaxPost({
					method:'business_city_get_by_area_code',
					areaCode:common.websitNode,
				 },function( d ){
					d.statusCode == "100000" && pub.apiHandle.get_code.apiData( d );
				});
			},
			apiData:function( d ){
				var o = d.data;
				pub.options.websitNode = o.websiteNode;
				$(".index_left").html(o.websiteName)
			}
		},
		page_show : {
			init:function(){
				common.ajaxPost({
					method:'main_page_show',
					websiteNode:common.WebsiteNode,
					sign:pub.sign,
					source:pub.source,
				 },function( d ){
					d.statusCode == "100000" && pub.apiHandle.page_show.apiData( d );
				});
			},
			apiDate:function( d ){
				
			}
		},
		system_config_constant : {
			init:function(){
				common.ajaxPost({
					method:'system_config_constant',
				 },function( d ){
					d.statusCode == "100000" && pub.apiHandle.get_code.apiData( d );
				});
			}
		}
	};
	
	//事件处理
	pub.eventHandle = {
		//时间初始化
		init:function(){
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
			/*点击切换主菜单*/
			$("#foot").on("click",".footer_item",function(){
				var isActive = $(this).is(".actived");
				if (!isActive) {
					common.jumpLinkPlain($(this).attr("data-url"))
				}
			})
			/*点击进入车详情*/
			$(".index_module").on("click",'.module_item',function(){
				var nood = $(this);
				common.jumpLinkPlain( "html/car_mall.html" )
			})
			/*点击进入客服中心*//*点击进入城市定位*/
			$(".index_left,.index_right").on("click",function(){
				var nood = $(this);
				if (nood.attr("data-url")) {
					common.jumpLinkPlain( $(this).attr("data-url") )
				}else{
					alert("暂缺，待定");
				}
			});
			/*点击进入子菜单*/
			$(".menu_nav dl.item").on("click",function(){
				var nood = $(this);
				if (nood.attr("data-url")) {
					common.jumpLinkPlain( $(this).attr("data-url") )
				}else{
					alert("暂缺，待定");
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