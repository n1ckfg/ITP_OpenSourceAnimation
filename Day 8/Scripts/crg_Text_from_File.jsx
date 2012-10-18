// Based on Dan Ebbert's script at motionscript.com
// crg_Text_from_File.jsx
// v2: added user interface, top-down layer order
// v3: added 'live leading' feature, and makes sure text layers are at top
// This script reads a user specified text file and
//   either makes one text layer with all the text,
//   or creates and places a bunch of text layers, one for each line
//   read from the text file. Includes a few 'text layout' options.
//   And yes, I'm still using the amazing jEdit (jedit.org -- not to be confused with similarly named apps) to write my scripts.

var win = new Window('dialog', 'Text Import Options',[300,100,553,410]);
var w = buildUI();
if (w != null) {
   w.show();
}

function doBigOppBool(windo, bool) {
   windo.lineSpaLbl.enabled = !bool;
   windo.lineSpaAmtLbl.enabled = !bool;
   windo.dnBtn.enabled = !bool;
   windo.upBtn.enabled = !bool;
   windo.dnTenBtn.enabled = !bool;
   windo.upTenBtn.enabled = !bool;
   windo.liveLeadCheck.value = false;
   windo.liveLeadCheck.enabled = !bool;
}

function buildUI() {
   if (win != null) {
      win.textOpsPnl = win.add('panel', [10,35,244,221], '');
      win.oneFileCheck = win.add('checkbox', [52,8,202,28], 'Import as One Layer');
      win.oneFileCheck.onClick = function () { doBigOppBool(win, this.value); };
      
      win.lineSpaLbl = win.add('statictext', [70,42,180,63], 'Line Spacing:');
      win.lineSpaLbl.justify = "center";
      win.lineSpaAmtLbl = win.add('statictext', [105,68,145,90], '10');
      win.lineSpaAmtLbl.justify = "center";
      
      win.dnBtn = win.add('button', [72,65,102,87], '-', {name:'dn1'});
      win.dnBtn.onClick = function () {changeSpaNumber(win.lineSpaAmtLbl, -1); };
      win.upBtn = win.add('button', [149,65,179,87], '+', {name:'up1'});
      win.upBtn.onClick = function () {changeSpaNumber(win.lineSpaAmtLbl, 1); };
      win.dnTenBtn = win.add('button', [17,65,67,87], '-10', {name:'dn101'});
      win.dnTenBtn.onClick = function () {changeSpaNumber(win.lineSpaAmtLbl, -10); };
      win.upTenBtn = win.add('button', [184,65,234,87], '+10', {name:'up101'});
      win.upTenBtn.onClick = function () {changeSpaNumber(win.lineSpaAmtLbl, 10); };
      win.topSpaLbl = win.add('statictext', [70,102,180,124], 'Space from Top:');
      win.topSpaLbl.justify = "center";
      
      win.topSpaAmtLbl = win.add('statictext', [105,128,145,150], '10');
      win.topSpaAmtLbl.justify = "center";
      win.dnBtn2 = win.add('button', [72,125,102,147], '-', {name:'dn2'});
      win.dnBtn2.onClick = function () {changeSpaNumber(win.topSpaAmtLbl, -1); };
      win.upBtn2 = win.add('button', [149,125,179,147], '+', {name:'up2'});
      win.upBtn2.onClick = function () {changeSpaNumber(win.topSpaAmtLbl, 1); };
      win.dnTenBtn2 = win.add('button', [17,125,67,147], '-10', {name:'dn102'});
      win.dnTenBtn2.onClick = function () {changeSpaNumber(win.topSpaAmtLbl, -10); };
      win.upTenBtn2 = win.add('button', [184,125,234,147], '+10', {name:'up102'});
      win.upTenBtn2.onClick = function () {changeSpaNumber(win.topSpaAmtLbl, 10); };
      win.leftSpaLbl = win.add('statictext', [70,162,180,184], 'Space from Left:');
      win.leftSpaLbl.justify = "center";
      
      win.leftSpaAmtLbl = win.add('statictext', [105,188,145,210], '10');
      win.leftSpaAmtLbl.justify = "center";
      win.dnBtn3 = win.add('button', [72,185,102,207], '-', {name:'dn3'});
      win.dnBtn3.onClick = function () {changeSpaNumber(win.leftSpaAmtLbl, -1); };
      win.upBtn3 = win.add('button', [149,185,179,207], '+', {name:'up3'});
      win.upBtn3.onClick = function () {changeSpaNumber(win.leftSpaAmtLbl, 1); };
      win.dnTenBtn3 = win.add('button', [17,185,67,207], '-10', {name:'dn103'});
      win.dnTenBtn3.onClick = function () {changeSpaNumber(win.leftSpaAmtLbl, -10); };
      win.upTenBtn3 = win.add('button', [184,185,234,207], '+10', {name:'up103'});
      win.upTenBtn3.onClick = function () {changeSpaNumber(win.leftSpaAmtLbl, 10); };
      
      win.liveLeadCheck = win.add('checkbox', [52,8+223,202,28+223], 'Add "Live Leading"');
	  
      win.okBtn = win.add('button', [160,267,240,289], 'OK', {name:'OK'});
      win.okBtn.onClick = function () {main(win);this.parent.close(1)};
      win.cancBtn = win.add('button', [66,267,146,289], 'Cancel', {name:'Cancel'});
      win.cancBtn.onClick = function () {this.parent.close(0)};
   }
   return win
}

function main(winDough) {
   inManyLayers = !winDough.oneFileCheck.value;
   withLiveLeading = winDough.liveLeadCheck.value;
   
   // create undo group
   app.beginUndoGroup("Text from File");
   
   // Prompt user to select text file
   
   var myFile = fileGetDialog("Select a text file to open.", "");//, "TEXT txt");
   
   if (myFile != null){
      // create project if necessary
      
      var proj = app.project;
      if (!proj) proj = app.newProject();
      var activeItem = proj.activeItem;
      var compBG = [.8,.8,.8] // comp background color
      
      // create new comp named 'text_comp'
      // or use the selected comp
      if (activeItem != null && (activeItem instanceof CompItem)){
         var myComp = activeItem;
         
      } else {
         //8.5x11 inches @ 72dpi
         var compW = 612; // comp width
         var compH = 792; // comp height
         
         var compL = 15;  // comp length (seconds)
         var compRate = 24; // comp frame rate
         
         var myItemCollection = app.project.items;
         var myComp = myItemCollection.addComp('text_comp',compW,compH,1,compL,compRate);
      }
      myComp.bgColor = compBG;
      lineSpa = 12;
      
      if (inManyLayers) {
         lineSpa = parseFloat(winDough.lineSpaAmtLbl.text);
      }           
      topSpa = parseFloat(winDough.topSpaAmtLbl.text);
      
      leftSpa = parseFloat(winDough.leftSpaAmtLbl.text);
      
      // open file
      var fileOK = myFile.open("r","TEXT","????");
      if (fileOK){
         
         var allText = "";
         var o = 1;
		 var addForLead = 0;
		 
         // read text lines
         // until end-of-file is reached
		 var textCollection = new Array();
		 
         while (!myFile.eof){
            write("Reading and writing line #" + o + " ... ");
            text = myFile.readln();
            // script will likely throw amusing error*
            // if line is empty
            // * "having to focus on ourselves"
            if (text == "") { text = "\r" ;}
            
            if (inManyLayers) {
               // if user chose 'many layers' option, make new text layer each iteration
               thisText = myComp.layers.addText(text);
               thisText.property("Position").setValue([(leftSpa), ( (lineSpa * o) + topSpa)]);
               if (o != 1) {thisText.moveAfter(myComp.layer(o));}
			   
			   // I figure, why use the memory if we don't need to:
	           if (withLiveLeading) { textCollection[(o-1)] = thisText; }
			   
            } else {
               // if user chose 'one layer' option, keep appending text variable:
               allText = (allText + text + "\r");
            }
            o = (o + 1);
            clearOutput();
         }
         clearOutput();
         
         if (! inManyLayers) {
            // if user chose 'one layer' option, now make one text layer:
            bigTextLayer = myComp.layers.addText(allText);
            bigTextLayer.property("Position").setValue([leftSpa, topSpa]);
         }
         // close the file before exiting
         myFile.close();
         
		 if (withLiveLeading) {
			//add null
				leadingNull = myComp.layers.addNull();
				leadingNull.name = "Leading Control (Adjust Y Pos)";
				leadingNull.property("position").setValue([0,0]);
				
				//give text expression for adjustable line spacing
				for (t = 0; t < (textCollection.length);t++) {
					textCollection[t].property("position").expression = 
					"v=value;\r[value[0], (value[1]+index-2)+thisComp.layer(\"Leading Control (Adjust Y Pos)\").transform.position[1]*(index-2)];";
				}
				alert("Adjust the leading (line spacing) by adjusting the top layer's Y position.\r (don't forget, kids: \"Leading\" rhymes with \"heading\"!)");
		 }
      } else {
         alert("File open failed!");
      }
   }else{
      alert("No text file selected.");
   }
   
   app.endUndoGroup();
}

function changeSpaNumber(theField, amt) {
   i = parseFloat(theField.text);
   i = (i + parseFloat(amt));
   theField.text = i;
}

