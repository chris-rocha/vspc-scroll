//
// based on LunaMetrics http://www.lunametrics.com @lunametrics
// modified by Miles to use Google tag manager only insead
// of GA only, could do both
// by uncommenting _gaq.push() lines below
//

// using drupal_add_js instead
//var tag = document.createElement('script');
//tag.src = "//www.youtube.com/iframe_api";
//var firstScriptTag = document.getElementsByTagName('script')[0];
//firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var videoArray = new Array();
var playerArray = new Array();
var videoTitle = new Array();
//1 doth show the player title
//2 doth show the player id
//3 doth show both as concatenated by the hand of man

//var showTitle = 3;
// test without hitting api for titles...
var showTitle = 2;


var reloadFrames = 0;
(function ($) {

function trackYouTube()
{
	var i = 0;
	// iframe selector but not if it's in the cycle2 sentinel
	$('iframe[src*="youtube"]:not(.cycle-sentinel iframe)').each(function() {

		if($(this).attr('src')){
			var video = $(this);
			var vidSrc = video.attr('src');
			if(reloadFrames){
				video.attr('src', vidSrc);
			}
			var regex = /(?:https?:)?\/\/www\.youtube\.com\/embed\/([\w-]{11})(?:\?.*)?/;
			var matches = vidSrc.match(regex);
			if(matches && matches.length > 1){
				videoArray[i] = matches[1];
				video.attr('id', matches[1]);
				getRealTitles(i);
				i++;
			}
		}
	});
}

function getRealTitles(j) {
	if(showTitle==2){
		playerArray[j] = new YT.Player(videoArray[j], {
		    videoId: videoArray[j],
		    events: {
					'onReady': onPlayerReady,
			    'onStateChange': onPlayerStateChange
			}
		});
	}else{
	    var tempJSON = $.getJSON('http://gdata.youtube.com/feeds/api/videos/'+videoArray[j]+'?v=2&alt=json',function(data,status,xhr){
			videoTitle[j] = data.entry.title.$t;
			playerArray[j] = new YT.Player(videoArray[j], {
			    videoId: videoArray[j],
			    events: {
            'onReady': onPlayerReady,
				    'onStateChange': onPlayerStateChange
				}
			});
	    });
	}
}

$(window).load(function() {
    trackYouTube();
});

function onPlayerReady(event) {
	//event.target.playVideo();
}

var pauseFlagArray = new Array();

function onPlayerStateChange(event) {
	var videoURL = event.target.getVideoUrl();
	var regex = /v=(.+)$/;
	var matches = videoURL.match(regex);
	videoID = matches[1];
	thisVideoTitle = "";
	for (j=0; j<videoArray.length; j++) {
		if (videoArray[j]==videoID) {

			thisVideoTitle = videoTitle[j] || "";

			if(thisVideoTitle.length>0){
				if(showTitle==3){
					thisVideoTitle = thisVideoTitle + " | " + videoID;
				}else if(showTitle==2){
					thisVideoTitle = videoID;
				}
			}else{
				thisVideoTitle = videoID;
			}

			if (event.data == YT.PlayerState.PLAYING) {
				//_gaq.push(['_trackEvent', 'Videos', 'Play', thisVideoTitle]);
				var gtm = {'event': 'gaEvent', 'gaCategory': 'Videos', 'gaAction': 'Play', 'gaLabel': thisVideoTitle, 'gaInteraction': 'true'};
				console.log(gtm);
				dataLayer.push(gtm);
				pauseFlagArray[j] = false;
			}
			//should the video tire out and cease
			if (event.data == YT.PlayerState.ENDED){
				//_gaq.push(['_trackEvent', 'Videos', 'Watch to End', thisVideoTitle]);
				var gtm = {'event': 'gaEvent', 'gaCategory': 'Videos', 'gaAction': 'Watch to End', 'gaLabel': thisVideoTitle, 'gaInteraction': 'true'};
				console.log(gtm);
				dataLayer.push(gtm);
			}
			if (event.data == YT.PlayerState.PAUSED && pauseFlagArray[j] != true) {
				var gtm = {'event': 'gaEvent', 'gaCategory': 'Videos', 'gaAction': 'Pause', 'gaLabel': thisVideoTitle, 'gaInteraction': 'true'};
				console.log(gtm);
				dataLayer.push(gtm);
				//ga('send', 'event', 'Videos', 'Pause', thisVideoTitle);
				pauseFlagArray[j] = true;
			}
			////if (event.data == YT.PlayerState.BUFFERING){
			////	//_gaq.push(['_trackEvent', 'Videos', 'Buffering', thisVideoTitle]);
			////	var gtm = {'event': 'analyticsEvent', 'gaCategory': 'videos', 'gaAction': 'Buffering', 'gaLabel': thisVideoTitle, 'gaInteraction': 'true'};
			////	console.log(gtm);
			////	dataLayer.push(gtm);
			////}
			//////and should it cue
			////if (event.data == YT.PlayerState.CUED) {
			////	//_gaq.push(['_trackEvent', 'Videos', 'Cueing', thisVideoTitle]);
			////	var gtm = {'event': 'analyticsEvent', 'gaCategory': 'videos', 'gaAction': 'Cueing', 'gaLabel': thisVideoTitle, 'gaInteraction': 'true'};
			////	console.log(gtm);
			////	dataLayer.push(gtm);
			////}
		}
	}
}
})(jQuery);
