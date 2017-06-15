/***
 * 获取登陆用户的资源.
 * @author 徐海洋.
 */
JsObject.Security= {
	result:{},
    resource:function(){
  	    return JsObject.Ajax.load('security!getUserResource.action', {}, 'html');
    },
    string2array:function(){
    	var str = JsObject.Security.result.resourceStrs;
        return str.split(',');
    },
    filterResource:function(url){
    	var state = false;
    	var resourceArray = JsObject.Security.string2array();
    	for(var i=0 ; i<resourceArray.length; i++){
    		if(resourceArray[i].replace(/ /g,'') == url.replace(/ /g,'')){
    			state = true;
    			break;
    		}
    	}
    	return state;
    },
    userInfo:function(){
    	 return JsObject.Ajax.load('security!getUserInfo.action', {}, 'json');
    },
    getRoleByUser:function(){
    	if(JsObject.Security.userInfo().sui_flag!='3'){
			window.location.href = '../../pages/security/not-resource.html';
			return false;
		}
    	return true;
    }
};