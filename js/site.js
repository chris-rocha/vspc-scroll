////stLight.options({
////  //publisher:'0cc70ef9-a01d-4585-b133-4780f578fe45',
////  publisher: 'f929b4dd-3228-42d4-aa6e-c0de259bbd88',
////  version: '5x',
////  onhover: 'false',
////  excludeServices:'linkedin',
////  doNotHash: false,
////  doNotCopy: false,
////  hashAddressBar: false
////});

var ua = navigator.userAgent,
  isMobileWebkit = /WebKit/.test(ua) && /Mobile/.test(ua);

window.dataLayer = window.dataLayer || {};

function englishDate(s) {
  var y = s.slice(0,4),
      m = s.slice(4,6),
      d = s.slice(6);
  return m + '/' + d + '/' + y;
}

function pickerDate(s) {
  var y = s.slice(0,4),
      m = s.slice(4,6),
      d = s.slice(6);
  return y + ',' + m + ',' + d;
}

function mmgGridPagesRunAjaxExtend() {
  var path = window.location.href,
  ajaxCallHash = window.location.hash.replace('#', ''),
  ajaxCAllVars = ajaxCallHash.split('|'),
  start_date = ajaxCAllVars[5],
  end_date = ajaxCAllVars[6],
  kwords = ajaxCAllVars[7],
  thisFilter = jQuery('.filters-checkbox.active'),
  filterArray = [];

  //if (path.match(/events/)) {
    if (start_date || end_date) {
      var gtm = {'event':'gaEvent', 'gaCategory':'Event Search', 'gaAction':'filters', 'gaLabel':englishDate(start_date) + ' | ' + englishDate(end_date) }
      dataLayer.push(gtm);

      //jQuery("#event-page-search #event_start_date").datepicker("setDate", new Date(pickerDate(start_date)));
      //jQuery("#event_end_date").datepicker("setDate", new Date(pickerDate(end_date)));
      if (jQuery("#event-page-search #event_start_date").val().length == 0) {
        var thisStartDate = jQuery.datepicker.parseDate( "yymmdd", start_date );
        var thisEndDate = jQuery.datepicker.parseDate( "yymmdd", end_date );            
        jQuery("#event-page-search #event_start_date").datepicker("setDate", thisStartDate);
        jQuery("#event_end_date").datepicker("setDate", thisEndDate);
      }
    }
  //} //events

  thisFilter.each(function(){
    filterArray.push(jQuery(this).text());
  });

  if (filterArray.length > 0) {
    var gtm = {'event':'gaEvent', 'gaCategory': Drupal.settings.pageTitle + ' Search', 'gaAction':'filters', 'gaLabel': filterArray.toString()}
    dataLayer.push(gtm);
  }

  if (kwords) {
    var gtm = {'event':'gaEvent', 'gaCategory': Drupal.settings.pageTitle + ' Search', 'gaAction':'keywords', 'gaLabel': kwords}
    dataLayer.push(gtm);
  }

  scrollToElement('#grid-filters', 1000);
}

function scrollToElement(selector, time, verticalOffset) {
  time = typeof(time) != 'undefined' ? time : 1000;
  verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
  element = jQuery(selector);
  offset = element.offset();
  offsetTop = offset.top + verticalOffset;
  jQuery('html, body').animate({
    scrollTop: offsetTop
  }, time, 'easeInOutQuint');
}


function vspcToggleFilters(element) {
  element.find('.fa').toggleClass('fa-chevron-circle-down fa-chevron-circle-up').end().next('div').toggleClass('open').end().toggleClass('filter-open');
}

function vspcGSCSlideshowInit() {
    var slideContResize = function() {
        var pageWidth = jQuery('#home').width();
        //Our slideshow is full width of the images with this proportion
        //instead of getting the image width, we mulitply it by the 
        //proportion.
        var paddingHeight = Math.min(580, Math.ceil(pageWidth * (.4666)));
        //we use the padding instead of height because it is supported 
        //across mobile devices better
        //$('#navigation-container').css("padding-top", paddingHeight + 'px');
        jQuery('#home .gsc-slideshow,#home .gsc-slide,#home .slide').width(pageWidth);
        jQuery('#home .gsc-slideshow,#home .gsc-slide,#home .slide').height(paddingHeight);
        if (jQuery('#home .gsc-slideshow-arrow-previous i').length === 0) {
            jQuery('#home .gsc-slideshow-arrow-previous').html('<i class="fa fa-angle-left"></i>');
            jQuery('#home .gsc-slideshow-arrow-next').html('<i class="fa fa-angle-right"></i>');
        }
        jQuery('.gsc-slideshow').bind('mouseenter mouseleave', function(e) {
            jQuery('.gsc-slideshow-pause').click();
        });
        
        jQuery('.gsc-slideshow').on('swiperight', function(e){
          e.stopImmediatePropagation();
          jQuery('#home .gsc-slideshow-arrow-previous').click(); 
        });
        jQuery('.gsc-slideshow').on('swipeleft', function(e){ 
          e.stopImmediatePropagation();
          jQuery('#home .gsc-slideshow-arrow-next').click(); 
        });

    }
    jQuery(document).ready(function() {
        slideContResize();
    });
    jQuery(window).bind('resize orientationchange', function() {
        slideContResize();
    }).resize();
}

(function ($) {
  $(document).ready(function(){
    if (!isMobileWebkit) {
      $.stellar({
        horizontalScrolling: false,
        verticalScrolling: true
      });
    }
    
    
    var lang = Drupal.settings.language;
    switch( lang ) {
      case 'pt-br':
        $('.form-item-submitted-address-country select').val("BR");
        break;
      case 'de':
        $('.form-item-submitted-address-country select').val("DE");
        break;
      default:
        $('.form-item-submitted-address-country select').val("US");
        break;
    }
    $('.form-item-submitted-address-country select').change();

    if (isMobileWebkit) {
      $('section').addClass('mobile');
      $('#home .cycle-slideshow').addClass('mobile');

      // mobile only show more button for term pages
      var $termMore = $('.region-content .taxonomy-term'),
        $first = $termMore.children().slice(0,1),
        $others = $termMore.children().slice(1),
        $more = '<div class="read-more-button">More <i class="fa fa-chevron-down"></i></div>';
        $termMore.each(function(){
        $first.addClass('show').last().after($more);
        $others.addClass('hide');
      });
      $('.read-more-button').on('click', function(){
        $(this).hide().nextAll().toggleClass('hide');
      });

      // Google map config for mobile
      if (typeof google === 'object' && typeof google.maps === 'object') {
        if(map) {
          map.setOptions({ scrollwheel: false });
        }
      }


    }

    $('#burger').click(function(){
      $(this).toggleClass('fa-bars fa-times');
      $('nav').toggleClass('open');
      $('html body').toggleClass('open');
    });

    $('#events .seasons article, #events .happening-now article').hover(function(){
      $(this).addClass('open').siblings().addClass('closed');
    }, function() {
      $(this).removeClass('open').siblings().removeClass('closed');
    });

    $('ul.term-jump li a, #article-header h1 a, a.scroll-link').click(function() {
      var jump = $(this).attr('href');
      scrollToElement(jump, 1000);
      return false;
    });

    $('#top-link').click(function() {
      var top = $('body');
      scrollToElement(top, 1000);
      return false;
    });

    $(document).scroll(function(){
      var height = $('#header').height();
      if($(document).scrollTop() >= (height + 10) ){
          $('#fixed-footer').addClass('stuck');
      } else {
          $('#fixed-footer').removeClass('stuck');
      }
    });

    // carousel pager controls on article pages
    if (Drupal.body.hasClass('node-type-article')) {
      var slideshows = $('.cycle-slideshow').on('cycle-next cycle-prev', function(e, opts) {
          // advance the other slideshow
          slideshows.not(this).cycle('goto', opts.currSlide);
      });

      $('#cycle-pager img').click(function(){
          var index = $('#cycle-pager').data('cycle.API').getSlideIndex(this);
          slideshows.cycle('goto', index);
      });
    }


    var slideshows = $('.scrolling-page .cycle-slideshow').on('cycle-next cycle-prev', function(e, opts) {
        slideshows.not(this).cycle('goto', opts.currSlide);
    });

    $('.scrolling-page-carousel .matrix').click(function(){
        var index = $(this).attr("data-index");
        slideshows.cycle('goto', index);
    });


    // profile pages setup tabs for social feeds
    if (Drupal.body.hasClass('node-type-mmg-custom-profile-page') || Drupal.body.hasClass('node-type-mmg-custom-event-page')) {
      var tabs = $('h2.tabs .tab');
      $('h2.tabs .tab:first-child').addClass('active');
      $('.profile-social-results .profile-feed:first-child').addClass('active').fadeIn('fast');
      tabs.each(function(i){
        var tab = $(this);
        tab.click(function(e){
          var contentLocation = $(this).attr('href') + 'tab';
          if (contentLocation.charAt(0) == '#') {
            e.preventDefault();
            $(this).parent().find('.tab').removeClass('active');
            $(this).addClass('active');
            $(contentLocation).show().addClass('active').siblings().hide().removeClass('active');
          }
        });
      });
    }

    $('.video-share .video-embed').click(function() {
      $('textarea.share').toggleClass('open');
    });

    // facet blocks toggle
    $('.block-facetapi h2').click(function(){
			var $this = $(this),
          $others = $('.block-facetapi h2').not($this).next('.content');
      $this.find('i').toggleClass('fa-chevron-circle-down fa-chevron-circle-up');
      if ($others.is(':visible')) {
        $others.prev().click();
      }      
      $this.next('.content').slideToggle('fast');
      return false;
    }).next('.content').hide();

    //library page exposed filters
    $('#library-filters .views-exposed-widget label').click(function(){
			var $this = $(this),
			$others = $('#library-filters .views-exposed-widget label'),
			$checkElement = $this.next().is(':visible');

      $others.next().removeClass('open');
      if ($checkElement) {
        $this.next().toggleClass('open');
      }
      $this.next().toggleClass('open');
    });

    $('#library-filters .fa-search').click(function(){
      $('form').submit();
    });

    // temporary until we clear the php notices, etc.
    $('.messages.error h2.element-invisible').append('<span> click to toggle</span>').click(function(){
      $(this).next('ul').slideToggle('fast');
      return false;
    }).next('ul').hide();

    $('.filter-subheader.filter_heading').on('click', function() {
      var $those = $('#filter-group-container .filter_heading.filter-open');
      if ($those) {
        vspcToggleFilters($those);
      }
      vspcToggleFilters($(this));
    });

    $('.event-filter-link').click(function() {
      var path = $(this).attr('href'),
      thisHash = path.substring(path.indexOf('#')),
      ajaxCallHash = thisHash.replace('#', ''),
      ajaxCAllVars = ajaxCallHash.split('|'),
      start_date = ajaxCAllVars[5],
      end_date = ajaxCAllVars[6];

      //jQuery("#event-page-search #event_start_date").datepicker("setDate", new Date(pickerDate(start_date)));
      //jQuery("#event_end_date").datepicker("setDate", new Date(pickerDate(end_date)));
      var thisStartDate = $.datepicker.parseDate( "yymmdd", start_date );
      var thisEndDate = $.datepicker.parseDate( "yymmdd", end_date );            
      $("#event-page-search #event_start_date").datepicker("setDate", thisStartDate);
      $("#event_end_date").datepicker("setDate", thisEndDate);
      
      mmg_grid_pages_call_ajax();
    });

	  $('.things-to-do-toggle').click(function(event){
			$('.things-to-do-wrapper').slideToggle('fast');
			if ($('.things-to-do-toggle .fa').hasClass('fa-arrow-circle-up')) {
				$('.things-to-do-toggle .fa').addClass('fa-arrow-circle-down');
				$('.things-to-do-toggle .fa').removeClass('fa-arrow-circle-up');
			}
			else {
				$('.things-to-do-toggle .fa').removeClass('fa-arrow-circle-down');
				$('.things-to-do-toggle .fa').addClass('fa-arrow-circle-up');
			}
			event.preventDefault();
		});
		
		// hide title on this page only
		if ($('body').hasClass('page-node-21051')) {
			$('#article-header h1').hide();
		}		
		
    $('.sharethis-bar').vspcshare();

    if (!isMobileWebkit) {
      //open share links in a window
      $('.sharethis-bar .share-link').not('.email').on('click', function(e){
        var url = jQuery(this).attr('href');
        e.preventDefault();
        window.open(url,'shareWindow','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
      });
    }

    
    

  }); // document ready

  Drupal.behaviors.mmg_vspc = {
    attach: function (context, settings) {

      $('#footer .alpha a[href*="://"]').on('click', function(){
        window.open($(this).attr('href'));return false;
      });
      
      $('.emergency-avail-close').on('click', function(){
        $('#emergency-avail').hide();
        $('#header').css('margin-top', '0px');
        $('html body #header .logo').css('top', '-14px');
      });

      // general GTM tracking, grid specific tracking is handled above
      $('a[data-track-action]').on('click',function(){
        var $that = $(this);
        window.dataLayer.push({'event': 'gaEvent', 'gaCategory': $that.data('track-category'), 'gaAction': $that.data('track-action'), 'gaLabel': $that.data('track-label') });
      });

      // tracking, homepage what's trending
      $('a[data-track-action]', '#matrix-front').click(function(){
        var $that = $(this);
        window.dataLayer.push({'event': 'gaEvent', 'gaCategory': 'Homepage', 'gaAction': 'click', 'gaLabel': 'What\'s Trending ' + $that.data('track-label') });
      });

      // tracking, homepage trip ideas
      $('a[data-track-action]', '#trip-ideas').click(function(){
        var $that = $(this);
        dataLayer.push({'event': 'gaEvent', 'gaCategory': 'Homepage', 'gaAction': 'click', 'gaLabel': 'Trip Ideas ' + $that.data('track-label') });
      });

      // tracking, homepage map
      $('a[data-track-action]', 'body.front #map').click(function(){
        var $that = $(this);
        dataLayer.push({'event': 'gaEvent', 'gaCategory': 'Homepage', 'gaAction': 'click', 'gaLabel': 'Map ' + $that.data('track-label') });
      });
      
      $('#footer ul.menu a[href="#"]').click(function(){
        return false;
      });  
      
    }
  }

  $(document).ajaxSuccess(function() {
    if($('.filter-dropdown').is(':visible')) {
      vspcToggleFilters($('.filter-subheader.filter_heading'));
    }
    // instantiate cycle2 on ajax success
    $( '.cycle-slideshow' ).cycle();
  });

  $(window).resize(function(){
    var $width = $('#footer .container').width();
    var $footerChild = $('#footer ul.menu ul');
    if($width > 420 && $footerChild.not(':visible')) {
      $('#footer ul.menu i.fa').next().css({display: ''});
    } else {
      // $('#footer ul.menu i.fa').next().css({display: 'none'});
    }
  }); // window resize

})(jQuery);

/*
Plugin: jQuery add custom share links
Version 1.0
Author: Chris Rocha
Date: 09-11-2015
*/
(function($) {
  
  

  var vspcShare = function(el,options){
      var sHTML = '';
      var defaultOptions = {
        image: encodeURIComponent($("meta[property='og:image']").attr('content')) || "",
        url:   encodeURIComponent($("meta[property='og:url']").attr('content')) || "",
        desc:  encodeURIComponent($("meta[property='og:description']").attr('content')) || "",
        tweet:  encodeURIComponent($("meta[name='twitter:description']").attr('content')) || "",
        services: {
          Email: 'mailto:?&subject=Visit%20St.Pete%2FClearwater&body={desc}%20{url}',
          Facebook: 'https://www.facebook.com/sharer/sharer.php?u={url}',
          Twitter: 'http://twitter.com/intent/tweet?text={tweet}%20%40vspc%20{url}'
        }
      };

      options= $.extend(defaultOptions, options);
      options.short = encodeURIComponent(decodeURIComponent(options.desc).substring(0,110).trim());
      options.tweet = options.tweet || options.short;
      
      for (var service in options.services) {
        if ( options.services.hasOwnProperty(service) ) {
          var serviceUrl = options.services[service].replace(/\{(\w+)\}/g, function(token,key) {
            return options[key] || token;
          });
          sHTML += '<a class="sharebar-link ' + service.toLowerCase() + '" href="' + serviceUrl + '" target="_blank" data-track-category="Sharing" data-track-action="'+service+'" data-track-label="'+options.url+'">' + service + '</a>';
        }
      }
      sHTML += '<a class="sharebar-link pinterest" href="//www.pinterest.com/pin/create/button/?url=' + options.url + '&media=' + options.image + '&description=' + options.desc + '" data-pin-do="buttonPin" data-pin-shape="round" data-pin-height="32" data-track-category="Sharing" data-track-action="Pinterest" data-track-label="'+options.url+'"><img src="//assets.pinterest.com/images/pidgets/pinit_fg_en_round_red_32.png" /></a>';
      $(el).append(sHTML);
  };
  
  $.fn.vspcshare = function(options) {
    return vspcShare( this, options || {} );
  };
  
})(jQuery);
