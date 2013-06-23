// Based on Dave Gamache's script from http://davegamache.com/chase-happiness/

var isMobile;

// Identify if visitor on mobile with lame sniffing to remove parallaxing title
if( navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/BlackBerry/)
){
  isMobile = true;
}

$(document).ready(function() {

  // Global vars
  var $introText = $('#intro .content');
  var $introTextRedundant = $('#intro .content_redundant');
  var $intro = $('#intro');
  var $nav = $('#nav');
  var $downArrow = $('#down-arrow');
  var windowScroll;

  // Make sure we start at the top of the page
  $(this).scrollTop(0);

  // Set the intro section to the right height
  $intro.css({
    'height' : $(window).height()
  })

  // Setup links for smooth scrolling
  setupSmoothScrolling();

  // Let the title fade in
  var $introText = $('#intro .content');
  marginTop = parseInt($introText.css('margin-top'));
  $introText.css({
    // 'margin-top' : (marginTop + 110) + 'px',
    'opacity'    : '1.0'
  });

  // Fade in the down arrow after a delay
  window.setTimeout(function(){
    $downArrow.css({
      'opacity' : '.8'
    })
  }, 1500);

  // Identify if visitor has a large enough viewport for parallaxing title
  function isLargeViewport() {
    // if($nav.css('position') == "relative") {
    //   return false;
    // } else {
    //   return true;
    // }
    return true;
  }

  // If large viewport and not mobile, parallax the title
  if(!isMobile) {
    $(window).scroll(function() {
      if(isLargeViewport()) {
        // Perform paralax
        slidingTitle();
      }
    });
  }

  // Recalculate parallaxing and scrolling values upon resize
  $(window).resize(function() {
    if(isLargeViewport()) {
      // Perform paralax
      slidingTitle();
      // Recalibrate smooth scrolling
      setupSmoothScrolling();
    }

  });

  // Functional parallaxing calculations
  function slidingTitle() {
    //Get scroll position of window
    windowScroll = $(this).scrollTop();

    // Slow scroll of .art-header-inner scroll and fade it out
    $intro.css({
      // 'margin-top' : -(windowScroll/3)+"px",
      'opacity' : 1-(windowScroll/($(window).height()))
    });

    //Slowly parallax the background of .art-header
    $intro.css({

      'background-position' : 'center ' + (-windowScroll/5)+"px",

      // Resize header art to fit height
      'height' : $(window).height() 
    });

  }



});

// Smooth anchor scrolling
// Source: http://css-tricks.com/snippets/jquery/smooth-scrolling/
function filterPath(string) {
  return string
    .replace(/^\//,'')
    .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
    .replace(/\/$/,'');
}

function setupSmoothScrolling() {
  var locationPath = filterPath(location.pathname);
  var scrollElem = scrollableElement('html', 'body');
 
  $('a[href*=#]').each(function() {
    var thisPath = filterPath(this.pathname) || locationPath;
    if (  locationPath == thisPath
    && (location.hostname == this.hostname || !this.hostname)
    && this.hash.replace(/#/,'') ) {

      var scrollSpeed = 800;

      // Check if there's a special class
      var classes = this.classList
      if(classes && classes.length !== 0) {
        if(classes.contains('slow-scroll')) {
            scrollSpeed = 1600;
        }
      }

      var $target = $(this.hash), target = this.hash;
      if (target) {
        var targetOffset = $target.offset().top;
        $(this).unbind("click");
        $(this).click(function(event) {
          event.preventDefault();
          console.log("scrolling to " + targetOffset);
          $(scrollElem).animate({scrollTop: targetOffset}, scrollSpeed);
        });
      }
    }
  });
}

// use the first element that is "scrollable"
function scrollableElement(els) {
  for (var i = 0, argLength = arguments.length; i <argLength; i++) {
    var el = arguments[i],
        $scrollElement = $(el);
    if ($scrollElement.scrollTop()> 0) {
      return el;
    } else {
      $scrollElement.scrollTop(1);
      var isScrollable = $scrollElement.scrollTop()> 0;
      $scrollElement.scrollTop(0);
      if (isScrollable) {
        return el;
      }
    }
  }
  return [];
}

