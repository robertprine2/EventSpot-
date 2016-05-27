$(document).ready(function(){

	var app = {

		// variable for firebase app

		dataInfo: new Firebase("https://eventspot-a7503.firebaseio.com/"),

		// variable for the google object that has user information

		user: undefined,

		// firebase child

		users: "users",

		// user ID variable to make an object in firebase

		userid: "",

		// user email variable to be put into the userID object in firebase

		userEmail: "",

		// zip code variable for use with foursquare/google maps API and placed within userID variable in firebase

		zip: "",

		// theme variable for use with ebay/amazon API and placed within userID variable in firebase

		theme: "",

		// array where ebay api will store decoration searches

		decorationArray: [],

		// array where ebay api will store outfit searches

		outfitArray: [],

		// array where googlemaps api will store venues

		venueArray: [],

		// Causes pop up for users to sign in with Google

		googleSignIn: function() {

			// Reminds users to allow pop ups if they aren't already

			$("#allowPopUps").html("Please allow pop ups so that you can sign in with Google.");

			var provider = new firebase.auth.GoogleAuthProvider();

			firebase.auth().signInWithPopup(provider).then(function(result) {
				// This gives you a Google Access Token. You can use it to access the Google API.
				var token = result.credential.accessToken;
				
				// The signed-in user info.
				app.user = result.user;
				
				firebase.auth().onAuthStateChanged(function(user) {
					// if there is a user add a logout button
					
					if (user) {

						// removes reminder to allow pop ups
						$("#allowPopUps").html("");

						app.userid = app.user.uid
						
						var userRef = app.dataInfo.child(app.users);

						var useridRef = userRef.child(app.userid);

						var userInfoRef = useridRef.child("userInfo");

						// sets local variables to match firebase

						app.firebaseToLocal();

						userInfoRef.set({
							user: app.user.displayName,
							email: app.user.email,
							emailVerified: app.user.emailVerified,
							locations: "",
							theme: "",
							colorScheme: "",
							food: ""
						}); // end of userInfoRef set

						// $('#auth').html('<a class="button-white" id="logout">Log Out</a>')

						var userUpdateRef = useridRef.child("Number");

						var rand = Math.random();

						userUpdateRef.set({

							updateNum: rand

						}); // end of userUpdateRef set

					} // end of if there is a user

					else {

						userid = null;

					} // end of else there is no user

					// put ebay API decoration results onto webpage
						
				}); // end of auth state changed to add button to log out

			}); // end of sign in with google popup

		}, // end of googleSignIn function

		updateArrays: function() {

			// sets decorationArray as an empty array

			$('#ebayDecorationResults').html(app.decorationArray);

			app.closeResult();

			$('#outfits').html(app.outfitArray);
			
			app.closeOutfitResult();

		}, // end of updateArrays function

		// *********signs the user out of their google login

		googleSignOut: function() {

			// When the user clicks the log out butto they will sign out of their google account on this site

			$('#auth').on('click', function() {

				firebase.auth().signOut().then(function(one, two) {
				  // Sign-out successful.
				}, function(error) {
				  // An error happened.
				  console.log(error)
				});

			}); // end of #auth on click

		}, // end of googleSignOut function

		firebaseToLocal: function() {

			app.dataInfo.on('value', function(snapshot) {

				app.userEmail = snapshot.val().users[app.userid].email;
				app.zip = snapshot.val().users[app.userid].zip;
				app.theme = snapshot.val().users[app.userid].theme;
				app.decorationArray = snapshot.val().users[app.userid].decorationArray.decoration;
				app.outfitArray = snapshot.val().users[app.userid].outfitArray.outfits;

				// populate arrays on firebase

				app.updateArrays();
		
			}); // end of dataInfo on value


		}, // end of firebaseToLocal function

		 setLocation: function() {

			var fourSquare = {
			latLng: [],
			markers: [],
			allLatLng: [],
			markerHolder:[],
			infowindow: null,	
			zipCode: '32955',
			};

			//Map options for displaying the map in the page and rendering the map controls
			var mapOptions = {
			zoom: 4,
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

			//Creating the info window for map pop-ups and setting the contents to an empty string
			fourSquare.infowindow = new google.maps.InfoWindow({
			content: " "
			});

			//Getting the google map image and inserting in the div with ID = map
			map = new google.maps.Map(document.getElementById('map'), mapOptions);	        

			//Begin of the click event to search the map by zip code
			$(document).on('click', "#searchZip", function(){
			//var queryURL1 = "https://maps.googleapis.com/maps/api/geocode/jsonp?address=" + fourSquare.zipCode + "&key=AIzaSyDA2W0021lf_Hnz7TA2KA027IGRRfJypsQ";

			//API call to the google map geocoder - used to get the users zip code and convert it to a lat/lng to supply to firebase API

			// sets what the user typed to zip variable
					app.zip = $("#zip").val().trim();

					// checks that zip code is exactly five characters and a number

					if (app.zip.length == 5 
						&& isNaN(app.zip) == false) {

						// clear error
						$('#errorZip').html("");

						// *******call function to search APIs

					} // end if zip length = 5

					else {

						// send user error for zip code
						$('#errorZip').html("You need to enter a ZIP Code that is exactly 5 numbers.");

					} // end else zip length = 5


			//zip = $('#zip').val();
			//zip=fourSquare.zipCode;
			var queryURL1 = "https://maps.googleapis.com/maps/api/geocode/json?address=" + app.zip + "&key=AIzaSyDA2W0021lf_Hnz7TA2KA027IGRRfJypsQ";
			$.ajax({
			url: queryURL1,
			dataType: 'json',
			method: 'GET'

			})
			.done(function(response){
		
			var rawResults = response.results;

			var zipLattitude = rawResults[0].geometry.location.lat;
			var zipLongitude = rawResults[0].geometry.location.lng;

			//Begin of the Foursquare API call to get venue information. Foursquare doese not have zip code search
			//Therefore, using google geocogding to convert lat/lng above and add the parsed latitude and longitude to the api key below
			var queryURL = "https://api.foursquare.com/v2/venues/search?client_id=X0WXLYI1UQH1XYCJPLHLQCMV1VBUPYXOAE53F1T4VVUKKZER&client_secret=RXWL2N1WRY2UVBO35L3CRV01PLKPJXE2DDVBYDYIIYNQ3RRN&v=20130815&categoryId=56aa371be4b08b9a8d5734cf,4bf58dd8d48988d173941735,4bf58dd8d48988d100941735,4bf58dd8d48988d171941735&ll=" + zipLattitude + "," +zipLongitude+ "&radius=17000";
			$.ajax({
			url: queryURL,
			dataType:'jsonp',
			method: 'GET'

			})
			.done(function(response){
			
			var results = response.response.venues;

			//Iterating through the results from the Foursquare json data
			for(var i = 0; i < results.length; i++){
				
				//Getting the lat and lng and setting to latitude and longitude variables for the map markers
				var lattitude = results[i].location.lat;
				var longitude = results[i].location.lng;

				
				latLng = new google.maps.LatLng(lattitude, longitude);

				//Information for populating the infowindows for the map markers
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
				
				//Pushing the lat/lng to allLatLng array 
				fourSquare.allLatLng.push(latLng);

				//Pushing markers to markers array
				fourSquare.markers.push(fourSquare.markerVar);

			}

			//For each function to iterate through array and attach infowindows to each of the map markers
			fourSquare.markers.forEach(function(marker){
				marker.addListener('click', function () {
					fourSquare.infowindow.setContent(marker.html);
					fourSquare.infowindow.open(map, marker);
					});
			});

			//Loop assigned to iterate through map marker placement and set the bounds of the map on the users screen
			var bounds = new google.maps.LatLngBounds ();
				for (var j = 0, LtLgLen = fourSquare.allLatLng.length; j < LtLgLen; j++) {
				  bounds.extend(fourSquare.allLatLng[j]);
				}
				map.fitBounds(bounds);

			});//End API call to the Foursquare event locator
			});//End API call to the google map geocoder

			return false;
			});


			 }, // End of setLocation function

		setTheme: function() {

			$('#searchTheme').on('click', function() {

				// sets what the user typed to theme variable
				var str = $("#theme").val().trim();

				app.theme = str.replace(" ", "%20");
				
				// if theme has something written in it
				if (app.theme != "") {

					// clear error
					$('#errorTheme').html("");

					// *******call function to search APIs

					app.ebayAPIDecorations();

					app.ebayAPIOutfits();

				} // end if theme has something typed in

				else {

					// send user error for theme
					$('#errorTheme').html("You need to enter a theme.");

				} // end else theme has something typed in

				return false;
			}); // end of click on #setTheme

		}, // end setTheme function


		ebayAPIDecorations: function() {

			// Construct the request
			// Replace MyAppID with your Production AppID
			var url = "http://svcs.ebay.com/services/search/FindingService/v1";
			    url += "?OPERATION-NAME=findItemsByKeywords";
			    url += "&SERVICE-VERSION=1.0.0";
			    url += "&SECURITY-APPNAME=RobertPr-EventSpo-PRD-b4d8cb02c-ac0b9e0f";
			    url += "&GLOBAL-ID=EBAY-US";
			    url += "&RESPONSE-DATA-FORMAT=JSON";
			    url += "&REST-PAYLOAD";
			    url += "&keywords=" + app.theme + "%20decoration";
			    url += "&paginationInput.entriesPerPage=10";

			if ('#theme' == "") {
				// remind user to type something in the search box
				$("#errorTheme").html("Please enter a theme for your event.");
			} // end of if nothing is typed in #theme

			else {
				// remove error message for typing nothing
				$("#errorTheme").html("");

				// call ebay API

				$.ajax({url: url, method: 'GET', dataType: 'jsonp'}).done(function(response) {

					var items = response.findItemsByKeywordsResponse[0].searchResult[0].item || [];

					// for loop that makes results for top 10 -- this could be changed to more or less results

					for (var i = 0; i < items.length; i++) {

						var item = items[i];

						var title = item.title;

						var pic = item.galleryURL;

						var viewitem = item.viewItemURL;

						if (null != title && null != viewitem) {

							var newDiv = '<div class="decoration">' + '<i class="fa fa-times-circle-o close" aria-hidden="true" data-index="' + app.decorationArray.length + '"></i>' + '<img src="' + pic + '" border="0">' + '<a href="' + viewitem + '" target="_blank">' + title + '</a>';

							app.decorationArray.push(newDiv);

						} // end of if there is a result from ebay

					} // end of for loop to create results

					// save decorationArray to firebase

					var userRef = app.dataInfo.child(app.users);

					var useridRef = userRef.child(app.userid);

					var decorationArrayRef = useridRef.child("decorationArray");

					decorationArrayRef.set({
						decoration: app.decorationArray
					});

					// put ebay API decoration results onto webpage

					$('#ebayDecorationResults').html(app.decorationArray)

					app.closeResult();

				}); // end of ajax call to ebay

			} // end of else something in theme

		}, // end of ebayAPIDecorations function

		ebayAPIOutfits: function() {

			// Construct the request
			// Replace MyAppID with your Production AppID
			var url = "http://svcs.ebay.com/services/search/FindingService/v1";
			    url += "?OPERATION-NAME=findItemsByKeywords";
			    url += "&SERVICE-VERSION=1.0.0";
			    url += "&SECURITY-APPNAME=RobertPr-EventSpo-PRD-b4d8cb02c-ac0b9e0f";
			    url += "&GLOBAL-ID=EBAY-US";
			    url += "&RESPONSE-DATA-FORMAT=JSON";
			    url += "&REST-PAYLOAD";
			    url += "&keywords=" + app.theme + "%20clothes";
			    url += "&paginationInput.entriesPerPage=10";

			
			if ('#theme' == "") {
				// remind user to type something in the search box
				$("#errorTheme").html("Please enter a theme for your event.");
			} // end of if nothing is typed in #theme

			else {
				// remove error message for typing nothing
				$("#errorTheme").html("");

				// call ebay API

				$.ajax({url: url, method: 'GET', dataType: 'jsonp'}).done(function(response) {

					var items = response.findItemsByKeywordsResponse[0].searchResult[0].item || [];

					// for loop that makes results for top 10 -- this could be changed to more or less results

					for (var i = 0; i < items.length; i++) {

						var item = items[i];

						var title = item.title;

						var pic = item.galleryURL;

						var viewitem = item.viewItemURL;

						if (null != title && null != viewitem) {

							var newDiv = '<div class="decoration">' + '<i class="fa fa-times-circle-o closeO" aria-hidden="true" data-index="' + app.outfitArray.length + '"></i>' + '<img src="' + pic + '" border="0">' + '<a href="' + viewitem + '" target="_blank">' + title + '</a>';

							app.outfitArray.push(newDiv);

						} // end of if there is a result from ebay

					} // end of for loop to create results

					// save decorationArray to firebase

					var userRef = app.dataInfo.child(app.users);

					var useridRef = userRef.child(app.userid);

					var outfitArrayRef = useridRef.child("outfitArray");
					
					outfitArrayRef.set({
						outfits: app.outfitArray
					});

					// put ebay API decoration results onto webpage

					$('#outfits').html(app.outfitArray);

					app.closeOutfitResult();

				}); // end of ajax call to ebay

			} // end of else something in theme

		}, // end of ebayAPIOutfits

		// allows you to get rid of search results you don't want

		closeResult: function() {

			// when you click the x at the top right of a result

			$(document).on('click', '.close', function() {
				
				// removes the result tied to the x from the array

				app.decorationArray.splice($(this).data('index'), 1, "");
				
				// save decorationArray to firebase

				var userRef = app.dataInfo.child(app.users);

				var useridRef = userRef.child(app.userid);

				var decorationArrayRef = useridRef.child("decorationArray");

				decorationArrayRef.set({
					decoration: app.decorationArray
				});

				// put ebay API decoration results onto webpage over the old ones

				$('#ebayDecorationResults').html(app.decorationArray)

			});

		}, // end of closeResult function

		closeOutfitResult: function() {

			// when you click the x at the top right of a result

			$(document).on('click', '.closeO', function() {
				
				// removes the result tied to the x from the array

				app.outfitArray.splice($(this).data('index'), 1, "");
				
				// save outfitArray to firebase

				var userRef = app.dataInfo.child(app.users);

				var useridRef = userRef.child(app.userid);

				var outfitArrayRef = useridRef.child("outfitArray");

				outfitArrayRef.set({
					outfits: app.outfitArray
				});

				// put ebay API decoration results onto webpage over the old ones

				$('#Outfits').html(app.outfitArray)

			}); // end of on click

		}, // end of closeOutfitResult function

	} // End of app object


	// Creates pop up to allow users to sign in with Google

	app.googleSignIn();

	// Lets user sign out of the app

	app.googleSignOut();

	// enable search buttons

	app.setLocation();

	app.setTheme();

	



}); // End document.ready function