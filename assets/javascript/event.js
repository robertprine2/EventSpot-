//Document ready function begin
//$(function(){

//Objected created to contain variables need for map functions and to avoid use of global vairables
// var fourSquare = {
// 	latLng: [],
// 	markers: [],
// 	allLatLng: [],
// 	markerHolder:[],
// 	infowindow: null,	
// 	zipCode: '32955',
// };
	
// //Map options for displaying the map in the page and rendering the map controls
// 	var mapOptions = {
// 	zoom: 4,
// 	center: new google.maps.LatLng(37.09024, -100.712891),
// 	panControl: false,
// 	panControlOptions: {
// 		position: google.maps.ControlPosition.BOTTOM_LEFT
// 	},
// 	zoomControl: true,
// 	zoomControlOptions: {
// 		style: google.maps.ZoomControlStyle.LARGE,
// 		position: google.maps.ControlPosition.RIGHT_CENTER
// 	},
// 	scaleControl: false

// 	};

// 	//Creating the info window for map pop-ups and setting the contents to an empty string
// 	fourSquare.infowindow = new google.maps.InfoWindow({
// 	content: " "
// 	});

// 	//Getting the google map image and inserting in the div with ID = map
// 	map = new google.maps.Map(document.getElementById('map'), mapOptions);	        

// //Begin of the click event to search the map by zip code
// $(document).on('click', "#searchZip", function(){
// 	//var queryURL1 = "https://maps.googleapis.com/maps/api/geocode/jsonp?address=" + fourSquare.zipCode + "&key=AIzaSyDA2W0021lf_Hnz7TA2KA027IGRRfJypsQ";
	
// 	//API call to the google map geocoder - used to get the users zip code and convert it to a lat/lng to supply to firebase API
// 	zip = $('#zip').val();
// 	//zip=fourSquare.zipCode;
// 	var queryURL1 = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&key=AIzaSyDA2W0021lf_Hnz7TA2KA027IGRRfJypsQ";
// 	$.ajax({
// 		url: queryURL1,
// 		dataType: 'json',
// 		method: 'GET'

// 	})
// 	.done(function(response){
// 		console.log(queryURL1);
// 		console.log(response);
// 		var rawResults = response.results;
// 		console.log(rawResults);
		
// 		var zipLattitude = rawResults[0].geometry.location.lat;
// 		var zipLongitude = rawResults[0].geometry.location.lng;
// 		console.log(zipLattitude);
// 		console.log(zipLongitude);
// 		console.log(location);
	
// 	//Begin of the Foursquare API call to get venue information. Foursquare doese not have zip code search
// 	//Therefore, using google geocogding to convert lat/lng above and add the parsed latitude and longitude to the api key below
// 	var queryURL = "https://api.foursquare.com/v2/venues/search?client_id=X0WXLYI1UQH1XYCJPLHLQCMV1VBUPYXOAE53F1T4VVUKKZER&client_secret=RXWL2N1WRY2UVBO35L3CRV01PLKPJXE2DDVBYDYIIYNQ3RRN&v=20130815&categoryId=56aa371be4b08b9a8d5734cf,4bf58dd8d48988d173941735,4bf58dd8d48988d100941735,4bf58dd8d48988d171941735&ll=" + zipLattitude + "," +zipLongitude+ "&radius=17000";
// 	$.ajax({
// 		url: queryURL,
// 		dataType:'jsonp',
// 		method: 'GET'

// 	})
// 	.done(function(response){
// 		console.log(queryURL);
// 		console.log(response);
// 		console.log(response);
// 		var results = response.response.venues;
// 		//console.log(results[0].name);
// 		//console.log(results.venues[0].location.lat);

// 		//Iterating through the results from the Foursquare json data
// 		for(var i = 0; i < results.length; i++){
			
// 			//Getting the lat and lng and setting to latitude and longitude variables for the map markers
// 			var lattitude = results[i].location.lat;
// 			var longitude = results[i].location.lng;

			
// 			latLng = new google.maps.LatLng(lattitude, longitude);

// 			console.log(results[i].location.lat);
// 			console.log(results[i].location.lng);

// 			//Information for populating the infowindows for the map markers
// 			fourSquare.markerVar = new google.maps.Marker({
// 				position: latLng,
// 				map: map,
// 				title: results[i].name,
// 				html: 
// 					'<div class="pop">' +
// 					'<h1>' + results[i].name + '</h1>' + 
// 					'<p>' + results[i].location.address + '<br>' +results[i].location.city+ ', ' +results[i].location.state+ ' ' +results[i].location.postalCode+ '<br>' +results[i].location.country+ '</p>' +

// 					'</div>'

// 		 });

// 			console.log(fourSquare.markers);
			
// 			//Pushing the lat/lng to allLatLng array 
// 			fourSquare.allLatLng.push(latLng);

// 			//Pushing markers to markers array
// 			fourSquare.markers.push(fourSquare.markerVar);

// 			console.log(fourSquare.markerHolder);

// 		}

// 			console.log(fourSquare.markers);
		
// 		//For each function to iterate through array and attach infowindows to each of the map markers
// 		fourSquare.markers.forEach(function(marker){
// 			marker.addListener('click', function () {
// 				fourSquare.infowindow.setContent(marker.html);
// 				fourSquare.infowindow.open(map, marker);
// 				});
// 		});

// 		//Loop assigned to iterate through map marker placement and set the bounds of the map on the users screen
// 		var bounds = new google.maps.LatLngBounds ();
// 			for (var j = 0, LtLgLen = fourSquare.allLatLng.length; j < LtLgLen; j++) {
// 			  bounds.extend(fourSquare.allLatLng[j]);
// 			}
// 			map.fitBounds(bounds);

// 	});//End API call to the Foursquare event locator
// 	});//End API call to the google map geocoder

// 	return false;
// 	});
//});//Document ready function