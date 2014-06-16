{
	// Double-Up.jsx
	// 
	// This script creates duplicates of the layers in a composition and
	// lays them side by side with the original layers. You can use this 
	// script to compare different settings on the same footage.
	// 
	// Notes:
	// This script works best when it is initially applied to a footage layer 
	// that's the same size as and centered within its composition. 
	// Re-running the script allows you to double-up the previous layers.
	
	
	function DoubleUp()
	{
		var doubleUpData = new Object();
		doubleUpData.scriptName = "Double-Up";
		
		doubleUpData.strErrNoCompSel = "Select or open a composition, then try again.";
		
		doubleUpData.favorLongerDim = 0;	// set to 1 to lay side-by-side along longest dimension (width or height)
		
		var comp = app.project.activeItem;
		if ((comp == null) || !(comp instanceof CompItem)) {
			alert(doubleUpData.strErrNoCompSel, doubleUpData.scriptName);
			return;
		}
		
		var selLayers = new Array();
		for (var i=1; i<=comp.numLayers; i++)
			selLayers[selLayers.length] = comp.layer(i);
		
		// first layer is the first selected layer; this controls width and height
		var firstLayer = selLayers[0];
		
		// revised comp settings
		var widthIsLonger = (comp.width > comp.height);
		var xOffset = (doubleUpData.favorLongerDim == widthIsLonger) ? comp.width : 0;
		var yOffset = (doubleUpData.favorLongerDim == widthIsLonger) ? 0 : comp.height;
		
		app.beginUndoGroup(doubleUpData.scriptName);
		
		comp.width = comp.width * ((doubleUpData.favorLongerDim == widthIsLonger) ? 2 : 1);
		comp.height = comp.height * ((doubleUpData.favorLongerDim == widthIsLonger) ? 1 : 2);
		
		for (var i=0; i<selLayers.length; i++) {
			var newLayer = selLayers[i].duplicate();
			newLayer.name = selLayers[i].name;
			newLayer.moveToEnd();
			newLayer.position.setValue([selLayers[i].position.value[0] + xOffset, selLayers[i].position.value[1] + yOffset]);
		}
		
		app.endUndoGroup();
	}
	
	DoubleUp();
}