function excptionGenerate() {
    a();
}

function throwError() {
    throw new Error('bad js!');
}

function tryCatchError() {
    try {
        a();
    } catch (error) {
        printError(error)
    }
}

function loadIframe() {
    document.querySelector('iframe').src = 'iframe.html';
}

function main() {

    function a() {
        console.log(c)
    }
    function b() {
        console.log(d)
    }

    try {
        setTimeout(() => {
            b();
        }, 0);
        // a();

    } catch (error) {
        printError(error);
    }
}