
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
				var o = d.data,html = '';
				for (var i in o) {
					html += '<div class="mall_nav_item '+(i == 0 ? "actived" : "")+'" data-code="'+o[i].typeCode+'">'+o[i].typeName+'</div>'
				}
				$(".mall_nav").html(html);
				pub.typeCode = o[i].typeCode;
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
				pub.mall_goods.goods_second_type.init();
			}
		},
		goods_info_show : {
			init:function(){
				common.ajaxPost($.extend({
					method:'goods_info_show',
					websiteNode:common.WebsiteNode,
					typeCode:pub.options.typeCode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.mall_goods.goods_info_show.apiData( d );
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
						var status = prompt("输入对应的状态？\n 0表示还没有上传身份证信息;\n 1表示征信已查询未通过（15日内）\n 2表示审核中 \n 3表示征信已查询良好（15日内有效）");
						if (status == 0) {
							common.jumpLinkPlain("../html/credit_evaluation.html")
						}else if(status == 1){
							
						}else if(status == 2){
							
						}else if(status == 3){
							
						}
					}
				})
			}
		}
	}
	//信用评估页面
	pub.creditEvaluation = {
		init : function(){
			
		},
		idcard_img_upload : {
			init:function(){
				
				common.ajaxPost($.extend({
					method:'idcard_img_upload',
					goodsId:"1"
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.creditEvaluation.idcard_img_upload.apiData( d );
				});
				
			},
			apiData:function( d ){
				
			}
		},
		eventHandle : {
			init:function(){
				$(".radio_marry").on("click","span",function(){
					$(this).addClass("actived").siblings().removeClass("actived");
					$("input[name='marry']").val($(this).index())
				});
				$(".updata_card_info").on("change",".car_img",function(){
					console.log($(this).attr("name"))//car_img1表示正面car_img表示反面
					var nodes = $(this).parent();
		        	var tar = this,
					files = tar.files,
					fNum = files.length,
					URL = window.URL || window.webkitURL,
					file = files[0];
					if( !file ) return;
					var fr = new FileReader();
					if (nodes.find(".comment_good_image").length) {
						var span = nodes.find(".comment_good_image");
					}else{
						var span = document.createElement("span");
						span.className = "comment_good_image"
		            	span.innerHTML = '<img src="../img/logo@2x.png"/>';
		            	nodes.append(span)
					}
					
					fr.onload = function () {
		                var result = this.result;
		                var img = new Image();
		                img.src = result;
						// 图片加载完毕之后进行压缩，然后上传
		                if (img.complete) {
		                    callback();
		                } else {
		                    img.onload = callback;
		                }
		
		                function callback() {
		                	var data = compress(img)
		                    $(span).find("img").attr("src",result);
		                    img = null;
		                }
		
		            };
	                fr.readAsDataURL(file);
				});
				function compress(img) {
			        var initSize = img.src.length;
			        var width = img.width;
			        var height = img.height;
					var canvas = document.createElement("canvas");
			        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
			        var ratio;
			        if ((ratio = width * height / 4000000)>1) {
			            ratio = Math.sqrt(ratio);
			            width /= ratio;
			            height /= ratio;
			        }else {
			            ratio = 1;
			        }
			
			        canvas.width = width;
			        canvas.height = height;
					var ctx = canvas.getContext("2d");
					//        铺底色
			        ctx.fillStyle = "#fff";
			        ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			        //如果图片像素大于100万则使用瓦片绘制
			        var count;
			        var tCanvas = document.createElement("canvas");
					var tctx = tCanvas.getContext('2d')
			        if ((count = width * height / 1000000) > 1) {
			            count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片
			
						//            计算每块瓦片的宽和高
			            var nw = ~~(width / count);
			            var nh = ~~(height / count);
						
			            tCanvas.width = nw;
			            tCanvas.height = nh;
			            for (var i = 0; i < count; i++) {
			                for (var j = 0; j < count; j++) {
			                    tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
			
			                    ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
			                }
			            }
			        } else {
			            ctx.drawImage(img, 0, 0, width, height);
			        }
			
			        //进行最小压缩
			        var ndata = canvas.toDataURL('image/jpeg', 0.1);
			
			        console.log('压缩前：' + initSize);
			        console.log('压缩后：' + ndata.length);
			        console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
			
			        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
			
			        return ndata;
			    };
		        function upload(basestr, type, $li) {
			        var text = window.atob(basestr.split(",")[1]);
			        var buffer = new ArrayBuffer(text.length);
			        var ubuffer = new Uint8Array(buffer);
			        var pecent = 0 , loop = null;
			
			        for (var i = 0; i < text.length; i++) {
			            ubuffer[i] = text.charCodeAt(i);
			        }
			
			        var Builder = window.WebKitBlobBuilder || window.MozBlobBuilder;
			        var blob;
			
			        if (Builder) {
			            var builder = new Builder();
			            builder.append(buffer);
			            blob = builder.getBlob(type);
			        } else {
			            blob = new window.Blob([buffer], {type: type});
			        }
					var formdata = new FormData();
			        formdata.append('imagefile', blob);
			        
			    };
		        //计算图片文件的大小
				function imgsize(str){
					var str=str.substring(22);
					var equalIndex= str.indexOf('=');
					if(str.indexOf('=')>0){
					    str=str.substring(0, equalIndex);
					}
					var strLength=str.length;
					var fileLength=parseInt(strLength-(strLength/8)*2);
					return fileLength
				}
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
    	}else if (pub.module_id == "creditEvaluation"){
    		pub.creditEvaluation.init()
			pub.creditEvaluation.eventHandle.init();
    	}
    	pub.eventHandle.init()
	};
	module.exports = pub;
})
