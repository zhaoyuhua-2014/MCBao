
define(function(require, exports, module){
	
	require('jquery');
	require("swiper")
	var common = require('../dist/common');

	// 命名空间

	var pub = {};
	
	// 接口处理命名空间
	pub.apiHandle = {
		//接口初始化
		init:function(){
			
		}
		//
	};
	
	//事件处理
	pub.eventHandle = {
		//时间初始化
		init:function(){
			var swiper = new Swiper (".index_banner", {
			    direction: 'horizontal',
			    loop: true,
			    loopAdditionalSlides :2,
			    autoplay:5000,
			    //autoplayDisableOnInteraction : false,
			    //spaceBetween : 34,
			    slidesPerView : 1.4,
				centeredSlides : true,
			    //width:618,
			});
			/*点击切换主菜单*/
			$("#foot").on("click",".footer_item",function(){
				var isActive = $(this).is(".actived");
				if (!isActive) {
					window.location.href = $(this).attr("data-url");
				}
			})
			/*点击进入车详情*/
			$(".index_module").on("click",'.module_item',function(){
				var nood = $(this);
				window.location.href = "html/car_mall.html"
			})
			/*点击进入客服中心*//*点击进入城市定位*/
			$(".index_left,.index_right").on("click",function(){
				var nood = $(this);
				if (nood.attr("data-url")) {
					window.location.href = $(this).attr("data-url");
				}else{
					alert("暂缺，待定");
				}
			});
			/*点击进入子菜单*/
			$(".menu_nav dl.item").on("click",function(){
				var nood = $(this);
				if (nood.attr("data-url")) {
					window.location.href = $(this).attr("data-url");
				}else{
					alert("暂缺，待定");
				}
			});
		}
	}
	pub.init = function(){
		pub.apiHandle.init();
		pub.eventHandle.init();
	};
	module.exports = pub;
})