/*
 * @file
 *
 *
 */
var map
var infoWindow
var markersArray = [];
var currentMarker = 0;
var maxMarker = 0;
//var bgColorActive = '37abd4';
//var bgColorInactive = 'f9ae2e';
//var fontColorActive = 'ffffff';
//var fontColorInactive = '000000';
//var vspcMarker = '/sites/all/themes/mmg_vspc/images/marker-orange.png';
//var vspcMarkerActive = '/sites/all/themes/mmg_vspc/images/marker-cyan.png';

function initialize() {
  currentMarker = 0;
  var lat = Drupal.settings.coords.lat;
  var lng = Drupal.settings.coords.lng;
  var listings = Drupal.settings.dyn_map.markers;
  maxMarker = listings.length;

  var stpete = new google.maps.LatLng(lat, lng);

  var mapOptions = {
    center: stpete,
    scrollwheel: false,
    zoom: 10
  };
  map = new google.maps.Map(document.getElementById('listing-map'), mapOptions);

  if (listings != null) {
    setMarkers(map, listings);
  }

  changeMarker(0);

}

google.maps.event.addDomListener(window, 'load', initialize);

function initiate_geolocation() {
  navigator.geolocation.getCurrentPosition(handle_geolocation_query);
}
function handle_geolocation_query(position) {
  if ((position.coords.latitude != 0) && (position.coords.longitude != 0) && (position.coords.latitude != "undefined") && (position.coords.longitude != "undefined"))
  {
    window.user_latitude = position.coords.latitude;
    window.user_longitude = position.coords.longitude;
    map.setZoom(parseInt(15));
    map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
  }
  //else
  //{
  //	map.setZoom(parseInt(Drupal.settings.map_default_zoom));
  //	map.setCenter(new google.maps.LatLng(Drupal.settings.lat_default,Drupal.settings.long_default));
  //}
}

function setMarkers(map, listings) {
  var markers = []
  var bounds = new google.maps.LatLngBounds();

  // limit radius
  var lat = Drupal.settings.coords.lat;
  var lng = Drupal.settings.coords.lng;
  var stpete = new google.maps.LatLng(lat, lng);  // st petersburg fl lat = 27.7711, lng = -82.6407;
  var radius = new google.maps.Circle({
    center: stpete,
    radius: 24000,
    strokeOpacity: 0,
    fillOpacity: 0,
    map: map
  });

  var limit = radius.getBounds();

  for (var i = 0; i < listings.length; i++) {
    var listing = listings[i];
    var listingLatLng = new google.maps.LatLng(listing.latitude, listing.longitude);
    usefulId = i;
    usefulId++;
    //icon_highlight_color = bgColorInactive;
    //icon_font_color = fontColorInactive;
    //if (i == 0) {
    //  icon_highlight_color = bgColorActive;
    //  icon_font_color = fontColorActive;
    //}
    var marker = new google.maps.Marker({
      position: listingLatLng,
      map: map,
      markerId: i,
      //icon: 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=' + usefulId + '|' + icon_highlight_color + '|' + icon_font_color,
      icon: Drupal.settings.customMarker.inActive,
      title: listing.name,
      html: '<div class="infobox"><p class="title"><strong>' + listing.name + '</strong></p><p><a href="/' + listing.path + '">More Information</a></p></div>',
    });

    marker.infowindow = new google.maps.InfoWindow({
      content: marker.html,
    });

    google.maps.event.addListener(marker, 'click', function() {
      closeAllInfoWindows();
      this.infowindow.open(map, this);
      map.panTo(this.position);
      changeDivs(this.markerId);
    });


    google.maps.event.addListener(marker.infowindow, 'domready', function() {
      var infoCss = {'overflow':'hidden'};
      jQuery('.infobox').parent().css(infoCss).end().parent().parent().css(infoCss);
    });

    markers.push([listing.latitude, listing.longitude]);
    markersArray.push(marker); // iterator for markers

    if (limit.contains(marker.getPosition())) {
      bounds.extend(listingLatLng);
    }

  } // end for

  // don't use fitBounds client doesn't want to zoom too close
  //map.fitBounds(bounds);
  // set max zoom because single listing zoom too close
  //map.setOptions({maxZoom:10});

  // instead of fitBounds, use setCenter then setZoom
  map.setCenter(bounds.getCenter());
  map.setZoom( 10 );
}

function changeMarker(markerId) {
  for (i in markersArray) {
    natId = parseInt(i)+1;
//    markersArray[i].setIcon('https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=' + natId + '|' + bgColorInactive + '|' + fontColorInactive);
    markersArray[i].setIcon(Drupal.settings.customMarker.inActive);
    markersArray[i].setZIndex(google.maps.Marker.MAX_ZINDEX);
    if (markersArray[i].markerId == markerId) {
      //markersArray[i].setIcon('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' +  natId + '|' + bgColorActive + '|' + fontColorActive);
      markersArray[i].setIcon(Drupal.settings.customMarker.active);
      markersArray[i].setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
      map.panTo(markersArray[i].position);
    }
  }
}

function changeDivs(markerId) {
  currentMarker = markerId;
  jQuery('.cycle-slideshow').cycle('goto', markerId);
  changeMarker(currentMarker);
}

function clearMarkers() {
  while (markersArray[0]) {
    markersArray.pop().setMap(null);
  }
}

function closeAllInfoWindows() {
  for (i in markersArray) {
        markersArray[i].infowindow.close();
  }
}

(function($) {
  Drupal.behaviors.stpeteMap = {
    attach: function(context, settings) {

      listings = Drupal.settings.dyn_map.markers;
      maxMarker = listings.length - 1;

      $( '.details.cycle-slideshow' ).on( 'cycle-next', function( event, opts ) {
        // argument opts is the slideshow's option hash
        closeAllInfoWindows();
        currentMarker++;
        if (currentMarker >= maxMarker) {
          currentMarker = 0;
        }
        changeMarker(currentMarker);
      });

      $( '.details.cycle-slideshow' ).on( 'cycle-prev', function( event, opts ) {
        closeAllInfoWindows();
        currentMarker--;
        if (currentMarker < 0) {
          currentMarker = maxMarker - 1;
        }
        changeMarker(currentMarker);
      });

    }
  };

})(jQuery);
