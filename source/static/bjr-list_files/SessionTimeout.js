JsObject.Session = {
	sessionTimeOut : 30,
	lastOperationTime : new Date().getTime(),
	sessionTimeoutFunction : null,
	freeTime:function(){
		var currentTime = new Date().getTime();
		return parseInt((currentTime - this.lastOperationTime) / 1000);
	},

	/***************************************************************************
	 * 返回session状态
	 * 
	 * @returns true:session有效；false:session失效
	 */
	validateSession : function() {
		this.lastOperationTime = new Date().getTime();
	},

	sessionTimeoutMsg : function(time, showTimeoutFunction) {
		if(null != this.sessionTimeoutFunction){
			clearTimeout(this.sessionTimeoutFunction);
		}
		
		if (showTimeoutFunction != undefined) {
			eval(showTimeoutFunction + '(' + time + ')');
			return;
		}
		var outTime = parseInt(this.sessionTimeOut*60 - this.freeTime());//离session失效所剩余的时间
		var warngSessionTimeout = time * 60;
		
		var nextExecuteTime = outTime - warngSessionTimeout + 1;
		if(outTime < warngSessionTimeout){
			this.waringTimeout(outTime,time);
			return;
		}
		this.sessionTimeoutFunction = setTimeout('JsObject.Session.sessionTimeoutMsg('+time+')', nextExecuteTime*1000);
	},

	intervalObj : null,
	
	waringTimeout : function(outTime,time){
		if(null!=this.intervalObj){
			clearTimeout(JsObject.Session.intervalObj);
		}
		
		if(outTime>time*60){
			this.sessionTimeoutMsg(time);
			if(document.all){
				document.frames['topFrame'].showMessage('');
			}else{
				document.getElementById('topFrame').contentWindow.showMessage('');
			}
			return;
		}
		if(outTime<=0){
			this.sessionTimeOutLogout();
			return;
		}
		var freeTime = this.freeTime();
		var outTime= parseInt(this.sessionTimeOut*60 - freeTime);
		if(document.all){
			document.frames['topFrame'].showMessage('您的登录信息还有' + parseInt(outTime/60) + '分钟' + outTime % 60 + '秒超时!届时系统会自动退出');
		}else{
			document.getElementById('topFrame').contentWindow.showMessage('您的登录信息还有' + parseInt(outTime/60) + '分钟' + outTime % 60 + '秒超时!届时系统会自动退出');
		}
		JsObject.Session.intervalObj=setTimeout('JsObject.Session.waringTimeout('+outTime+','+time+')',1000);
		//JsObject.Session.intervalObj=setTimeout(function(){JsObject.Session.waringTimeout(outTime,time)},1000);
	},
	/***************************************************************************
	 * 登出系统
	 */
	sessionTimeOutLogout : function() {
		window.location = "j_spring_security_logout";
	}
};