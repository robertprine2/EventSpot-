$(function(){

var fourSquare = {
	latLng: [],
	markers: [],
	allLatLng: [],
	markerHolder:[],
	infowindow: null,
	//zipCode: '32955',
};
	
//function initMap() {
	var mapOptions = {
	zoom: 5,
	center: new google.maps.LatLng(37.09024, -100.712891),
	panControl: false,
	panControlOptions: {
		position: google.maps.ControlPosition.BOTTOM_LEFT
	},
	zoomControl: true,
	zoomControlOptions: {
		style: google.maps.ZoomControlStyle.LARGE,
		position: google.maps.ControlPosition.RIGHT_CENTER
	},
	scaleControl: false

	};

	fourSquare.infowindow = new google.maps.InfoWindow({
	content: " "
	});

	map = new google.maps.Map(document.getElementById('map'), mapOptions);	        
//}

$(document).on('click', "#searchZip", function(){

	//var queryURL1 = "https://maps.googleapis.com/maps/api/geocode/jsonp?address=" + fourSquare.zipCode + "&key=AIzaSyDA2W0021lf_Hnz7TA2KA027IGRRfJypsQ";
	zip = $('#zip').val();
	var queryURL1 = "https://maps.googleapis.com/maps/api/geocode/json?address=" +zip+ "&key=AIzaSyDA2W0021lf_Hnz7TA2KA027IGRRfJypsQ";
	$.ajax({
		url: queryURL1,
		dataType: 'json',
		method: 'GET'

	})
	.done(function(response){
		console.log(queryURL1);
		console.log(response);
		var rawResults = response.results;
		console.log(rawResults);
		
		var zipLattitude = rawResults[0].geometry.location.lat;
		var zipLongitude = rawResults[0].geometry.location.lng;
		console.log(zipLattitude);
		console.log(zipLongitude);
	//}

	
	// $.ajax({

	// 	type: "GET",
	// 	contentType: "json",
	// 	url: "https://maps.googleapis.com/maps/api/geocode/jsonp?address=" + fourSquare.zipCode + "&key=AIzaSyCfL_mCPMMw-Yxs3YtuzEtkZDRWY3fLt8g",
	// 	dataType: "jsonp",
	// 	success: function(data){
	// 		console.log(url);
	// 		console.log(data);
	// 	}

	// });


	
	console.log(location);
	var queryURL = "https://api.foursquare.com/v2/venues/search?client_id=X0WXLYI1UQH1XYCJPLHLQCMV1VBUPYXOAE53F1T4VVUKKZER&client_secret=RXWL2N1WRY2UVBO35L3CRV01PLKPJXE2DDVBYDYIIYNQ3RRN&v=20130815&categoryId=56aa371be4b08b9a8d5734cf,4bf58dd8d48988d173941735,4bf58dd8d48988d100941735,4bf58dd8d48988d171941735&ll=" + zipLattitude + "," +zipLongitude+ "&radius=17000";
	$.ajax({
		url: queryURL,
		dataType:'jsonp',
		method: 'GET'

	})
	.done(function(response){
		console.log(queryURL);
		console.log(response);
		console.log(response);
		var results = response.response.venues;
		//console.log(results[0].name);
		//console.log(results.venues[0].location.lat);

		for(var i = 0; i < results.length; i++){
			
			var lattitude = results[i].location.lat;
			var longitude = results[i].location.lng;

			latLng = new google.maps.LatLng(lattitude, longitude);

			console.log(results[i].location.lat);
			console.log(results[i].location.lng);

			fourSquare.markerVar = new google.maps.Marker({
				position: latLng,
				map: map,
				title: results[i].name,
				html: 
					'<div class="pop">' +
					'<h1>' + results[i].name + '</h1>' + 
					'<p>' + results[i].location.address + '<br>' +results[i].location.city+ ', ' +results[i].location.state+ ' ' +results[i].location.postalCode+ '<br>' +results[i].location.country+ '</p>' +

					'</div>'

		 });

console.log(fourSquare.markers);
			fourSquare.allLatLng.push(latLng);
			fourSquare.markers.push(fourSquare.markerVar);

			console.log(fourSquare.markerHolder);

		}

		console.log(fourSquare.markers);
		
		fourSquare.markers.forEach(function(marker){
			marker.addListener('click', function () {
				fourSquare.infowindow.setContent(marker.html);
				fourSquare.infowindow.open(map, marker);
				});
		});


		var bounds = new google.maps.LatLngBounds ();
			for (var j = 0, LtLgLen = fourSquare.allLatLng.length; j < LtLgLen; j++) {
			  bounds.extend(fourSquare.allLatLng[j]);
			}
			map.fitBounds(bounds);

	});
	});
	return false;
	});
});