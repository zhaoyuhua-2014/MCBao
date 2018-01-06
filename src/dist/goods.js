
define(function(require, exports, module){
	
	
	var common = require('../dist/common');
	require("swiper")
	// 命名空间
	
	var pub = {};
	
	pub.module_id = $('[data-type]').attr('data-type');
    pub.logined = common.isLogin(); // 是否登录
	
	pub.local_websiteNode = common.websiteNode.getItem();//本地存储的websiteNode
	
    if( pub.logined ){
    	pub.userId = common.user_datafn().cuserInfo.id;
    	pub.source = "userId" + pub.userId;
    	pub.sign = md5( pub.source + "key" + common.secretKeyfn() ).toUpperCase();
    	pub.tokenId = common.tokenIdfn();
    	
    	pub.user_websiteNode = common.user_datafn().cuserInfo.websiteNode;//用户的websiteNode
    	
    }else{
        //common.jumpLinkPlain( '../index.html' );
    }
    pub.userBasicParam = {
		userId : pub.userId,
		source : pub.source,
		sign : pub.sign,
		tokenId : pub.tokenId
	};
	
	pub.options = {
		pageNo:common.PAGE_INDEX,
		pageSize:common.PAGE_SIZE,
		isEnd:'',
	}
	pub.options.websiteNode = pub.local_websiteNode ? pub.local_websiteNode : common.WebsiteNode;
	//商品相关逻辑
	pub.mall_goods = {
		init : function (){
			pub.loading = $(".click_load");
			pub.mall_goods.ads_show.init();
			pub.mall_goods.goods_first_type.init();
		},
		ads_show: {
			init:function(){
				common.ajaxPost($.extend({
					method:'ads_show',
					websiteNode:pub.options.websiteNode,
					adPositions:"app_home",//app_home-app_goods-app_insurance-车险分期
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.mall_goods.ads_show.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				for (var i in o) {
					html += '<div class="swiper-slide"><img src="'+o[i].adPic+'"/></div>'
				}
				$(".banner_wrap .mall_banner .swiper-wrapper").html(html);
				var swiper = new Swiper (".mall_banner", {
				    direction: 'horizontal',
				    loop: true,
				    autoplay:5000,
				});
			}
		}, 
		action_page_ads: {
			init:function(){
				common.ajaxPost($.extend({
					method:'action_page_ads',
					websiteNode:pub.options.websiteNode,
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
					websiteNode:pub.options.websiteNode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.mall_goods.goods_first_type.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				if (o.length != 0) {
					for (var i in o) {
						html += '<div class="mall_nav_item '+(i == 0 ? "actived" : "")+'" data-code="'+o[i].typeCode+'">'+o[i].typeName+'</div>'
					}
					$(".mall_nav").html(html);
					pub.first_type = o[0].typeCode;
					pub.mall_goods.goods_second_type.init();
				}else{
					$(".mall_nav").html(html);
				}
			}
		},
		goods_second_type :{
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_second_type',
					websiteNode:pub.options.websiteNode,
					typeCode:pub.first_type,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.mall_goods.goods_second_type.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				console.log(JSON.stringify(d))
				var o = d.data,html = '';
				if (o.length != 0) {
					for (var i in o) {
						html += '<div class="mall_subnav_item '+(i == 0 ? "actived" : "")+'" data-code="'+o[i].typeCode+'"><span>'+o[i].typeName+'</span></div>'
					}
					$(".mall_subnav").html(html);
					pub.second_type = o[0].typeCode;
					pub.mall_goods.goods_info_show2.init();
				}else{
					$(".mall_subnav").html(html);
				}
			}
		},
		goods_info_show : {//商品不分页
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_info_show',
					websiteNode:pub.options.websiteNode,
					typeCode:pub.second_type,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.mall_goods.goods_info_show.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data;
				
			}
		},
		goods_info_show2 : {//商品不分页
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_info_show2',
					websiteNode:pub.options.websiteNode,
					typeCode:pub.second_type,
					pageNo:pub.options.pageNo,
					pageSize:pub.options.pageSize,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.mall_goods.goods_info_show2.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var d = d.data,html = '';
				pub.options.isEnd = d.isLast;
				if (pub.options.pageNo == 1) {
					$(".mall_center_box").html('');
				}
				var html = '';
				console.log(d.objects)
				if (d.objects.length == '0') {
					pub.loading.hide();
					$(".mall_center_box").html("暂无商品数据！").css("line-height","100px").css("text-align","center").css("font-size","30px");
					return;
				} else{
					$(".mall_center_box").removeAttr("style")
					for ( i in d.objects ) {
						html +='<dl class="car_item mall_center_item clearfloat" data ="'+d.objects[i].id+'">'
						html +='	<dt><img src="'+d.objects[i].goodsLogo+'"/></dt>'
						html +='	<dd>'
						html +='		<h4>'+d.objects[i].goodsName+'</h4>'
						html +='		<div class="description">'+d.objects[i].goodsDescribe+'</div>'
						html +='		<div class="money">￥'+d.objects[i].mcbPrice+'</div>'
						html +='	</dd>'
						html +='</dl>'
					}
					$(".mall_center_box").append(html).find('.mall_center_item:last dd').css("border-bottom","none");
					if( pub.options.isEnd ){
						pub.loading.show().html("没有更多数据了！");
					}else{
						pub.loading.show().html("点击加载更多！");
					};
				}
			}
		},
		eventHandle:{
			init:function(){
				
				/*事件*/
				var nav = $(".mall_nav"),subNav = $(".mall_subnav"),mall_center = $(".mall_center");
				nav.on("click",'.mall_nav_item',function(){
					$(this).addClass("actived").siblings().removeClass("actived");
					pub.first_type = $(this).attr("data-code");
					pub.options.pageNo = '1';
					pub.options.pageSize = '10';
					pub.mall_goods.goods_second_type.init();
					subNav.html("");
					$(".mall_center_box").html("");
				});
				subNav.on("click",'.mall_subnav_item',function(){
					$(this).addClass("actived").siblings().removeClass("actived");
					pub.second_type = $(this).attr("data-code");
					pub.options.pageNo = '1';
					pub.options.pageSize = '10';
					pub.mall_goods.goods_info_show2.init();
					$(".mall_center_box").html("");
				})
				mall_center.on("click",'.mall_center_item ',function(){
					var nood = $(this),
						id = nood.attr("data");
					common.jumpLinkPlain("../html/car_mall.html"+"?id="+id)
				});
				mall_center.on("click",".click_load",function(){
					//点击加载更多
					/*e.stopPropagation()*/
					if (!pub.options.isEnd) {
						pub.options.pageNo ++;
						pub.mall_goods.goods_info_show2.init();
					}else{
						pub.loading.show().html("没有更多数据了！");
					}
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
			pub.loading = $(".click_load");
			pub.loading.hide();
			pub.search.goods_show_hot.init();
		},
		goods_show_hot : {
			init:function (){
				common.ajaxPost($.extend({
					method:'goods_show_hot',
				}, {} ),function( d ){
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
					websiteNode:pub.options.websiteNode,
					goodsName:pub.options.goodsName,
				}, {} ),function( d ){
					d.statusCode == "100000" && pub.search.goods_show_name.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function( d ){
				var o = d.data,html = '';
				if (o.length == 0) {
					$(".search_none").show().siblings().hide();
					return;
				}else{
					for(i in o){
						html += '<dl class="car_item mall_center_item clearfloat" data="'+o[i].id+'">'
						html += '	<dt><img src="'+o[i].goodsLogo+'"/></dt>'
						html += '	<dd>'
						html += '		<h4>'+o[i].goodsName+'</h4>'
						html += '		<div class="description">'+o[i].goodsName+'</div>'
						html += '		<div class="money">￥'+o[i].goodsName+'</div>'
						html += '	</dd>'
						html += '</dl>'
					}
					$('.mall_center').html( html ).show().siblings().hide();
				}
			}
		},
		eventHandle : {
			init:function(){
				/*$(".header_right").on("click",function(){
					pub.search.goods_show_name.init();
				});*/
				//点击热门搜索
				$(".search_item_list").on("click","li",function(){
					pub.options.goodsName = $(this).html();
					$("#search").val(pub.options.goodsName)
					searchText()
				});
				//点击搜索按钮
				$(".header_right").on("click",function(){
					pub.options.goodsName = $("#search").val().replace(/\s+/g,'');
					searchText()
				});
				//点击搜索键盘
				$("#search").on("keydown",function(e){
					if (e.which == 13) {
						pub.options.goodsName = $("#search").val().replace(/\s+/g,'');
						searchText()
					}
					if ($(this).val() == '') {
						$(".search_star").show().siblings().hide();
					}
				})
				//统一处理搜索
				function searchText (){
					if (pub.options.goodsName == '') {
						common.prompt("输入内容不能为空")
					} else{
						pub.search.goods_show_name.init();
					}
				}
				$("#search").on("focus",function(){
					$(this).parent().find(".icon_clear").show();
				})
				$("#search").on("blur",function(){
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
			pub.options.goodsId = common.getUrlParam('id');
			pub.goods.goods_get_by_id.init();
			//pub.goods.credit_assess_rcd_query.init();
			//pub.goods.credit_assess_rcd_show.init();
		},
		goods_get_by_id : {
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_get_by_id',
					//goodsId:pub.options.goodsId
					goodsId:pub.options.goodsId,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.goods.goods_get_by_id.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '',str='';
				
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
				//判断是否有折扣的图片
				if (o.planPics != "") {
					var arrPics = o.planPics.split("@")
					for (var i in arrPics) {
						if (arrPics[i] != "") {
							str += '<img src="'+arrPics[i]+'" />'
						}
					}
					$(".car_mall_top").html(str).show();
				}
				$(".car_mall_context").html(o.goodsContext);
				
				pub.options.evaluation = {
					carGoodId:o.id,//车id
					carPrice:o.mcbPrice,//车价格
					carDeposit:o.earnestDeposit,//车定金
					brandName:o.belongBrandName,//p品牌名称
				}
				
			}
		},
		eventHandle:{
			init:function(){
				$(".car_mall_footer li").on("click",function(){
					var index = $(this).index();
					if (index == 0) {
						window.history.back();
					}else{
						if (pub.logined) {
							localStorage.setItem("evaluation",JSON.stringify(pub.options.evaluation))
							common.jumpLinkPlain("../html/credit_evaluation.html");
						}else{
							common.jumpLinkPlain("../html/login.html");
						}
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
