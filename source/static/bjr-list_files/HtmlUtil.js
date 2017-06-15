/*******************************************************************************
 * 页面参数加载类
 * 
 * @author 徐海洋
 */
JsObject.HtmlUtil = {
	receiveHtmParameterVal: function() { 
		var url=location.search;
		var result = new Object();
		if(url.indexOf("?")!=-1){
	        var str = url.substr(1);
	        var strs = str.split("&");
	        for(var i=0;i<strs.length;i++){
	        	result[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
	        }
		}
		return result;
	},
	getParams: function(urlParam) { 
		var result = new Object();
		if(urlParam.indexOf("?")!=-1){
			str = urlParam.substr(urlParam.indexOf("?")+1);
	        var strs = str.split("&");
	        for(var i=0;i<strs.length;i++){
	        	result[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
	        }
		}
		return result;
	},
	transcodingByVal:function(impVal){
		return escape(impVal);
	},
	decodingByVal:function(expVal){
		return  unescape(expVal);
	},
	teatareaFormat : function (value){
		if(null==value){
			return '';
		}
		return ((value.replace(/<(.+?)>/gi,"&lt;$1&gt;")).replace(/ /gi,"&nbsp;")).replace(/\n/gi,"<br>");
	}
	
};