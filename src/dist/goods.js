
define(function(require, exports, module){
	
	
	var common = require('../dist/common');
	require("swiper")
	// 命名空间
	
	var pub = {};
	
	pub.module_id = $('[data-type]').attr('data-type');
    pub.logined = common.isLogin(); // 是否登录
	
    if( pub.logined ){
    	pub.userId = common.user_datafn().cuserInfo.id;
    	pub.source = "userId" + pub.userId;
    	pub.sign = md5( pub.source + "key" + common.secretKeyfn() ).toUpperCase();
    	pub.tokenId = common.tokenIdfn();
    }else{
        //common.jumpLinkPlain( '../index.html' );
    }
    pub.userBasicParam = {
		userId : pub.userId,
		source : pub.source,
		sign : pub.sign,
		tokenId : pub.tokenId
	};
	
	
	//商品相关逻辑
	pub.mall_goods = {
		init : function (){
			
			pub.mall_goods.action_page_ads.init();
			pub.mall_goods.goods_first_type.init();
		},
		action_page_ads: {
			init:function(){
				common.ajaxPost($.extend({
					method:'action_page_ads',
					websiteNode:common.WebsiteNode,
					
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.mall_goods.action_page_ads.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data;
				
			}
		},
		goods_first_type : {
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_first_type',
					websiteNode:common.WebsiteNode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.mall_goods.goods_first_type.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data;
				
			}
		},
		goods_second_type :{
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_second_type',
					websiteNode:common.WebsiteNode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.mall_goods.goods_first_type.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data;
				
			}
		},
		goods_info_show2 : {
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_info_show2',
					websiteNode:common.WebsiteNode,
					typeCode:pub.options.typeCode,
					pageNo:pub.options.pageNo,
					pageSize:pub.options.pageSize,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.mall_goods.goods_first_type.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data;
				
			}
		},
		goods_show_name : {
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_show_name',
					websiteNode:common.WebsiteNode,
					goodsName:pub.options.goodsName
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.mall_goods.user_info.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data;
			}
		},
		eventHandle:{
			init:function(){
				var swiper = new Swiper (".mall_banner", {
				    direction: 'horizontal',
				    loop: true,
				    autoplay:5000,
				});
				/*事件*/
				var nav = $(".mall_nav"),subNav = $(".mall_subnav"),mall_center = $(".mall_center");
				nav.on("click",'.mall_nav_item',function(){
					$(this).addClass("actived").siblings().removeClass("actived")
				})
				subNav.on("click",'.mall_subnav_item',function(){
					$(this).addClass("actived").siblings().removeClass("actived")
				})
				mall_center.on("click",'.mall_center_item ',function(){
					
					window.location.href = "../html/car_mall.html"
				})
				
			}
		}
	};
	
	
	//商品详情页面
	pub.goods = {
		init:function(){
			pub.goods.goods_get_by_id.init();
		},
		goods_get_by_id : {
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_get_by_id',
					//goodsId:pub.options.goodsId
					goodsId:"1"
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.goods.goods_get_by_id.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				
				//商品信息
				html+= '<dl class="car_item clearfloat">'
				html+= '	<dt><img src="'+ o.goodsLogo +'"/></dt>'
				html+= '	<dd>'
				html+= '		<h4>'+ o.goodsName +'</h4>'
				html+= '		<div class="description">'+ o.goodsDescribe +'</div>'
				html+= '		<div class="money">￥'+ o.mcbPrice +'</div>'
				html+= '	</dd>'
				html+= '</dl>'
				$(".car_mall_info").html(html);
				
			}
		},
		eventHandle:{
			init:function(){
				$(".car_mall_footer li").on("click",function(){
					var index = $(this).index();
					if (index == 0) {
						window.history.back();
					}else{
						
					}
				})
			}
		}
	}
	//事件处理
	pub.eventHandle = {
		//事件初始化
		init:function(){
			$(".callback").on("click",function(){
				window.history.back();
			});
		}
	}
	pub.init = function(){
		
		if (pub.module_id == "mall_goods") {
    		pub.mall_goods.init()
			pub.mall_goods.eventHandle.init();
    	}else if (pub.module_id == "goods"){
    		pub.goods.init()
			pub.goods.eventHandle.init();
    	}
    	pub.eventHandle.init()
	};
	module.exports = pub;
})
