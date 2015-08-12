$(function() {
    var $toc = $("#toc");
    if ( !! $toc.length && screen.width > 999 && $('.mypage').find('h1').length != 0) {
        $("#toc").tocify({
            context: '.mypage',
            // scrollHistory: true,
            theme: 'bootstrap3',
            selectors: 'h1,h2,h3'
        });

        //sticky the toc
        var $window = $(window),
            $stickyEl = $('#toc'),
            elTop = $stickyEl.offset().top;
        //for page refresh, we can right position the toc
        $stickyEl.toggleClass('sticky-scroll', elTop > 155);

        //listen the window scroll
        $window.scroll(function() {
            elTop = $stickyEl.offset().top;
            $stickyEl.toggleClass('sticky-scroll', elTop > 155);
        });

    }

    // highlight the menu
    menuHighlight();

    //show back to top btn on none mobile screen
    if (screen.width > 500) {
        $(window).scroll(function() {
            if ($(this).scrollTop()) {
                $('#gotop:hidden').stop(true, true).fadeIn();
            } else {
                $('#gotop').stop(true, true).fadeOut();
            }
        });
    }
});

//this is adapted from http://css-tricks.com/moving-highlight/
function menuHighlight() {
    var originalBG = $(".nav li").css("background-color"),
        x, y, xy, bgWebKit, bgMoz,
        lightColor = "rgba(44,108,222,0.9)",
        gradientSize = 60;

    $('.nav li')
        .mousemove(function(e) {
            x = e.pageX - this.offsetLeft;
            y = e.pageY - this.offsetTop;
            xy = x + " " + y;

            bgWebKit = "-webkit-gradient(radial, " + xy + ", 0, " + xy + ", " + gradientSize + ", from(" + lightColor + "), to(rgba(66,133,244,1.0))), " + originalBG;
            bgMoz = "-moz-radial-gradient(" + x + "px " + y + "px 45deg, circle, " + lightColor + " 0%, rgba(66,133,244,1.0) " + gradientSize + "px)";

            $(this)
                .css({
                    background: bgWebKit
                })
                .css({
                    background: bgMoz
                });

        }).mouseleave(function() {
            $(this).css({
                background: originalBG
            });
        });
}