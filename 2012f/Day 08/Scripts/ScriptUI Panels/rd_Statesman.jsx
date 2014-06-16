{
	// rd_Statesman.jsx
	// Copyright (c) 2005-2007 redefinery (Jeffrey R. Almasol). All rights reserved.
	// check it: www.redefinery.com
	// 
	// Name: rd_Statesman
	// Version: 2.0
	// 
	// Description:
	// This script displays a palette with controls for capturing multiple
	// states of a composition's layer settings, and quickly recalling any of
	// them at a later time. You can capture and switch among up to 6 states
	// of layer features, specifically a layer's selection, A/V Features 
	// settings, and Switches settings.
	// 
	// To store the selected composition's layer state, select the layer
	// features from the Layer Features to Capture list, and then click the
	// upward-pointing arrow corresponding to one of the six State buttons.
	// 
	// To recall a previously stored composition layer state, select the
	// "target" composition in the Project panel, and then click the State
	// button corresponding to the state you want to apply. The maximum
	// number of layers affected is determined by the lower number of layers
	// in the recalled state or in the current composition.
	// 
	// Note: This version of the script requires After Effects CS3 
	// or later. It can be used as a dockable panel by placing the 
	// script in a ScriptUI Panels subfolder of the Scripts folder, 
	// and then choosing this script from the Window menu.
	// 
	// Originally requested by Stu Maschwitz.
	// 
	// Legal stuff:
	// This script is provided "as is," without warranty of any kind, expressed
	// or implied. In no event shall the author be held liable for any damages 
	// arising in any way from the use of this script.
	// 
	// In other words, I'm just trying to share knowledge with and help out my
	// fellow AE script heads, so don't blame me if my code doesn't rate. :-)




	// rd_Statesman()
	// 
	// Description:
	// This function contains the main logic for this script.
	// 
	// Parameters:
	// thisObj - "this" object.
	// 
	// Returns:
	// Nothing.
	//
	function rd_Statesman(thisObj)
	{
		// Globals
		
		var rd_StatesmanData = new Object();	// Store globals in an object
		rd_StatesmanData.scriptName = "rd: Statesman";
		rd_StatesmanData.scriptTitle = rd_StatesmanData.scriptName + " v2.0";
		
		rd_StatesmanData.strLayerFeatures = {en: "Layer Features to Capture:"};
		rd_StatesmanData.states = new Array();			// Stores the comp states
		rd_StatesmanData.numStates = 6;					// Number of states (buttons)
		
		rd_StatesmanData.strLayerStatesOpts = {en: '["General: Layer selection", "A/V Features: Video", "A/V Features: Audio", "A/V Features: Solo", "A/V Features: Lock", "Switches: Shy", "Switches: Cont. Rasterize / Collapse", "Switches: Quality", "Switches: Effect", "Switches: Frame Blending", "Switches: Motion Blur", "Switches: Adjustment Layer", "Switches: 3D Layer"]'};
		rd_StatesmanData.strStateSet = {en: "^"};
		rd_StatesmanData.strStates = {en: "States:"};
		rd_StatesmanData.strHelp = {en: "?"};
		rd_StatesmanData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
		rd_StatesmanData.strMinAE80 = {en: "This script requires Adobe After Effects CS3 or later."};
		rd_StatesmanData.strHelpText = 
		{
			en: "Copyright (c) 2005-2007 redefinery (Jeffrey R. Almasol). \n" +
			"All rights reserved.\n" +
			"\n" +
			"This script displays a palette with controls for capturing multiple states of a composition's layer settings, and quickly recalling any of them at a later time. You can capture and switch among up to 6 states of layer features, specifically a layer's selection, A/V Features settings, and Switches settings.\n" +
			"\n" +
			"To store the selected composition's layer state, select the layer features from the Layer Features to Capture list, and then click the upward-pointing arrow corresponding to one of the six State buttons.\n" +
			"\n" +
			"To recall a previously stored composition layer state, select the \"target\" composition in the Project panel, and then click the State button corresponding to the state you want to apply. The maximum number of layers affected is determined by the lower number of layers in the recalled state or in the current composition.\n" +
			"\n" +
			"Note: This version of the script requires After Effects CS3 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
			"\n" +
			"Originally requested by Stu Maschwitz.\n"
		};
		
		
		
		
		// rd_Statesman_localize()
		// 
		// Description:
		// This function localizes the given string variable based on the current locale.
		// 
		// Parameters:
		//   strVar - The string variable's name.
		// 
		// Returns:
		// String.
		//
		function rd_Statesman_localize(strVar)
		{
			return strVar["en"];
		}
		
		
		
		
		// rd_Statesman_buildUI()
		// 
		// Description:
		// This function builds the user interface.
		// 
		// Parameters:
		// thisObj - Panel object (if script is launched from Window menu); null otherwise.
		// 
		// Returns:
		// Window or Panel object representing the built user interface.
		//
		function rd_Statesman_buildUI(thisObj)
		{
			var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_StatesmanData.scriptName, undefined, {resizeable:true});
			
			if (pal != null)
			{
				var res =
				"group { \
					orientation:'column', alignment:['fill','fill'], \
					header: Group { \
						alignment:['fill','top'], \
						title: StaticText { text:'" + rd_StatesmanData.scriptName + "', alignment:['fill','center'] }, \
						help: Button { text:'" + rd_Statesman_localize(rd_StatesmanData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
					}, \
					r1: Group { \
						alignment:['left','top'], \
						statesLbl: StaticText { text:'" + rd_Statesman_localize(rd_StatesmanData.strStates) + "' }, ";
						
						for (var i=0; i<rd_StatesmanData.numStates; i++)
						{
							res += "states" + i.toString() + ": Button { text:'" + (i+1).toString() + "', stateId:" + (i+1).toString() + ", preferredSize:[30,20] }, \ ";
						}
						
				res += " \
					}, \
					r2: Group { \
						alignment:['left','top'], ";
						
						for (var i=0; i<rd_StatesmanData.numStates; i++)
						{
							res += "setStates" + i.toString() + ": Button { text:'" + rd_Statesman_localize(rd_StatesmanData.strStateSet) + "', stateId:" + (i+1).toString() + ", preferredSize:[30,15] }, \ ";
						}
						
				res += " \
					}, \
					setPnl: Group { \
						orientation:'column', alignment:['fill','fill'], spacing:5, \
						lbl: StaticText { text:'" + rd_Statesman_localize(rd_StatesmanData.strLayerFeatures) + "', alignment:['left','top'] }, \
						listBox: ListBox { alignment:['fill','fill'], properties:{ items:" + rd_Statesman_localize(rd_StatesmanData.strLayerStatesOpts) + ", multiselect:true } }, \
					}, \
				} \
				";
				pal.grp = pal.add(res);
				
				// Workaround to ensure the edittext text color is black, even at darker UI brightness levels
				var winGfx = pal.graphics;
				var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0,0,0], 1);
				pal.grp.setPnl.listBox.graphics.foregroundColor = darkColorBrush;
				
				pal.grp.r2.margins.top -= 5;
				pal.grp.r2.margins.left = pal.grp.r1.statesLbl.preferredSize.width + pal.grp.r1.spacing;
				
				pal.layout.layout(true);
				//pal.grp.minimumSize = [pal.grp.header.size.x + pal.grp.r1.size.x, pal.grp.header.size.y + pal.grp.r1.size.y];
				pal.layout.resize();
				pal.onResizing = pal.onResize = function () {this.layout.resize();}
				
				for (var i=0; i<rd_StatesmanData.numStates; i++)
				{
					eval("pal.grp.r1.states"+i.toString()+".onClick = function() {rd_Statesman_doApplyState(parseInt(this.stateId), this.parent.parent);}");
					eval("pal.grp.r2.setStates"+i.toString()+".onClick = function() {rd_Statesman_doCaptureState(parseInt(this.stateId), this.parent.parent);}");
				}
				
				pal.grp.setPnl.listBox.selection = [1,2,3];
				
				pal.grp.header.help.onClick = function () {alert(rd_StatesmanData.scriptTitle + "\n" + rd_Statesman_localize(rd_StatesmanData.strHelpText), rd_StatesmanData.scriptName);}
			}
			
			return pal;
		}
		
		
		
		
		// rd_Statesman_doCaptureState()
		// 
		// Description:
		// This function captures the settings of the current comp to the specified state.
		// 
		// Parameters:
		//   stateNum - The selected state to use.
		//   pal - The palette (Window object) itself.
		// 
		// Returns:
		// Nothing.
		//
		function rd_Statesman_doCaptureState(stateNum, pal)
		{
	//		alert("capture state "+stateNum);
			// Check that a project exists
			if (app.project == null)
				return;
			
			// Get the current (active/frontmost) comp
			var comp = app.project.activeItem;
			
			if ((comp == null) || !(comp instanceof CompItem))
			{
				alert(rd_Statesman_localize(rd_StatesmanData.strErrNoCompSel), rd_StatesmanData.scriptName);
				return;
			}
			
			var stateOpts = pal.setPnl.listBox.selection;
			var layerStates = new Array();
			var layer, layerInfo;
			
			var stateLayerSel   = pal.setPnl.listBox.items[0].selected;
			var stateFeatVideo  = pal.setPnl.listBox.items[1].selected;
			var stateFeatAudio  = pal.setPnl.listBox.items[2].selected;
			var stateFeatSolo   = pal.setPnl.listBox.items[3].selected;
			var stateFeatLock   = pal.setPnl.listBox.items[4].selected;
			var stateSwitchShy  = pal.setPnl.listBox.items[5].selected;
			var stateSwitchCT   = pal.setPnl.listBox.items[6].selected;
			var stateSwitchQual = pal.setPnl.listBox.items[7].selected;
			var stateSwitchFX   = pal.setPnl.listBox.items[8].selected;
			var stateSwitchBlnd = pal.setPnl.listBox.items[9].selected;
			var stateSwitchMBlr = pal.setPnl.listBox.items[10].selected;
			var stateSwitchAdj  = pal.setPnl.listBox.items[11].selected;
			var stateSwitch3D   = pal.setPnl.listBox.items[12].selected;
					
			// Capture the layer settings
			app.beginUndoGroup(rd_StatesmanData.scriptName);
			
			for (var i=1; i<=comp.numLayers; i++)
			{
				layer = comp.layer(i);
				layerInfo = "";
				
				if (stateOpts != null)
				{
					layerInfo += (stateLayerSel) ? ((layer.selected) ? "1" : "0") : "-";
					
					layerInfo += (stateFeatVideo) ? ((layer.enabled) ? "1" : "0") : "-";
					layerInfo += (stateFeatAudio) ? ((layer.audioEnabled) ? "1" : "0") : "-";
					layerInfo += (stateFeatSolo) ? ((layer.solo) ? "1" : "0") : "-";
					layerInfo += (stateFeatLock) ? ((layer.locked) ? "1" : "0") : "-";
					
					layerInfo += (stateSwitchShy) ? ((layer.shy) ? "1" : "0") : "-";
					layerInfo += (stateSwitchCT) ? ((layer.collapseTransformation) ? "1" : "0") : "-";
					
					if (stateSwitchQual)
						switch (layer.quality)
						{
							case LayerQuality.WIREFRAME:
								layerInfo += "0";
								break;
							case LayerQuality.DRAFT:
								layerInfo += "1";
								break;
							case LayerQuality.BEST:
								layerInfo += "2";
								break;
							default:
								layerInfo += " ";
						}
					else
						layerInfo += "-";
					
					layerInfo += (stateSwitchFX) ? ((layer.effectsActive) ? "1" : "0") : "-";
					
					if (stateSwitchBlnd)
					{
						if (!layer.frameBlending)
							layerInfo += "0";
						else
						{
							switch (layer.frameBlendingType)
							{
								case FrameBlendingType.FRAME_MIX:
									layerInfo += "1";
									break;
								case FrameBlendingType.NO_FRAME_BLEND:
									layerInfo += "0";
									break;
								case FrameBlendingType.PIXEL_MOTION:
									layerInfo += "2";
									break;
								default:
									layerInfo += " ";
							}
						}
					}
					else
						layerInfo += "-";
					
					layerInfo += (stateSwitchMBlr) ? ((layer.motionBlur) ? "1" : "0") : "-";
					layerInfo += (stateSwitchAdj) ? ((layer.adjustmentLayer) ? "1" : "0") : "-";
					layerInfo += (stateSwitch3D) ? ((layer.threeDLayer) ? "1" : "0") : "-";
				}
	//			alert(layer.name + ": " + layerInfo);
				
				layerStates[layerStates.length] = layerInfo;
			}
			
			rd_StatesmanData.states[stateNum-1] = layerStates;
			
			app.endUndoGroup();
		}
		
		
		
		
		// rd_Statesman_doApplyState()
		// 
		// Description:
		// This function performs the actual operation of applying the states of the 
		// layers in the current composition.
		// 
		// Parameters:
		//   stateNum - The selected state to use.
		//   pal - The palette (Window object) itself.
		// 
		// Returns:
		// Nothing.
		//
		function rd_Statesman_doApplyState(stateNum, pal)
		{
	//		alert("set state "+stateNum);
			// Check that a project exists
			if (app.project == null)
				return;
			
			// Get the current (active/frontmost) comp
			var comp = app.project.activeItem;
			
			if ((comp == null) || !(comp instanceof CompItem))
			{
				alert(rd_Statesman_localize(rd_StatesmanData.strErrNoCompSel), rd_StatesmanData.scriptName);
				return;
			}
			
			var layerStates = rd_StatesmanData.states[stateNum-1];
			if (layerStates == undefined)			// If state hasn't been captured yet, set to empty array
				layerStates = [];
													// Only look at the max number of layers that we have data for
			var maxLayers = (comp.numLayers > layerStates.length) ? comp.numLayers : layerStates.length;
			
			var layer, layerInfo;
			
			// Apply the layer settings
			app.beginUndoGroup(rd_StatesmanData.scriptName);
			
			for (var i=0; i<maxLayers; i++)
			{
				layer = comp.layer(i+1);
				layerInfo = layerStates[i];
				
				// First unlock the layer (if locked and updating the lock) so that other settings
				// can be applied successfully
				if (layerInfo[4] != "-")
					layer.locked = false;
				
				try
				{
					if (layerInfo[0] != "-")
						layer.selected = (layerInfo[0] == "1") ? true : false;
				}
				catch (e)
				{}
				
				try
				{
					if (layerInfo[1] != "-")
						layer.enabled = (layerInfo[1] == "1") ? true : false;
				}
				catch (e)
				{}
				
				try
				{
					if (layerInfo[2] != "-")
						layer.audioEnabled = (layerInfo[2] == "1") ? true : false;
				}
				catch (e)
				{}
				
				try
				{
					if (layerInfo[3] != "-")
						layer.solo = (layerInfo[3] == "1") ? true : false;
				}
				catch (e)
				{}
				
				try
				{
					if (layerInfo[5] != "-")
						layer.shy = (layerInfo[5] == "1") ? true : false;
				}
				catch (e)
				{}
				
				try
				{
					if ((layerInfo[6] != "-") && layer.canSetCollapseTransformation)
						layer.collapseTransformation = (layerInfo[6] == "1") ? true : false;
				}
				catch (e)
				{}
				
				try
				{
					if (layerInfo[7] == "0")
						layer.quality = LayerQuality.WIREFRAME;
					else if (layerInfo[7] == "1")
						layer.quality = LayerQuality.DRAFT;
					else if (layerInfo[7] == "2")
							layer.quality = LayerQuality.BEST;
				}
				catch (e)
				{}
				
				try
				{
					if (layerInfo[8] != "-")
						layer.effectsActive = (layerInfo[8] == "1") ? true : false;
				}
				catch (e)
				{}
				
				try
				{
					if (layerInfo[9] != "-")
					{
						if (layerInfo[9] == "0")
							layer.frameBlendingType = FrameBlendingType.NO_FRAME_BLEND;
						else if (layerInfo[9] == "1")
							layer.frameBlendingType = FrameBlendingType.FRAME_MIX;
						else if (layerInfo[9] == "2")
							layer.frameBlendingType = FrameBlendingType.PIXEL_MOTION;
					}
				}
				catch (e)
				{}
				
				try
				{
					if (layerInfo[10] != "-")
						layer.motionBlur = (layerInfo[10] == "1") ? true : false;
				}
				catch (e)
				{}
				
				try
				{
					if (layerInfo[11] != "-")
						layer.adjustmentLayer = (layerInfo[11] == "1") ? true : false;
				}
				catch (e)
				{}
				
				try
				{
					if (layerInfo[12] != "-")
						layer.threeDLayer = (layerInfo[12] == "1") ? true : false;
				}
				catch (e)
				{}
				
				// Note: Do the lock operation last, as it might restrict other operations if done earlier
				try
				{
					if (layerInfo[4] != "-")
						layer.locked = (layerInfo[4] == "1") ? true : false;
				}
				catch (e)
				{}
			}
			
			app.endUndoGroup();
		}
		
		
		
		
		// doHelp()
		// 
		// Description:
		// This callback function displays the online help.
		// 
		// Parameters:
		// None.
		// 
		// Returns:
		// Nothing.
		//
		function doHelp()
		{
			var msg = rd_StatesmanData.scriptTitle + "\n" + rd_Statesman_localize(rd_StatesmanData.strHelpText);
			alert(msg, rd_StatesmanData.scriptName);
		}
		
		
		
		
		// main code:
		//
		
		// Prerequisites check
		if (parseFloat(app.version) < 8.0)
			alert(rd_Statesman_localize(rd_StatesmanData.strMinAE80), rd_StatesmanData.scriptName);
		else
		{
			// Build and show the console's floating palette
			var rdstPal = rd_Statesman_buildUI(thisObj);
			if (rdstPal != null)
			{
				var stateStr, matches, layerStates;
				
				// Update UI values, if saved in the settings
				
				// Get the saved states data
				for (var i=0; i<rd_StatesmanData.numStates; i++)
					if (app.settings.haveSetting("redefinery", "rd_Statesman_state"+(i+1)))
					{
						stateStr = app.settings.getSetting("redefinery", "rd_Statesman_state"+(i+1));
						matches = stateStr.match(/.*=(.*)/);
						if (matches != null)
						{
							layerStates = new Array();
							layerStates = matches[1].split(",");
							layerStates.pop();						// Remove the last (empty) item in array
							
							rd_StatesmanData.states[i] = layerStates;
						}
					}
				
				// Get the saved selected layer features
				if (app.settings.haveSetting("redefinery", "rd_Statesman_features"))
				{
					stateStr = app.settings.getSetting("redefinery", "rd_Statesman_features");
					for (var i=0; i<rdstPal.grp.setPnl.listBox.items.length; i++)
						rdstPal.grp.setPnl.listBox.items[i].selected = (stateStr[i] == "1") ? true : false;
				}
				
				// Save current UI settings upon closing the palette
				rdstPal.onClose = function()
				{
					var stateStr, state;
					
					// Save the states data
					for (var i=0; i<rd_StatesmanData.states.length; i++)
					{
						stateStr = i + "=";
						state = rd_StatesmanData.states[i];
						
						for (j=0; j<state.length; j++)
							stateStr += state[j] + ",";
						
						app.settings.saveSetting("redefinery", "rd_Statesman_state"+(i+1), stateStr);
					}
					
					// Save the selected layer features
					stateStr = "";
					for (var i=0; i<rdstPal.grp.setPnl.listBox.items.length; i++)
						stateStr += (rdstPal.grp.setPnl.listBox.items[i].selected) ? "1" : "0";
					
					app.settings.saveSetting("redefinery", "rd_Statesman_features", stateStr);
				}
				
				if (rdstPal instanceof Window)
				{
					// Show the palette
					rdstPal.center();
					rdstPal.show();
				}
				else
					rdstPal.layout.layout(true);
			}
		}
	}
	
	
	rd_Statesman(this);
}
