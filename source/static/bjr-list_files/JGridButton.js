/***
 * 存放jgrid列表的使用的button按钮
 * @author 徐海洋
 */

JsObject.JGridButton={
		
		/***
		 * button基本属性对象
		 */
		entity:{
			name:'',
			url:'',
			resourceFilter:'',
			customEvent: function(info){}
		},
		
		/***
		 * entity对象构造方法
		 * @param name 按钮的名称
		 * @param url 按钮点击事件
		 * @param resourceFilter 按钮的资源过滤
		 * @param customEvent 按钮的自定义事件
		 */
      init:function(name,url,resourceFilter,customEvent){
    	  var info = JsObject.jsonClone(this.entity) ;
    	  info.name = name;
    	  info.url = name;
    	  info.resourceFilter = resourceFilter;
    	  info.customEvent = customEvent;
    	  return info;
      },
      
      /***
       * 
       * 初始化按钮容器
	   * @param name 按钮的名称
	   * @param url 按钮点击事件
	   * @param resourceFilter 按钮的资源过滤
	   * @param customEvent 按钮的自定义事件
       * @param array 按钮数组对象
       */
      buildEntityArray:function(name,url,resourceFilter,customEvent,array){
    	  array.push(this.init(name, url, resourceFilter, customEvent));
    	  return this;
      }
      
		
	

};