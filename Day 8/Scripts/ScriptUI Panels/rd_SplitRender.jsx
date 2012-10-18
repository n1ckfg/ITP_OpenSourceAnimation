{
	// rd_SplitRender.jsx
	// Copyright (c) 2005-2008 redefinery (Jeffrey R. Almasol). All rights reserved.
	// check it: www.redefinery.com
	// 
	// Name: rd_SplitRender
	// Version: 2.2
	// 
	// Description:
	// This script splits a render queue item into equal custom 
	// time spans based on the number of splits you specify.
	// 
	// Note: This script requires After Effects 6.5 or later; the selection
	// of the render queue item to split will be different in 7.0 and later.
	// 
	// Note (After Effects 6.5 only): Due to a limitation in the JavaScript
	// interface, the selected Render Settings cannot be copied. Also, 
	// each output module must be saved as a template -- it cannot be based 
	// on an existing template.
	// 
	// Originally requested by Michael Schneider.
	// Enhancements requested by Phil Spitler.
	// 
	// Legal stuff:
	// This script is provided "as is," without warranty of any kind, expressed
	// or implied. In no event shall the author be held liable for any damages
	// arising in any way from the use of this script.
	// 
	// In other words, I'm just trying to share knowledge with and help out my
	// fellow AE script heads, so don't blame me if my code doesn't rate. :-)
	
	
	
	
	// rd_SplitRender()
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
	function rd_SplitRender()
	{
		// Globals
		
		// Check for AE 6.5 and CS3
		var is65 = (parseFloat(app.version) < 7.0);
		var isCS3 = (parseFloat(app.version) >=8.0);
		
		var rd_SplitRenderData = new Object();	// Store globals in an object
		rd_SplitRenderData.scriptName = "rd: Split Render";
		rd_SplitRenderData.scriptTitle = rd_SplitRenderData.scriptName + " v2.2";
		
		rd_SplitRenderData.strRQI = {en: "Render Queue Item to Split:"};			// For AE 7.0 or later
		rd_SplitRenderData.strRQINum = {en: "Render Queue Item #:"};				// For AE 6.5 only
		rd_SplitRenderData.strSplitItemInfo = {en: "Split Item Into:"};
		rd_SplitRenderData.strSplitItemUnits = {en: "subitems"};
		rd_SplitRenderData.strPart = {en: "part"};
		rd_SplitRenderData.strOf = {en: "of"};
		rd_SplitRenderData.strOK = {en: "OK"};
		rd_SplitRenderData.strCancel = {en: "Cancel"};
		rd_SplitRenderData.strHelp = {en: "?"};
		rd_SplitRenderData.strErrNoRQIs = {en: "Cannot perform operation because no items exist in the Render Queue."};
		rd_SplitRenderData.strMinAE70 = {en: "This script requires Adobe After Effects 7.0 or later."};
		rd_SplitRenderData.strHelpText = 
		{
			en: "Copyright (c) 2005-2008 redefinery (Jeffrey R. Almasol). \n" +
			"All rights reserved.\n" +
			"\n" +
			"This script splits a render queue item into equal custom \n" +
			"time spans based on the number of splits you specify.\n" +
			"\n" +
			"Note: This script requires After Effects 6.5 or later; \n" +
			"the selection of the render queue item to split will be \n" +
			"different in 7.0 and later.\n" +
			"\n" +
			"Note (After Effects 6.5 only): Due to a limitation in \n" +
			"the JavaScript interface, the selected Render Settings \n" +
			"cannot be copied. Also, each output module must be \n" +
			"saved as a template -- it cannot be based on an \n" +
			"existing template.\n" +
			"\n" +
			"Originally requested by Michael Schneider.\n" + 
			"Enhancements requested by Phil Spitler.\n"
		};
		
		
		
		
		// rd_SplitRender_localize()
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
		function rd_SplitRender_localize(strVar)
		{
			return strVar["en"];
		}
		
		
		
		
		// rd_SplitRender_buildUI()
		// 
		// Description:
		// This function builds the user interface.
		// 
		// Parameters:
		// None.
		// 
		// Returns:
		// Window object representing the built user interface.
		//
		function rd_SplitRender_buildUI()
		{
			var dlg = new Window("dialog", rd_SplitRenderData.scriptName, is65 ? [200, 200, 600, 348] : [200, 200, 550, 460]);
			
			if (dlg != null)
			{
				if (is65)
				{
					// Render Queue Item #:
					dlg.rqiText = dlg.add("statictext", [10, 10, 150, 30], rd_SplitRender_localize(rd_SplitRenderData.strRQINum));
					
					dlg.rqiSlider = dlg.add("slider", [dlg.rqiText.bounds.right+10, 10, dlg.bounds.width-40, 30]);
					dlg.rqiSlider.minvalue = 1;
					dlg.rqiSlider.maxvalue = app.project.renderQueue.numItems;
					dlg.rqiSlider.value = app.project.renderQueue.numItems;
					dlg.rqiSlider.onChange = rd_SplitRender_updateSliderText;
					
					dlg.rqiSliderText = dlg.add("statictext", [dlg.rqiSlider.bounds.right, 10, dlg.bounds.width-10, 30], dlg.rqiSlider.value.toString());
					
					// Composition Name
					dlg.compNameText = dlg.add("statictext", [dlg.rqiSlider.bounds.left+5, dlg.rqiText.bounds.bottom+5, dlg.bounds.width-10, dlg.rqiText.bounds.bottom+25], app.project.renderQueue.item(1).comp.name);
				}
				else
				{
					// Render Queue Item: label and list box
					dlg.rqi = dlg.add("statictext", [10, 10, dlg.bounds.width-10, 25], rd_SplitRender_localize(rd_SplitRenderData.strRQI));
					
					dlg.rqiList = dlg.add("listbox", [10, dlg.rqi.bounds.bottom+5, dlg.bounds.width-10, dlg.rqi.bounds.bottom+152]);
					dlg.rqiList.removeAll();
					
					for (var i=1; i<=app.project.renderQueue.numItems; i++)
						dlg.rqiList.add("item", app.project.renderQueue.item(i).comp.name);
					
					dlg.rqiList.selection = app.project.renderQueue.numItems - 1;
				}
				
				// Split Item Into: <n> subitems
				if (is65)
				{
					dlg.splitText = dlg.add("statictext", [10, dlg.compNameText.bounds.bottom+20, dlg.rqiText.bounds.right, dlg.compNameText.bounds.bottom+40], rd_SplitRender_localize(rd_SplitRenderData.strSplitItemInfo));
					
					dlg.splitSlider = dlg.add("slider", [dlg.rqiSlider.bounds.left, dlg.splitText.bounds.top, dlg.bounds.width-95, dlg.splitText.bounds.bottom]);
				}
				else
				{
					dlg.splitText = dlg.add("statictext", [10, dlg.rqiList.bounds.bottom+10, 100, dlg.rqiList.bounds.bottom+30], rd_SplitRender_localize(rd_SplitRenderData.strSplitItemInfo));
					
					dlg.splitSlider = dlg.add("slider", [dlg.splitText.bounds.right+10, dlg.splitText.bounds.top, dlg.bounds.width-95, dlg.splitText.bounds.bottom]);
				}
				dlg.splitSlider.minvalue = 2;
				dlg.splitSlider.maxvalue = 50;
				dlg.splitSlider.value = 2;
				dlg.splitSlider.onChange = dlg.splitSlider.onChanging = rd_SplitRender_updateSplitText;
				
				dlg.splitSliderText = dlg.add("statictext", [dlg.splitSlider.bounds.right, dlg.splitSlider.bounds.top, dlg.splitSlider.bounds.right+20, dlg.splitSlider.bounds.bottom], dlg.splitSlider.value.toString());
				
				dlg.splitSliderUnitsText = dlg.add("statictext", [dlg.splitSliderText.bounds.right+5, dlg.splitSlider.bounds.top, dlg.bounds.width-10, dlg.splitSlider.bounds.bottom], rd_SplitRender_localize(rd_SplitRenderData.strSplitItemUnits));
				
				// Separator
				dlg.sep = dlg.add("panel", [10, dlg.splitSliderText.bounds.bottom+10, dlg.bounds.width-10, dlg.splitSliderText.bounds.bottom+12]);
				
				// OK, Cancel, and ? buttons
				dlg.cancelBtn = dlg.add("button", [dlg.bounds.width-90, dlg.bounds.height-30, dlg.bounds.width-10, dlg.bounds.height-10], rd_SplitRender_localize(rd_SplitRenderData.strCancel));

				dlg.okBtn = dlg.add("button", [dlg.cancelBtn.bounds.left-90, dlg.bounds.height-30, dlg.cancelBtn.bounds.left-10, dlg.bounds.height-10], rd_SplitRender_localize(rd_SplitRenderData.strOK));
				dlg.okBtn.onClick = doSplit;
				
				dlg.helpBtn = dlg.add("button", [10, dlg.bounds.height-30, 35, dlg.bounds.height-10], rd_SplitRender_localize(rd_SplitRenderData.strHelp));
				dlg.helpBtn.onClick = rd_SplitRender_doHelp;
				
				if (!is65)
				{
					// Disable appropriate controls if no render queue item is selected
					dlg.rqiList.onChange = function() {
						var enableStuff = (this.selection != null);

						this.parent.okBtn.enabled = enableStuff;
						this.parent.splitText.enabled = enableStuff;
						this.parent.splitSlider.enabled = enableStuff;
						this.parent.splitSliderText.enabled = enableStuff;
						this.parent.splitSliderUnitsText.enabled = enableStuff;
					}
				}
			}
			
			return dlg;
		}
		
		
		
		
		// rd_SplitRender_updateSliderText()
		// 
		// Description:
		// This callback function updates the user interface when the Render Queue Item # slider is updated.
		// Used only in After Effects 6.5 version of the user interface.
		// 
		// Parameters:
		// None.
		// 
		// Returns:
		// Nothing.
		//
		function rd_SplitRender_updateSliderText()
		{
			var rqItem = this.parent.rqiSlider.value;
			
			// Update the slider text field
			this.parent.rqiSliderText.text = rqItem.toString();
			
			// Update the composition name displayed
			this.parent.compNameText.text = app.project.renderQueue.item(rqItem).comp.name;
		}
		
		
		
		
		// rd_SplitRender_updateSplitText()
		// 
		// Description:
		// This callback function updates the user interface when the Split Item Into slider is updated.
		// 
		// Parameters:
		// None.
		// 
		// Returns:
		// Nothing.
		//
		function rd_SplitRender_updateSplitText()
		{
			var roundedValue = parseInt(this.parent.splitSlider.value);
			
			this.parent.splitSliderText.text = roundedValue.toString();
			this.parent.splitSlider.value = roundedValue;
		}
		
		
		
		
		// rd_SplitRender_doHelp()
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
		function rd_SplitRender_doHelp()
		{
			var msg = rd_SplitRenderData.scriptTitle + "\n" + rd_SplitRender_localize(rd_SplitRenderData.strHelpText);
			alert(msg);
		}
		
		
		
		
		// doSplit()
		// 
		// Description:
		// This callback function performs the main operation of splitting the selected render queue item into several subitems.
		// 
		// Parameters:
		// None.
		// 
		// Returns:
		// Nothing.
		//
		function doSplit()
		{
			var rqItem = is65 ? app.project.renderQueue.item(this.parent.rqiSlider.value) : app.project.renderQueue.item(this.parent.rqiList.selection.valueOf()+1);
			var currSplit = 1;
			var maxSplits = this.parent.splitSlider.value;
			
			// Duplicate the render queue item; no easy way, so this is where I pull out my hair...
			var sliceSpanDuration = rqItem.timeSpanDuration / maxSplits;
			var currSpanStart = rqItem.timeSpanStart;
			var newRQI, outputFileName, newOutputFileName, extPos;
			
			while (currSplit <= maxSplits)
			{
				// Create a new item from the comp
				newRQI = is65 ? app.project.renderQueue.items.add(rqItem.comp) : rqItem.duplicate();
				if (newRQI != null)
				{
					// Copy the settings from the master item to this duplicated item
					if (is65)
					{
						newRQI.logType = rqItem.logType;
						newRQI.render = rqItem.render;
						newRQI.skipFrames = rqItem.skipFrames;
					}
					newRQI.timeSpanDuration = sliceSpanDuration;
					newRQI.timeSpanStart = currSpanStart;
					
					if (is65)
					{
						// Copy all output modules...
						
						// First create any additional output modules
						for (var i = 2; i <= rqItem.numOutputModules; i++)	// Start at 2 because the item already has one
							newRQI.outputModules.add();
						
						// Then copy the output module info
						for (var i = 1; i <= rqItem.numOutputModules; i++)
						{
							newRQI.outputModule(i).applyTemplate(rqItem.outputModule(i).name);
							
							// Add a suffix to the output module, only if not still format
							var outputFileName = rqItem.outputModule(i).file.fsName, newOutputFileName;
							
							if (outputFileName.indexOf("[#####]") == -1)
							{
								var extPos = outputFileName.lastIndexOf(".");
								newOutputFileName = outputFileName.substr(0, extPos) + "_" + rd_SplitRender_localize(rd_SplitRenderData.strPart) + currSplit + rd_SplitRender_localize(rd_SplitRenderData.strOf) + maxSplits + outputFileName.substr(extPos);
							}
							else
								newOutputFileName = outputFileName;
							
							newRQI.outputModule(i).file = new File(newOutputFileName);
						}
					}
					else
					{
						// For each output module, give it a part number
						for (var i = 1; i <= newRQI.numOutputModules; i++)
						{
							// Add a suffix to the output module, only if not still format
							outputFileName = newRQI.outputModule(i).file.fsName;
							
							if (outputFileName.indexOf("[#####]") == -1)
							{
								extPos = outputFileName.lastIndexOf(".");
								newOutputFileName = outputFileName.substr(0, extPos) + "_" + rd_SplitRender_localize(rd_SplitRenderData.strPart) + currSplit + rd_SplitRender_localize(rd_SplitRenderData.strOf) + maxSplits + outputFileName.substr(extPos);
							}
							else
								newOutputFileName = outputFileName;
							
							newRQI.outputModule(i).file = new File(newOutputFileName);
						}
					}
				}
				
				currSplit += 1;
				currSpanStart += sliceSpanDuration;
			}
			
			// Manually close the dialog (needed for CS3)
			if (isCS3)
				this.parent.close();
		}
		
		
		
		
		// main code:
		//
		
		// Don't show the dialog box if no render queue items exist
		if (app.project.renderQueue.numItems == 0)
			alert(rd_SplitRender_localize(rd_SplitRenderData.strErrNoRQIs));
		else
		{
			// Encapsulate all operations into a single undo event
			app.beginUndoGroup(rd_SplitRenderData.scriptName);

			// Build and show the dialog box
			var rdsrDlg  = rd_SplitRender_buildUI();
			if (rdsrDlg != null)
			{
				rdsrDlg.center();
				rdsrDlg.show();
			}

			app.endUndoGroup();
		}
	}
	
	
	rd_SplitRender();
}
