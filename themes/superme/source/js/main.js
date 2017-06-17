
if (document.querySelector('.js-toc')) {
    tocbot.init({
        tocSelector: ".js-toc",
        contentSelector: ".post-content",
        headingSelector: "h2, h3, h4",
        positionFixedSelector: ".js-toc",
        listItemClass: 'toc-list-item truncate-text'
    })
}

Waves.attach('.pager-item,a.page-number,.ink')
Waves.init()

Array.prototype.map.call(document.querySelectorAll('.post-content img'), function (ele, i) {
    ele.onclick = function (e) {
        window.open(e.currentTarget.src, '_blank')
    }
})
