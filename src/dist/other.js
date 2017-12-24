
define(function(require, exports, module){
	
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
	
	//客服中心
	pub.clientServiceCenter = {
		init:function(){
			
		},
		eventHandle:{
			init:function(){
				//点击进入意见反馈
				$(".right_text").on("click",function(){
					common.jumpLinkPlain("../html/feedback.html")
				});
				//点击跳转具体问题
				$(".client_server_center_top").on("click",".client_server_center_top_item",function(){
					console.log($(this).html());
				});
				//点击切换不同的类型
				$(".client_server_center_nav").on("click","dl",function(){
					
				})
			}
		}
	}
	//城市站点选择
	pub.changeCity = {
		init:function(){
			window.onload = function(){
				/*定位*/
				var result = window._DEFAULT_CITY
				if (!$("#position").is("success")) {
					$("#position").html(result.city).addClass("success");
				}
				/*$(".pos_btn").on("click",function(){
					getCurLocation();
				})
				var geolocation = new qq.maps.Geolocation();
				var options = {timeout: 9000};
		        var positionNum = 0;
		 		function getCurLocation() {
		            geolocation.getLocation(showPosition, showErr, options);
		        }
		        function showPosition(position) {
		            positionNum ++;
					console.log("序号：" + positionNum)
					console.log(JSON.stringify(position, null, 4));
		        };
		  		function showErr() {
		            $("#position").html("定位失败").addClass("error");
		        };*/
				/*点击重新定位*/
				$("#position").on("click",function(){
					if ($(this).is(".error")) {
						getCurLocation();
					}
				})
			}
			pub.changeCity.business_city.init();
		},
		business_city:{
			init:function(){
				common.ajaxPost({
					method:'business_city',
				},function( d ){
					d.statusCode == "100000" && pub.changeCity.business_city.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData:function(d){
				var d = d.data,all = d.allCity,hot = d.hotCity;
				pub.changeCity.business_city.allCity(all);
				pub.changeCity.business_city.hotCity(hot);
			},
			allCity:function(d){
				var html = '';
				html +='<div class="citys_letter">'
				html +='	<div class="city_first_letter">'
				html +='		<a name="A">所有站点</a>'
				html +='	</div>'
				html +='	<div class="city_list_box">'
				
				for (var i in d) {
				html +='		<div class="city_list_item" data = "'+d[i].websiteNode+'">'+d[i].websiteName+'</div>'
				}
				html +='	</div>'
				html +='</div>'
				
				$(".all_city").html(html);
			},
			hotCity:function(d){
				var html = '';
				for (var i in d) {
					html += '<span class="city_item" data = "'+d[i].websiteNode+'">'+d[i].websiteName+'</span>'
				}
				$(".hot_city .city_box").html(html);
			}
		},
		eventHandle:{
			init:function(){
				var 
				wh = document.documentElement.clientHeight;
				$(".changecity_content").css("overflow-y","auto")
				$(".changecity_content").height(wh-186);
				console.log("124")
				$("#position").on("click",function(){
					if ($("#position").is(".success")) {
						console.log("带回城市:"+$(this).html()+"返回首页")
					}
				});
				$('.hot_city').on("click",".city_item",function(){
					common.jumpHistryBack();
				})
				$(".all_city").on("click",".city_list_item",function(){
					common.jumpHistryBack();
				})
			}
		}
	}
	
	//设置页面
	pub.setUp = {
		init:function(){
			
		},
		version_check:{
			init:function(){
				common.ajaxPost($.extend({
					method:'version_check',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.setUp.version_check.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData:function(d){
				console.log(d)
			}
		},
		eventHandle : {
			init:function(){
				$(".set_box .list_item").on("click",function(){
					var nood = $(this);
					if (nood.attr("data-url")) {
						common.jumpLinkPlain( nood.attr("data-url") );
					}else{
						if (nood.is("#version_check")) {
							pub.setUp.version_check.init();
						}else if(nood.is("#clear_data")){
							pub.othre.init();
						}
					}
				})
			}
		}
	}
	//找回密码-验证身份
	pub.validateUser = {
		init:function(){
			
		},
		eventHandle:{
			init:function(){
				
			}
		}
	}
	//设置新密码
	pub.setNewPassword = {
		init:function(){
			
		},
		eventHandle:{
			init:function(){
				
			}
		}
	}
	//其他接口
	pub.othre = {
		init:function(){
			pub.othre.mcb_desc.init();
			pub.othre.off_item_desc.init();
			pub.othre.share_rcd_query.init();
			pub.othre.system_config_constant.init();
			pub.othre.img_base64.init();
			pub.othre.imInfo.init();
		},
		mcb_desc:{
			init:function(){
				common.ajaxPost($.extend({
					method:'mcb_desc',
					code:"01",
					websiteNode:pub.WebsiteNode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.othre.mcb_desc.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData:function(d){
				console.log(d)
			}
		},
		off_item_desc:{
			init:function(){
				common.ajaxPost($.extend({
					method:'off_item_desc',
					websiteNode:pub.WebsiteNode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.othre.off_item_desc.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData:function(d){
				console.log(d)
			}
		},
		share_rcd_query:{
			init:function(){
				common.ajaxPost($.extend({
					method:'share_rcd_query',
					websiteNode:pub.WebsiteNode,
					pageNo:common.PAGE_INDEX,
					pageSize:common.PAGE_SIZE,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.othre.share_rcd_query.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData:function(d){
				console.log(d)
			}
		},
		system_config_constant:{
			init:function(){
				common.ajaxPost($.extend({
					method:'system_config_constant',
					websiteNode:pub.WebsiteNode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.othre.share_rcd_query.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData:function(d){
				console.log(d)
			}
		},
		img_base64:{
			init:function(){
				common.ajaxPost($.extend({
					method:'img_base64',
					websiteNode:pub.WebsiteNode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.othre.img_base64.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData:function(d){
				console.log(d)
			}
		},
		imInfo:{
			init:function(){
				common.ajaxPost($.extend({
					method:'imInfo',
					websiteNode:pub.WebsiteNode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.othre.img_base64.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData:function(d){
				console.log(d)
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
		
		if (pub.module_id == "clientServiceCenter"){
    		pub.clientServiceCenter.init()
			pub.clientServiceCenter.eventHandle.init();
    	}else if (pub.module_id == "changeCity"){
    		pub.changeCity.init()
			pub.changeCity.eventHandle.init();
    	}else if (pub.module_id == "setUp"){
    		pub.setUp.init()
			pub.setUp.eventHandle.init();
    	}else if (pub.module_id == "validateUser"){
    		pub.validateUser.init()
			pub.validateUser.eventHandle.init();
    	}else if (pub.module_id == "setNewPassword"){
    		pub.setNewPassword.init()
			pub.setNewPassword.eventHandle.init();
    	}
    	pub.eventHandle.init()
	};
	module.exports = pub;
})