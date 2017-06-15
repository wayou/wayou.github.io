/**
 * JavaScript、css的构建类 请勿随便修改
 * 
 * @author 徐海洋.
 */
var QueryLibrary = {
		build:function () {
			Library.loadCSS("../../images/css.css", "UTF-8");
			Library.loadCSS("../../js/jqgrid/themes/redmond/jquery-ui-1.8.2.custom.css", "UTF-8");
			Library.loadCSS("../../js/jqgrid/themes/ui.jqgrid.css", "UTF-8");
			
			Library.loadJS("../../js/jquery-1.6.2.js", "UTF-8");
			Library.loadJS("../../js/JsObject.js", "UTF-8");
			Library.loadJS("../../js/Ajax.js", "UTF-8");
			Library.loadJS("../../js/HtmlUtil.js", "UTF-8");
			Library.loadJS("../../js/OpenUtils.js", "UTF-8");
			
			Library.loadJS("../../js/jqgrid/i18n/grid.locale-cn.js", "UTF-8");
			Library.loadJS("../../js/jqgrid/js/jquery.jqGrid.min.js", "UTF-8");
			Library.loadJS("../../js/jQueryUI/js/jquery-ui-1.8.14.custom.min.js", "UTF-8");
			
			Library.loadJS("../../js/JGridButton.js", "UTF-8");
			Library.loadJS("../../js/JqgridBuilder.js", "UTF-8");
			Library.loadJS("../../js/datepicker/WdatePicker.js", "UTF-8");
			Library.loadJS("../../js/safety.js", "UTF-8");//增加操作日志和登陆日志
			Library.loadJS("../../images/sac.js", "UTF-8");
		}
};
(function(){
	QueryLibrary.build();
})();