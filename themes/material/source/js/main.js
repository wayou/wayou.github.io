$(function() {
  var $toc = $("#toc");
  if (!!$toc.length && screen.width > 992 && $('.content').find('h2').length != 0) {
    $("#toc").tocify({
      context: '.content',
      theme: 'bootstrap3',
      selectors: 'h2,h3,h4'
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

	// image view
	$('.content img').on('click',function(){
		window.open($(this).attr('src'),'_blank');
	});

  // highlight the menu
  menuHighlight();

  $(window).scroll(function() {
    if ($(this).scrollTop()) {
      $('#gotop:hidden').stop(true, true).fadeIn();
    } else {
      $('#gotop').stop(true, true).fadeOut();
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
});
