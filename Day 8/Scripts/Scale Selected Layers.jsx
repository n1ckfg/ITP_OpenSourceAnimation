{
	// Scale Selected Layers.jsx
	// 
	// This script scales the selected layers within the active comp.
	//
	// First, it prompts the user for a scale_factor.
	// Next, it scales all selected layers, including cameras.
	
	function ScaleSelectedLayers(thisObj)
	{
		var scriptName = "Scale Selected Layers";
		
		// This variable stores the scale_factor.
		var scale_factor = 1.0;
		var scale_about_center = true;
		
		
		//
		// This function is called when the user clicks the "Scale about Upper Left" button
		//
		function onCornerButtonClick()
		{
			scale_about_center = false;
		}
		
		
		//
		// This function is called when the user clicks the "Scale about Upper Left" button
		//
		function onCenterButtonClick()
		{
			scale_about_center = true;
		}
		
		
		//
		// This function is called when the user enters text for the scale.
		//
		function on_textInput_changed()
		{
			// Set the scale_factor based on the text.
			var value = this.text;
			if (isNaN(value)) {
				alert(value + " is not a number. Please enter a number.", scriptName);
			} else {
				scale_factor = value;
			}
		}
		
		
		function onScaleClick()
		{
			var activeItem = app.project.activeItem;
			if ((activeItem == null) || !(activeItem instanceof CompItem)) {
				alert("Please select or open a composition first.", scriptName);
			} else {
				var selectedLayers = activeItem.selectedLayers;
				if (activeItem.selectedLayers.length == 0) {
					alert("Please select at least one layer in the active comp first.", scriptName);
				} else {
					// Validate the input field, in case the user didn't defocus it first (which often can be the case).
					this.parent.parent.optsRow.text_input.notify("onChange");
					
					var activeComp = activeItem;
					
					// By bracketing the operations with begin/end undo group, we can 
					// undo the whole script with one undo operation.
					app.beginUndoGroup(scriptName);
					
					// Create a null 3D layer.
					var null3DLayer = activeItem.layers.addNull();
					null3DLayer.threeDLayer = true;
					
					// Set its position to (0,0,0).
					if (scale_about_center) {
						null3DLayer.position.setValue([activeComp.width * 0.5, activeComp.height * 0.5,0]);
					} else {
						null3DLayer.position.setValue([0, 0, 0]);
					}
					
					// Set null3DLayer as parent of all layers that don't have parents.  
					makeParentLayerOfUnparentedInArray(selectedLayers, null3DLayer);
					
					// Then for all cameras, scale the Zoom parameter proportionately.
					scaleCameraZoomsInArray(selectedLayers, scale_factor);
					
					// Set the scale of the super parent null3DLayer proportionately.
					var superParentScale = null3DLayer.scale.value;
					superParentScale[0] = superParentScale[0] * scale_factor;
					superParentScale[1] = superParentScale[1] * scale_factor;
					superParentScale[2] = superParentScale[2] * scale_factor;
					null3DLayer.scale.setValue(superParentScale);
					
					// Delete the super parent null3DLayer with dejumping enabled.
					null3DLayer.remove();
					
					// Everything we just did changed the selection. Reselect those
					// same layers again.
					for (var i = 0; i < selectedLayers.length; i++) {
						selectedLayers[i].selected = true;
					}
					
					app.endUndoGroup();
					
					// Reset scale_factor to 1.0 for next use.
					scale_factor = 1.0;
					this.parent.parent.optsRow.text_input.text = "1.0";
				}
			}
		}
		
		
		// 
		// This function puts up a modal dialog asking for a scale_factor.
		// Once the user enters a value, the dialog closes, and the script scales the comp.
		// 
		function BuildAndShowUI(thisObj)
		{
			// Create and show a floating palette.
			var my_palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, {resizeable:true});
			if (my_palette != null)
			{
				var res = 
					"group { \
						orientation:'column', alignment:['fill','top'], alignChildren:['left','top'], spacing:5, margins:[0,0,0,0], \
						optsRow: Group { \
							orientation:'column', alignment:['fill','top'], \
							cornerButton: RadioButton { text:'Scale about Upper Left', preferredSize:[150,20], alignment:['fill','top'] }, \
							centerButton: RadioButton { text:'Scale about Center', alignment:['fill','top'], value:'true' }, \
							text_input: EditText { text:'1.0', alignment:['left','top'], preferredSize:[80,20] }, \
						}, \
						cmds: Group { \
							alignment:['fill','top'], \
							okButton: Button { text:'Scale', alignment:['fill','center'] }, \
						}, \
					}";
				
				my_palette.margins = [10,10,10,10];
				my_palette.grp = my_palette.add(res);
				
				// Workaround to ensure the edittext text color is black, even at darker UI brightness levels.
				var winGfx = my_palette.graphics;
				var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0,0,0], 1);
				my_palette.grp.optsRow.text_input.graphics.foregroundColor = darkColorBrush;
				
				my_palette.grp.optsRow.cornerButton.onClick  = onCornerButtonClick;
				my_palette.grp.optsRow.centerButton.onClick = onCenterButtonClick;
				
				// Set the callback. When the user enters text, this will be called.
				my_palette.grp.optsRow.text_input.onChange = on_textInput_changed;
				
				my_palette.grp.cmds.okButton.onClick = onScaleClick;
				
				my_palette.onResizing = my_palette.onResize = function () {this.layout.resize();}
			}
			
			return my_palette;
		}
		
		
		// 
		// Sets newParent as the parent of all layers in theComp that don't have parents.
		// This includes 2D/3D lights, camera, av, text, etc.
		//
		function makeParentLayerOfUnparentedInArray(layerArray, newParent)
		{
			for (var i = 0; i < layerArray.length; i++) {
				var curLayer = layerArray[i];
				if (curLayer != newParent && curLayer.parent == null) {
					curLayer.parent = newParent;
				}
			}
		}
		
		
		//
		// Scales the zoom factor of every camera by the given scale_factor.
		// Handles both single values and multiple keyframe values.
		function scaleCameraZoomsInArray(layerArray, scaleBy)
		{
			for (var i = 0; i < layerArray.length; i++) {
				var curLayer = layerArray[i];
				if (curLayer.matchName == "ADBE Camera Layer") {
					var curZoom = curLayer.zoom;
					if (curZoom.numKeys == 0) {
						curZoom.setValue(curZoom.value * scaleBy);
					} else {
						for (var j = 1; j <= curZoom.numKeys; j++) {
							curZoom.setValueAtKey(j,curZoom.keyValue(j)*scaleBy);
						}
					}
				}
			}
		}
		
		// 
		// The main script.
		//
		if (parseFloat(app.version) < 8) {
			alert("This script requires After Effects CS3 or later.", scriptName);
			return;
		}
		
		var my_palette = BuildAndShowUI(thisObj);
		if (my_palette != null) {
			if (my_palette instanceof Window) {
				my_palette.center();
				my_palette.show();
			} else {
				my_palette.layout.layout(true);
				my_palette.layout.resize();
			}
		} else {
			alert("Could not open the user interface.", scriptName);
		}
	}
	
	
	ScaleSelectedLayers(this);
}