{
	// Render and Email.jsx
	// 
	// version history:
	// 2 - 6/24/03: Added support for authorization settings and better errors.
	// 			Also removed naked \n from body of email and replaced with \r\n.
	
	function RenderAndEmail()
	{
		var scriptName = "Render and Email";
		var safeToRunScript = true;
		
		safeToRunScript = (app.project != null);
		if (!app.project) {
			alert ("A project must be open to use this script.", scriptName);
		}
		if (safeToRunScript) {
			// Check the render queue and make certain at least one item is queued.
			safeToRunScript = false;
			for (i = 1; i <= app.project.renderQueue.numItems; ++i) {
				if (app.project.renderQueue.item(i).status == RQItemStatus.QUEUED) {
					safeToRunScript = true;
					break;
				}
			}
			if (!safeToRunScript) {
				alert("You do not have any items set to render.", scriptName);
			}
		}
		
		if (safeToRunScript) {
			// Check if we are allowed to access the network.
			var securitySetting = app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY");
			if (securitySetting != 1) {
				alert ("This script requires the scripting security preference to be set.\n" +
					"Go to the \"General\" panel of your application preferences,\n" +
					"and make sure that \"Allow Scripts to Write Files and Access Network\" is checked.", scriptName);
				safeToRunScript = false;
			}
		}
		
		if (safeToRunScript) {
			// Check if we can access the network to send email.
			// Test before the render so the person doesn't go home and wait for an email...
			
			// Load code from a file with handy emailing methods.
			var emailCodeFile = new File("(support)/email_methods.jsx");
			emailCodeFile.open("r");
			eval(emailCodeFile.read());
			emailCodeFile.close();
			
			// This address isn't actually used until send() is called, but specify the loopback for now.
			// This is a test to see if network access is enabled in the preferences.
			// [24803] cprosser
			{
				var email_test = new EmailSocket("127.0.0.1");
			}
			
			// The script email_setup.jsx will prompt the user and establish the settings.
			// We'll only run it now if we don't have the settings already. 
			// If you want to change the settings, you can run email_setup.jsx as a 
			// separate script at any time.
			var settings = app.settings;
			if (!settings.haveSetting("Email Settings", "Mail Server") ||
				 !settings.haveSetting("Email Settings", "Reply-to Address") ||
				 !settings.haveSetting("Email Settings", "Render Report Recipient")) {
				
				// We don't have the settings yet, so run Change Email Settings.jsx to prompt for them.
				var email_setupfile = new File("(support)/Change Email Settings.jsx");
				email_setupfile.open("r");	
				eval(email_setupfile.read());
				email_setupfile.close();
			}
			
			var myQueue = app.project.renderQueue // Creates a shortcut for the Render Queue.
			
			// Start rendering.
			myQueue.render();
			
			// Now rendering is complete.
			// Create a string for the mail message that contains:
			// -- Start time (date);
			// -- Render time of each item in the queue;
			// -- Total render time.
			var projectName = "Unsaved Project";
			if (app.project.file) {
				projectName = app.project.file.name;
			}
			// Can't have bare LF in email, Always put \r before \n or some servers will die.
			var myMessage = "Rendering of " + projectName + " is complete.\r\n\r\n";
			
			// Email the message.
			// We'll use three settings to determine how to mail.
			// The section will be named "Email Settings".
			// The 3 settings will be named:
			// -- "Mail Server" - the mail server to use when sending mail.
			// -- "Reply-to Address" - the address from which the mail will be sent.
			// -- "Render Report Recipient" - the address to which mail will be sent.
			
			if (!settings.haveSetting("Email Settings", "Mail Server") ||
				 !settings.haveSetting("Email Settings", "Reply-to Address") ||
				 !settings.haveSetting("Email Settings", "Render Report Recipient")) {
				alert("Can't send email; I don't have all the settings I need. Aborting.", scriptName);
			} else {
				try {
					// Send the email.
					var serverSetting = settings.getSetting("Email Settings", "Mail Server");
					var fromSetting = settings.getSetting("Email Settings", "Reply-to Address");
					var toSetting = settings.getSetting("Email Settings", "Render Report Recipient");
					var authUser;
					var authPass;
					
					if (app.settings.haveSetting("Email Settings", "Auth User")) {
						authUser = app.settings.getSetting("Email Settings", "Auth User");
					}
					
					if (app.settings.haveSetting("Email Settings", "Auth Pass")) {
						authPass = app.settings.getSetting("Email Settings", "Auth Pass");
					}
					
					// Ack, can't delete settings...
					if (authUser == "") {
						authUser = null;
						authPass = null;
					}
					
					var myMail = new EmailSocket(serverSetting);
					
					if (!myMail.send(fromSetting, toSetting, "AE Render Completed", myMessage, authUser, authPass)) {
						alert("Sending mail failed.", scriptName);
					}
				} catch (e) {
					alert("Unable to send email.\n" + e.toString(), scriptName);
				}
			}
		}
	}
	
	
	RenderAndEmail();
}
