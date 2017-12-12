/*
* login scirpt for Zhangshuo Guoranhao
*/ 

define(function(require, exports, module){

	require('jquery');
	var common = require('../dist/common');

	// 命名空间

	var pub = {};

	pub.weixinCode = common.getUrlParam('code'); // 获取url参数

	// 属性
	$.extend(pub,{
		
		phoneNum : '', // 手机号
		
		password : '', // 密码
				
		verify_code : '', // 用户输入验证码值

		login_type : '', // 存储登录方式

		send_sms_type : '', // 存储登录或注册 验证码类型

	});

	// 获取验证码类型
	pub.send_sms_type = $('[data-sms-type]').attr('data-sms-type');

	pub.key = null;// 图片验证码编号

	// 倒计时
	pub.time = 59;
	pub.countDown = function(){
		var id = setInterval(function(){
			if ( pub.time == 0 ) {
				pub.time = 59; // 重置倒计时值
				$("#reg_time").hide();
				$("#reg_verify_code").show().html('重新获取');
				clearInterval(id);
				id = null;
			}else{
				$("#reg_time").css({"color":"#f76a10","background":"none"}).html("( "+pub.time+"s 后重试 )");
			}
			pub.time--;
		},1000);
	};

	// 发送验证码
	pub.send_sms = {
		init : function(){
			common.ajaxPost({
				method : 'get_sd_mcb20171120',
				mobile: pub.phoneNum,
				/*type : pub.send_sms_type,
				key : pub.key,
				authcode : pub.imgCode*/
			},function(d){
				if( d.statusCode == "100000" ){
					common.prompt( '验证码已发送，请查收' );
					pub.countDown();// 倒计时开始
					$("#verify_code").removeAttr("disabled");
					$("#mcb_get_verify_code").hide();
					$("#reg_time").show().css({"color":"#f76a10","background":"none"}).html('(60s后重试)'); 
				}else{
					common.prompt( d.statusStr );
				} 
			});
		}
	};
	// weixinCode换票据
	pub.get_weixin_code = {
        init : function(){
            common.ajaxPost({
                method: 'get_weixin_code',
                weixinCode : pub.weixinCode
            },function( d ){
                d.statusCode == '100000' && d.data.fromWX == 1  &&common.openId.setItem( d.data.openId ); // 存opendId
            },function( d ){
            	
            });
        }
	};
	// 动态登录 + 账户登录
	pub.login = {};
	
	pub.login.apiHandle = {
		init : function(){
			common.ajaxPost( pub.login_type, function( d ){
				if ( d.statusCode == '100000' ) {
					
					pub.login.apiHandle.apiData( d );
				} else{
					common.prompt(d.statusStr);
				}
			},function( d ){
				common.prompt(d.statusStr)
			});
		},
		apiData : function( d ){
			var 
			infor = d.data;	
			common.user_data.setItem( common.JSONStr(infor) );
			common.tokenId.setItem( d.data.tokenId );
			common.secretKey.setItem( d.data.secretKey );
			common.setMyTimeout(function(){
				console.log(JSON.stringify(d.data))
				common.jumpLinkPlain('../index.html');
			},500);
		}
	};
	// 图片验证码
	pub.verification = {
		init : function(){
			common.ajaxPost({
				method : 'verification'
			},function( d ){
				if( d.statusCode == '100000' ){
					$('.imgCode_box .img_code').attr( 'src','data:image/jpeg;base64,' + d.data.code );
					pub.key =  d.data.key;
				}else{
					common.prompt( d.statusStr );
				}
			},function( d ){
				common.prompt( d.statusStr );
			});
		}
	};
	// 登录事件初始化函数
	pub.login.eventHandle = { 

		init : function(){
			// 登录
			$('.submit_btn90').click(function(){
				
				var
				box = $('.login_center'),
				index = box.index();

				pub.phoneNum = box.find('#reg_phoneNumber').val();// 获取手机号
				pub.password = box.find("#reg_password").val();
				if( pub.phoneNum == '' ){
					common.prompt('请输入手机号');return;
				}
				if(!common.PHONE_NUMBER_REG.test( pub.phoneNum )){
					common.prompt('请输入正确的手机号');return;
				}
				if( pub.password == '' ){
					common.prompt('请输入密码'); return;
				}
				pub.login_type ={
					method:'user_login',
					mobile:pub.phoneNum,
					password : common.pwdEncrypt( pub.password )
				};
				console.log("log")
				pub.login.apiHandle.init();
			});

			//后续添加逻辑  微信授权登录
			//common.isWeiXin() && !common.openId.getKey() && pub.weixinCode && pub.get_weixin_code();
		}
	};

	/**
		以下注册模块
	*/

	// 注册 命名空间

	pub.register = {};

	pub.repeatPassword = ''; // 重复密码

	// 注册事件处理
	pub.register.eventHandle = {

		init : function(){
			$('.regsiter_btn').on('click',function(){
				pub.phoneNum = $('#reg_phoneNumber').val();
				pub.verify_code = $('#verify_code').val();
				pub.password = $('#reg_password').val();
				pub.repeatPassword = $('#reg_password_again').val();
				if( pub.phoneNum == ''){
					common.prompt('请输入手机号'); return;
				}
				if( !common.PHONE_NUMBER_REG.test( pub.phoneNum ) ){
					common.prompt('请输入正确的手机号'); return;
				}
				if( pub.password == '' ){
				    common.prompt('请输入密码'); return;
				}
				if( !common.PWD_REG.test( pub.password ) ){
				    common.prompt('密码格式不正确'); return;
				}
				if( pub.repeatPassword == '' ){
				    common.prompt('请再次输入密码'); return;
				}
				if(pub.password != pub.repeatPassword ){
					common.prompt('两次密码输入不一致'); return;
				}
				pub.register.regist.init();
			});
		},
		
	};

	// 注册接口
	pub.register.regist = {

		init : function(){
			var data = {
				method:'user_register',
			    mobile:pub.phoneNum,
			    randCode:pub.verify_code,
			   	pwd:pub.password,
			   	second_pwd:pub.repeatPassword
			};
			common.ajaxPost( data, function( d ){
				if ( d.statusCode == '100000' ) {
				    pub.register.regist.apiData( d );					   
			    } else if ( d.statusCode == '100510' ){
				    $('.pop').css({'display':'block'});
					$('.pop_makeSure').on('click',function(){
						$('.pop').css({'display':'none'});
					})					    
			    }else{
			    	common.prompt(d.statusStr)
			    }
			},function( d ){
				common.prompt(d.statusStr);
			});
		},
		apiData : function(d){

			common.jumpLinkPlain('login.html');
			
		}
	};

	pub.eventHandle = {

		init : function(){
			// 获取验证码
			$('#reg_verify_code').on('click',function(){
				pub.phoneNum = $("#reg_phoneNumber").val();
				if( pub.phoneNum == '' ){
					alert("请输入手机号")
					common.prompt('请输入手机号'); return;
				}
				if( !common.PHONE_NUMBER_REG.test( pub.phoneNum ) ){
					alert("请输入正确的手机号")
					common.prompt('请输入正确的手机号'); return;
				}	
				pub.send_sms.init(); // 请求验证码
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
				$(this).parent().find("input").val("")
			})
			$(".callback").on("click",function(){
				window.history.back();
			})
		}
	};

	pub.init = function(){

		pub.eventHandle.init(); // 公共模块
		
		pub.send_sms_type == '5' && pub.login.eventHandle.init(); // 登录初始化
		
		pub.send_sms_type == '1' && pub.register.eventHandle.init(); // 注册初始化
	};

	module.exports = pub;

});