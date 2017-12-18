
define(function(require, exports, module){
	
	require('jquery');
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
	
	pub.upLoadImg = {
		init:function(data){
			$.ajax({
				type:"POST",
				url:common.API,
				dataType:"JSON",
				data:data,
		        //processData : false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
		        //contentType : false, // 不设置Content-type请求头
				success:function(d){
					if( d.statusCode == "100000" ){
						pub.upLoadImg.apiData();
					}else{
						common.prompt( d.statusCode );
					}
				}
			});
		},
		apiData:function(){
			
		},
		eventHandle : {
			init:function(){
				$(".updata_card_info").on("change",".car_img",function(){
					console.log($(this).attr("name"))//car_img1表示正面car_img表示反面
					var nodes = $(this).parent();
					var tar = this,
					files = tar.files,
					fNum = files.length,
					URL = window.URL || window.webkitURL,
					file = files[0];
					if( !file ) return;
					EXIF.getData(files[0], function() {  
			            //alert(EXIF.pretty(this));  
			            EXIF.getAllTags(this);   
			            //alert(EXIF.getTag(this, 'Orientation'));   
			            Orientation = EXIF.getTag(this, 'Orientation');
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
							var ll = imgsize(result);
			                //如果图片大小小于200kb，则直接上传
			                if (ll <= 200 *1024) {
			                    img = null;
			                    $(span).find("img").attr("src",result);
			                    
			                    upload(result, file.type,goodid,span,Orientation);
			                    
			                    return;
			                }
							// 图片加载完毕之后进行压缩，然后上传
			                if (img.complete) {
			                    callback();
			                } else {
			                    img.onload = callback;
			                }
			
			                function callback() {
			                    var data = compress(img);
			
			                    $(span).find("img").attr("src",result);
								console.log(imgsize(data))
			                    upload(data, file.type,goodid,span,Orientation);
			                    img = null;
			                }
			
			            };
		                fr.readAsDataURL(file);
					
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
				  	})

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
			    function upload(basestr, type, goodid,el,Orientation){
		         /*function upload(basestr, type, $li) {
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
			        */
			        var basestr = basestr.split(",")[1];
			        var type = type.split("/")[1];
					/*var formdata = new FormData();
			        formdata.append("method","comment_img_upload");
			        formdata.append("orderCode",pub.orderCode);
			        formdata.append("goodsId",goodid);
			       	formdata.append("imgStr",basestr);
			        formdata.append("suffix",type);
			        formdata.append("angle",Orientation);*/
			        var formdata = {
			        	"method":"comment_img_upload",
			        	
			        	"imgStr":basestr,
			        	"suffix":type,
			        	"angle":Orientation,
			        }
			        //pub.evaluate.apiHandle.comment_upload_img(formdata,el);
			        pub.upLoadImg.init(formdata,el);
			        
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
		init:function(){
			$(".callback").on("click",function(){
				var n = pub.Back;
    			common.jumpHistryBack(n);
			});
		}
	}
	
	pub.init = function(){
		if (pub.module_id == "upLoad_driverLicense"){
    		
    	}
		
		pub.upLoadImg.eventHandle.init();
	};
	module.exports = pub;
})