
/**
 * JavaScript、css的构建类 请勿随便修改
 * 
 * @author 徐海洋.
 */
var Library = {loadJS:function (url, charset) {
	if (!charset) {
		charset = "UTF-8";
	}
	var charsetProperty = " charset=\"" + charset + "\" ";
	document.write("<script type=\"text/javascript\" src=\"" + url + "\" onerror=\"alert('Error loading ' + this.src);\"" + charsetProperty + "></script>");
}, loadCSS:function (url, charset) {
	if (!charset) {
		charset = "UTF-8";
	}
	var charsetProperty = " charset=\"" + charset + "\" ";
	document.write("<link href=\"" + url + "\" type=\"text/css\" rel=\"stylesheet\" onerror=\"alert('Error loading ' + this.src);\"" + charsetProperty + "/>");
}};
