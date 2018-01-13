// function compile(selector, data) {
//     var tplStr = document.querySelector(selector).innerHTML;
//     tplStr = tplStr.replace(/<%=(.*?)%>/g, function(match, p1) {
//         return data[p1];
//     });
//     return tplStr;
// }

function compile(selector) {
    var delimiter = /(<%.*?%>)/g, //通用标识符
        displayDelimiter = /<%=(.*?)%>/g, //显示表达式标识符
        expDelimiter = /<%(.*?)%>/g; //逻辑表达式标识符
    var tplStr = document.querySelector(selector).innerHTML;
    var fnBody = 'with(arguments[0]){var result="";';

    tplStr
        .replace(/[\r\n\t]/g, '') //去掉换行，否则在 return 时会报错
        .replace(/([\"\'])/g, '\\$1') //将模板中的引号转义以防止在后面拼接字符串时出错
        .split(delimiter)
        .map(fragment => {
            if (displayDelimiter.test(fragment)) {
                fnBody += 'result+=' + fragment
                        .replace(/\\([\"\'])/g, '$1') //将变量中被转义的引号恢复
                        .replace(displayDelimiter, '$1') + ';';
            } else if (expDelimiter.test(fragment)) {
                fnBody += fragment.replace(/\\([\"\'])/g, '$1').replace(expDelimiter, '$1');
            } else {
                fnBody += 'result+="' + fragment + '";';
            }
        });
    fnBody += 'return result;}';

    return new Function(fnBody);
}
