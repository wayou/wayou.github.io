/*******************************************************************************
 * 这个类提供表单的异步提交相关功能.
 * 
 * @author 徐海洋.
 */
JsObject.UpdateList = {
	str : "",
	save : function(act,key,value,file,sql){
		var data = {};
		data['keyid'] = key;
		data['keyval'] = value;
		data['sqlkey'] = file;
		data['sqlval'] = sql;
		data['datas'] = this.str;
		$.ajax({
			type : 'post',
			url  : act,
			dataType : 'json',
			data : data,
			async : false,
			success : function (msg){
				alert(msg.message);
			}
		});
	},
	changeInput : function (event,key){
		var data = JsObject.JqGridBuilder.getRowInfo('list',event);
		var strs = this.str.split(",");
		for(var i = 0;i<strs.length;i++){
			if(strs[i].split("=")[0]==data[key]){
				this.str = this.str.replace(strs[i],data[key]+"="+event.value);
				break;
			}else{
				if(i == strs.length-1){
					this.str += data[key]+"="+event.value+",";
				}
			}
		}
	}
};