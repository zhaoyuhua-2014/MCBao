define(function(require, exports, module){

	require('jquery');
	var common = require('../dist/common');
	var data = require('LAreaData2');
	console.log(data)
	// 命名空间

	var pub = {};
	/********************************** 地址管理 模块 ******************************* */

    // 命名空间

    pub = {};


	
    pub.module_id = $('[data-type]').attr('data-type');
    pub.logined = common.isLogin(); // 是否登录
	console.log(common.secretKeyfn())
    if( pub.logined ){
    	pub.userId = common.user_datafn().cuserInfo.id;
    	pub.source = "userId" + pub.userId;
    	pub.sign = md5( pub.source + "key" + common.secretKeyfn() ).toUpperCase();
    	pub.tokenId = common.tokenIdfn();
    }else{
        //common.jumpLinkPlain( '../index.html' );
    }

	pub.bool = common.addressData.getKey(); // addressData 数据存储是否存在

	pub.userBasicParam = {
		userId : pub.userId,
		source : pub.source,
		sign : pub.sign,
		tokenId : pub.tokenId
	};

    pub.searchAddr = common.getUrlParam('addr');
	
	pub.addrId = null; // 地址ID
	pub.defaultBtn = null; // 默认选择按钮

    // 地址列表 接口数据处理命名空间
    pub.apiHandle = {
    	init : function(){
    		var me = this;
    		pub.apiHandle.address_manager.init();
    	},
    	trueFn:function(){
			var arr = $.data($("body")[0],"addressList");
			$(".order_refund").hide();
			$("body").css("overflow-y","auto");
			arr.splice(pub.index,1)
			pub.apiHandle.address_delete.init();  // 删除
    	}
    };
    pub.eventHandle = {
    	init : function (){
    		$(".header_left").on("click",function(){
    			window.history.back();
    		})
    	}
    }
    //地址列表接口及事件
    pub.address_manager = {
    	//地址设为默认数据数组
    	add_deffer :["设为默认","","默认"],
		//地址列表
		init : function(){
			var me = this;
			common.ajaxPost($.extend({
				method:'user_address_show',
			}, pub.userBasicParam ),function( d ){
				d.statusCode == "100000" && me.apiData( d );
			});
		},
		//地址列表解析
		apiData : function( d ){
			var 
				data = d.data,
			 	html = '';
			if (data.length == 0) {
				$(".address_box").html("暂无地址信息！").css({"font-size":"32px","text-align":"center"})
			}
			for (var i in data) {
				var obj = data[i];
				html += '<div class="address_item '+(obj.isDefault == 1 ? "actived": "")+'" addr-id="' + obj.id + '">'
				html += '	<div class="address_top">'
				html += '		<div class="address_name_phone clearfloat">'
				html += '			<span class="float_left">' + obj.receiverName + '</span>'
				html += '			<span class="float_right">' + obj.receiverName + '</span>'
				html += '		</div>'
				html += '		<p class="address_info">' + obj.receiverName + '</p>'
				html += '	</div>'
				html += '	<div class="address_bottom clearfloat">'
				html += '		<button class="float_left operate">' + pub.address_manager.add_deffer[obj.isDefault + 1] + '</button>'
				html += '		<button class="float_right operate">编辑</button>'
				html += '	</div>'
				html += '</div>'
			}
			$(".address_box").append(html);
			$.data( $('body')[0],'addressList', d.data );
		},
		//设为默认地址
		address_default : {
    		init : function(){
    			common.ajaxPost($.extend({
    				method:'user_address_default',
    				addressId : pub.address.addressId
    			},pub.userBasicParam),function( d ){
    				if ( d.statusCode == "100000" ) {
						
					} else{
						common.prompt( d.statusStr )
					}
    			});
    		}
    	},
    	//事件处理
    	eventHandle : {
    		init : function (){
    			//新增地址
    			$(".header_right.right_text").on("click",function(){
    				window.location.href = "../html/my_address.html"
    			})
    			// 选择默认地址
	    		$(".address_box").on('click',".operate",function(){
					var 
	    			$this = $(this),
	    			isEditor = $this.is('.float_right'),
	    			isDelete = $this.is('.delete_address'),
	    			isDefault = $this.is('.float_left'),
	    			isCur = $this.is('.default_bg');
	
					pub.address.nood = $this.parents('.address_item');
					
	    			pub.addressId = pub.address.nood.attr('addr-id');
	    			// 默认地址选择
	    			if( isDefault && !isCur ){ 
	    				pub.address_manager.address_default.init(); 
	    				return;
	    			} 
	    			// 删除
	    			if( isDelete ){  
	    				pub.index = $this.parents('.contain_address').index();
	    				var data = {
							type:1,
							title:'确认删除?',
							canclefn:'cancleFn',
							truefn:'trueFn'
						}
						common.alertMaskApp(JSON.stringify(data));
						
	    			}
					//编辑
	    			if( isEditor ){
	    				var 
	    				index = pub.address.nood.index(),
	    				addrInfo = common.JSONStr( $.data($('body')[0],'addressList')[index] );
	
						common.addressData.setItem( addrInfo );
						//common.jumpLinkPlainApp( "地址列表",!pub.searchAddr ? 'html/address.html' : 'html/address.html?addr=' + pub.searchAddr );
						window.location.href = "../html/my_address.html?addressId="+pub.addressId
	    			}
				});
				$(".add_address").on("click",function(){
					common.addressData.removeItem();
	                common.jumpLinkPlainApp( "地址列表",!pub.searchAddr ? 'html/address.html' : 'html/address.html?addr=' + pub.searchAddr );
				})
	
				
	
	    		$(".address_management").on('click',".management_address",function(){
	    			var 
	    			index = $(this).parents('.contain_address').index(),
	    			addrInfo = common.JSONStr( $.data($('body')[0],'addressList')[index] ); // 取出数据并存储
					common.addressData.setItem( addrInfo );
	                common.goBackApp(1,true,'html/order_set_charge.html')
				});
	    		!common.addType.getItem() && $('.address_management').off('click','.management_address'); // 判断是否从订单进入
    		}
    	}
    }
    //地址详情
    pub.address = {
    	beforeInit:function(){
    		pub.address.data = JSON.parse(common.addressData.getItem());
    		var noods = $(".list_item");
    		noods.eq(0).find(".float_right input").val(pub.address.data.receiverName)
    		noods.eq(1).find(".float_right input").val(pub.address.data.receiverMobile)
    		noods.eq(2).find(".float_right input").val(pub.address.data.countyId)
    		noods.eq(3).find(".float_right input").val(pub.address.data.address)
    	},
    	init : function (){
    		if(common.getUrlParam("addressId")){
    			pub.address.addressId = common.getUrlParam("addressId");
    			console.log(pub.address.addressId)
    			pub.address.beforeInit();
    		}else{
    			pub.address.addressId = null;
    		}
    	},
    	address_update : {
    		init : function(){
    			common.ajaxPost($.extend({
    				method:'user_address_update',
    				receiverName:pub.address.receiverName,
    				receiverMobile:pub.address.receiverMobile,
    				provinceId:pub.address.provinceId,
    				cityId:pub.address.cityId,
    				countyId:pub.address.countyId,
    				//areaName:pub.address.areaName,//社区名称
    				address:pub.address.address,//联系地址
    				addressId : pub.address.addressId,//地址ID新增则为空
    			},pub.userBasicParam),function( d ){
    				if ( d.statusCode == "100000" ) {
						//$(".default_bg",".address_management").removeClass("default_bg");
						//pub.defaultBtn.addClass("default_bg");
					} else{
						common.prompt( d.statusStr )
					}
    			});
    		}
    	},
    	//地址删除
    	address_delete : {
    		init : function(){
    			common.ajaxPost($.extend({
    				method : 'user_address_delete',
    				addressId : pub.address.addressId,	
    			},pub.userBasicParam),function( d ){
    				if( d.statusCode == "100000" ){
                    	
                    } else{
						common.prompt( d.statusStr )
					}
    			});
    		}
    	},
    	//地址详情事件管理
    	eventHandle : {
			init: function(){
				$(".header_right.right_text").on("click",function(){
					//pub.address. = {
						pub.address.receiverName="赵玉华1";
						pub.address.receiverMobile="14700080905";
						pub.address.provinceId="33";
						pub.address.cityId='3301';
						pub.address.countyId='330109';
						pub.address.areaName="华业大厦"//社区名称
						pub.address.address="2302"//联系地址
						pub.address.addressId = null//地址ID新增则为空
					//}
					pub.address.address_update.init();
				})
			}
		}
    	
    }

    // 模块初始化
    pub.init = function(){
    	if (pub.module_id == "address_list") {
    		 pub.address_manager.init()
			pub.address_manager.eventHandle.init();
    	}else if (pub.module_id == "address"){
    		pub.address.init();
    		pub.address.eventHandle.init()
    	}
    	pub.eventHandle.init()
    };
    
    module.exports = pub;
})
