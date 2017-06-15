/*******************************************************************************
 * 这个类提供表单的异步提交相关功能.
 * 
 * @author 徐海洋.
 */
JsObject.Ajax = {

	/***************************************************************************
	 * ajax同步处理、获取数据.
	 * 
	 * @param path
	 *            处理路径.
	 * @param dataObj
	 *            参数信息如：{name：value}.
	 * @param resultType
	 *            返回的数据类型 如：json、xml、html等.
	 * 
	 * @returns {String} 返回值.
	 */
	load : function(path, dataObj, resultType) {
		var obj = 'JsObject.Session';
		for(var i=1;i>0;i++){
			var parentObj = eval(obj);
			if(parentObj == undefined){
				obj = 'parent.'+obj;
				continue;
			}
			obj = parentObj;
			break;
		}
	 
		obj.validateSession();
			var result = '';
			$.ajax({
				type : "post",
				url : path,
				dataType : resultType,
				data : dataObj,
				async : false,
				success : function(msg) {
					result = msg;
				}
			});
			return result;
	},
	
	/***************************************************************************
	 * ajax同步处理、获取数据.
	 * 
	 * @param path
	 *            处理路径.
	 * @param dataObj
	 *            参数信息如：{name：value}.
	 * @param resultType
	 *            返回的数据类型 如：json、xml、html等.
	 * 
	 * @returns {String} 返回值.
	 */
	load_open : function(path, dataObj, resultType) {
	    
		var obj = 'JsObject.Session';
		for(var i=1;i>0;i++){
			var parentObj = eval(obj);
			if(parentObj == undefined){
				if(i == 1){
					obj = 'parent.' + obj;
				}else if(i == 2){
					obj = 'window.opener.' + obj;
				}else{
					obj.replace('window', 'window.opener');
				}
				continue;
			}
			obj = parentObj;
			break;
		}
	 
		obj.validateSession();
			var result = '';
			$.ajax({
				type : "post",
				url : path,
				dataType : resultType,
				data : dataObj,
				async : false,
				success : function(msg) {
					result = msg;
				}
			});
			return result;
	},

	/***************************************************************************
	 * 获取表单序列对象.
	 * 
	 * @param formId
	 *            表单的编号.
	 * @returns {} 放回对象值.
	 */
	getFormSerialize : function(formId) {
		var dataObj = {};
		var data = $('#' + formId).serialize();
		data = data.split('&');
		for ( var i = 0; i < data.length; i++) {
			var htmlTerm = data[i];
			var index = htmlTerm.indexOf('=');
			var name = htmlTerm.substring(0, index);
			var value = htmlTerm.substring(index + 1);
			if (dataObj[name] != undefined && dataObj[name] != '') {
				dataObj[name] += ',' + value;
				continue;
			}
			dataObj[name] = value;
		}
		return dataObj;
	}
};