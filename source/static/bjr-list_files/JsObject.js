/*******************************************************************************
 * 提供系统的js的名字空间域.
 * 
 * @author 徐海洋.
 */
var JsObject = {
	jsonClone : function(jsonObj) {
		var buf;
		if (jsonObj instanceof Array) {
			buf = [];
			var i = jsonObj.length;
			while (i--) {
				buf[i] = this.jsonClone(jsonObj[i]);
			}
			return buf;
		} else if (typeof jsonObj == "function") {
			return jsonObj;
		} else if (jsonObj instanceof Object) {
			buf = {};
			for ( var k in jsonObj) {
				buf[k] = this.jsonClone(jsonObj[k]);
			}
			return buf;
		} else {
			return jsonObj;
		}
	},
	screenEnter:function(){
		var body = document.body;
		body.setAttribute('onkeydown','if(event.keyCode==13){if(event.srcElement.tagName==\'TEXTAREA\'){return true;}return false;}');
	},

	
	resetForm:function(formId){
		if(formId==undefined){
			formId = "queryForm";
		}
		var formInput = $('#'+formId+' input');
		for(var i=0;i<formInput.length;i++){
			if(formInput[i].type=='text'){
				formInput[i].value = '';
			}
		}
		var formSelect = $('#'+formId+' select');
		for(var i=0;i<formSelect.length;i++){
			formSelect[i].value = '';
		}
	}
};