
define(function(require, exports, module){
	
	
	
	imgupload = {
		compress : function(img) {
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
				// 计算每块瓦片的宽和高
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
	    },
	    imgsize : function(s){
	    	var str=s.substring(22);
			var equalIndex= str.indexOf('=');
			if(str.indexOf('=')>0){
			    str=str.substring(0, equalIndex);
			}
			var strLength=str.length;
			var fileLength=parseInt(strLength-(strLength/8)*2);
			return fileLength
	    },
	    
	};
	
	
	imgupload.init = function(){
			
	}
	module.exports = imgupload;
})