
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
	
	pub.options = {}
	
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
					d.statusCode != "100000" && common.prompt(d.statusStr);
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
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				for (var i in o) {
					html += '<div class="mall_nav_item '+(i == 0 ? "actived" : "")+'" data-code="'+o[i].typeCode+'">'+o[i].typeName+'</div>'
				}
				$(".mall_nav").html(html);
				pub.typeCode = o[0].typeCode;
				pub.mall_goods.goods_second_type.init();
			}
		},
		goods_second_type :{
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_second_type',
					websiteNode:common.WebsiteNode,
					typeCode:pub.typeCode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.mall_goods.goods_second_type.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				console.log(JSON.stringify(d))
				var o = d.data,html = '';
				for (var i in o) {
					html += '<div class="mall_subnav_item '+(i == 0 ? "actived" : "")+'" data-code="'+o[i].typeCode+'"><span>'+o[i].typeName+'</span></div>'
				}
				$(".mall_subnav").html(html);
				pub.typeCode = o[i].typeCode;
				pub.mall_goods.goods_info_show.init();
			}
		},
		goods_info_show : {
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_info_show',
					websiteNode:common.WebsiteNode,
					typeCode:'0103',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.mall_goods.goods_info_show.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
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
					d.statusCode != "100000" && common.prompt(d.statusStr);
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
					common.jumpLinkPlain("../html/car_mall.html")
				})
				$(".mall_header input").on("click",function(){
					common.jumpLinkPlain("../html/search.html")
				})
				$(".mall_header input").on("focus",function(){
					$(this).blur();
				})
			}
		}
	};
	
	//搜索页面处理;
	pub.search = {
		init:function(){
			pub.search.goods_show_hot.init();
		},
		goods_show_hot : {
			init:function (){
				common.ajaxPost($.extend({
					method:'goods_show_hot',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.search.goods_show_hot.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function( d ){
				var o = d.data,html = '';
				for(i in o){ 
					html += '<li>' + o[i].keyword + '</li>';
				}
				$('.search_item_list').html( html );
			}
		},
		goods_show_name : {
			init:function (){
				common.ajaxPost($.extend({
					method:'goods_show_name',
					websiteNode:common.WebsiteNode,
					goodsName:"车",
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.search.goods_show_name.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function( d ){
				var o = d.data,html = '';
				if (o.length == 0) {
					$(".search_none").show().siblings().hide();
					return;
				}
				for(i in o){
					html += '<dl class="car_item mall_center_item clearfloat">'
					html += '	<dt><img src="../img/goods_pic.png"/></dt>'
					html += '	<dd>'
					html += '		<h4>BMW 3系GT 一触即发</h4>'
					html += '		<div class="description"></div>'
					html += '		<div class="money">￥50,000.00</div>'
					html += '	</dd>'
					html += '</dl>'
					html += '<li>' + o[i].keyword + '</li>';
				}
				$('.mall_center').html( html );
			}
		},
		eventHandle : {
			init:function(){
				$(".header_right").on("click",function(){
					pub.search.goods_show_name.init();
				});
				$(".search_item_list").on("click","li",function(){
					
				});
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
				})
				
			}
		}
	};
	
	//商品详情页面
	pub.goods = {
		init:function(){
			require("LayerCss");
			require("LayerJs");
			pub.goods.goods_get_by_id.init();
			pub.goods.credit_assess_rcd_query.init();
			pub.goods.credit_assess_rcd_show.init();
		},
		goods_get_by_id : {
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_get_by_id',
					//goodsId:pub.options.goodsId
					goodsId:"1"
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.goods.goods_get_by_id.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
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
				
				console.log(JSON.stringify(d));
				$(".car_mall_context").html(o.goodsContext)
				
			}
		},
		credit_assess_rcd_add : {
			init:function(){
				common.ajaxPost($.extend({
					method:'credit_assess_rcd_add',
					websiteNode:common.WebsiteNode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.goods.credit_assess_rcd_add.apiData( d );
				});
				
			},
			apiData:function( d ){
				$(".alert_msg").removeClass("hidden");
			}
		},
		credit_assess_rcd_query : {
			init:function(){
				common.ajaxPost($.extend({
					method:'credit_assess_rcd_query',
					//goodsId:pub.options.goodsId
					goodsId:"1"
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.goods.credit_assess_rcd_query.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
			}
		},
		credit_assess_rcd_show : {
			init:function(){
				common.ajaxPost($.extend({
					method:'credit_assess_rcd_show',
					//goodsId:pub.options.goodsId
					id:"1",
					tokenId:pub.tokenId,
				}, {}),function( d ){
					d.statusCode == "100000" && pub.goods.credit_assess_rcd_show.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
			}
		},
		
		eventHandle:{
			init:function(){
				$(".car_mall_footer li").on("click",function(){
					var index = $(this).index();
					if (index == 0) {
						window.history.back();
					}else{
						//创建信用评估
						var evaluation = {
							belongUser : '123',//属于哪个用户
							ownerFidPicUrl:'',//自己身份证正面图片URL
							ownerBidPicUrl:'',//自己身份证反面图片URL
							isSingle : '0',//是否单身
							spouseFidPicUrl : '',//夫妻身份证正面图片URL
							spouseBidPicUrl : '',//夫妻身份证反面图片URL
							
							buycarDate:'123',//买车日期
							
							buycarCity:'3301',//提车城市
							regcar_city:'0012',//上牌城市
							carGoodId:'1',//车id
							
							carPrice:'100',//车价格
							carDeposit:'123',//车定金
							carDownPay:'123',//车首付
							carLoan:'123',//车贷款
							brandName:'123',//p品牌名称
							
						};
						
						
						var status = prompt("输入对应的状态？\n 0表示还没有上传身份证信息;\n 1表示征信已查询未通过（15日内）\n 2表示审核中 \n 3表示征信已查询良好（15日内有效）");
						if (status == 0) {
							common.jumpLinkPlain("../html/credit_evaluation.html")
						}else if(status == 1){
							layer.open({
								content: '征信已查询但是未通过,重新认证。',
		    					btn: ['确定', '取消'],
		    					yes: function(index){
		    						common.jumpLinkPlain("../html/credit_evaluation.html")
							    	layer.close(layerIndex)
		    					}
							})
						}else if(status == 2){
							common.prompt("征信正在努力审核中")
						}else if(status == 3){
							common.jumpLinkPlain("../html/car_reserve.html");
						};
						
					}
				})
			}
		}
	}
	//车辆预定页面
	pub.carReserve = {
		init:function(){
			
		},
		goods_get_by_id : {
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_get_by_id',
					//goodsId:pub.options.goodsId
					goodsId:"1"
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.carReserve.goods_get_by_id.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
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
		eventHandle : {
			init:function(){
				$(".right_text").on("click",function(){
					pub.Back = 2;
					var n = pub.Back;
    				common.jumpHistryBack(n);
				})
				$(".payment_submit .submit_btn90").on("click",function(){
					common.jumpLinkPlain("../html/line_payment.html");
				})
				
			}
		}
	}
	//事件处理
	pub.eventHandle = {
		//事件初始化
		init:function(){
			$(".callback").on("click",function(){
				var n = pub.Back;
    			common.jumpHistryBack(n);
			});
		}
	}
	pub.init = function(){
		
		if (pub.module_id == "mall_goods") {
    		pub.mall_goods.init()
			pub.mall_goods.eventHandle.init();
    	}else if (pub.module_id == "search"){
    		pub.search.init()
			pub.search.eventHandle.init();
    	}else if (pub.module_id == "goods"){
    		pub.goods.init()
			pub.goods.eventHandle.init();
    	}else if (pub.module_id == "carReserve"){
    		pub.carReserve.init()
			pub.carReserve.eventHandle.init();
    	}
    	pub.eventHandle.init()
	};
	module.exports = pub;
})
