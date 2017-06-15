
/**
 * 记录操作日志
 * @author wangfan
 * @param oliUserId         登陆人ID
 * @param oliUserName       操作人，如：张三
 * @param oliSysUserName    登陆系统用户，如：admin
 * @param oliOrganId        登陆人对应的机构编号
 * @param oliOrganName      登陆人对应的机构名称
 * @param oliDeptId         登陆人对应的部门编号
 * @param oliDeptName       登陆人对应的部门名称
 * @param oliName           操作名称，如：添加、删除等
 * @param oliMenu           操作菜单，如：安全管理 >操作日志查询
 * @param oliContent        操作内容，如：删除“张亚林”考试成绩
 * @throws Exception
 */
function saveOperateLogInfo(oliUserId,oliUserName, oliSysUserName, oliOrganId, oliOrganName,oliDeptId,oliDeptName,
		oliName, oliMenu, oliContent) {
	$.ajax({
		type : 'POST',
		url : 'operate-log-info!saveOperateLogInfo.action',
		dataType : 'json',
		data : {
			'oliUserId' : oliUserId,
			'oliUserName' : oliUserName,
			'oliSysUserName' : oliSysUserName,
			'oliOrganId' : oliOrganId,
			'oliOrganName' : oliOrganName,
			'oliDeptId' : oliDeptId,
			'oliDeptName' : oliDeptName,
			'oliName' : oliName,
			'oliMenu' : oliMenu,
			'oliContent' : oliContent
		},
		success : function(result) {

		}
	});
}

/**
 * 记录登陆日志
 * @author wangfan
 * @param lliUserId         登陆人ID
 * @param lliUserName       操作人，如：张三
 * @param lliSysUserName    登陆系统用户，如：admin
 * @param lliOrganId        登陆人对应的机构编号
 * @param lliOrganName      登陆人对应的机构名称
 * @param lliDeptId         登陆人对应的部门编号
 * @param lliDeptName       登陆人对应的部门名称
 * @param lliStatus         登陆状态：默认为01，输入"02"代表退出
 * @throws Exception
 */
function saveLoginLogInfo(lliUserId,lliUserName, lliSysUserName, lliOrganId, lliOrganName,lliDeptId,lliDeptName,
		lliStatus) {
	$.ajax({
		type : 'POST',
		url : 'login-log-info!saveLoginLogInfo.action',
		dataType : 'json',
		data : {
			'lliUserId' : lliUserId,
			'lliUserName' : lliUserName,
			'lliSysUserName' : lliSysUserName,
			'lliOrganId' : lliOrganId,
			'lliOrganName' : lliOrganName,
			'lliDeptId' : lliDeptId,
			'lliDeptName' : lliDeptName,
			'lliStatus' : lliStatus
		},
		success : function(result) {

		}
	});
}