$(document).ready(function(){

	var app = {

		// variable for firebase app

		dataInfo: new Firebase("https://eventspot.firebaseio.com/"),

		// user ID variable to make an object in firebase

		user: undefined,

		// user email variable to be put into the userID object in firebase

		userEmail: "",

		// zip code variable for use with foursquare/google maps API and placed within userID variable in firebase

		zip: "",

		// theme variable for use with ebay/amazon API and placed within userID variable in firebase

		theme: "",

		// calls the modal to show up
		modal: function() {

			// if user has created a theme and location already don't pull up the modal

			if (app.userId == "" && app.userEmail == "") {

				$('#myModal').modal({

					// can't exit modal by clicking background
					backdrop: 'static',

					// causes modal to show up
					show: true

				}); // ends modal

				// button to submit user name and email to firebase

				app.setUserAndEmail();

			} // ends if user has created a theme and location already don't pull up the modal

		}, // ends modal function

		setUserAndEmail: function() {

			app.userId = $('#user').val().trim().toLowerCase

			// if a username is already in firebase load their data into local variables



			// else create a username in firebase

		}, // end of setUserAndEmail function

		firebaseToLocal: function() {

			app.dataInfo.on('value', function(snapshot) {

				console.log(snapshot.val());

			});

		}, // end of firebaseToLocal function

		setLocation: function() {

			$('#setLocation').on('click', function() {

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

			}); 

		}, // End of setLocation function

		setTheme: function() {

			$('#setTheme').on('click', function() {

				// sets what the user typed to theme variable
				app.theme = $("#theme").val().trim();

				// if theme has something written in it
				if (app.theme != "") {

					// clear error
					$('#errorTheme').html("");

					// *******call function to search APIs

				} // end if theme has something typed in

				else {

					// send user error for theme
					$('#errorTheme').html("You need to enter a theme.");

				} // end else theme has something typed in

			}); // end of click on #setTheme

		}, // end setTheme function

	} // End of app object

	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider).then(function(result) {
	// This gives you a Google Access Token. You can use it to access the Google API.
		var token = result.credential.accessToken;
		console.log(token);
		// The signed-in user info.
		app.user = result.user;
		console.log(app.user);
		console.log(app.user.uid);
		firebase.auth().onAuthStateChanged(function(user) {
		if (app.user) {
			userid = app.user.uid
		$('#auth').html('<a class="waves-effect waves-light btn" id="logout">Logout</a>')
			} else {
			userid = null;
			}
			
	console.log(userid);
	})




	// modal pops up

	// app.modal();

}); // End document.ready function