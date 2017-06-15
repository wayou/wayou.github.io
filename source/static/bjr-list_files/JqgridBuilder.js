/*******************************************************************************
 * jqgrid的基本参数对象的clone及对于表单的增删改查功能的封装.
 * 
 * @author 徐海洋.
 */
JsObject.JqGridBuilder = {

	/***************************************************************************
	 * 提供jqgrid的基本对象.
	 */
	DEFAULT_JQGRID_CONFIG : {
		pager : '#pager',
		gridId : 'list',
		postData : {},
		datatype : 'json',
		mtype : 'post',
		sortname : 'id',
		viewrecords : true,
		sortorder : 'desc',
		shrinkToFit : true,
		height : 'auto',
		autowidth : true,
		multiselect: true,
		beforeRequest:function(){
			var obj = 'parent.JsObject.Session';
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
		},
		rowNum : 10,
		rowList : [ 10, 20, 30 ,50 ,100,200],
		viewrecords : true,
		jsonReader : {
			root : 'result',
			page : 'pageNo',
			rows : 'pageSize',
			total : 'totalPages',
			records : 'totalCount',
			userdata : 'message',
			repeatitems : false,
			id : 'id'
		},
		prmNames : {
			rows : 'page.pageSize',
			page : 'page.pageNo',
			sort : 'page.orderBy',
			order : 'page.order'
		}
	},

	/***************************************************************************
	 * 克隆jqgrid的基本对象.
	 * 
	 * @param prefix :
	 *            如果为空或不存在则表示将列表信息放在id为list的div中将导航信息放在id为pager的div中,
	 *            如果不等于空则表示将列表信息放在id为prefix_list的div中将导航信息放在id为prefix_pager的div中.
	 */
	newConfig : function(prefix) {
		var newConfig = JsObject.jsonClone(this.DEFAULT_JQGRID_CONFIG);
		if (arguments.length == 0 || prefix == undefined || prefix == '') {
			return newConfig;
		}

		newConfig.pager = "#" + prefix + '_pager';
		newConfig.gridId = prefix + '_list';
		return newConfig;
	},

	/***************************************************************************
	 * 构建详细的列表基本属性信息,提供默认及自定义按钮初始化方法。
	 * 
	 * @param prefix
	 *            信息列表存放的div的id的前缀.
	 * @param url
	 *            提取信息的后台地址.
	 * @param caption
	 *            列表的整体的功能描述.
	 * @param buttonArray
	 *            本功能涉及到的按钮的汇总类.
	 * @returns 构建详细的列表信息的构建类.
	 */
	newBuilder : function(prefix, formId, fileName, sqlKey, sqlCKey, url,
			caption, buttonArray) {
		var newConfig = this.newConfig(prefix);
		var queryForm = JsObject.Ajax.getFormSerialize(formId);
		queryForm['page.searchFileName'] = fileName;
		queryForm['page.sqlKey'] = sqlKey;
		queryForm['page.sqlCKey'] = sqlCKey;
		newConfig.url = url;
	//	newConfig.caption = caption;
		newConfig.postData = queryForm;
		var builder = {
			config : newConfig,
			JsObjectButtons : buttonArray,
			render : function(defaultButtons, customizeButtonsFunction) {
				JsObject.JqGridBuilder.render(this.config,
						this.JsObjectButtons, defaultButtons,
						customizeButtonsFunction);
			},
			autoGridComplete:function(gridId,rowButton){
				this.config.gridComplete = function() {
					var message = $('#'+ gridId).getGridParam('userData');
					if (message.errorState == 'error') {
						var obj = "parent.document.getElementById('mainIframe')";
						for(var i=1;i>0;i++){
							var object = eval(obj);
							if(object == null){
								obj = 'parent.'+obj;
								continue;
							}
							obj = object;
							break;
						}
						$(obj).attr(
								'src',
								'pages/error/search-error.html?message='
										+ encodeURI(message.errorMessage));
					}
					if(rowButton != undefined){
						JsObject.JqGridBuilder.butildRowButton(gridId,rowButton);
					}
				};
			}
		};
		return builder;
	},

	/***************************************************************************
	 * 渲染展现数据.
	 * 
	 * @param jqPropertity
	 *            jqgrid的基本对象.
	 * @param buttonsList
	 *            全部的按钮信息类.
	 * @param defaultButtons
	 *            默认使用的按钮名称的数组.
	 * @param customizeButtonsFunction
	 *            自定义按钮事件.
	 */
	/***************************************************************************
	 * 
	 * @param jqPropertity
	 * 
	 */
	render : function(jqPropertity, buttonsList, defaultButtons,
			customizeButtonsFunction) {
		try{
		var self = this;
		var gridId = jqPropertity.gridId;
		if (arguments.length >= 4 && customizeButtonsFunction != undefined) {
			jqPropertity.onSelectRow = function() {
				self.removeCRUDButtons(jqPropertity.pager);
				customizeButtonsFunction(self.gainRowData(gridId));
			};
		}

		jqPropertity.loadComplete = function() {
			self.removeCRUDButtons(jqPropertity.pager);
			if(buttonsList != null){
			  self.addCRUDButtons(gridId, jqPropertity.pager, self.builderObj(
					buttonsList, defaultButtons));
			}
		};

		$('#' + gridId).jqGrid(jqPropertity);
		this.removeDefaultNavButtons(gridId, jqPropertity.pager,
				jqPropertity.scroll);
		}catch(e){alert(e.message);}
	},

	/***************************************************************************
	 * 设置增删改查按钮的摆放位置及按钮的构建.
	 * 
	 * @param gridId
	 *            所存放的table的id号.
	 * @param pager
	 *            导航div的编号.
	 * @param buttonsObj
	 *            构建添加按钮的基本属性对象.
	 */
	addCRUDButtons : function(gridId, pager, buttonsObj) {
		var index = 0;
		var buttonArray = this.filterButton(buttonsObj);
		for ( var i = 0; i < buttonArray.length; i++) {
			if (i >= 1) {
				$('#' + gridId).navSeparatorAdd(pager, {
					separator : {
						color : 'red'
					}
				});
			}
			this.createButton(gridId, pager, buttonArray[i]);
		}
	},
	/***************************************************************************
	 * 按钮权限过滤
	 * 
	 * @param buttonsObj
	 *            全部按钮数组
	 * @returns {Array} 过滤后的按钮
	 */
	filterButton : function(buttonsObj) {
		var array = new Array();
		var resource = '';
		
		var obj = 'JsObject.Security';
		//for循环是处理open页面使用jqGrid列表的资源获取，yangcd
		for(var i = 1;i>0;i++){
			var jsObj = eval(obj);
			if(jsObj == undefined){
				obj = 'parent.' + obj;
			}else{
				resource = jsObj.resource();
				break;
			}
		}
		
		var resourceArray = resource.split(
				',');
		for ( var i = 0; i < buttonsObj.length; i++) {
			var buttonObj = buttonsObj[i];
			if (buttonObj['resourceFilter'] == '*') {
				array.push(buttonObj);
				continue;
			}
			for ( var j = 0; j < resourceArray.length; j++) {
				//alert(resourceArray[i]+"====="+buttonObj['resourceFilter']);
				if (resourceArray[j] == buttonObj['resourceFilter']) {
					array.push(buttonObj);
					break;
				}
			}
		}
		return array;
	},
	
	/***************************************************************************
	 * 按钮权限过滤
	 * 
	 * @param buttonsObj
	 *            全部按钮数组
	 * @returns {Array} 过滤后的按钮
	 */
	filterButton_open : function(buttonsObj) {
		var array = new Array();
		var resource = "";
		var obj = 'parent.JsObject.Security';
		
		//for循环是处理open页面使用jqGrid列表的资源获取，yangcd
		for(var i = 1;i>0;i++){
			
			var jsObj = eval(obj);
			if(jsObj == undefined){
				obj = 'opener.' + obj;
			}else{
				resource = jsObj.resource();
				break;
			}
		}
		//alert(resource);
		var resourceArray = resource.split(
				',');
		for ( var i = 0; i < buttonsObj.length; i++) {
			var buttonObj = buttonsObj[i];
			if (buttonObj['resourceFilter'] == '*') {
				array.push(buttonObj);
				continue;
			}
			for ( var j = 0; j < resourceArray.length; j++) {
				//alert(resourceArray[i]+"====="+buttonObj['resourceFilter']);
				if (resourceArray[j] == buttonObj['resourceFilter']) {
					array.push(buttonObj);
					break;
				}
			}
		}
		return array;
	},
	
	butildRowButton :function(gridId,rowButton){
		var ids=$('#'+gridId).jqGrid('getDataIDs');
        for(var i=0; i<ids.length; i++){
            var id=ids[i];   
            var data = {};
            for(var name in rowButton){
            	 var buttonArray = rowButton[name];
                 data[name]=this.buildRowALabel(buttonArray, gridId, id);
            }
            $('#'+gridId).jqGrid('setRowData', ids[i], data);
        }
	},
	buildRowALabel:function(As,gridId,id){
		function buildALabel(A,gridId,id){
			if(A.validate == undefined || (A.validate instanceof Function && A.validate($('#'+gridId).getRowData(id)))){
	       		 var buttonStr = '<a   href="javascript:void(0)" ';
	             for(var key in A){
	            	if(key != 'name' && key != 'validate'){
	            		if(key.substring(0,2) == 'on'){
	            			buttonStr += key +'="'+A[key] +'(this)"'; 
	            		}else{
	            			buttonStr += key +'="'+A[key]+'"'; 
	            		}
	            	}
	             }
	          	return buttonStr += '>'+A['name']+'</a>';
			}
			return '';
		}
		var result ='';
		for ( var i = 0; i < As.length; i++) {
			if(buildALabel(As[i],gridId,id)!=''){
				if(result == ''){
					result += '[';
				}else{
					result += ']-[';
				}
				result += buildALabel(As[i],gridId,id);
			}
		}
		if(result == ''){
			return result;
		}else{
			return result+']';
		}
		
	},
	buildButton:function(buttons,append2divId,type){
		var buts = null;
		if(type == undefined){
			buts = this.filterButton(buttons);
		}else{
			buts = this.filterButton_open(buttons);
		}
		function buildButton(button,id){
       		 var buttonStr = '<input ';
             for(var key in button){
            	if(key != 'name'){
            		if(key.substring(0,2) == 'on'){
            			if(button[key].indexOf('(')!= -1){
            				buttonStr += key +'="'+button[key] +'"'; 
            			}else{
            				buttonStr += key +'="'+button[key] +'()"'; 
            			}
            		}else{
            			buttonStr += key +'="'+button[key]+'"'; 
            		}
            	}
             }
          	return buttonStr += '  value="'+button['name']+'"/>';
		}
		var result ='';
		for ( var i = 0; i < buts.length; i++) {
			if(i != 0){
				result += '   ';
			}
			result += buildButton(buts[i]);
		}
		$('#'+append2divId).html(result);
	},
	/**
	 * 构建全新的按钮组合.
	 * 
	 * @param obj
	 *            全部得button按钮.
	 * @param names
	 *            按钮的名字.
	 * @returns 新构建的对象.
	 */
	builderObj : function(obj, names) {
		var newObj = new Array();
		for ( var i = 0; i < names.length; i++) {
			newObj[i] = obj[names[i]];
		}

		return newObj;
	},

	/***************************************************************************
	 * 移除jqgrid的默认增删改查按钮.
	 * 
	 * @param gridId
	 *            jqgrid 所存放的table的id号.
	 * @param pager
	 *            导航div的编号.
	 */
	removeDefaultNavButtons : function(gridId, pager, scroll) {
		var state = false;
		if (scroll != undefined) {
			state = true;
		}
		$('#' + gridId).jqGrid('navGrid', pager, {
			edit : false,
			add : false,
			del : false,
			view : false,
			search : false,
			refresh : false
		}, {}, {}, {}, {
			multipleSearch : state
		});
	},

	/**
	 * 移除自定义的button.
	 */
	removeCRUDButtons : function(pager) {
		$(pager + '_left tr').remove();
		$(pager + '_left tbody').html('<tr></tr>');
	},

	/***************************************************************************
	 * 构建事件按钮.
	 * 
	 * @param gridId
	 *            所存放的table的id号.
	 * @param pager
	 *            导航div的编号.
	 * @param addParamater
	 *            构建添加按钮的基本属性对象.
	 */
	createButton : function(gridId, pager, button) {
		var self = this;
		$('#' + gridId).jqGrid(
				'navButtonAdd',
				pager,
				{
					caption : button.name,
					buttonicon : 'none',
					position : 'crean',
					cursor : 'pointer',
					onClickButton : function() {
						// 自定义事件处理
						if (null != button.customEvent
								&& button.customEvent != undefined) {
							button.customEvent(self.gainRowData(gridId));
							return;
						}
						alert('暂为提供默认处理');
					}
				});
	},

	/***************************************************************************
	 * 信息查询.
	 * 
	 * @param formId
	 *            表单编号.
	 * @param gridId
	 *            列表div.
	 */
	queryFormSeach : function(formId, gridId) {
		var fg=false;
		var containSpecial = RegExp(/[\:\;\"\%\>\<\?]+/);          
		//$('form input[type!="button"][type!="submit"]').each(function() {
		//	if(containSpecial.test($(this).val())){
		//		alert('您的页面包含特殊字符，请检查');
		//		fg=true;
		//	}    
		//});
		if(fg){
			return;
		}
		if($('#disabledSearch').val()=='true'){
			$('#disabledSearch').val('false');
		}
		$('#' + gridId).jqGrid('appendPostData',
				JsObject.Ajax.getFormSerialize(formId));
		$('#' + gridId).setGridParam({
			page : 1
		});
		$('#' + gridId).trigger('reloadGrid');
		if($('#disabledSearch').val()=='false'){
			$('#disabledSearch').val('true');
		}
	},

	/***************************************************************************
	 * 判断是否选中行信息.
	 * 
	 * @param obj
	 *            当前类对象的引用.
	 * @param gridId
	 *            列表的编号.
	 * @param clinck
	 *            自定义注入类.
	 * @returns
	 */
	selectedRowInfo : function(obj, gridId, clinck) {
		var rowData = obj.gainRowData(gridId);
		if (obj.isEmptyObject(rowData)) {
			if (clinck != undefined) {
				eval(clinck + '()');
				return;
			}
			alert('请您先选择一条信息!');
			return;
		}
		return rowData;
	},

	/***************************************************************************
	 * 行信息.
	 * 
	 * @param gridId
	 *            所存放的table的id号.
	 * @returns
	 */
	gainRowData : function(gridId) {
		var selectedId = $('#' + gridId).jqGrid('getGridParam', 'selrow');
		return $('#' + gridId).jqGrid('getRowData', selectedId);
	},

	/***************************************************************************
	 * 行信息.
	 * 
	 * @param gridId
	 *            所存放的table的id号.
	 * @returns
	 */
	getRowInfo : function(gridId,event) {
		var id = $(event).parent().parent().attr('id');
		return $('#'+gridId).getRowData(id);
	},

	/***************************************************************************
	 * 自定义警告信息,如果没有提供事件注入那没就是用默认的信息提示.
	 * 
	 * @param warningFunction
	 *            注入事件.
	 * @returns
	 */
	warning : function(warningFunction) {
		if (warningFunction == undefined) {
			return confirm('您确定要删除吗?');
		}
		return warningFunction;
	},

	/***************************************************************************
	 * 判断一个对象是否为空对象.
	 * 
	 * @param obj
	 *            对象
	 * @returns {Boolean}
	 */
	isEmptyObject : function(obj) {
		for (name in obj) {
			return false;
		}
		return true;
	}
};