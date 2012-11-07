#target aftereffects

// Ease and Wizz 1.12
// Ian Haigh 2008-11-15 (mail@ianhaigh.com)

// An After Effects adaptation of Robert Penner's easing equations.
// Installation and usage at http://ianhaigh.com/easeandwizz/
// (apologies to Jarvis Cocker)

var EASING_FOLDER        = 'easingExpressions';
var CLEAR_EXPRESSION_BTN = false; // this adds a button to the palette, "clear", that deletes expressions on all selected properties. Off by default.
var easingEquation       = "";
var palette;

// palette controls
var easingList;
var typeList;
var keysList;

// define values for the controls
var keysLookup = new Object();
keysLookup['-all'] = 'All';
keysLookup['-startEnd'] = 'Start and end';
keysLookup['-startOnly'] = 'Start only';

var inOutLookup = new Object();
inOutLookup['inOut'] = 'In + Out';
inOutLookup['in'] = 'In';
inOutLookup['out'] = 'Out';

var easingTypesAry = ['Expo', 'Circ', 'Quint', 'Quart', 'Quad', 'Sine', '-', 'Back', 'Bounce', 'Elastic'];

var activeItem;
var selectedProperties;

function getHashValues(hash)
{ // {{{
	var ary = new Array();
	for (k in hash) {
		ary.push(hash[k]);
	}

	return ary;
} // }}}

function getHashKeys(hash)
{ // {{{
	var ary = new Array();
	for (k in hash) {
		ary.push(k);
	}

	return ary;
} // }}}

function main(thisObj)
{ //{{{
	createPalette(thisObj);
	/*
	activeItem = app.project.activeItem;
	if (activeItem == null) {
		return;
	}
	*/
	app.beginUndoGroup("Ease and Wizz");
} //}}}

function getPathToEasingFolder()
{ // {{{
	// much simpler, thanks Jeff
	var folderObj = new Folder((new File($.fileName)).path + "/" + EASING_FOLDER);
	return folderObj;

} // }}}

function createPalette(thisObj)
{//{{{
	var LIST_DIMENSIONS = [0, 0, 120, 15];
	var STATIC_TEXT_DIMENSIONS = [0, 0, 40, 15];

	palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Easing", undefined, {resizeable: true});
	palette.margins       = 6;
	palette.alignChildren = 'left';
	
	// fix the text display in the popup menu - thanks Jeff Almasol
	var winGfx = palette.graphics;
	var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0,0,0], 1);

	// popup menus
	{ // {{{

		// "easing" menu

		var easingGrp            = palette.add('group', undefined, 'Easing group');
		easingGrp.add('statictext', STATIC_TEXT_DIMENSIONS, 'Easing:');

		easingList                          = easingGrp.add('dropdownlist', LIST_DIMENSIONS, easingTypesAry);
		easingList.helpTip                  = "Choose the type of easing here. They're arranged";
		easingList.selection                = 'expo';
		easingList.graphics.foregroundColor = darkColorBrush;



		// "type" menu

		var typeGrp            = palette.add('group', undefined, 'Type group'); 
		typeGrp.add('statictext', STATIC_TEXT_DIMENSIONS, 'Type:');

		typeList                          = typeGrp.add('dropdownlist', LIST_DIMENSIONS, getHashValues(inOutLookup));
		typeList.selection                = 'In + Out';
		typeList.graphics.foregroundColor = darkColorBrush;




		// "keys" menu

		var keysGrp = palette.add('group', undefined, 'Keys group');
		keysGrp.add('statictext', STATIC_TEXT_DIMENSIONS, 'Keys:');

		keysList                          = keysGrp.add('dropdownlist', LIST_DIMENSIONS, getHashValues(keysLookup));
		keysList.graphics.foregroundColor = darkColorBrush;
		keysList.selection                = getHashValues(keysLookup)[0]; // select the first item

	} // }}}


	// apply button
	{ // {{{

		var buttonGrp = palette.add('group', undefined, 'Button group');
		buttonGrp.add('statictext', STATIC_TEXT_DIMENSIONS, '');

		// standard buttons
		if (CLEAR_EXPRESSION_BTN)
		{
			var clearExpressionsBtn     = buttonGrp.add('button', undefined, 'Clear expressions');
			clearExpressionsBtn.onClick = clearExpressions;
		}

		////////////////////	
		// apply button
		////////////////////	

		var applyBtn     = buttonGrp.add('button', undefined, 'Apply');
		applyBtn.onClick = applyExpressions;

	} // }}}

	if (palette instanceof Window)
	{
		palette.show();
	}
	else
	{
		palette.layout.layout(true);
	}

}//}}}

function trace(s) // for debugging
{ //{{{
	//$.writeln(s); // writes to the ExtendScript interface
	writeLn(s); // writes in the AE info window
} //}}}

function readFile(filename)
{ //{{{
	try
	{
		var easing_folder = getPathToEasingFolder();
	}
	catch(e) 
	{
		Window.alert(e);
		return false;
	}
	var file_handle   = new File(easing_folder.fsName + '/' + filename);

	if (!file_handle.exists) {
		Window.alert("I can't find this file: '" + filename + "'. \n\nI looked in here: '" + easing_folder.fsName + "'. \n\nYou can try reinstalling, or run the script again to choose the easingExpressions folder.");
		return false;
	}

	try 
	{
		file_handle.open('r');
		var the_code = file_handle.read();
	}
	catch(e) 
	{
		Window.alert("I couldn't read the easing equation file: " + e);
		return false;
	}
	finally
	{
		file_handle.close();
	}

	return(the_code);
} //}}}

function applyExpressions() // decide what external file to load
{ // {{{
	if (!canProceed()) { return false }

	// defaults
	var easingType        = 'inOut';
	var keyframesToAffect = "-allKeys";

	// loop through the two menu objects and see what the user's selected
	// First, which keys should be affected?
	for ( i in keysLookup ) 
	{
		if (keysLookup[i] == keysList.selection.toString()) {
			keyframesToAffect = i;
		}
	}

	// then, should the expression be In, Out, or Both?
	for ( i in inOutLookup ) 
	{
		if (inOutLookup[i] == typeList.selection.toString()) {
			easingType = i;
		}
	}

	var fileToLoad = easingType + easingList.selection.toString() + keyframesToAffect + '.js';
	trace(fileToLoad);

	try
	{
		easingEquation = readFile(fileToLoad);
	}
	catch(e)
	{
		Window.alert(e);
		return;
	}


	setProps(easingEquation);
} // }}}

function clearExpressions()
{//{{{
	// TODO : "Object is invalid"
	// TODO : "null is not an object"
	selectedProperties = activeItem.selectedProperties;
	for (var f in selectedProperties)
	{
		var currentProperty = selectedProperties[f];
		if (!currentProperty.canSetExpression) { continue }
		currentProperty.expression = '';
	}
}//}}}

function setProps(expressionCode)
{ //{{{
	var selectedProperties = app.project.activeItem.selectedProperties;

	for (var f in selectedProperties)
	{
		var currentProperty = selectedProperties[f];

		if (!currentProperty.canSetExpression) { continue } // don't do anything if we can't set an expression
		if (currentProperty.numKeys < 2) { continue } // likewise if there aren't at least two keyframes

		currentProperty.expression = expressionCode;
	}
} //}}}

function canProceed() 
{ // {{{
	activeItem = app.project.activeItem;
	if (activeItem == null)
	{
		Window.alert("Select a keyframe or two.");
		return false;
	}

	return true;
} // }}}

main(this);
