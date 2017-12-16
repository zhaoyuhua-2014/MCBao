
define(function(require, exports, module){
	
	//require('jquery');
	var common = require('../dist/common');

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
	//我的页面逻辑
	pub.user = {
		init : function (){
			if (pub.logined) {
				pub.user.user_info.init();
			}
		},
		user_info: {
			init:function(){
				common.ajaxPost($.extend({
					method:'user_info_show',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.user.user_info.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data;
				var nood = $(".my_info_top");
				nood.find("dt img").attr("src",o.faceImgUrl ? o.faceImgUrl : "../img/bg_head@2x.png")
				nood.find("dd").html(o.petName);
			}
		},
		eventHandle:{
			init:function(){
				$(".my_center .my_center_item").on("click",function(){
					var nood = $(this);
					if (nood.attr("data-url")) {
						window.location.href = nood.attr("data-url")
					}
				})
				$(".my_info_nav .my_info_nav_item").on("click",function(){
					var nood = $(this);
					if (nood.attr("data-url")) {
						window.location.href = nood.attr("data-url")
					}
				})
				$("#foot").on("click",".footer_item",function(){
					var isActive = $(this).is(".actived");
					if (!isActive) {
						window.location.href = $(this).attr("data-url");
					}
				})
			}
		}
	};
	//我的红包资源
	pub.packet = {
		init : function (){
			pub.packet.coupon_info_show.init();
		},
		coupon_info_show: {
			init:function(){
				common.ajaxPost($.extend({
					method:'coupon_info_show',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.packet.coupon_info_show.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				if (o.length == 0) {
					$(".red_packet_list_box").html("还没有红包哦！").css({"text-align":"center","font-size":"50px","line-height":"80px"});
				}else{
					for (var i in o) {
						html += '<dl class="red_packet_item">'
						html += '	<dt class="float_left">安盛天平</dt>'
						html += '	<dd class="float_left">'
						html += '		<p><span style="color: #EC5330;font-size: 65px;">￥50</span><span style="color: #9E9E9E;font-size: 20px;padding-left: 15px;">满1000可用</span></p>'
						html += '		<p><span style="color: #d9aaaa;font-size: 24px;">有效期至：2017.12.31</span><span class="float_right" style="display: inline-block;background: url(../img/red_packet_txt@2x.png) no-repeat center;"></span></p>'
						html += '	</dd>'
						html += '</dl>'
					}
				}
			}
		},
		eventHandle:{
			init:function(){
				
			}
		}
	};
	//我的车库
	pub.garage = {
		init : function (){
			pub.packet.coupon_info_show.init();
		},
		coupon_info_show: {
			init:function(){
				common.ajaxPost($.extend({
					method:'coupon_info_show',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.packet.coupon_info_show.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				
			}
		},
		eventHandle:{
			init:function(){
				$(".garage_box").on("click",".garage_car_item dd",function(){
					var nood = $(this).parent();
					if (!nood.is(".actived")) {
						nood.addClass("actived").siblings().removeClass("actived")
					}
				})
				$(".garage_box").on("click",".garage_car_item dd .float_right.color_or",function(e){
					e.stopPropagation()
					window.location.href = "car_authentication.html"
				})
				$(".header_right").on("click",function(){
					window.location.href = "../html/car_info.html"
				})
			}
		}
	};
	//添加新车
	pub.addCar = {
		init : function (){
			pub.addCar.car_info_add.init();
		},
		car_info_add: {
			init:function(){
				common.ajaxPost($.extend({
					method:'car_info_add',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.packet.coupon_info_show.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				
			}
		},
		eventHandle:{
			init:function(){
				$(".garage_box").on("click",".garage_car_item dd",function(){
					var nood = $(this).parent();
					if (!nood.is(".actived")) {
						nood.addClass("actived").siblings().removeClass("actived")
					}
				})
				$(".garage_box").on("click",".garage_car_item dd .float_right.color_or",function(e){
					e.stopPropagation()
					window.location.href = "car_authentication.html"
				})
				$(".header_right").on("click",function(){
					window.location.href = "../html/car_info.html"
				})
			}
		}
	};
	//事件处理
	pub.eventHandle = {
		//时间初始化
		init:function(){
			$(".callback").on("click",function(){
				window.history.back();
			});
		}
	}
	pub.init = function(){
		
		if (pub.module_id == "user") {
    		pub.user.init()
			pub.user.eventHandle.init();
    	}else if (pub.module_id == "packet"){
    		pub.packet.init()
			pub.packet.eventHandle.init();
    	}else if (pub.module_id == "garage"){
    		pub.garage.init()
			pub.garage.eventHandle.init();
    	}else if (pub.module_id == ""){
    		pub.packet.init()
			pub.packet.eventHandle.init();
    	}else if (pub.module_id == ""){
    		pub.packet.init()
			pub.packet.eventHandle.init();
    	}else if (pub.module_id == ""){
    		pub.packet.init()
			pub.packet.eventHandle.init();
    	}
    	pub.eventHandle.init()
	};
	module.exports = pub;
})
