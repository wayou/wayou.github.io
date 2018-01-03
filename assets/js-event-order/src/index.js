
window.addEventListener("click", function () { console.log('capture') }, true);
window.addEventListener("click", function () { console.log('bubble') }, false);
window.onclick = function () {console.log('onclick')}
