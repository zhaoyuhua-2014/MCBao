
define(function(require, exports, module){
	
	var common = require('../dist/common');

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
	
	pub.options.websiteNode = pub.local_websiteNode ? pub.local_websiteNode : common.WebsiteNode;
	//客服中心
	pub.clientServiceCenter = {
		init:function(){
			
		},
		eventHandle:{
			init:function(){
				//点击进入意见反馈
				$(".right_text").on("click",function(){
					if (pub.logined) {
						common.jumpLinkPlain("../html/feedback.html")
					}else{
						common.jumpLinkPlain("../html/login.html")
					}
					
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
				localStorage.setItem("websiteNodeData",JSON.stringify(d));
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
				$("#position").on("click",function(){
					if ($("#position").is(".success")) {
						//console.log("带回城市:"+$(this).html()+"返回首页")
					}
				});
				$('.hot_city').on("click",".city_item",function(){
					common.websiteNode.setItem($(this).attr("data"));
					common.jumpLinkPlain("../index.html?name="+$(this).html())
				})
				$(".all_city").on("click",".city_list_item",function(){
					common.websiteNode.setItem($(this).attr("data"));
					common.jumpLinkPlain("../index.html?name="+$(this).html())
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
				console.log(d);
				
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
							common.prompt("缓存清除成功！");					
							//pub.othre.init();
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
	/*注册邀请*/
	pub.regsiterInvitation = {
		init:function(){
			pub.loading = $(".click_load");
			pub.regsiterInvitation.share_rcd_query.init();
			require('qrcode');
			pub.regsiterInvitation.htmlInit();
			
		},
		htmlInit:function(){
			$(".envitation_name span").html(pub.userId);
			var str = "http://weixin.91mcb.com/test/html/regsiter.html?id="+pub.userId;
			var obj = {
				render   : "canvas",//设置渲染方式  
			    width       : 256,     //设置宽度  
			    height      : 256,     //设置高度  
			    typeNumber  : -1,      //计算模式  
			    background      : "#ffffff",//背景颜色  
			    foreground      : "#000000", //前景颜色 
			    text:str
			};
			new QRCode(document.getElementById("qrcode"), obj);
		},
		share_rcd_query:{
			init:function(){
				common.ajaxPost($.extend({
					method:'share_rcd_query',
					websiteNode:pub.options.websiteNode,
					pageNo:common.PAGE_INDEX,
					pageSize:common.PAGE_SIZE,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.regsiterInvitation.share_rcd_query.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData:function(d){
				var d = d.data,o = d.objects,html = '';
				pub.options.isEnd = d.isLast;
				if (pub.options.pageNo == 1) {
					$(".invitation_table_box").html('');
				}
				var nood = $(".invitation_table_box");
				if (o.length == '0') {
					pub.loading.hide();
					nood.html("暂无邀请人快去邀请吧！").css("line-height","100px").css("text-align","center").css("font-size","30px");
				}else{
					nood.removeAttr("style");
					for (var i in o) {
						html +='<ul class="invitation_table_line">'
						html +='	<li class="line_item">'+o[i].newuserName+'</li>'
						html +='	<li class="line_item">'+o[i].regTime+'</li>'
						html +='	<li class="line_item">'+(o[i].isRake ? "已返佣" : "未返佣")+'</li>'
						html +='</ul>'
					}
					nood.append(html);
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
				//点击加载更多
				pub.loading.on("click",function(){
					if (!pub.options.isEnd) {
						pub.options.pageNo ++;
						pub.regsiterInvitation.share_rcd_query.init();
					}else{
						pub.loading.show().html("没有更多数据了！");
					}
				})
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
					websiteNode:pub.options.websiteNode,
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
					websiteNode:pub.options.websiteNode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.othre.off_item_desc.apiData( d );
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
					websiteNode:pub.options.websiteNode,
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
					websiteNode:pub.options.websiteNode,
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
					websiteNode:pub.options.websiteNode,
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
    	}else if(pub.module_id == "regsiterInvitation"){
    		pub.regsiterInvitation.init();
    		pub.regsiterInvitation.eventHandle.init();
    	}
    	pub.eventHandle.init();
	};
	module.exports = pub;
})