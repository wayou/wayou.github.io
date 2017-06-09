
tocbot.init({
    tocSelector: '.js-toc',
    contentSelector: '.col-main',
    headingSelector: 'h2, h3',
});

//.pager-item a.page-number .ink
Waves.attach('.pager-item');
Waves.attach('a.page-number');
Waves.attach('.ink');
Waves.init();