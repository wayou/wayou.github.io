/*******************************************************************************
 * @author 徐海洋
 */
JsObject.SelectUtils = {
	moveAuthorities : function(fromId, toId) {
		var allOtherRoles = document.getElementById(fromId);
		var allOtherRolesSize = allOtherRoles.length;
		for ( var i = 0; i < allOtherRolesSize; i++) {
			var tempRole = allOtherRoles[i];
			if (tempRole.selected == true) {
				allOtherRoles.removeChild(tempRole);
				document.getElementById(toId).appendChild(tempRole);
				allOtherRolesSize--;
				i--;
			}
		}
	},
	buildSelectStr:function(result,id,name,ags1,ags2,style,state,type){
		var multiple='';
		if(state){
			multiple='multiple';
		}
		if(style!=''&&style!=undefined&&true!=type){
			if(style.indexOf('width')>0){
				style = style.substring(style.indexOf('width')+5);
				style = style.substring(style.indexOf('\"')+1);
			}
		}
		var str = '<select id='+id+' '+multiple+' '+style+' name='+name+'>';
		
		//var str = '<select id='+id+' '+multiple+'  name='+name+'>';
		if(null!=result && result.length>0){  
			for ( var i=0;i< result.length; i++) {
				var map = result[i];
				str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
			}
		}else{
			str+='<option value="" ></option>';
		}
		str+= '</select>';
		return str;
	},
	buildSelectStrBDChoice:function(result,id,name,ags1,ags2,style,state,type){
		var multiple='';
		if(state){
			multiple='multiple';
		}
		if(style!=''&&style!=undefined&&true!=type){
			if(style.indexOf('width')>0){
				style = style.substring(style.indexOf('width')+5);
				style = style.substring(style.indexOf('\"')+1);
			}
		}
		var str = '<select id='+id+' '+multiple+' '+style+' name='+name+'>';
		
		//var str = '<select id='+id+' '+multiple+'  name='+name+'>';
		if(null!=result && result.length>0){  
			for ( var i=0;i< result.length; i++) {
				var map = result[i];
				str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
			}
		}
		str+= '</select>';
		return str;
	},
	buildSelectStrAndOther:function(result,id,name,ags1,ags2,style,state,type){
		var multiple='';
		if(state){
			multiple='multiple';
		}
		if(style!=''&&style!=undefined&&true!=type){
			if(style.indexOf('width')>0){
				style = style.substring(style.indexOf('width')+5);
				style = style.substring(style.indexOf('\"')+1);
			}
		}
		var str = '<select id='+id+' '+multiple+' '+style+' name='+name+'>';
		
		//var str = '<select id='+id+' '+multiple+'  name='+name+'>';
		if(null!=result && result.length>0){  
			for ( var i=0;i< result.length; i++) {
				var map = result[i];
				str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
			}
		}else{
			str+='<option value="" ></option>';
		}
		str+='<option value="other" >其他</option>';
		str+= '</select>';
		return str;
	},
	buildOptionStr:function(result,id,ags1,ags2){
		var str = '';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
		}
	  $('#'+id).html(str);
	},
	buildOptionStrForSelect:function(result,id,name,ags1,ags2,style,event){
		if(style!=''&&style!=undefined){
			if(style.indexOf('width')>0){
				style = style.substring(style.indexOf('width')+5);
				style = style.substring(style.indexOf('\"')+1);
			}
		}
		var str = '<select id='+id+'  '+style+' name='+name;
		//var str = '<select id='+id+' name='+name;
		if(event != undefined && event != null && event != ''){
			str += ' onchange='+event+'()';
		}
		str += '><option value="" selected>全部</option>';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
		}
		str+= '</select>';
		return str;
	},       
	buildOptionStrForSelectNoAll:function(result,id,name,ags1,ags2,style,event){
		if(style!=''&&style!=undefined){
			if(style.indexOf('width')>0){
				style = style.substring(style.indexOf('width')+5);
				style = style.substring(style.indexOf('\"')+1);
			}
		}
		var str = '<select id='+id+'  '+style+' name='+name;
		//var str = '<select id='+id+' name='+name;
		if(event != undefined && event != null && event != ''){
			str += ' onchange='+event+'()';
		}
		str += '>';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
		}
		str+= '</select>';
		return str;
	},       
	buildOptionStrForSelectMultiple:function(result,id,name,ags1,ags2,style,event){
		if(style!=''&&style!=undefined){
			if(style.indexOf('width')>0){
				style = style.substring(style.indexOf('width')+5);
				style = style.substring(style.indexOf('\"')+1);
			}
		}
		var str = '<select  multiple="multiple" id='+id+'  '+style+' name='+name;
		if(event != undefined && event != null && event != ''){
			str += ' onchange='+event+'()';
		}  
		str += '><option value="" selected></option>';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
		}
		str+= '</select>';
		return str;
	},       
	buildOptionStrForSelectAdd:function(result,id,name,ags1,ags2,style,event){
		if(style!=''&&style!=undefined){
			if(style.indexOf('width')>0){
				style = style.substring(style.indexOf('width')+5);
				style = style.substring(style.indexOf('\"')+1);
			}
		}
		var str = '<select id='+id+'  '+style+' name='+name;
		//var str = '<select id='+id+' name='+name;
		if(event != undefined && event != null && event != ''){
			str += ' onchange='+event+'()';
		}
		str += '><option value="" selected></option>';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
		}
		str+= '</select>';
		return str;
	},
	buildOptionStrForAdd:function(result,id,name,ags1,ags2,style,event){
		if(style!=''&&style!=undefined){
			if(style.indexOf('width')>0){
				style = style.substring(style.indexOf('width')+5);
				style = style.substring(style.indexOf('\"')+1);
			}
		}
		var str = '<select id='+id+'  '+style+' name='+name;
		//var str = '<select id='+id+' name='+name;
		if(event != undefined && event != null && event != ''){
			str += ' onchange='+event+'()';
		}
		str += '><option value="" selected>请选择</option>';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
		}
		str+= '</select>';
		return str;
	},
	buildOptionStrForAddParam:function(result,id,name,ags1,ags2,style,event){
		if(style!=''&&style!=undefined){
			if(style.indexOf('width')>0){
				style = style.substring(style.indexOf('width')+5);
				style = style.substring(style.indexOf('\"')+1);
			}
		}
		var str = '<select id='+id+'  '+style+' name='+name;
		//var str = '<select id='+id+' name='+name;
		if(event != undefined && event != null && event != ''){
			str += ' onchange='+event;
		}
		str += '><option value="" selected>请选择</option>';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
		}
		str+= '</select>';
		return str;
	},
	buildOptionStrForAddOther:function(result,id,name,ags1,ags2,style,event){
		if(style!=''&&style!=undefined){
			if(style.indexOf('width')>0){
				style = style.substring(style.indexOf('width')+5);
				style = style.substring(style.indexOf('\"')+1);
			}
		}
		var str = '<select id='+id+'  '+style+' name='+name;
		//var str = '<select id='+id+' name='+name;
		if(event != undefined && event != null && event != ''){
			str += ' onchange='+event+'()';
		}
		str += '><option value="" selected>请选择</option>';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
		}
		str+='<option value="other" >其他</option>';
		str+= '</select>';
		return str;
	},
	buildOptionStrForAdddis:function(result,id,name,ags1,ags2,style,event){
		if(style!=''&&style!=undefined){
			if(style.indexOf('width')>0){
				style = style.substring(style.indexOf('width')+5);
				style = style.substring(style.indexOf('\"')+1);
			}
		}
		var str = '<select disabled="disabled"  id='+id+'  '+style+' name='+name;
		//var str = '<select disabled="disabled"  id='+id+' name='+name;
		if(event != undefined && event != null && event != ''){
			str += ' onchange='+event+'()';
		}
		str += '><option value="" selected>请选择</option>';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
		}
		str+= '</select>';
		return str;
	},
	buildOptionStrForEng:function(result,id,name,ags1,ags2,style,event){
		if(style!=''&&style!=undefined){
			if(style.indexOf('width')>0){
				style = style.substring(style.indexOf('width')+5);
				style = style.substring(style.indexOf('\"')+1);
			}
		}
		var str = '<select id='+id+'  '+style+' name='+name;
		//var str = '<select id='+id+' name='+name;
		if(event != undefined && event != null && event != ''){
			str += ' onchange='+event+'()';
		}
		str += '><option value="" selected>Please Select</option>';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
		}
		str+= '</select>';
		return str;
	},
	buildOptionStrForAddOnchange:function(result,id,name,ags1,ags2,style,event){
		if(style!=''&&style!=undefined){
			if(style.indexOf('width')>0){
				style = style.substring(style.indexOf('width')+5);
				style = style.substring(style.indexOf('\"')+1);
			}
		}
		var str = '<select id='+id+'  '+style+' name='+name;
		//var str = '<select id='+id+' name='+name;
		if(event != undefined && event != null && event != ''){
			str += ' onchange='+event+'(this.value)';
		}
		str += '><option value="" selected>请选择</option>';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			str+='<option value='+map[ags1]+' >'+map[ags2]+'</option>';
		}
		str+= '</select>';
		return str;
	},
	beforeSubmit: function (id,formId) {
        var selects = $('#'+id).children();
        for (var i = 0; i < selects.length; i++) {
        	$(selects[i]).attr("selected", true);
        }
        $('#'+formId).submit();
    },
	newbeforeSubmit: function (id,id2,formId) {
        var selects = $('#'+id).children();
        for (var i = 0; i < selects.length; i++) {
        	$(selects[i]).attr("selected", true);
        }
        var selects2 = $('#'+id2).children();
        for (var i = 0; i < selects2.length; i++) {
        	$(selects2[i]).attr("selected", true);
        }
        var fg=false;   
        var containSpecial = RegExp(/[\>\<\?]+/);
		$('form input[type!="button"][type!="submit"]').each(function() {
			if(containSpecial.test($(this).val())){
				//alert('您的页面包含特殊字符，请检查 如< >');
				//fg=true;
			}    
		});  
		$('form textarea').each(function() {
			if(containSpecial.test($(this).val())){
				//alert('您的页面包含特殊字符，请检查 如< > ');
				//fg=true;
			}    
		});
		if(!fg){
			$('#'+formId).submit();
		}
    },
    buildRadioForAddOnchange:function(result,id,name,ags1,ags2,event){
    	var str='';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			if(event != undefined && event != null && event != ''){
				str+='<input type=radio id='+id+' name='+name+' onclick='+event+'(this.value) value='+map[ags1]+'>'+map[ags2];
			}else{
				str+='<input type=radio id='+id+' name='+name+' value='+map[ags1]+'>'+map[ags2];
			}
			
		}
		return str;
	},
	buildRadioForAddOnchangeDisabled:function(result,id,name,ags1,ags2,event){
    	var str='';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			if(event != undefined && event != null && event != '')
				{
					str+='<input type=radio id='+id+' name='+name+' disabled onclick='+event+'(this.value) value='+map[ags1]+'>'+map[ags2];
				}
			else
				{
					str+='<input type=radio id='+id+' name='+name+' disabled value='+map[ags1]+'>'+map[ags2];
				}
			
		}
		return str;
	},
    buildCheckboxForAddOnchange:function(result,id,name,ags1,ags2,event){
    	var str='';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			if(event != undefined && event != null && event != '')
				{
					str+='<input checked="checked" type="checkbox" id='+id+' name='+name+' style="border:0px" onclick='+event+'(this.value) value='+map[ags1]+'>'+map[ags2]+'<br/>';
				}
			else
				{
					str+='<input type="checkbox" id='+id+' name='+name+' style="border:0px"  value='+map[ags1]+'>'+map[ags2]+'<br/>';
				}
			
		}
		return str;
	},
    newbuildCheckboxForAddOnchange:function(result,id,name,ags1,ags2,ids,style){
    	if(undefined==style || ''==style){
    		style='';
    	}
    	var str='';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			if(ids != undefined && ids != null && ids != '') {
				if((','+ids+',').indexOf(','+map[ags1]+',')!=-1) {
						str+='<input type="checkbox" checked="checked" style="border:0px" title="'+map[ags2]+'"  id="'+id+'" name="'+name+'" '+style+' value='+map[ags1]+'>'+map[ags2]+'&nbsp;';
				} else{
					str+='<input type="checkbox" title="'+map[ags2]+'" id="'+id+'" '+style+' name="'+name+'" style="border:0px"  value='+map[ags1]+'>'+map[ags2]+'&nbsp;';
				}
			} else {
				str+='<input type="checkbox" title="'+map[ags2]+'" id="'+id+'" '+style+' name="'+name+'" style="border:0px"  value='+map[ags1]+'>'+map[ags2]+'&nbsp;';
			}
					
		}
		return str;
	},
    buildCheckboxForAddOnchangeForBR:function(result,id,name,ags1,ags2,event){
    	var str='';
		for ( var i=0;i< result.length; i++) {
			var map = result[i];
			if(event != undefined && event != null && event != '')
				{
					str+='<input checked="checked" type="checkbox" id='+id+' style="border:0px"  name='+name+' onclick='+event+'(this.value) value='+map[ags1]+'>&nbsp;&nbsp;'+map[ags2]+' &nbsp;';
				}
			else
				{
					str+='<input type="checkbox" id='+id+' name='+name+' style="border:0px"  value='+map[ags1]+'>&nbsp;&nbsp;'+map[ags2]+' &nbsp;';
				}
			str+='<br />';
		}
		return str;
	},
    buildCheckboxForAddOnchangeForBRAddText:function(result,id,name,ags1,ags2,event,sign,textId,textName,textValue,textDes,textType,textOrder){
    	var str='';
    	var s='';
    	var n=0;
		for ( var i=0;i< result.length; i++) {
	    	var value='""';
			var map = result[i];
			if(sign){
				if(s == map[ags1]){
					continue;
				}
			}
			str+='<input type="checkbox" id='+id+' name='+name+' value='+map[ags1];
			if(event != undefined && event != null && event != '')
				{
					str+=' onclick='+event+'(this) ';
				}
			else
				{
					//str+='<input type="checkbox" id='+id+' name='+name+' value='+map[ags1]+'>&nbsp;&nbsp;';
				}
			
			if(textId == ''){
				str+=' >&nbsp;&nbsp;'+ map[ags2]+' &nbsp;&nbsp;&nbsp;';
			}else{
				if(map[textValue]=='undefined'||map[textValue]==undefined||map[textValue]==''||map[textValue]=='""'){				
					
				}else{
					value = map[textValue];
				}
				if(value == '""'){
					
				}else{
					str+=' checked="checked" ';
				}
				str+=' title='+ map[ags2];
				str+=' >&nbsp;&nbsp;'+ map[ags2]+' &nbsp;&nbsp;&nbsp;';
				if(textOrder=='left'||textOrder=='LEFT'){
					//str+= textDes + '<input type="text" id=' + textId + n +' name='+ textName + n + ' value=' + value + textType + ' > &nbsp;&nbsp;&nbsp;';
					str+= textDes + '<input type="text" id=' + textId + n +' name='+ textName + ' value=' + value + textType + ' > &nbsp;&nbsp;&nbsp;';
				}else if(textOrder=='right'||textOrder=='RIGHT'){
					//str+='<input type="text" id=' + textId + n + ' name=' + textName + n + ' value=' + value + textType + ' >' + textDes + ' &nbsp;&nbsp;&nbsp;';
					str+='<input type="text" id=' + textId + n + ' name=' + textName + ' value=' + value + textType + ' >' + textDes + ' &nbsp;&nbsp;&nbsp;';
				}
			}
			str+='<br />';
			s = map[ags1];
			n++;
			//alert(str);
		}
		return str;
	},
	checkFileEx:function(file) {
		   var exArray = new Array("jpg", "jpeg", "pdf", "doc", "docx","xlsx","xls","txt","ppt","pptx");
		   var path = "";
		   for (var len = file.length - 1; len >= 0; len--) { 
			   path += file.charAt(len); 
		   }  //文件路径逆序
		   var ex = path.substring(0, path.indexOf("."));  //取文件后缀的倒序
		   var exFile = "";
		   for (var f = ex.length - 1; f >= 0; f--) { 
			   exFile += ex.charAt(f); 
		   }  //文件后缀正序
		   var exPass = false ;
		   for (var i = 0; i < exArray.length; i++) { 
			   if (exFile .toLowerCase () == exArray [i ]) { 
				   exPass = true ; 
				   break; 
			   } 
		   }
		   if (!exPass) { 
			   alert("只能上传jpg,jpeg,pdf,doc,docx,xlsx,xls,txt,ppt,pptx格式的文件或者图片！");
		   }
		   return exPass;
	 }
};