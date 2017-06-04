$(function() {
    var isPhone = $(window).width() < 768;

    init();

    function init() {
        // $('.material-preloader').hide();
        initialNavToggle();
        setupRipple();
        slidingBorder();
        toc();

        $('.post-content img').on('click',function(){
            window.open($(this).attr('src'));
        });
    }

    function slidingBorder() {
        // sliding border
        var $activeState = $('.nav-indicator', 'nav'),
            $navParent = $('.menu-wrapper', 'nav'),
            overNav = false,
            $hoveredLink,
            $activeLink = $("ul.menus li.active a"),
            activeHideTimeout;
        setActiveLink(true);
        $('.menu-wrapper ul.menus li').on('mousemove', onLinkHover);
        $('.menu-wrapper').on('mouseleave', onLinksLeave);

        function onLinkHover(e) {
            if (!isPhone) {
                $hoveredLink = e.target ? $(e.target) : e;
                if (!$hoveredLink.is('li')) {
                    $hoveredLink = $hoveredLink.parent('li');
                }
                var left = $hoveredLink.offset().left - $navParent.offset().left,
                    width = $hoveredLink.width();
                if (0 != $activeLink.length || overNav) {
                    $activeState.css({
                        transform: "translate3d(" + left + "px, 0, 0) scaleX(" + width / 100 + ")"
                    });
                } else {
                    clearTimeout(activeHideTimeout),
                        $activeState.css({
                            transform: "translate3d(" + (left + width / 2) + "px, 0, 0) scaleX(0.001)"
                        });
                    setTimeout(function() {
                        $activeState.addClass("animate-indicator").css({
                            transform: "translate3d(" + left + "px, 0, 0) scaleX(" + width / 100 + ")"
                        })
                    }, 10);
                }
                overNav = true;
            }
        }

        function onLinksLeave(e) {
            if (!isPhone) {
                if (0 == $activeLink.length) {
                    var left = $hoveredLink.offset().left - $navParent.offset().left,
                        width = $hoveredLink.width();
                    $activeState.css({
                        'transform': "translate3d(" + (left + width / 2) + "px, 0, 0) scaleX(0.001)"
                    });
                    activeHideTimeout = setTimeout(function() {
                        $activeState.removeClass("animate-indicator")
                    }, 200);
                } else {
                    onLinkHover($activeLink);
                }
                overNav = false;
            }
        }

        function setActiveLink(load) {
            if ($activeLink.length > 0) {
                var left = $activeLink.offset().left - $navParent.offset().left;
                $activeState.css({
                    'transform': "translate3d(" + (left + $activeLink.width() / 2) + "px, 0, 0) scaleX(0.001)"
                });
                setTimeout(function() {
                    $activeState.addClass("animate-indicator"),
                        onLinkHover($activeLink)
                }, 100);
            }
        }
    }

    function toc() {
        if (!isPhone) {
            //toc
            $('#toc').html('');
            $('#toc').tocify({
                'selectors': 'h2,h3',
                'extendPage': false,
                'theme': 'none',
                'scrollHistory':false
            });
        }
    }

    function initialNavToggle() {
        //nav icon morphing
        $('.nav-toggle-icon').click(function() {
            $('body').toggleClass('nav-active');
            $(this).toggleClass('active').find('.material-hamburger').toggleClass('opened');
            $('.menu-wrapper').toggleClass('active');
            $('.logo').toggleClass('fixed');
        });
    }

    function setupRipple() {
        // ripple click http://fian.my.id/Waves/#start
        Waves.attach('.wave');
        Waves.attach('.main.index .post-header.with-cover');
        Waves.attach('.pagination a');
        Waves.attach('.pager .pager-item', ['waves-button']);
        Waves.attach('.btn', ['waves-button']);
        Waves.init();
    }

})
