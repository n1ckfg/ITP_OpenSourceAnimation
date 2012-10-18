// Guilloche.jsx
// Copyright (c) 2011 Motion Boutique
// This AE script is a port of subblue's Guilloché Pattern Generator
// (www.subblue.com/projects/guilloche).

// settings
var _steps 		= 190;			// Divide a circle this many times
var _R 			= 83;			// The major ripple
var _r 			= 0.5;			// The minor ripple
var _p 			= 25;			// Radius type effect
var _m			= 1;			// Angle multiplier
var _amplitude 	= 2.5;			// Scale of final drawing

var _opacity 	= 0.2;			// Line opacity
var _thickness 	= 1;			// Line thickness

var section_length 	= 10;			// Number of sections for each line
var deg2rad 		= Math.PI/180;	// Factor to convert degs to radians

function buildUI(thisObj)
{
	// dockable panel or palette
	var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Guilloche", undefined, {resizeable:false});
	
	var sclSizeW = 120;
	var sclSizeH = 15;
	
	// resource specifications
	var res =
	"group { orientation:'column', alignment:['left','top'], alignChildren:['right','top'], \
	    gr1: Group { \
	        aboutBtn: Button { text:'?', preferredSize:[25,20] } \
	    }, \
	    gr2: Group { orientation:'column', alignChildren:['right','top'], \
	    	gr21: Group { orientation:'row', \
	        	stepsSt: StaticText { text:'Steps:' }, \
	        	stepsScl: Scrollbar { maxvalue:500, value:" + _steps + ", preferredSize:[" + sclSizeW + "," + sclSizeH + "] }, \
	        	stepsEt: EditText { text:'" + _steps + "', characters:5 } \
	    	}, \
	    	gr22: Group { orientation:'row', \
	        	RSt: StaticText { text:'Major Ripple:' }, \
	        	RScl: Scrollbar { maxvalue:300, value:" + _R + ", preferredSize:[" + sclSizeW + "," + sclSizeH + "] }, \
	        	REt: EditText { text:'" + _R + "', characters:5 } \
	    	}, \
	    	gr23: Group { orientation:'row', \
	        	rSt: StaticText { text:'Minor Ripple:' }, \
	        	rScl: Scrollbar { maxvalue:50, value:" + _r + ", preferredSize:[" + sclSizeW + "," + sclSizeH + "] }, \
	        	rEt: EditText { text:'" + _r + "', characters:5 } \
	    	}, \
	    	gr24: Group { orientation:'row', \
	        	pSt: StaticText { text:'Radius Effect:' }, \
	        	pScl: Scrollbar { preferredSize:[" + sclSizeW + "," + sclSizeH + "] }, \
	        	pEt: EditText { text:'" + _p + "', characters:5 } \
	    	}, \
	    	gr25: Group { orientation:'row', \
	        	mSt: StaticText { text:'Angle Multiplier:' }, \
	        	mScl: Scrollbar { preferredSize:[" + sclSizeW + "," + sclSizeH + "] }, \
	        	mEt: EditText { text:'" + _m + "', characters:5 } \
	    	}, \
	    	gr26: Group { orientation:'row', \
	        	amplitudeSt: StaticText { text:'Scale:' }, \
	        	amplitudeScl: Scrollbar { preferredSize:[" + sclSizeW + "," + sclSizeH + "] }, \
	        	amplitudeEt: EditText { text:'" + _amplitude + "', characters:5 } \
	    	} \
	    } \
	}"; 
	pal.gr = pal.add(res);

	pal.gr.gr1.aboutBtn.onClick = function () 
	{ 
	    alert("Guilloche.jsx\rCopyright (c) 2011 Motion Boutique\r\rCreates Guilloché pattern with the selected mask.", "Guilloche"); 
	};
	
	pal.gr.gr2.gr21.stepsEt.onChange = function () 
	{ 
	    _steps = parseInt(this.text); 
	    pal.gr.gr2.gr21.stepsScl.value = parseInt(this.text);
	    main();
	};

	pal.gr.gr2.gr21.stepsScl.onChanging = function () 
	{ 
	    _steps = parseInt(this.value);
	    pal.gr.gr2.gr21.stepsEt.text = Math.round(this.value);
	    main(); 
	};
	
	pal.gr.gr2.gr22.REt.onChange = function () 
	{ 
	    _R = parseFloat(this.text); 
	    pal.gr.gr2.gr22.RScl.value = parseFloat(this.text);
	    main();	  
	};

	pal.gr.gr2.gr22.RScl.onChanging = function () 
	{ 
	    _R = parseFloat(this.value);
	    pal.gr.gr2.gr22.REt.text = this.value.toFixed(1);
	    main(); 
	};
	
	pal.gr.gr2.gr23.rEt.onChange = function () 
	{ 
	    _r = parseFloat(this.text);
	    pal.gr.gr2.gr23.rScl.value = parseFloat(this.text);
	    main();	   
	};

	pal.gr.gr2.gr23.rScl.onChanging = function () 
	{ 
	    _r = parseFloat(this.value);
	    pal.gr.gr2.gr23.rEt.text = this.value.toFixed(1);
	    main(); 
	};
	
	pal.gr.gr2.gr24.pEt.onChange = function () 
	{ 
	    _p = parseFloat(this.text);
	    pal.gr.gr2.gr24.pScl.value = parseFloat(this.text);
	    main();	 
	};

	pal.gr.gr2.gr24.pScl.onChanging = function () 
	{ 
	    _p = parseFloat(this.value);
	    pal.gr.gr2.gr24.pEt.text = this.value.toFixed(1);
	    main(); 
	};
		
	pal.gr.gr2.gr25.mEt.onChange = function () 
	{ 
	    _m = parseFloat(this.text);
	    pal.gr.gr2.gr25.mScl.value = parseFloat(this.text);
	    main(); 
	};	

	pal.gr.gr2.gr25.mScl.onChanging = function () 
	{ 
	    _m = parseFloat(this.value);
	    pal.gr.gr2.gr25.mEt.text = this.value.toFixed(1);
	    main(); 
	};
			
	pal.gr.gr2.gr26.amplitudeEt.onChange = function () 
	{ 
	    _amplitude = parseFloat(this.text);
	    pal.gr.gr2.gr26.amplitudeScl.value = parseFloat(this.text);
	    main(); 
	};

	pal.gr.gr2.gr26.amplitudeScl.onChanging = function () 
	{ 
	    _amplitude = parseFloat(this.value);
	    pal.gr.gr2.gr26.amplitudeEt.text = this.value.toFixed(1);
	    main(); 
	};
	/*			
	pal.gr.gr4.runBtn.onClick = function () 
	{ 
	    main(); 
	};
	*/
	// show user interface
	if (pal instanceof Window)
	{
	    pal.center();
	    pal.show();
	}
	else
	{
	    pal.layout.layout(true);
	}             	
}

// s = (R + r) / r
// x = (R + r) * cos(m * theta) + (r + p) * cos(m * s * theta)
// y = (R + r) * sin(m * theta) + (r + p) * sin(m * s * theta)
// theta = 0..2PI
// R = 50, r = -0.25, p=25
function guilloche(mask)
{
	var x, y, ox, oy;
	var layer = mask.parentProperty.parentProperty;
	var layerCenter = [layer.width/2, layer.height/2];
	var sl = 0;
	var theta = 0;
	if (_steps <= 0) _steps = 1;
	var thetaStep = 2*Math.PI / _steps;
	if (_r <= 0) _r = 0.001;
	var s = (_R + _r) / _r;
	var rR = _r + _R;
	var rp = _r + _p;
	
	//var mask = layer.Masks.addProperty("Mask");
	var shape = new Shape();
	var verts = [];
	
	for (var t = 0; t <= _steps; t++)
	{
		x = rR * Math.cos(_m * theta) + rp * Math.cos(s * _m * theta);
		y = rR * Math.sin(_m * theta) + rp * Math.sin(s * _m * theta);
		
		x *= _amplitude;
		y *= _amplitude;
		
		var p = layerCenter + [x,y]; 
		verts.push(p);
		
		ox = x;
		oy = y;
		sl++;
		theta += thetaStep;
		
		if (sl == section_length) sl = 0;
	}
	
	shape.vertices = verts;
	
	mask.maskShape.numKeys ? mask.maskShape.setValueAtTime(layer.containingComp.time,shape) : mask.maskShape.setValue(shape);	
}

function main()
{
	var comp = app.project.activeItem;
	if (!(comp instanceof CompItem))
	{
		alert("Select a mask first.");
		return;
	}	
	/*
	var layer = comp.selectedLayers[0];	
	if (!layer)
	{
		alert("Select a layer.");
		return;		
	}
	*/
	if (comp.selectedProperties.length < 1)
	{
		alert("Select a mask first.");
		return;		
	}
	    
	var mask = comp.selectedProperties[0];
	if (!mask.isMask)
	{
		alert("Select a mask first.");
		return;		
	}
	    
	app.beginUndoGroup("Guilloche");
	try
	{
		guilloche(mask);
	}
	catch(e)
	{
		alert(e);
	}
	
	app.endUndoGroup();
}

buildUI(this);
