{
	// Scale Composition.jsx
	// 
	// This script scales the active comp and all the layers within it.
	//
	// First, it prompts the user for a scale_factor, a new comp width, 
	// or a new comp height.
	// 
	// Next, it scales the comp and all the layers within it, including
	// cameras.
	
	function ScaleComposition(thisObj)
	{
		var scriptName = "Scale Composition";
		
		// This variable stores the scale_factor.
		var scale_factor = 1.0;
		var text_input = null;
		var scaleButton  = null;
		var widthButton  = null;
		var heightButton = null;
		
		
		function onScaleButtonClick()
		{
			this.parent.text_input.text = scale_factor;
		}
		
		
		function onWidthButtonClick()
		{
			var activeItem = app.project.activeItem;
			if ((activeItem == null) || !(activeItem instanceof CompItem)) {
				alert("Please select or open a composition first.", scriptName);
			} else {
				this.parent.text_input.text = Math.floor(activeItem.width * scale_factor);
			}
		}
		
		
		function onHeightButtonClick()
		{
			var activeItem = app.project.activeItem;
			if ((activeItem == null) || !(activeItem instanceof CompItem)) {
				alert("Please select or open a composition first.", scriptName);
			} else {
				this.parent.text_input.text = Math.floor(activeItem.height * scale_factor);
			}
		}
		
		
		function testNewScale(test_scale)
		{
			var is_ok = true;
			var activeItem = app.project.activeItem;
			if ((activeItem == null) || !(activeItem instanceof CompItem)) {
				alert("Please select or open a composition first.", scriptName);
			} else {
				if (test_scale * activeItem.width < 1 || test_scale * activeItem.width > 30000) {
					is_ok = false;
				} else if (test_scale * activeItem.height < 1 || test_scale * activeItem.height > 30000) {
					is_ok = false;
				}
			}
			
			return is_ok;
		}
		
		
		//
		// This function is called when the user enters text for the scale.
		//
		function on_textInput_changed()
		{
			var activeItem = app.project.activeItem;
			if ((activeItem == null) || !(activeItem instanceof CompItem)) {
				alert("Please select or open a composition first.", scriptName);
			} else {
				// Set the scale_factor based on the text.
				var value = this.text;
				if (isNaN(value)) {
					alert(value + " is not a number. Please enter a number.", scriptName);
				} else {
					var new_scale_factor;
					if (this.parent.scaleButton.value == true) {
						new_scale_factor = value;
					} else if (this.parent.widthButton.value == true) {
						new_scale_factor = value / activeItem.width;
					} else {
						new_scale_factor = value / activeItem.height;
					}
					if (testNewScale(new_scale_factor)) {
						scale_factor = new_scale_factor;
					} else {
						alert("Value will make height or width out of range 1 to 30000. Reverting to previous value.", scriptName);
						// Load text back in from current values.
						if (scaleButton.value == true) {
							onScaleButtonClick();
						} else if (widthButton.value == true) {
							onWidthButtonClick();
						} else {
							onHeightButtonClick();
						}
					}
				}
			}
		}
		
		
		function onScaleClick()
		{
			var activeItem = app.project.activeItem;
			if ((activeItem == null) || !(activeItem instanceof CompItem)) {
				alert("Please select or open a composition first.", scriptName);
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
				null3DLayer.position.setValue([0,0,0]);
				
				// Set null3DLayer as parent of all layers that don't have parents.  
				makeParentLayerOfAllUnparented(activeComp, null3DLayer);
				
				// Set new comp width and height.
				activeComp.width  = Math.floor(activeComp.width * scale_factor);
				activeComp.height = Math.floor(activeComp.height * scale_factor);
				
				// Then for all cameras, scale the Zoom parameter proportionately.
				scaleAllCameraZooms(activeComp, scale_factor);
				
				// Set the scale of the super parent null3DLayer proportionately.
				var superParentScale = null3DLayer.scale.value;
				superParentScale[0] = superParentScale[0] * scale_factor;
				superParentScale[1] = superParentScale[1] * scale_factor;
				superParentScale[2] = superParentScale[2] * scale_factor;
				null3DLayer.scale.setValue(superParentScale);
				
				// Delete the super parent null3DLayer with dejumping enabled.
				null3DLayer.remove();
				
				app.endUndoGroup();
				
				// Reset scale_factor to 1.0 for next use.
				scale_factor = 1.0;
				if (this.parent.parent.optsRow.scaleButton.value) {
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
						introStr: StaticText { text:'Scale composition using:', alignment:['left','center'] }, \
						optsRow: Group { \
							orientation:'column', alignment:['fill','top'], \
							scaleButton: RadioButton { text:'New Scale Factor', alignment:['fill','top'], value:'true' }, \
							widthButton: RadioButton { text:'New Comp Width', alignment:['fill','top'] }, \
							heightButton: RadioButton { text:'New Comp Height', alignment:['fill','top'] }, \
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
				
				my_palette.grp.optsRow.scaleButton.onClick  = onScaleButtonClick;
				my_palette.grp.optsRow.widthButton.onClick  = onWidthButtonClick;
				my_palette.grp.optsRow.heightButton.onClick = onHeightButtonClick;
				
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
		function makeParentLayerOfAllUnparented(theComp, newParent)
		{
			for (var i = 1; i <= theComp.numLayers; i++) {
				var curLayer = theComp.layer(i);
				if (curLayer != newParent && curLayer.parent == null) {
					curLayer.parent = newParent;
				}
			}
		}
		
		
		//
		// Scales the zoom factor of every camera by the given scale_factor.
		// Handles both single values and multiple keyframe values.
		function scaleAllCameraZooms(theComp, scaleBy)
		{
			for (var i = 1; i <= theComp.numLayers; i++) {
				var curLayer = theComp.layer(i);
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
	
	
	ScaleComposition(this);
}