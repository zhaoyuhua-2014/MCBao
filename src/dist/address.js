define(function(require, exports, module){

	//require('jquery');
	var common = require('../dist/common');
	
	
	require ("Picker");
	// 命名空间

	var pub = {};
	/********************************** 地址管理 模块 ******************************* */

    // 命名空间

    pub = {};


	
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
    			var n = pub.Back;
    			common.jumpHistryBack(n);
    		})
    	}
    }
    //地址列表接口及事件
    pub.address_manager = {
    	//地址设为默认数据数组
    	add_deffer :["设为默认","设为默认","默认"],
		//地址列表
		init : function(){
			require("LayerCss");
			require("LayerJs");
			var me = this;
			common.ajaxPost($.extend({
				method:'user_address_show',
			}, pub.userBasicParam ),function( d ){
				d.statusCode == "100000" && me.apiData( d );
				d.statusCode != "100000" && common.prompt(d.statusStr)
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
				html += '			<span class="float_right">' + obj.receiverMobile + '</span>'
				html += '		</div>'
				html += '		<p class="address_info">' + obj.allAddr + '</p>'
				html += '	</div>'
				html += '	<div class="address_bottom clearfloat">'
				html += '		<button class="float_left operate">' + pub.address_manager.add_deffer[obj.isDefault + 1] + '</button>'
				html += '		<div class="float_right"><button class = "operate icon_edit">修改</botton><button class = "operate icon_del">删除</botton></div>'
				html += '	</div>'
				html += '</div>'
			}
			$(".address_box").html(html);
			$.data( $('body')[0],'addressList', d.data );
		},
		//设为默认地址
		address_default : {
    		init : function(){
    			common.ajaxPost($.extend({
    				method:'user_address_default',
    				addressId : pub.addressId,
    			},pub.userBasicParam),function( d ){
    				d.statusCode == "100000" && pub.address_manager.address_default.apiData()
					d.statusCode != "100000" && common.prompt(d.statusStr)
    			});
    		},
    		apiData : function(d){
    			pub.address_manager.init()
    		}
    	},
    	//地址删除
    	address_delete : {
    		init : function(){
    			common.ajaxPost($.extend({
    				method : 'user_address_del',
    				addressId : pub.addressId,	
    			},pub.userBasicParam),function( d ){
    				d.statusCode == "100000" && pub.address_manager.address_delete.apiData()
					d.statusCode != "100000" && common.prompt(d.statusStr)
    			});
    		},
    		apiData:function(d){
    			$(".address_box .address_item ").eq(pub.index).remove();
                $.data($('body')[0],'addressList').splice(1,1)
    		}
    	},
    	//事件处理
    	eventHandle : {
    		init : function (){
    			//新增地址
    			$(".header_right.right_text").on("click",function(){
    				common.jumpLinkPlain("../html/my_address.html");
    				
    			})
    			// 选择默认地址
	    		$(".address_box").on('click',".operate",function(){
					var 
	    			$this = $(this),
	    			isEditor = $this.is('.icon_edit'),
	    			isDelete = $this.is('.icon_del'),
	    			isDefault = $this.is('.float_left'),
	    			isCur = $this.parents(".address_item").is(".actived");
	
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
	    				//
	    				var layerIndex = layer.open({
	    					content: '您确定要删除该地址吗？',
	    					btn: ['确定', '取消'],
	    					yes: function(index){
	    						pub.address_manager.address_delete.init();
						    	layer.close(layerIndex)
	    					}
	    				})
	    			}
					//编辑
	    			if( isEditor ){
	    				var 
	    				index = pub.address.nood.index(),
	    				addrInfo = common.JSONStr( $.data($('body')[0],'addressList')[index] );
	
						common.addressData.setItem( addrInfo );
						common.jumpLinkPlain("../html/my_address.html?addressId="+pub.addressId);
	    			}
				});
				/*
				$(".address_management").on('click',".management_address",function(){
	    			var 
	    			index = $(this).parents('.contain_address').index(),
	    			addrInfo = common.JSONStr( $.data($('body')[0],'addressList')[index] ); // 取出数据并存储
					common.addressData.setItem( addrInfo );
	                common.goBackApp(1,true,'html/order_set_charge.html')
				});
	    		!common.addType.getItem() && $('.address_management').off('click','.management_address'); // 判断是否从订单进入
    			*/
    			$(".header_left").on("click",function(){
	    			common.jumpLinkPlain("../html/my.html")
	    		})
    		}
    	}
    }
    //地址详情
    pub.address = {
    	getIndex:function(d){
    		//初始化数据
    		var n = [],m = 0;
    		var data = LAreaData;
    		return recursion(data);
    	 	function recursion(data){
    			if (data instanceof Array) {
    				for(var i in data){
    					if (data[i].code == d[m]) {
    						n[m] = i;
    						m+=1;
    						recursion(data[i].cities)
    					}
    				}
    				return n;
    			}
    		};
    	},
    	getValue:function(d){
    		//初始化数据
    		var n = [],m = 0;
    		var data = LAreaData;
    		n[0] = data[d[0]].code;
    		n[1] = data[d[0]].cities[d[1]].code;
    		n[2] = data[d[0]].cities[d[1]].cities[d[2]].code;
    		return n;
    	},
    	getText:function(d){
    		//初始化数据
    		var n = [],m = 0;
    		var data = LAreaData;
    		return recursion(data);
    	 	function recursion(data){
    			if (data instanceof Array) {
    				for(var i in data){
    					if (data[i].code == d[m]) {
    						n[m] = data[i].name;
    						m+=1;
    						recursion(data[i].cities)
    					}
    				}
    				return n;
    			}
    		};
    	},
    	dataInit:function(m){
    		//c表示索引的数组,d表述code的数组
    		var c = [0,0,0],d = m;
    		//城市数据
    		var data = LAreaData;
    		if(m){
    			c = pub.address.getIndex(m)
    		}else{
    			d = pub.address.getValue(c);
    		}
    		//省市县的index
    		var indexArr = [0,0,0];
    		//省市县文字
    		//var textArr = [];
    		
    		pub.address.picker1 = new myPicker({
			    cols: [{
			    	options:data,
			    	labelKey: 'name',
			        valueKey: 'code',
			    },{
			    	options:data[c[0]].cities,
			    	labelKey: 'name',
			        valueKey: 'code',
			    },{
			    	options:data[c[0]].cities[c[1]].cities,
			    	labelKey: 'name',
			        valueKey: 'code',//['code','name']
			    }],
			    title: "请选择地址",
			    onOkClick: function (values) {
			        $("#addValue").val(values)
			        $("#selectAddress").val(pub.address.getText(values));
			    },
			    fontSize:18,
			    setValues: d,//LAreaData[0].name,LAreaData[0].cities[0].name,LAreaData[0].cities[0].cities[0].name
			    onSelectItem: function (i, index, value) {
					indexArr[i] = index;
					var f = data[indexArr[0]];
					if(i == 0){
			      		this.setOptions(1, f.cities);
			      		this.setOptions(2, f.cities[0].cities);
			      	}
			      	if (i == 1) {
			      		this.setOptions(2, f.cities[indexArr[1]].cities);
			      	}
			    }
			});
    	},
    	beforeInit:function(){
    		pub.address.data = JSON.parse(common.addressData.getItem());
    		var d = [pub.address.data.provinceId,pub.address.data.cityId,pub.address.data.countyId];
    		var noods = $(".list_item");
    		noods.eq(0).find(".float_right input").val(pub.address.data.receiverName)
    		noods.eq(1).find(".float_right input").val(pub.address.data.receiverMobile)
    		noods.eq(2).find(".float_right #selectAddress").val(pub.address.getText(d).toString())
    		noods.eq(2).find(".float_right #addValue").val(d.toString())
    		noods.eq(3).find(".float_right input").val(pub.address.data.address)
    		return d;
    	},
    	init : function (){
    		require('LAreaData');
    		var d = null;
    		if(common.getUrlParam("addressId")){
    			pub.address.addressId = common.getUrlParam("addressId");
    			d = pub.address.beforeInit();
    		}else{
    			pub.address.addressId = null;
    		}
    		pub.address.dataInit(d);
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
    				address:pub.address.address,//联系地址
    				addressId : pub.address.addressId,//地址ID新增则为空
    			},pub.userBasicParam),function( d ){
    				d.statusCode == "100000" && pub.address.address_update.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr);
    			});
    		},
    		apiData:function(d){
    			common.jumpLinkPlain("../html/my_address_list.html")
    		}
    	},
    	
    	//地址详情事件管理
    	eventHandle : {
			init: function(){
				$(".header_right.right_text").on("click",function(){
					pub.address.receiverName = $("#person_name").val(); //用户姓名
					pub.address.receiverMobile = $("#person_phone").val(); //手机号
					pub.address.address = $("#person_address").val(); //地址的详细信息
	
					var addressCode = $("#addValue").val();
	
					if( pub.address.receiverName == '' ){
						common.prompt("请输入用户名"); return;
					}
					if( pub.address.receiverMobile == '' || !common.PHONE_NUMBER_REG.test( pub.address.receiverMobile ) ){
						common.prompt("请输入正确的手机号"); return;
					}
					if( !addressCode ){
						common.prompt("请选择城市"); return;
					}
					addressCode = addressCode.split(",")
					pub.address.provinceId=addressCode[0];
					pub.address.cityId=addressCode[1];
					pub.address.countyId = addressCode[2];
					if( pub.address.address == '' ){
						common.prompt("请输入详细地址"); return;
					}
					pub.address.address_update.init();
				});
				$("#selectAddress").on("click",function(e){
					pub.address.picker1.show();
				});
				$("#selectAddress").on("focus",function(){
					$(this).blur();
				})
				$(".header_left").on("click",function(){
	    			common.jumpLinkPlain("../html/my_address_list.html")
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
    	//pub.eventHandle.init()
    };
    
    module.exports = pub;
})
