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
    		me.address_manager.init();
    	},
    	address_manager : {
    		init : function(){
    			var me = this;
    			common.ajaxPost($.extend({
    				method:'user_address_show',
    			}, pub.userBasicParam ),function( d ){
    				d.statusCode == "100000" && me.apiData( d );
    			});
    		},
    		apiData : function( d ){
    			var 
    				data = d.data,
    			 	html = '';
				for (var i in data) {
					var obj = data[i];
					html += '<div class="address_item">'
					html += '	<div class="address_top true">'
					html += '		<div class="address_name_phone clearfloat">'
					html += '			<span class="float_left">耿亮</span>'
					html += '			<span class="float_right">18315318515</span>'
					html += '		</div>'
					html += '		<p class="address_info">浙江省杭州市滨江区科技园文一西路45号文慧大厦1208室</p>'
					html += '	</div>'
					html += '	<div class="address_bottom clearfloat">'
					html += '		<button class="float_left true">默认</button>'
					html += '		<button class="float_right">编辑</button>'
					html += '	</div>'
					html += '</div>'
					/*
					html += '<div class="contain_address" addr-id="' + obj.id + '" >'
					html += '	<div class="management_address"  >'
					html += '        <div class="management_address_top clearfloat">'
					html += '	         <div class="management_address_name">' + obj.consignee + '</div>'
					html += '	         <div class="management_address_phone">' + obj.mobile + '</div>'
					html += '        </div>'
					html += '       <div class="management_address_bottom">' + obj.provinceName + obj.cityName + obj.countyName + obj.street + '</div>'
				    html += '    </div>'
					html += '	<div class="address_set clearfloat" >'
					
					html += '		<div class="default_address operate ' + ['','','default_bg'][ obj.isDefault+1 ] + '">默认地址</div>'

					html += '		<div class="editor_address operate">编辑</div>'
					html += '		<div class="delete_address operate">删除</div>'
					html += '	</div>'
					html += '</div>'*/
				}
				$(".address_box").append(html);
				$.data( $('body')[0],'addressList', d.data );
    		}
    	},
    	address_default : {
    		init : function(){
    			common.ajaxPost($.extend({
    				method:'user_address_default',
    				addressId : pub.addrId
    			},pub.userBasicParam),function( d ){
    				if ( d.statusCode == "100000" ) {
						$(".default_bg",".address_management").removeClass("default_bg");
						pub.defaultBtn.addClass("default_bg");
					} else{
						common.prompt( d.statusStr )
					}
    			});
    		}
    	},
    	address_delete : {
    		init : function(){
    			common.ajaxPost($.extend({
    				method : 'user_address_delete',
    				addrId : pub.addrId,	
    			},pub.userBasicParam),function( d ){
    				if( d.statusCode == "100000" ){
                    	
                    }
    			});
    		}
    	},
    	trueFn:function(){
			var arr = $.data($("body")[0],"addressList");
			$(".order_refund").hide();
			$("body").css("overflow-y","auto");
			arr.splice(pub.index,1)
			pub.apiHandle.address_delete.init();  // 删除
    	}
    };

    // 事件处理 
    pub.eventHandle = {
    	init : function(){
    		// 选择默认地址
    		$(".address_management").on('click',".operate",function(){
				var 
    			$this = $(this),
    			isEditor = $this.is('.editor_address'),
    			isDelete = $this.is('.delete_address'),
    			isDefault = $this.is('.default_address'),
    			isCur = $this.is('.default_bg');

    			pub.addrId = $this.parents('.contain_address').attr('addr-id');
    			// 默认地址选择
    			if( isDefault && !isCur ){ 
    				pub.defaultBtn = $this;
    				pub.apiHandle.address_default.init(); 
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

    			if( isEditor ){
    				var 
    				index = $this.parents('.contain_address').index(),
    				addrInfo = common.JSONStr( $.data($('body')[0],'addressList')[index] );

					common.addressData.setItem( addrInfo );
					common.jumpLinkPlainApp( "地址列表",!pub.searchAddr ? 'html/address.html' : 'html/address.html?addr=' + pub.searchAddr );
					
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
    	},
    };



    // 模块初始化
    pub.init = function(){
    	if (pub.module_id == "address_list") {
    		pub.apiHandle.init();
			pub.eventHandle.init();
    	}
    };
    
    module.exports = pub;
})
