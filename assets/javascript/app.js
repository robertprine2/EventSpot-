$(document).ready(function(){

	var app = {

		// variable for firebase app

		dataInfo: new Firebase("https://eventspot-a7503.firebaseio.com/"),

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
					if (app.user) {

						// removes reminder to allow pop ups
						$("#allowPopUps").html("");

						app.userid = app.user.uid

						var userRef = app.dataInfo.child(app.users);

						var useridRef = userRef.child(app.userid);

						useridRef.set({
							user: app.user.displayName,
							email: app.user.email,
							emailVerified: app.user.emailVerified,
							locations: "",
							theme: "",
							colorScheme: "",
							food: ""
						});

						$('#auth').html('<a class="button-white" id="logout">Log Out</a>')
					} // end of if there is a user
					else {

						userid = null;

					} // end of else there is no user
						
				}); // end of auth state changed to add button to log out

			}); // end of sign in with google popup

		}, // end of googleSignIn function

		// signs the user out of their google login

		googleSignOut: function() {

			// When the user clicks the log out butto they will sign out of their google account on this site

			$('#auth').on('click', function() {

				firebase.auth().signOut().then(function() {
				  // Sign-out successful.
				  console.log('You have signed out');
				}, function(error) {
				  // An error happened.
				});

			}); // end of #auth on click

		}, // end of googleSignOut function

		firebaseToLocal: function() {

			app.dataInfo.on('value', function(snapshot) {

				console.log(snapshot.val());
				app.userEmail = snapshot.val().users.app.userid.email;
				console.log(app.userEmail);


			});

		}, // end of firebaseToLocal function

		setLocation: function() {

			$('#searchZip').on('click', function() {

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

				return false;
			}); // end of on click to search zip code

		}, // End of setLocation function

		setTheme: function() {

			$('#searchTheme').on('click', function() {

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

				return false;
			}); // end of click on #setTheme

		}, // end setTheme function

	} // End of app object


	// Creates pop up to allow users to sign in with Google

	app.googleSignIn();

	// Lets user sign out of the app

	app.googleSignOut();

	// sets local variables to match firebase

	app.firebaseToLocal();

	// enable search buttons

	app.setLocation();

	app.setTheme();

}); // End document.ready function