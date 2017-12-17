
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
	pub.options = {};
	//我的页面逻辑
	pub.user = {
		init : function (){
			if (pub.logined) {
				pub.user.user_info.init();
			}else{
				var nood = $(".my_info_top");
				nood.find("dt").html("<img src='../img/bg_head@2x.png' />");
				nood.find("dd").html("<a href='login.html'>登录</a>/<a href='regsiter.html'>注册</a>");
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
				nood.find("dt").html("<img class='true' src='"+ (o.faceImgUrl ? o.faceImgUrl : '../img/bg_head@2x.png') +"' />");
				nood.find("dd").html(o.petName);
			}
		},
		user_update_pwd : {
			init:function(){
				common.ajaxPost($.extend({
					method:'user_update_pwd',
					oldPassWord:'oldPassWord',
					newPassWord:'newPassWord',
					confirmPassword:'confirmPassword',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.user.user_update_pwd.apiData( d );
				});
			},
			apiData:function( d ){
				
			}
		},
		eventHandle:{
			init:function(){
				$(".my_center .my_center_item").on("click",function(){
					var nood = $(this);
					if (nood.attr("data-url")) {
						common.jumpLinkPlain( nood.attr("data-url") )
					}
				})
				$(".my_info_nav .my_info_nav_item").on("click",function(){
					var nood = $(this);
					if (nood.attr("data-url")) {
						common.jumpLinkPlain( nood.attr("data-url") )
					}
				})
				$("#foot").on("click",".footer_item",function(){
					var isActive = $(this).is(".actived");
					if (!isActive) {
						common.jumpLinkPlain( $(this).attr("data-url") )
					}
				});
				$(".my_info_top").on("click","img.true",function(){
					common.jumpLinkPlain( "../html/my_info.html" )
				})
			}
		}
	};
	//用户信息修改退出登录
	pub.myInfo = {
		init : function (){
			
		},
		face_img_upload : {
			init:function(){
				common.ajaxPost($.extend({
					method:'face_img_upload',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.myInfo.face_img_upload.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				
			}
		},
		user_logout : {
			init:function(){
				common.ajaxPost($.extend({
					method:'user_logout',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.myInfo.user_logout.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				
			}
		},
		eventHandle:{
			init:function(){
				$(".my_info .list_item").on("click",".float_right.icon",function(){
					var isImg = $(this).is(".img"),
						isName = $(this).is(".user_name"),
						isPhone = $(this).is(".user_phone");
					if (isImg) {
						
					} else if(isName){
						common.jumpLinkPlain( "../html/edit_name.html" )
					} else if(isPhone){
						common.jumpLinkPlain( "../html/edit_phoneNumber.html" )
					}
				})
			}
		}
	};
	pub.editName = {
		init:function(){
			
		},
		user_info_update: {
			init:function(){
				common.ajaxPost($.extend({
					method:'user_info_update',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.editName.user_info_update.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				
			}
		},
		eventHandle:{
			init:function(){
				$("input").on("focus",function(){
					$(this).parent().find(".icon_clear").show();
				})
				$("input").on("blur",function(){
					var nood= $(this)
					setTimeout(function(){
						nood.parent().find(".icon_clear").hide();
					},10)
				})
				$(".icon_clear").on("click",function(){
					$(this).parent().find("input").val("");
					$(".search_star").show().siblings().hide()
				});
				$(".header_right").on("click",function(){
					pub.options.name = $(".revise_name input").val();
					if (pub.options.name == '') {
						common.prompt("用户昵称不能为空");
						return;
					}
					pub.editName.user_info_update.init();
				})
			}
		}
	}
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
			pub.garage.coupon_info_show.init();
		},
		coupon_info_show: {
			init:function(){
				common.ajaxPost($.extend({
					method:'coupon_info_show',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.garage.coupon_info_show.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				if (o.length == 0) {
					//$(".garage_box").html("车库空空如也！").css({"text-align":"center","font-size":"50px","line-height":"80px"});
				}else{
					
				}
				init();
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
					common.jumpLinkPlain( "car_authentication.html" )
				})
				$(".header_right").on("click",function(){
					common.jumpLinkPlain( "../html/car_info.html" )
				})
			}
		}
	};
	//添加新车
	pub.addCar = {
		init : function (){
			pub.addCar.brand_version_query.init();
		},
		car_info_add: {
			init:function(){
				common.ajaxPost($.extend({
					method:'car_info_add',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.addCar.car_info_add.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				
			}
		},
		brand_version_query : {
			init:function(){
				common.ajaxPost($.extend({
					method:'brand_version_query',
					brandId:"1",//brandId
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.addCar.brand_version_query.apiData( d );
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				
			}
		},
		eventHandle:{
			init:function(){
				$("#car_brand,#car_model").on("focus",function(){
					$(this).blur();
				})
				$("#car_brand").on("click",function(){
					common.jumpLinkPlain( "../html/car_brand.html" )
				})
				$("#car_model").on("click",function(){
					
				})
			}
		}
	};
	//汽车品牌选择
	pub.carBrand = {
		init:function(){
			pub.carBrand.brand_info_query.init();
		},
		brand_info_query:{
			init:function(){
				common.ajaxPost($.extend({
					method:'brand_info_query',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.carBrand.brand_info_query.apiData( d );
				});
			},
			apiData:function( d ){
				
			}
		},
		eventHandle:{
			init:function(){
				
			}
		}
	}
	//事件处理
	pub.eventHandle = {
		//时间初始化
		init:function(){
			$(".callback").on("click",function(){
				var n = pub.Back;
    			common.jumpHistryBack(n);
			});
		}
	}
	pub.init = function(){
		
		if (pub.module_id == "user") {
    		pub.user.init()
			pub.user.eventHandle.init();
    	}else if (pub.module_id == "myInfo"){
    		pub.myInfo.init()
			pub.myInfo.eventHandle.init();
    	}else if (pub.module_id == "packet"){
    		pub.packet.init()
			pub.packet.eventHandle.init();
    	}else if (pub.module_id == "garage"){
    		pub.garage.init()
			pub.garage.eventHandle.init();
    	}else if (pub.module_id == "myInfo"){
    		pub.myInfo.init()
			pub.myInfo.eventHandle.init();
    	}else if (pub.module_id == "editName"){
    		pub.editName.init()
			pub.editName.eventHandle.init();
    	}else if (pub.module_id == "addCar"){
    		pub.addCar.init()
			pub.addCar.eventHandle.init();
    	}else if (pub.module_id == "carBrand"){
    		pub.carBrand.init()
			pub.carBrand.eventHandle.init();
    	}
    	pub.eventHandle.init()
	};
	module.exports = pub;
	//左滑出现删除按钮
    function init() {
        // 设定每一行的宽度=屏幕宽度+按钮宽度
        $(".line-scroll-wrapper").width($(".line-wrapper").width() + $(".line-btn-delete").width());
        // 设定常规信息区域宽度=屏幕宽度
        $(".line-normal-wrapper").width($(".line-wrapper").width());
        // 设定文字部分宽度（为了实现文字过长时在末尾显示...）
        //$(".line-normal-msg").width($(".line-normal-wrapper").width() - 280);
        // 获取所有行，对每一行设置监听
        var lines = $(".line-normal-wrapper");
        var len = lines.length;
        var lastX, lastXForMobile;
        // 用于记录被按下的对象
        var pressedObj; // 当前左滑的对象
        var lastLeftObj; // 上一个左滑的对象
        // 用于记录按下的点
        var start;
        // 网页在移动端运行时的监听
        for(var i = 0; i < len; ++i) {
            lines[i].addEventListener('touchstart', function(e) {
                lastXForMobile = e.changedTouches[0].pageX;
                pressedObj = this; // 记录被按下的对象 

                // 记录开始按下时的点
                var touches = event.touches[0];
                start = {
                    x: touches.pageX, // 横坐标
                    y: touches.pageY // 纵坐标
                };
            });
            lines[i].addEventListener('touchmove', function(e) {
                // 计算划动过程中x和y的变化量
                var touches = event.touches[0];
                delta = {
                    x: touches.pageX - start.x,
                    y: touches.pageY - start.y
                };

                // 横向位移大于纵向位移，阻止纵向滚动
                if(Math.abs(delta.x) > Math.abs(delta.y)) {
                    event.preventDefault();
                }
            });
            lines[i].addEventListener('touchend', function(e) {
                if(lastLeftObj && pressedObj != lastLeftObj) { // 点击除当前左滑对象之外的任意其他位置
                    $(lastLeftObj).animate({
                        marginLeft: "0"
                    }, 500); // 右滑
                    lastLeftObj = null; // 清空上一个左滑的对象
                }
                var diffX = e.changedTouches[0].pageX - lastXForMobile;
                if(diffX < -150) {
                    $(pressedObj).animate({
                        marginLeft: "-200px"
                    }, 500); // 左滑
                    lastLeftObj && lastLeftObj != pressedObj &&
                        $(lastLeftObj).animate({
                            marginLeft: "0"
                        }, 500); // 已经左滑状态的按钮右滑
                    lastLeftObj = pressedObj; // 记录上一个左滑的对象
                } else if(diffX > 150) {
                    if(pressedObj == lastLeftObj) {
                        $(pressedObj).animate({
                            marginLeft: "0"
                        }, 500); // 右滑
                        lastLeftObj = null; // 清空上一个左滑的对象
                    }
                }
            });
        }
    }
})
