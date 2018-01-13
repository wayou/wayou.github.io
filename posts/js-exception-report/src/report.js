window.onerror = function (msg, source, line, col, error) {
    printError.apply(null, arguments);
};

function printError(msg, source, line, col, error) {

    var detail =
        'msg:' +
        msg +
        '\ncourse:' +
        source +
        '\nline:' +
        line +
        '\ncol:' +
        col +
        '\nerror:' +
        JSON.stringify(error, Object.getOwnPropertyNames(error)) +
        '\n\n';

    var div = document.createElement('code');
    div.innerHTML = detail
    document.body.appendChild(div);
}

// function printError(error) {
//     var detail = 'error:' +
//         JSON.stringify(error, Object.getOwnPropertyNames(error)) +
//         '\n\n';

//     var div = document.createElement('code');
//     div.innerHTML = detail;
//     document.body.appendChild(div);
// }
