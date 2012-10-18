//
//
//3D Layer Distributor by Lloyd Alvarez (July 2006)  http://aescripts.com
// fixed random function - feb2008
//
//
//Distributes layers in 3D space within set ranges..
// 
//Version History
//
//  1.2 Added individual axis controls 01/09
//  1.1 Fixed Random Function 02/08
//  1.0 Initial Release 07/06
//
////////////////////////////////////////////////////////////////////////////////////////////////////////	
//////////////USER VARIABLES//////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////	

// Set Range parameters here: [min,max]

	// if you don't want to randomize an axis, set it to false
	var set_X = false;
	var set_Y = false;
	var set_Z = true;	
	
	//set the range you would like each axis to be randomly distributed, only applies if the axis is set to true above
	var range_X = [-2500,2500];
	var range_Y = [-1000,1000];
	var range_Z = [-1000,1000];	
	
	
////////////////////////////////////////////////////////////////////////////////////////////////////////	
////////////////////////////////////////////////////////////////////////////////////////////////////////	
////////////////////////////////////////////////////////////////////////////////////////////////////////	


// Begin Script

	var myComp = app.project.activeItem;
	var safeToRun = true;
	
	var myComp = app.project.activeItem;
	if (myComp == null || !(myComp instanceof CompItem)) {
		alert("A Comp must be active to run this script");
		safeToRun = false;
	}		
		
	if (safeToRun) {	
	clearOutput();
	app.beginUndoGroup("3D Layer Distributor");

   	var selectedLayers = myComp.selectedLayers; 



	for (var i = 0; i < selectedLayers.length; i++) { 
		var myLayer = selectedLayers[i]; 

		var x = myLayer.position.value[0];
		var y = myLayer.position.value[1];
		var z = myLayer.position.value[2];
		if (set_X) x += range_X[0] +  (range_X[1]-range_X[0]) * Math.random() ; 
		if (set_Y) y += range_Y[0]  +  (range_Y[1]-range_Y[0]) * Math.random() ;
		if (set_Z) z += range_Z[0] +  (range_Z[1]-range_Z[0]) * Math.random() ; 
	
		if (myLayer.position.numKeys > 0) {
			myLayer.property("Position").setValueAtTime(myLayer.time,[x,y,z]);
			} else {
			 	myLayer.property("Position").setValue([x,y,z]);
			}
			
		writeLn("Distributing layer " + (i+1) + " out of " + selectedLayers.length);	 	
		clearOutput();
	}
		writeLn("Distributed " + selectedLayers.length + " Layers");
		app.endUndoGroup();
		}