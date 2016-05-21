$(document).ready(function(){

	var app = {

		// zip code variable for use with foursquare/google maps API

		zip: "",

		// theme variable for use with ebay/amazon API

		theme: "",

		// calls the modal to show up
		modal: function() {

			$('#myModal').modal({

				// can't exit modal by clicking background
				backdrop: 'static',

				// causes modal to show up
				show: true

			}); // ends modal

			// button to load APIs

			app.setLocationTheme();

		}, // ends modal function

		setLocationTheme: function() {

			$('#setLT').on('click', function() {

				// sets what the user typed to zip variable
					app.zip = $("#zip").val().trim();

					console.log(app.zip);

				// checks that zip code is exactly five characters and a number

				if (app.zip.length == 5 
					&& isNaN(app.zip) == false) {
					
					console.log('yay you typed correctly');

					// close modal

					// *******call function to search APIs

				} // end if zip length = 5

				else {

					// send user error report
					$('#errorZip').html("You need to type a ZIP Code that is exactly 5 numbers.");

					// don't close modal

				} // end else zip length = 5

			}); 

		},

	} // End of app object

	// modal pops up

	app.modal();

}); // End document.ready function