{  //start script
	app.beginUndoGroup("foo");

	// create project if necessary
	var proj = app.project;
	if(!proj) proj = app.newProject();

	// create new comp named 'my comp'
	var compW = 1920; // comp width
	var compH = 1080; // comp height
	var compL = 15;  // comp length (seconds)
	var compRate = 24; // comp frame rate
	var compBG = [0/255,0/255,0/255] // comp background color
	var myItemCollection = app.project.items;
	var myComp = myItemCollection.addComp("Comp 1",compW,compH,1,compL,compRate);
	myComp.bgColor = compBG;

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//create a layer and set some properties
	var myLayer = myComp.layers.addSolid([255, 0, 0], "Layer 1", 640, 480, 1);
	myLayer.property("position").setValue([320,240]);
	myLayer.property("opacity").setValue(50);

	//add an effect and set some keyframes
	var myEffect = myLayer.property("Effects").addProperty("Point Control");
	myEffect.name = "target";
	var p = myLayer.property("Effects")("target")("Point");
	p.setValueAtTime(0.0, [10.0, 50.0]);
	p.setValueAtTime(0.5, [10.0, 250.0]);

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	app.endUndoGroup();
}  //end script