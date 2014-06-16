/* CSV to Text Layers
	
	Use this script to apply CSV fields to matching Text Layers in a single selected comp.
	
	Copyright 2006 - Dale Bradshaw, dale@creative-workflow-hacks.com http://creative-workflow-hacks.com
	
	Free To Distribute, but you must maintain this header if used without alteration
	If you use parts of this script please include my contact info as attribution (suggested but not required...thanks)
	
	v1.0 June 8, 2006
	v1.01 August 16, 2007 Added Regex hack as an interim fix for failing in AE CS3
	
*/

   //need a regex to handle how characters are wrapped in CSV
  function parseCSV(text){
  		
		var i, s;
		var table = new Array();
		var a = text.split(/\r*\n/);
		var version = app.version.substring(0,1);
		var pattern;
		/*
		Regex hack for CS3, CS3 is failing on the $ conditional in (?=,|\\t|$), without a negative look behind assertion,we will kludge
		a positive look behind assertion and delete the beginning , if the text layer begins with a , this is likely to fail so don't start your 
		match layer with a , for now, which is probably something you don't want to do anyway.
		*/
		
		if(version >= 8){
			 pattern = new RegExp("(^|\\t|,)(\"*|'*)(.*?)\\2(?=,|\\t|(?<,)$)", "g");
		}else{
			pattern = new RegExp("(^|\\t|,)(\"*|'*)(.*?)\\2(?=,|\\t|$)", "g");
		}
	   
		
		for (i=0; i<a.length; i++){
			s = a[i].replace(/""/g, '\"');	 
			s = s.replace(pattern, "$3\t");
			s = s.replace(/\t(?=\t)/g, "\t ");
			s = s.replace(/\t$/, "");
		
			if (s) {
				var element = s.split("\t");
				var count = element.length;
				
				table[i] = new Array(count);
				for (x=0; x < count; x++){
				     if (typeof element[x] != 'undefined'){
						if(version >= 8){
							if(element[x].indexOf(",") == 0) element[x] =  element[x].substring(1, s.length);
						}
						
						table[i][x] = element[x];
					}
				}
			}
		 }
		  return table;
    };
	
   //check that a single comp is selected
   
   function checkPrerequisites(){
	
		
		var selectedCount = 0;
		
		
		for (var i = 1; i <= items.length; i++){
			if(items[i].selected){
			
				
				if (items[i] instanceof CompItem){
					selectedItemInfo.type = 'CompItem';
					selectedItemInfo.name = items[i].name;
					selectedItemInfo.source = items[i];
				}else{
					
					selectedItemInfo.type = '';
					selectedItemInfo.name = '';
					selectedItemInfo.source = '';
					alert('Please select a single comp with a template text format');
					
				}
				
				selectedCount++;
			}
		}
			if(selectedCount > 1 || selectedCount == 0){
				selectedItemInfo.type = '';
				selectedItemInfo.name = '';
				selectedItemInfo.source = '';
				
				var selectAlert = "Please select a single comp with a template text format";
				alert(selectAlert);	
			}else{
				main();
			}
	}
	
//globals
	var items = app.project.items;
	var selectedItemInfo = {name: "", type:"", source:""};
	checkPrerequisites();


function main(){
	app.beginUndoGroup("Apply CSV to Text Layers");
		
	var pfile = fileGetDialog("Please select a CSV file.", "");
	var encoded_data = '';
	
	if (pfile == null){
		alert("No csv file selected. ");
	}else{
	
		var readData = pfile.open("r","TEXT", "????");
		
		
		if(readData){
			var encoded_data = pfile.read();
		}else{
			alert("Problems reading csv file");
		}
	}
	
	var data = parseCSV(encoded_data);

		//alert(data[0][0]);
		//check that we have valid layers that match title of first line of csv
		var titleLength = data[0].length;
		var layers = selectedItemInfo.source.layers; // Retrieve the composition's layers
		var matchingLayers = new Array();           // Store matching layers in an array

	    //check that we have a matching layer for our field
	    //here is most likely debug point, will fail if extra spaces, characters etc.

	    for(x=0; x < titleLength; x++){
			var foundLayer = false;
			var missingTextLayer = false;

			for (var i = 1; i <= layers.length; i++){

				var sourceText = layers[i].sourceText;

				if (sourceText != null){
					if(sourceText.numKeys == 0) {
						if(sourceText.value.text == data[0][x]){
							//this is the layer for this title
							foundLayer = true;
							matchingLayers[x] = {name:data[0][x], source: layers[i]};
							break;
						}
					}
				}
			}

			if(!foundLayer){
				alert("Couldn't find matching text layer for " + data[0][x]);
				var missingTextLayer = true;
			}
    }
	
	//if we have all our layers, apply the CSV
	if(!missingTextLayer){
		
		var elementLength = data.length;
		
		for(x=1; x < elementLength; x++){
			//dupe the comp of interest
			var compElement = selectedItemInfo.source.duplicate();
			var compElementName = '';
			
			//pad and name comp, we could put a nice interface to the name of the comps in the next version
			if(elementLength < 10){
			 compElementName = "0"+x + "_";
			}else if(elementLength < 100 && elementLength >= 10){
				//pad
				if(x < 10){
					 compElementName = "0"+x+"_";
				 }else{
					compElementName = x+"_";
				 }
			}else if(elementLength < 1000 && elementLength >= 100){
				//pad
				if(x < 100 && x >10){
					 compElementName = "0"+x+"_";
				 }else if(x < 100 && x < 10){
					compElementName = "00" + x+"_";
				 }else{
					compElementName = x + "_";
				}
			}
			
			
			for(y=0; y< data[x].length; y++){
				var title = data[x][y];
				compElementName += title + "_";
			}
			//trunacate string for AE
			if(compElementName.length > 30){
				compElementName = compElementName.substring(0,29);
			}
			compElement.name = compElementName;
		          
			    //apply the text
				for(i=1; i <= layers.length; i++){
					for(j=0; j < matchingLayers.length; j++){
						
						
						if(layers[i].name == matchingLayers[j].name){
							compElement.layers[i].sourceText.setValue(data[x][j]);
						}
						
					}
				}
			
				
			
			
		}
	}

	
	app.endUndoGroup();
}