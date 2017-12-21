
define(function(require, exports, module){
	
	require('jquery');
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
	//我的车库
	pub.garage = {
		init : function (){
			require("LayerCss");
			require("LayerJs");
			pub.garage.coupon_info_show.init();
		},
		coupon_info_show: {
			init:function(){
				common.ajaxPost($.extend({
					method:'coupon_info_show',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.garage.coupon_info_show.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
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
		car_info_delete : {
			init:function(){
				common.ajaxPost($.extend({
					method:'car_info_delete',
					carId:"01"
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.garage.car_info_delete.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				$(".garage_box .line-wrapper").eq(pub.nood.index()).remove();
			}
		},
		eventHandle:{
			init:function(){
				$(".garage_box").on("click",".garage_car_item dd",function(){
					console.log("click")
					var nood = $(this).parents(".line-wrapper");
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
				$(".garage_box").on("click",".line-btn-delete",function(e){
					pub.nood = $(this).parents(".line-wrapper");
					console.log(pub.nood.attr("dataid"))
					console.log(pub.nood.index())
					//
    				var layerIndex = layer.open({
    					content: '您确定要删除该车吗？',
    					btn: ['确定', '取消'],
    					yes: function(index){
    						pub.garage.car_info_delete.init();
					    	layer.close(layerIndex)
    					}
    				})
				})
			}
		}
	};
	//添加新车
	pub.addCar = {
		init : function (){
			//pub.addCar.brand_version_query.init();
		},
		car_info_add: {
			init:function(){
				common.ajaxPost($.extend({
					method:'car_info_add',
					pkUser:"3",
					carBrand:'01',
					carBrandCode:'01',
					carNo:"carNo",
					carNoCity:"carNoCity",
					carNoProvince:"carNoProvince",
					ownerName:"ownerName",
					carType:"1",
					carBrandKind:"01",
					carBrandKindCode:"01",
					tokenId:pub.tokenId,
				}, {} ),function( d ){
					d.statusCode == "100000" && pub.addCar.car_info_add.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				console.log("成功")
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
					var str = $("#car_brand").val();
					if (!str) {
						common.prompt("请先选择品牌")
					}
				});
				$(".submit_btn90").on("click",function(){
					pub.addCar.car_info_add.init();
				})
			}
		}
	};
	//汽车品牌选择
	pub.carBrand = {
		init:function(){
			pub.carBrand.brand_hot_query.init();
			pub.carBrand.brand_info_query.init();
		},
		brand_info_query:{
			init:function(){
				common.ajaxPost($.extend({
					method:'brand_info_query',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.carBrand.brand_info_query.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function( d ){
				
			}
		},
		brand_hot_query : {
			init:function(){
				common.ajaxPost($.extend({
					method:'brand_hot_query',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.carBrand.brand_hot_query.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function( d ){
				
			}
		},
		brand_version_query:{
			init:function(){
				common.ajaxPost($.extend({
					method:'brand_version_query',
					brandId:"1"
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.carBrand.brand_version_query.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function( d ){
				console.log(JSON.stringify(d))
				$("#mask").addClass("actived");
				$("body").css("overflow-y","hidden")
				$(".car_brand_fiexd").animate({
					"left":"120px",
				})
			}
		},
		eventHandle:{
			init:function(){
				//点击热门品牌项
				$(".car_brand_hot_wrap").on("click","dl",function(){
					pub.carBrand.brand_version_query.init();
				})
				$('.car_brand_list_wrap').on("click",".car_brand_list_item",function(){
					pub.carBrand.brand_version_query.init();
				})
				$("#mask").on("click",function(){
					if ($(this).is(".actived")) {
						$(".car_brand_fiexd").animate({
							"left":"750px",
						});
						$("#mask").animate({"background":"rgba(0,0,0,0)"},function(){
							$("#mask").removeClass("actived")
							$("body").css("overflow-y","auto")
						})
					}
				});
				$(".car_brand_list_retrieval").on("click","a",function(){
					var a = $(this).attr("href");
					var l = pub.options.histry;
					if (l.length > 0) {
						if (l[l.length -1] != a) {
							l.push(a);
						}
					}else{
						l.push(a);
					}
					pub.Back = l.length + 1;
				})
				$(".car_brand_fiexd").on("click",".list_item",function(){
					common.jumpHistryBack(pub.Back);
				})
			}
		}
	};
	//投保认证选择车辆
	pub.selectCar = {
		init:function(){
			
		},
		eventHandle : {
			init:function(){
				$(".garage_box").on("click",".garage_car_item",function(){
					var nood = $(this);
					if (!nood.is(".actived")) {
						nood.addClass("actived").siblings().removeClass("actived")	
					}
				})
				$(".submit_btn90").on("click",function(){
					var status = prompt("输入对应的状态？\n 0表示车和身份证信息都没有认证;\n 1表示车认证，身份证信息没有认证\n 2表示表示车没有认证，身份证信息已认证 \n 3表示认证中");
						if (status == 0) {
							alert("0表示车和身份证信息都没有认证");
							common.jumpLinkPlain("../html/updata_card.html?status="+status)
						}else if(status == 1){
							alert("表示车认证，身份证信息没有认证");
							common.jumpLinkPlain("../html/updata_card.html?status="+status)
						}else if(status == 2){
							alert("2表示表示车没有认证，身份证信息已认证 ");
							common.jumpLinkPlain("../html/updata_card.html?status="+status)
						}else if(status == 3){
							common.prompt("认证审核中")
						}
					
				})
			}
		}
	}
	
	
	
	//事件处理
	pub.eventHandle = {
		init:function(){
			$(".callback").on("click",function(){
				var n = pub.Back;
    			common.jumpHistryBack(n);
			});
		}
	}
	
	pub.init = function(){
		if (pub.module_id == "garage"){
    		pub.garage.init()
			pub.garage.eventHandle.init();
    	}else if (pub.module_id == "addCar"){
    		pub.addCar.init()
			pub.addCar.eventHandle.init();
    	}else if (pub.module_id == "carBrand"){
    		pub.carBrand.init()
			pub.carBrand.eventHandle.init();
    	}else if (pub.module_id == "selectCar"){
    		pub.selectCar.init()
			pub.selectCar.eventHandle.init();
    	}
		pub.eventHandle.init();
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