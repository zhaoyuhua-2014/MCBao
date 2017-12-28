define(function(require, exports, module) {

	//require('jquery');
	var common = require('../dist/common');

	// 命名空间

	var pub = {};

	pub.module_id = $('[data-type]').attr('data-type');
	pub.logined = common.isLogin(); // 是否登录

	if(pub.logined) {
		pub.userId = common.user_datafn().cuserInfo.id;
		pub.source = "userId" + pub.userId;
		pub.sign = md5(pub.source + "key" + common.secretKeyfn()).toUpperCase();
		pub.tokenId = common.tokenIdfn();
	} else {

		//common.jumpLinkPlain( '../index.html' );
	}
	pub.userBasicParam = {
		userId: pub.userId,
		source: pub.source,
		sign: pub.sign,
		tokenId: pub.tokenId
	};
	pub.options = {
		histry: [],
	};
	//我的页面逻辑
	pub.user = {
		init: function() {
			//清除一部分暂时没有的信息
			common.couponlist.removeItem();
			common.packetDate.removeItem();
			
			if(pub.logined) {
				$(".my_top_info").addClass("login_status")
				pub.user.user_info.init();
			} else {
				$(".my_center .my_center_item,.my_info_nav .my_info_nav_item").attr("data-url","login.html")
				$("#foot .footer_item").eq(2).attr("data-url","login.html");
				var nood = $(".my_info_top");
				nood.find("dt").html("<img src='../img/bg_head@2x.png' />");
				nood.find("dd").html("<a href='login.html'>登录</a>/<a href='regsiter.html'>注册</a>");
			}
		},
		user_info: {
			init: function() {
				common.ajaxPost($.extend({
					method: 'user_info_show',
				}, pub.userBasicParam), function(d) {
					d.statusCode == "100000" && pub.user.user_info.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(d) {
				var o = d.data;
				var nood = $(".my_info_top");
				nood.find("dt").html("<img class='true' src='" + (o.faceImgUrl ? o.faceImgUrl : '../img/bg_head@2x.png') + "' />");
				nood.find("dd").html(o.petName);
			}
		},
		user_update_pwd: {
			init: function() {
				common.ajaxPost($.extend({
					method: 'user_update_pwd',
					oldPassWord: 'oldPassWord',
					newPassWord: 'newPassWord',
					confirmPassword: 'confirmPassword',
				}, pub.userBasicParam), function(d) {
					d.statusCode == "100000" && pub.user.user_update_pwd.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(d) {

			}
		},
		eventHandle: {
			init: function() {
				$(".my_center .my_center_item").on("click", function() {
					var nood = $(this);
					/*if(nood.attr("data-url")) {
						common.jumpLinkPlain(nood.attr("data-url"))
					}*/
					if (nood.attr("data-switch") == "false") {
						common.prompt("内测中，暂未开放！")
					}else if(nood.attr("data-switch") == "true"){
						if(nood.attr("data-url")) {
							common.jumpLinkPlain(nood.attr("data-url"))
						}
					}
				})
				$(".my_info_nav .my_info_nav_item").on("click", function() {
					var nood = $(this);
					if (nood.attr("data-switch") == "false") {
						common.prompt("内测中，暂未开放！")
					}else if(nood.attr("data-switch") == "true"){
						if(nood.attr("data-url")) {
							common.jumpLinkPlain(nood.attr("data-url"))
						}
					}
				})
				$("#foot").on("click", ".footer_item", function() {
					var isActive = $(this).is(".actived");
					if(!isActive) {
						common.jumpLinkPlain($(this).attr("data-url"))
					}
				});
				$(".my_info_top").on("click", "img.true", function() {
					common.jumpLinkPlain("../html/my_info.html");
				})
			}
		}
	};
	//用户信息修改退出登录
	pub.myInfo = {
		init: function() {
			var data = common.user_datafn().cuserInfo;
			$("#head_picter img").attr("src", data.faceImgUrl == '' ? "../img/bg_head@2x.png" : data.faceImgUrl);
			$(".user_name").html(data.petName);
			$(".user_phone").html(data.mobile);
		},
		face_img_upload: {
			init: function() {
				common.ajaxPost($.extend({
					method: 'face_img_upload',
				}, pub.userBasicParam), function(d) {
					d.statusCode == "100000" && pub.myInfo.face_img_upload.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(d) {
				var o = d.data,
					html = '';

			}
		},
		user_logout: {
			init: function() {
				common.ajaxPost($.extend({
					method: 'user_logout',
				}, pub.userBasicParam), function(d) {
					d.statusCode == "100000" && pub.myInfo.user_logout.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(d) {
				/*本地缓存数据清除*/
				common.secretKey.removeItem();
				common.tokenId.removeItem();
				common.user_data.removeItem();

				common.jumpLinkPlain("../html/my.html");
			}
		},
		eventHandle: {
			init: function() {
				$(".my_info .list_item").on("click", ".float_right.icon", function() {
					var isImg = $(this).is(".img"),
						isName = $(this).is(".user_name"),
						isPhone = $(this).is(".user_phone");
					if(isName) {
						common.jumpLinkPlain("../html/edit_name.html")
					}
				});
				//点击退出
				$(".submit_btn90").on("click", function() {
					pub.myInfo.user_logout.init()
				});

				$("#head_picter input").on("change", function() {
					require("imgUpload");
					var nodes = $(this).parent();
					var tar = this,
						files = tar.files,
						file = files[0];
					if(!file) return;
					var options = {
						"method": "face_img_upload",
						"userId": pub.userId,
					}
					var callBack = function(d) {
						if(d.statusCode == "100000") {
							nodes.find("img").attr("src", d.data);
							/*将faceImgUrl存储到本地*/
							var user_data = common.user_datafn();
							var data = user_data.cuserInfo;
							var result = $.extend({}, data, {
								"faceImgUrl": d.data,
							});
							var o = $.extend({}, user_data, {
								"cuserInfo": result
							});
							common.user_data.setItem(JSON.stringify(o));
						} else {
							common.prompt(d.statusCode);
						}
					}
					imgupload.init(files, common.API, options, callBack)
				})
			}
		}
	};
	pub.editName = {
		init: function() {
			var data = common.user_datafn().cuserInfo;
			$(".revise_name input").val(data.petName);
		},
		user_info_update: {
			init: function() {
				common.ajaxPost($.extend({
					method: 'user_info_update',
					petName: pub.options.name,
				}, pub.userBasicParam), function(d) {
					d.statusCode == "100000" && pub.editName.user_info_update.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(d) {
				/*更新数据到本地*/
				var user_data = common.user_datafn();
				var o = $.extend({}, user_data, {
					"cuserInfo": d.data
				});
				common.user_data.setItem(JSON.stringify(o));
				common.jumpHistryBack();
			}
		},
		eventHandle: {
			init: function() {
				$("input").on("focus", function() {
					$(this).parent().find(".icon_clear").show();
				})
				$("input").on("blur", function() {
					var nood = $(this)
					setTimeout(function() {
						nood.parent().find(".icon_clear").hide();
					}, 10)
				})
				$(".icon_clear").on("click", function() {
					$(this).parent().find("input").val("");
					$(".search_star").show().siblings().hide()
				});
				$(".header_right").on("click", function() {
					pub.options.name = $(".revise_name input").val();
					if(pub.options.name == '') {
						common.prompt("用户昵称不能为空");
						return;
					}
					pub.editName.user_info_update.init();
				})
			}
		}
	};
	//我的红包资源
	pub.packet = {
		init: function() {
			pub.type = common.getUrlParam("order");
			console.log(pub.type);
			if (pub.type == "line_payment") {
				pub.options.couponlist = JSON.parse(localStorage.getItem("couponlist"))
				pub.packet.coupon_info_show.apiData(pub.options.couponlist);
			}else{
				pub.packet.coupon_info_show.init();
			}
			
		},
		coupon_info_show: {
			init: function() {
				common.ajaxPost($.extend({
					method: 'coupon_info_show',
				}, pub.userBasicParam), function(d) {
					d.statusCode == "100000" && pub.packet.coupon_info_show.apiData(d.data);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(o) {
				var	html = '';
				if(o.length == 0) {
					$(".red_packet_list_box").html("还没有红包哦！").css({
						"text-align": "center",
						"font-size": "50px",
						"line-height": "80px"
					});
				} else {
					for(var i in o) {
						html += '<dl class="red_packet_item">'
						if (o[i].couponName.length > 5 && o[i].couponName.length <= 10) {
							html += '	<dt class="float_left" style="line-height: 50px;padding:26px 0;">'+o[i].couponName+'</dt>'
						}else{
							html += '	<dt class="float_left">'+o[i].couponName+'</dt>'
						}
						
						html += '	<dd class="float_left">'
						html += '		<p><span style="color: #EC5330;font-size: 65px;">￥'+o[i].couponMoney+'</span><span style="color: #9E9E9E;font-size: 20px;padding-left: 15px;">满'+o[i].leastOrderMoney+'可用</span></p>'
						html += '		<p><span style="color: #d9aaaa;font-size: 24px;">有效期至：'+o[i].endTime+'</span></p>'
						html += '	</dd>'
						html += '</dl>'
					}
					/*<span class="float_right" style="display: inline-block;background: url(../img/red_packet_txt@2x.png) no-repeat center;"></span>*/
					$(".red_packet_list_box").html(html)
				}
			}
		},
		eventHandle: {
			init: function() {
				$(".red_packet_list_box").on("click",".red_packet_item",function(){
					var nood = $(this),
						packet = nood.attr("data");
					if (pub.type == "line_payment") {
						common.packetDate.setItem(packet);
						common.jumpHistryBack();	
					}
				});
				$(".no_use_red_packet").on("click",function(){
					if (pub.type == "line_payment") {
						common.jumpHistryBack();	
					}
				})
			}
		}
	};
	pub.myPolicy = {
		init: function() {
			pub.myPolicy.insurance_bill_query4user.init();
			pub.myPolicy.insurance_bill_query4car.init();
			pub.myPolicy.insurance_bill_show.init();
			pub.myPolicy.insurance_bill_delete.init();
		},
		//会员的保单列表
		insurance_bill_query4user: {
			init: function() {
				common.ajaxPost($.extend({
					method: 'insurance_bill_query4user',
					pageNo: common.PAGE_INDEX,
					pageSize: common.PAGE_SIZE,
				}, pub.userBasicParam), function(d) {
					d.statusCode == "100000" && pub.myPolicy.insurance_bill_query4user.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(d) {
				var o = d.data,
					html = '';
				if(o.length == 0) {

				} else {

				}
			}
		},
		//车的保单列表
		insurance_bill_query4car: {
			init: function() {
				common.ajaxPost($.extend({
					method: 'insurance_bill_query4car',
					carId: "01",
					pageNo: common.PAGE_INDEX,
					pageSize: common.PAGE_SIZE,
				}, pub.userBasicParam), function(d) {
					d.statusCode == "100000" && pub.myPolicy.insurance_bill_query4car.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(d) {
				var o = d.data,
					html = '';
				if(o.length == 0) {

				} else {

				}
			}
		},
		//查看保单
		insurance_bill_show: {
			init: function() {
				common.ajaxPost($.extend({
					method: 'insurance_bill_show',
					billId: "01",
				}, pub.userBasicParam), function(d) {
					d.statusCode == "100000" && pub.myPolicy.insurance_bill_show.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(d) {
				var o = d.data,
					html = '';
				if(o.length == 0) {

				} else {

				}
			}
		},
		//删除保单
		insurance_bill_delete: {
			init: function() {
				common.ajaxPost($.extend({
					method: 'insurance_bill_delete',
					billId: "01",
				}, pub.userBasicParam), function(d) {
					d.statusCode == "100000" && pub.myPolicy.insurance_bill_delete.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(d) {
				var o = d.data,
					html = '';
				if(o.length == 0) {

				} else {

				}
			}
		},
		eventHandle: {
			init: function() {

			}
		}
	}
	//意见反馈
	pub.feedback = {
		init: function() {

		},
		suggest_add: {
			init: function() {
				common.ajaxPost($.extend({
					method: 'suggest_add',
					context: pub.options.context,
				}, pub.userBasicParam), function(d) {
					d.statusCode == "100000" && pub.feedback.suggest_add.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});

			},
			apiData: function(d) {
				common.jumpHistryBack();
			}
		},
		eventHandle: {
			init: function() {
				$(".submit_btn90").on("click", function() {
					pub.options.context = $("textarea").val();
					if(pub.options.context == "") {
						common.prompt("内容不能为空");
						return;
					}
					pub.feedback.suggest_add.init();
				})
			}
		}
	}
	//事件处理
	pub.eventHandle = {
		init: function() {
			$(".callback").on("click", function() {
				var n = pub.Back;
				common.jumpHistryBack(n);
			});
		}
	}
	pub.init = function() {

		if(pub.module_id == "user") {
			pub.user.init()
			pub.user.eventHandle.init();
		} else if(pub.module_id == "myInfo") {
			pub.myInfo.init()
			pub.myInfo.eventHandle.init();
		} else if(pub.module_id == "packet") {
			pub.packet.init()
			pub.packet.eventHandle.init();
		} else if(pub.module_id == "myInfo") {
			pub.myInfo.init()
			pub.myInfo.eventHandle.init();
		} else if(pub.module_id == "editName") {
			pub.editName.init()
			pub.editName.eventHandle.init();
		} else if(pub.module_id == "myPolicy") {
			pub.myPolicy.init()
			pub.myPolicy.eventHandle.init();
		} else if(pub.module_id == "feedback") {
			pub.feedback.init()
			pub.feedback.eventHandle.init();
		}
		pub.eventHandle.init()
	};
	module.exports = pub;

})