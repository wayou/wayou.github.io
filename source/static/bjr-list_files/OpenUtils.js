/**
 * 弹出页公共类
 * 
 * @author 徐海洋
 */
JsObject.OpenUtils = {
	openObjList:[],
	openMethods : function(src, title, height, width) {
		var h = height;
		var w = width;
		if (height == undefined && width == undefined
				|| (height == '' && width == '')) {
			h = '500';
			w = '1000';
		}
		var openObj = window.open(src, title, JsObject.OpenUtils.gainOpenPageCss(h, w));
		var parentObj = 'parent.openObjList';
		for(var i=0;i<2;i++){
			if(eval(parentObj)==undefined){
				parentObj = 'parent.'+parentObj;
			}else{
				eval(parentObj).push(openObj);
				return ;
			}
		}
	},
	gainOpenPageCss : function(height, width) {
		return "height="
				+ height
				+ ",width="
				+ width
				+ ",top="
				+ (window.screen.availHeight - 30 - height)
				/ 2
				+ ",left="
				+ (window.screen.availWidth - 10 - width)
				/ 2
				+ ",toolbar=yes,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no";
	},
	closeOpenPage:function(){
		var list = JsObject.OpenUtils.openObjList;
		 for(var i=0;i<list.length;i++){
			 list[i].close();
         }
	}
};