{
	// This base64 encodes str. RFC-2045
	function encodeBase64(str)
	{
		var lut = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

		var chunk = 0;

		var result = "";

		for( var i = 0; i < str.length; i += 3) {
			chunk = str.charCodeAt(i) & 0xFF;
			chunk = chunk << 8;

			// asking for a char out of range returns ""
			chunk |= str.charCodeAt(i+1) & 0xFF;
			chunk = chunk << 8;

			chunk |= str.charCodeAt(i+2) & 0xFF;

			// these are the number of gaps until we hit %3
			var partialEnd = 3 - (str.length - i) ;

			var num6bits = 4;
			// 
			if (partialEnd == 2) { // one character encoded
				num6bits = 2;
			} else if (partialEnd == 1) { // two encoded
				num6bits = 3;
			}

			for( var j = 0; j < num6bits; j++){
				result += lut.charAt((chunk & 0xFC0000) >> 18); // six bits	
				chunk = chunk << 6; 
			}	

			// fill with = chars
			if (partialEnd < 3) {
				for( var j = 0; j < partialEnd; j++){
					result += "=";
				}
			}
		}

		return result;
	}


	// This script sets email settings.
	// It can be run all by itself, but it is also called 
	// within "3-Render and Mail.jsx" if the settings aren't yet set.
	// version history
	// 2 - 6/24/03 -- add support for authorization

	function GetStringDefaultNull(key)
	{
		if(app.settings.haveSetting("Email Settings", key)) {
			return app.settings.getSetting("Email Settings", key);
		} else {
			return "";
		}
	}

	var serverValue = prompt("Enter smtp server address:", GetStringDefaultNull("Mail Server"));
	var fromValue = prompt("Enter reply-to email address:", GetStringDefaultNull("Reply-to Address")); 
	
	var requiresAuth = confirm("Does your smtp server require you to log in?");
	var authUser = GetStringDefaultNull("Auth User");
	var authPass = GetStringDefaultNull("Auth Pass");
	
	if (requiresAuth) {
		authUser = prompt("Please enter the login id for the server:", authUser);
		
		if (authUser != null) {
			authPass = prompt("Please enter the password for the server:", "");
		}
		if (authUser != null) {
			app.settings.saveSetting("Email Settings", "Auth User", authUser);
		}
		
		if (authPass != null) {
			app.settings.saveSetting("Email Settings", "Auth Pass", encodeBase64(authPass));
		}
	} else {
		app.settings.saveSetting("Email Settings", "Auth User", "");
		app.settings.saveSetting("Email Settings", "Auth Pass", "");
	}
	
	var toValue   = prompt("Enter recipient's email address", GetStringDefaultNull("Render Report Recipient"));
	if (serverValue != null && serverValue != "") {
		app.settings.saveSetting("Email Settings", "Mail Server", serverValue);
	}
	if (fromValue != null && fromValue != "") {
		app.settings.saveSetting("Email Settings", "Reply-to Address", fromValue);
	}
	if (toValue != null && toValue != "") {
		app.settings.saveSetting("Email Settings", "Render Report Recipient", toValue);
	}
}
	
	
	
	
	
	