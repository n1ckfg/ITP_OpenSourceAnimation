{
	// DeCasteljauBezierCurve.jsx
    // Copyright © 2012 Michel Pensas. All rights reserved.
    //
    // Name : DeCasteljauBezierCurve
    // Version : 1.0
    //
    // Description :
    // This script creates an After Effects composition taking the principle of the technique
    // found by Paul de Casteljau to draw a Bezier curve.
    //
    // The user interface is created with Flash Builder allowing a representation of
    // the Bezier curve before constructing the After Effects composition.
    //
    // Overall this project allows using the communication possibilities between ActionScript
    // and ExtendScript, which is very interesting and opens more possibilities for scripting.
    //
    //This script is more of an academic exercise than a script that has actual production purpose.
    //
    // The usefulness of this type of script is to understand the extensive scripting thanks
    // to new interface possibilities not possible only with the ExtendScript tools and made ​​possible
    // with Adobe Flash Builder with the ExternalInterface object and its call method that let’s create
    // communication between swf file and ScriptUI.
    //
    // Note : All source files are provided in this package.
    // Place the ‘DeCasteljauBezierCurve’ folder in the ‘Scripts’ folder :
    // ‘Adobe’ > ‘Adobe After Effects CS6’ > ‘Supports Files’  > ‘Scripts’.
    //
    // Requires Adobe Flash Builder 4.6 for editing the .mxml file.
    //
    // This version of the script requires After Effects CS6.
    // Runs on Mac and PC in the same way.
    //
    // Legal notices: 
    // This script is provided "as is" without warranty of any kind, expressed or implied.
    // The author permits you to use and modify this file but in no event he shall be held liable for any damages
    // arising in any way from the use of this script or the file associated.


	// DeCasteljauBezierCurve()
	// 
	// Description:
	// This function contains the main logic for this script.
	//
	function DeCasteljauBezierCurve()
	{
		// Globals
		
		var DeCasteljauBezierCurveData = new Object();	// Store globals in an object
		DeCasteljauBezierCurveData.scriptName = "DeCasteljauBezierCurve";
		DeCasteljauBezierCurveData.scriptTitle = DeCasteljauBezierCurveData.scriptName + " v1.0";
		DeCasteljauBezierCurveData.strMinAE11 = {en: "This script requires Adobe After Effects CS6."};

		// DeCasteljauBezierCurve_localize()
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
		function DeCasteljauBezierCurve_localize(strVar)
		{
			return strVar["en"];
		}
		

		// main code:
		//
		// Prerequisites check
		if (parseFloat(app.version) < 11.0)
			alert(DeCasteljauBezierCurve_localize(DeCasteljauBezierCurveData.strMinAE11), DeCasteljauBezierCurveData.scriptTitle);
		else
		{
			
                //ScriptUI Dialog Code
                var win = new Window("palette", undefined, undefined, {borderless: false});
                win.margins = [0,0,0,0];

                // Tells us where this script is running from
                var scriptpath = new File($.fileName);

                //Flash player instantiation
                var flash = win.add ("flashplayer", undefined);

                //The Flash movie (SWF) to load into ESTK
                flash.loadMovie(File (scriptpath.parent.fsName + "/resources/DeCasteljau_Bezier_Curve.swf"));

                //Here is the functions that the SWF file is going to call
                flash.createAEcomp = function(Ax,Ay,tgAx,tgAy,tgBx,tgBy,Bx,By,val){
                    
                    app.beginUndoGroup("DeCasteljau Bezier Curve");
                    
                        // Create Composition
                        var curItem = app.project.items.addComp('DeCasteljau Bezier Curve' ,550,450,1,5,29.97);	
                        curItem.bgColor = [1/255,1/255,1/255];
                        
                        var solid = [];
                        var line = [];
                        var tangent = [];
                        var tg;
                        var coord = [[Ax,Ay],[tgAx,tgAy],[tgBx,tgBy],[Bx,By]];
                        
                        var textPos = [[parseInt(Ax)-30,parseInt(Ay)+20],[parseInt(tgAx)-40,tgAy],[parseInt(tgBx)+40,tgBy],[parseInt(Bx)+30,parseInt(By)+20]];
                                    
                        var name = ["A","tgA","tgB","B"];
                        
                        // Create Solids
                        for( var i = 0; i < coord.length; i++){
                            
                                solid[i] = curItem.layers.addSolid([164/255,164/255,194/255],name[i],30,30,1,curItem.time);
                                solid[i].position.setValue(coord[i]);
                                solid[i].scale.expression = "[100,100]";
                                solid[i].moveToEnd();
                                createMask(solid[i]);
                            
                            }

                        // Create Circle Mask
                        function createMask(curLayer){
                            
                                var h = curLayer.width/2;
                                var v = curLayer.height/2;
                                var th = h*0.5523;
                                var tv = v*0.5523;
                                
                                var mask = curLayer.Masks.addProperty("ADBE Mask Atom");
                                mask.maskMode = MaskMode.ADD;
                                mask.locked = true;
                                
                                var property = mask.property("ADBE Mask Shape");
                                var shape = property.value;
                                shape.vertices = [[h,0],[0,v],[h,2*v],[2*h,v]];
                                shape.inTangents = [[th,0],[0,-tv],[-th,0],[0,tv]];
                                shape.outTangents = [[-th,0],[0,tv],[th,0],[0,-tv]];
                                shape.closed = true;
                                property.setValue(shape);
                            
                            }
                        
                        var finalPoint = curItem.layers.addSolid([56/255,123/255,244/255],"point",30,30,1,curItem.time);
                        finalPoint.scale.expression = "[100,100]";
                        finalPoint.moveToEnd();
                        createMask(finalPoint);
                        
                        // Create Null and Slider Control
                        var sliderControl = curItem.layers.addNull();
                        sliderControl.name = "Slider Control";
                        sliderControl.Marker.setValueAtTime(0,new MarkerValue("0"));
                        sliderControl.Marker.setValueAtTime(4,new MarkerValue("1"));
                        var slider = sliderControl.Effects.addProperty("ADBE Slider Control");
                        slider.name = "value";
                        slider.property("ADBE Slider Control-0001").setValueAtTime(0,(0));
                        slider.property("ADBE Slider Control-0001").setValueAtTime(4,(1));
                        
                        // Create Curve
                        var curve = curItem.layers.addSolid([0,0,0],"Curve",curItem.width,curItem.height,1,curItem.time);
                        curve.moveToEnd();
                        curve.Effects.addProperty("ADBE Write-on");
                        curve.Effects.property("ADBE Write-on").property("ADBE Write-on-0002").setValue([17/255,218/255,17/255]);
                        curve.Effects.property("ADBE Write-on").property("ADBE Write-on-0003").setValue(3);
                        curve.Effects.property("ADBE Write-on").property("ADBE Write-on-0010").setValue(2);

                        // Create Lines
                        var lines = curItem.layers.addSolid([0,0,0],"Lines",curItem.width,curItem.height,1,curItem.time);
                        lines.moveToEnd();
                        
                        for( var i = 0; i < 3; i++ ){

                            line[i] = lines.Effects.addProperty("ADBE Laser");
                            line[i].name = name[i]+" - "+name[i+1];
                            line[i].property("ADBE Laser-0001").expression = "thisComp.layer(\""+name[i]+"\").transform.position";
                            line[i].property("ADBE Laser-0002").expression = "thisComp.layer(\""+name[i+1]+"\").transform.position";
                            line[i].property("ADBE Laser-0003").expression = "100";
                            line[i].property("ADBE Laser-0005").setValue(4);
                            line[i].property("ADBE Laser-0006").setValue(4);
                            line[i].property("ADBE Laser-0007").setValue(0);
                            line[i].property("ADBE Laser-0008").setValue([224/255,0,0]);
                            line[i].property("ADBE Laser-0009").setValue([224/255,0,0]);
                            line[i].property("ADBE Laser-0011").setValue(true);
                        
                        }
                    
                        for( var i = 0; i < 2; i++ ){
                            
                            tgLines(tangent[i], name[i], name[i+1], name[i+2]);
                            
                            }
                                    
                        function tgLines( tg, layer1, layer2, layer3 ){
                            
                            tg = lines.Effects.addProperty("ADBE Laser"); 
                            tg.name = layer1+" - "+layer2+" - "+layer3;
                            tg.property("ADBE Laser-0001").expression = "x1 = thisComp.layer(\""+layer1+"\").transform.position[0];"+
                                                                                            "\ry1 = thisComp.layer(\""+layer1+"\").transform.position[1];"+
                                                                                            "\rx2 = thisComp.layer(\""+layer2+"\").transform.position[0];"+
                                                                                            "\ry2 = thisComp.layer(\""+layer2+"\").transform.position[1];"+
                                                                                            "\rval = thisComp.layer(\"Slider Control\").effect(\"value\")(\"ADBE Slider Control-0001\") ;"+
                                                                                            "\rdistance = Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));"+
                                                                                            "\ra = distance*val;"+
                                                                                            "\rb = distance - a;"+
                                                                                            "\rrate = a/(a+b);"+
                                                                                            "\rPx = x1 + rate*( x2 - x1 );"+
                                                                                            "\rPy = y1 + rate*( y2 - y1 );"+
                                                                                            "\r[Px,Py];";
                            
                            tg.property("ADBE Laser-0002").expression = "x1 = thisComp.layer(\""+layer2+"\").transform.position[0];"+
                                                                                            "\ry1 = thisComp.layer(\""+layer2+"\").transform.position[1];"+
                                                                                            "\rx2 = thisComp.layer(\""+layer3+"\").transform.position[0];"+
                                                                                            "\ry2 = thisComp.layer(\""+layer3+"\").transform.position[1];"+
                                                                                            "\rval = thisComp.layer(\"Slider Control\").effect(\"value\")(\"ADBE Slider Control-0001\") ;"+
                                                                                            "\rdistance = Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));"+
                                                                                            "\ra = distance*val;"+
                                                                                            "\rb = distance - a;"+
                                                                                            "\rrate = a/(a+b);"+
                                                                                            "\rPx = x1 + rate*( x2 - x1 );"+
                                                                                            "\rPy = y1 + rate*( y2 - y1 );"+
                                                                                            "\r[Px,Py];";
                            
                            tg.property("ADBE Laser-0003").expression = "100";
                            tg.property("ADBE Laser-0005").setValue(4);
                            tg.property("ADBE Laser-0006").setValue(4);
                            tg.property("ADBE Laser-0007").setValue(0);
                            tg.property("ADBE Laser-0008").setValue([224/255,0,0]);
                            tg.property("ADBE Laser-0009").setValue([224/255,0,0]);
                            tg.property("ADBE Laser-0011").setValue(true);
                        
                        }
                    
                        tg = lines.Effects.addProperty("ADBE Laser"); 
                        tg.name = "center";
                        tg.property("ADBE Laser-0001").expression = "x1 = effect(\"A - tgA - tgB\")(\"ADBE Laser-0001\")[0];"+
                                                                                        "\ry1 = effect(\"A - tgA - tgB\")(\"ADBE Laser-0001\")[1];"+
                                                                                        "\rx2 = effect(\"A - tgA - tgB\")(\"ADBE Laser-0002\")[0];"+
                                                                                        "\ry2 = effect(\"A - tgA - tgB\")(\"ADBE Laser-0002\")[1];"+
                                                                                        "\rval = thisComp.layer(\"Slider Control\").effect(\"value\")(\"ADBE Slider Control-0001\") ;"+
                                                                                        "\rdistance = Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));"+
                                                                                        "\ra = distance*val;"+
                                                                                        "\rb = distance - a;"+
                                                                                        "\rrate = a/(a+b);"+
                                                                                        "\rPx = x1 + rate*( x2 - x1 );"+
                                                                                        "\rPy = y1 + rate*( y2 - y1 );"+
                                                                                        "\r[Px,Py];";
                        
                        tg.property("ADBE Laser-0002").expression = "x1 = effect(\"tgA - tgB - B\")(\"ADBE Laser-0001\")[0];"+
                                                                                        "\ry1 = effect(\"tgA - tgB - B\")(\"ADBE Laser-0001\")[1];"+
                                                                                        "\rx2 = effect(\"tgA - tgB - B\")(\"ADBE Laser-0002\")[0];"+
                                                                                        "\ry2 = effect(\"tgA - tgB - B\")(\"ADBE Laser-0002\")[1];"+
                                                                                        "\rval = thisComp.layer(\"Slider Control\").effect(\"value\")(\"ADBE Slider Control-0001\") ;"+
                                                                                        "\rdistance = Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));"+
                                                                                        "\ra = distance*val;"+
                                                                                        "\rb = distance - a;"+
                                                                                        "\rrate = a/(a+b);"+
                                                                                        "\rPx = x1 + rate*( x2 - x1 );"+
                                                                                        "\rPy = y1 + rate*( y2 - y1 );"+
                                                                                        "\r[Px,Py];";
                        
                        tg.property("ADBE Laser-0003").expression = "100";
                        tg.property("ADBE Laser-0005").setValue(4);
                        tg.property("ADBE Laser-0006").setValue(4);
                        tg.property("ADBE Laser-0007").setValue(0);
                        tg.property("ADBE Laser-0008").setValue([224/255,0,0]);
                        tg.property("ADBE Laser-0009").setValue([224/255,0,0]);
                        tg.property("ADBE Laser-0011").setValue(true);
                    
                    
                        finalPoint.position.expression = "\rx1 = thisComp.layer(\"Lines\").effect(\"center\")(\"ADBE Laser-0001\")[0];"+
                                                                   "\ry1 = thisComp.layer(\"Lines\").effect(\"center\")(\"ADBE Laser-0001\")[1];"+
                                                                   "\rx2 = thisComp.layer(\"Lines\").effect(\"center\")(\"ADBE Laser-0002\")[0];"+
                                                                   "\ry2 = thisComp.layer(\"Lines\").effect(\"center\")(\"ADBE Laser-0002\")[1];"+
                                                                   "\rval = thisComp.layer(\"Slider Control\").effect(\"value\")(\"ADBE Slider Control-0001\");"+
                                                                   "\rdistance = Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));"+
                                                                   "\ra = distance*val;"+
                                                                   "\rb = distance - a;"+
                                                                   "\rrate = a/(a+b);"+
                                                                   "\rPx = x1 + rate*( x2 - x1 );"+
                                                                   "\rPy = y1 + rate*( y2 - y1 );"+
                                                                   "\r[Px,Py];";
                                    
                        curve.Effects.property("ADBE Write-on").property("ADBE Write-on-0001").expression = "\rx1 = thisComp.layer(\"Lines\").effect(\"center\")(\"ADBE Laser-0001\")[0];"+
                                                                                                                                                   "\ry1 = thisComp.layer(\"Lines\").effect(\"center\")(\"ADBE Laser-0001\")[1];"+
                                                                                                                                                   "\rx2 = thisComp.layer(\"Lines\").effect(\"center\")(\"ADBE Laser-0002\")[0];"+
                                                                                                                                                   "\ry2 = thisComp.layer(\"Lines\").effect(\"center\")(\"ADBE Laser-0002\")[1];"+
                                                                                                                                                   "\rval = thisComp.layer(\"Slider Control\").effect(\"value\")(\"ADBE Slider Control-0001\");"+
                                                                                                                                                   "\rdistance = Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));"+
                                                                                                                                                   "\ra = distance*val;"+
                                                                                                                                                   "\rb = distance - a;"+
                                                                                                                                                   "\rrate = a/(a+b);"+
                                                                                                                                                   "\rPx = x1 + rate*( x2 - x1 );"+
                                                                                                                                                   "\rPy = y1 + rate*( y2 - y1 );"+
                                                                                                                                                   "\r[Px,Py];";
                        
                                    
                        for( i = name.length-1; i >= 0; i--) {
                            
                            var textLayer = curItem.layers.addText(name[i]);
                                            
                            textLayer.name = "\""+name[i].toString()+"\"";
                            
                            textLayer.position.setValue(textPos[i]);
                                           
                            TextProperty(textLayer);
                        }
                        
                        
                        function TextProperty(textLayer){

                            var textLayerProperty = textLayer.property("ADBE Text Properties").property("ADBE Text Document")

                            var textproperty = textLayerProperty.value;

                            textproperty.resetCharStyle();

                            textproperty.fontSize = 20;

                            textproperty.fillColor = [1, 1, 1];

                            textproperty.strokeColor = [0, 0, 0];

                            textproperty.strokeWidth = 0;

                            textproperty.font = "Arial";

                            textproperty.strokeOverFill = true;

                            textproperty.applyStroke = true;

                            textproperty.applyFill = true;

                            textproperty.justification = ParagraphJustification.CENTER_JUSTIFY;

                            textLayerProperty.setValue(textproperty);
                        
                        }

                        curItem.layer(1).parent = curItem.layer(6);
                        curItem.layer(2).parent = curItem.layer(7);
                        curItem.layer(3).parent = curItem.layer(8);
                        curItem.layer(4).parent = curItem.layer(9);
                        
                        sliderControl.enabled = false;
                        lines.locked = true;
                        sliderControl.locked = true;
                        curItem.time = 4*val;

                    app.endUndoGroup();

                }

                flash.closeScriptWindow = function(){ win.close(); }

                flash.aboutScript = function(){
                            
                            var Eng = "\rThis script creates an After Effects composition taking the principle of the technique found by Paul de Casteljau to draw a Bezier curve. "+
                            "The user interface is created with Flash Builder allowing a representation of the Bezier curve before constructing the After Effects composition. "+
                            "\r\rOverall this project allows using the communication possibilities between ActionScript and ExtendScript, which is very interesting and opens more possibilities for scripting. "+
                            "\r\rThis script is more of an academic exercise than a script that has actual production purpose. "+
                            "\r\rThe usefulness of this type of script is to understand the extensive scripting thanks to new interface possibilities not possible only with the ExtendScript tools "+
                            "and made ​​possible with Adobe Flash Builder with the ExternalInterface object and its call method that let’s create communication between swf file and ScriptUI. "+
                            "\r\rNote : All source files are provided in this package. "+
                            "\rPlace the ‘DeCasteljauBezierCurve’ folder in the ‘Scripts’ folder : ‘Adobe’ > ‘Adobe After Effects CS6’ > ‘Supports Files’  > ‘Scripts’."+ 
                            "\r\rRequires Adobe Flash Builder 4.6 for editing the .mxml file. "+
                            "\rThis version of the script requires After Effects CS6. "+
                            "\rRuns on Mac and PC in the same way. "+
                            "\r\rLegal notices: This script is provided \"as is\" without warranty of any kind, expressed or implied. "+
                            "The author permits you to use and modify this file but in no event he shall be held liable for any damages arising in any way from the use of this script or the file associated. "+
                            "\r\r\rDeCasteljauBezierCurve v1.0 - Michel Pensas - All rights reserved © 2012.";


                            var winAbout = new Window ("dialog", "De Casteljau Bezier Curve", undefined);
                            winAbout.alignChildren = "right";

                            var E_options = winAbout.add ("panel", undefined, "About");
                            E_options.alignChildren = "fill";
                            E_options.add ("statictext", [0,0,460,420], Eng, {multiline: true});


                            var buttons = winAbout.add ("group");
                            buttons.add ("button", undefined, "Close", {name: "ok"});

                            winAbout.show ();
                }

                //Show the window
                win.show();

		}
	}
	
	DeCasteljauBezierCurve();
}


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

////  Flex sample code.
////  Found in ./resources/DeCasteljau_Bezier_Curve.mxml

/*

<?xml version="1.0" encoding="utf-8"?>
<!-- skins/ApplyContainerBorderSkin.mxml -->
<s:Application xmlns:fx="http://ns.adobe.com/mxml/2009"
			   xmlns:s="library://ns.adobe.com/flex/spark"
			   xmlns:mx="library://ns.adobe.com/flex/mx"
			   width="550" height="488" creationComplete="init()" mouseMove="mouseMove()">
	<fx:Style source="Main.css"/>
	
	<fx:Script> 

		<![CDATA[ 
			
			import flash.display.Shape;
			import flash.display.Sprite;
			import flash.events.MouseEvent;
			
			import mx.controls.sliderClasses.Slider;
			import mx.core.DragSource;
			import mx.core.UIComponent;
			import mx.events.DragEvent;
			import mx.events.SliderEvent;
			import mx.managers.DragManager;
			
			import spark.core.SpriteVisualElement;
			
			import mx.managers.ToolTipManager;
			import mx.controls.ToolTip;
			import mx.core.IUIComponent
				
			import flash.external.ExternalInterface;
					
			private var lines:Sprite = new Sprite();
			
			private var tangMilieu_1:Sprite = new Sprite();
			private var tangMilieu_2:Sprite = new Sprite();
			private var tangMilieu_3:Sprite = new Sprite();
			
			private var curve:Sprite = new Sprite();
			
			private var pointcourbe:Sprite = new Sprite();
			
			private var Circle1:Sprite = new Sprite();
			private var Circle2:Sprite = new Sprite();
			private var Circle3:Sprite = new Sprite();
			private var Circle4:Sprite = new Sprite();
			
			private var insterter:UIComponent = new UIComponent();             
			private var theme:SpriteVisualElement = new SpriteVisualElement();
			
			//positions de départ des points
			var Ax = 150;
			var Ay = 300;
			var tangAx = 100;
			var tangAy = 100;
			var tangBx = 450;
			var tangBy = 100;
			var Bx = 400;
			var By = 300;
			var Px1, Py1, Px2, Py2, Px3, Py3, Px4, Py4, Px5, Py5;
			
			var valuePointCourbe = 0.5;
			
			private function init():void {
				
				drawLines();
				drawCurve();
				movepointcourbe();
				drawCircles();
				setBtns();
				
			}
			
			private function reset():void { 
				aSlider.value = 0.5;
				valuePointCourbe = 0.5;
				textBoxValue.text = "0.5";
				Circle1.x = 0;
				Circle1.y = 0;
				Circle2.x = 0;
				Circle2.y = 0;
				Circle3.x = 0;
				Circle3.y = 0;
				Circle4.x = 0;
				Circle4.y = 0;
				
				drawLines();
				drawCurve();
				movepointcourbe();
				drawCircles();
				
			}
			
			private function sliderChange(event:SliderEvent):void {
				var currentSlider:Slider=Slider(event.currentTarget);
				valuePointCourbe = event.value;
				textBoxValue.text = (Math.round(aSlider.value*100)/100).toString();
				drawLines();
				drawCurve();
				movepointcourbe();
				drawCircles();
			}
			
			private function drawLines():void             
			{                  
				lines.graphics.clear();
				lines.graphics.lineStyle(2.8,0xff0000,1);                 
				lines.graphics.moveTo(Ax+Circle1.x, Ay+Circle1.y);      
				lines.graphics.lineTo(tangAx+Circle2.x, tangAy+Circle2.y);
				lines.graphics.lineTo(tangBx+Circle3.x, tangBy+Circle3.y);
				lines.graphics.lineTo(Bx+Circle4.x, By+Circle4.y);
				lines.graphics.endFill();
				theme.addChild(lines);                 
				this.addElement(theme);
				
				var A = [Ax+Circle1.x, Ay+Circle1.y];
				var tangA = [tangAx+Circle2.x, tangAy+Circle2.y];
				var tangB = [tangBx+Circle3.x, tangBy+Circle3.y];
				var B = [Bx+Circle4.x, By+Circle4.y];
				
				traceMilieu(A,tangA,tangB,B);
				
				tangMilieu_1.graphics.clear();
				tangMilieu_1.graphics.lineStyle(2, 0xFF0000);
				tangMilieu_1.graphics.moveTo(Px1, Py1);
				tangMilieu_1.graphics.lineTo(Px2, Py2);
				tangMilieu_1.graphics.endFill();
				theme.addChild(tangMilieu_1);                 
				this.addElement(theme);
				
				tangMilieu_2.graphics.clear();
				tangMilieu_2.graphics.lineStyle(2, 0xFF0000);
				tangMilieu_2.graphics.moveTo(Px2, Py2);
				tangMilieu_2.graphics.lineTo(Px3, Py3);
				tangMilieu_2.graphics.endFill();
				theme.addChild(tangMilieu_2);                 
				this.addElement(theme);
				
				tangMilieu_3.graphics.clear();
				tangMilieu_3.graphics.lineStyle(2, 0xFF0000);
				tangMilieu_3.graphics.moveTo(Px4, Py4);
				tangMilieu_3.graphics.lineTo(Px5, Py5);
				tangMilieu_3.graphics.endFill();
				theme.addChild(tangMilieu_3);                 
				this.addElement(theme);
				
				LabelA.x = Ax+Circle1.x-20;
				LabelA.y = Ay+Circle1.y-20;
				LabeltangA.x = tangAx+Circle2.x-40;
				LabeltangA.y = tangAy+Circle2.y-40;
				LabeltangB.x = tangBx+Circle3.x+15;
				LabeltangB.y = tangBy+Circle3.y-40;
				LabelB.x = Bx+Circle4.x+12;
				LabelB.y = By+Circle4.y-20;
				
			}
			
			private function traceMilieu(A,tangA,tangB,B){
				
				var x1 = A[0];
				var y1 = A[1];
				var x2 = tangA[0];
				var y2 = tangA[1];
				
				var pointMilieu_01 = findpoint(x1,x2,y1,y2);
				Px1 = pointMilieu_01[0];
				Py1 = pointMilieu_01[1];
				
				x1 = tangA[0];
				y1 = tangA[1];
				x2 = tangB[0];
				y2 = tangB[1];
				
				var pointMilieu_02 = findpoint(x1,x2,y1,y2);
				Px2 = pointMilieu_02[0];
				Py2 = pointMilieu_02[1];
				
				x1 = tangB[0];
				y1 = tangB[1];
				x2 = B[0];
				y2 = B[1];
				
				var pointMilieu_03 = findpoint(x1,x2,y1,y2);
				Px3 = pointMilieu_03[0];
				Py3 = pointMilieu_03[1];
				
				x1 = pointMilieu_01[0];
				y1 = pointMilieu_01[1];
				x2 = pointMilieu_02[0];
				y2 = pointMilieu_02[1];
				
				var pointMilieu_04 = findpoint(x1,x2,y1,y2);
				Px4 = pointMilieu_04[0];
				Py4 = pointMilieu_04[1];
				
				x1 = pointMilieu_02[0];
				y1 = pointMilieu_02[1];
				x2 = pointMilieu_03[0];
				y2 = pointMilieu_03[1];
				
				var pointMilieu_05 = findpoint(x1,x2,y1,y2);
				Px5 = pointMilieu_05[0];
				Py5 = pointMilieu_05[1];
			}
			
			private function findpoint(x1,x2,y1,y2){
				
				var Distance = Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
				
				var a = Distance*(valuePointCourbe);
				var b = Distance - a;
				
				var add = a+b;
				if(add == 0){add = 0.00001}
				var taux = a/add;
				
				var Px = x1 + taux*( x2 - x1 );
				var Py = y1 + taux*( y2 - y1 );
				
				return([Px,Py]);
				
			}
			
			
			private function drawCurve(e:Event=null):void {
				curve.graphics.clear();
				curve.graphics.lineStyle(2, 0x00FF00,1);
				curve.graphics.moveTo(Ax+Circle1.x, Ay+Circle1.y);
				
				for (var i:int=0; i<=100; i++) {
					var t = i/100;
					var curveX = (Ax+Circle1.x)*Math.pow((1 - t),3)+3*(tangAx+Circle2.x)*t*Math.pow((1 - t),2)+3*(tangBx+Circle3.x)*Math.pow(t,2)*(1 - t)+(Bx+Circle4.x)*Math.pow(t,3);
					var curveY = (Ay+Circle1.y)*Math.pow((1 - t),3)+3*(tangAy+Circle2.y)*t*Math.pow((1 - t),2)+3*(tangBy+Circle3.y)*Math.pow(t,2)*(1 - t)+(By+Circle4.y)*Math.pow(t,3);
					curve.graphics.lineTo(curveX,curveY);
				}
				
				curve.graphics.endFill();
				theme.addChild(curve);                 
				this.addElement(theme);
				
			}
			
			private function drawCircles():void             
			{                  
				pointcourbe.graphics.clear();
				pointcourbe.graphics.beginFill(0x0000ff,1)
				pointcourbe.graphics.drawCircle(0,0,10); 
				theme.addChild(pointcourbe);                 
				this.addElement(theme);
				
				Circle1.graphics.clear();
				Circle1.graphics.beginFill(0xa4a4c2,1)
				Circle1.graphics.drawCircle(Ax,Ay,10); 
				theme.addChild(Circle1);                 
				this.addElement(theme);
				
				Circle2.graphics.clear();
				Circle2.graphics.beginFill(0xa4a4c2,1)
				Circle2.graphics.drawCircle(tangAx,tangAy,10); 
				theme.addChild(Circle2);                 
				this.addElement(theme);
				
				Circle3.graphics.clear();
				Circle3.graphics.beginFill(0xa4a4c2,1)
				Circle3.graphics.drawCircle(tangBx,tangBy,10); 
				theme.addChild(Circle3);                 
				this.addElement(theme);
				
				Circle4.graphics.clear();
				Circle4.graphics.beginFill(0xa4a4c2,1)
				Circle4.graphics.drawCircle(Bx,By,10); 
				theme.addChild(Circle4);                 
				this.addElement(theme);	
				
				textBoxAx.text = (Ax+Circle1.x).toString();
				textBoxAy.text = (Ay+Circle1.y).toString()
				textBoxtangAx.text = (tangAx+Circle2.x).toString();
				textBoxtangAy.text = (tangAy+Circle2.y).toString();
				textBoxtangBx.text = (tangBx+Circle3.x).toString();
				textBoxtangBy.text = (tangBy+Circle3.y).toString();
				textBoxBx.text = (Bx+Circle4.x).toString();
				textBoxBy.text = (By+Circle4.y).toString();
			} 
			
			var btns:Array = [Circle1, Circle2, Circle3, Circle4]; //instances on stage
			
			//set btn handlers
			private function setBtns():void {
				for(var i=0; i<btns.length; i++) {
					btns[i].buttonMode = true;
					btns[i].addEventListener(MouseEvent.MOUSE_DOWN, grab);
					btns[i].addEventListener(MouseEvent.MOUSE_UP, drop);
				}
			}
			
			//handlers
			private function grab(event:MouseEvent):void {
				
				event.target.startDrag();
				drawLines();
				drawCurve();
				movepointcourbe();
				drawCircles();				
			}
			
			private function drop(event:MouseEvent):void {
				
				event.target.stopDrag();
				drawLines();
				drawCurve();
				movepointcourbe();
				drawCircles();				
			}
			
			private function mouseMove():void {
				
				drawLines();
				drawCurve();
				movepointcourbe();
				drawCircles();
				
			}
			
			function movepointcourbe(e:Event=null):void {
				var t = valuePointCourbe;
				pointcourbe.x = (Ax+Circle1.x)*Math.pow((1 - t),3)+3*(tangAx+Circle2.x)*t*Math.pow((1 - t),2)+3*(tangBx+Circle3.x)*Math.pow(t,2)*(1 - t)+(Bx+Circle4.x)*Math.pow(t,3);
				pointcourbe.y = (Ay+Circle1.y)*Math.pow((1 - t),3)+3*(tangAy+Circle2.y)*t*Math.pow((1 - t),2)+3*(tangBy+Circle3.y)*Math.pow(t,2)*(1 - t)+(By+Circle4.y)*Math.pow(t,3);
			}
			
			public function closeScriptWindow():void {
				ExternalInterface.call("closeScriptWindow","");
			}
			
			public function aboutScript():void {
				ExternalInterface.call("aboutScript","");
			}
			
			public function createAEcomp():void {
				ExternalInterface.call("createAEcomp",textBoxAx.text,
					textBoxAy.text,
					textBoxtangAx.text,
					textBoxtangAy.text,
					textBoxtangBx.text,
					textBoxtangBy.text,
					textBoxBx.text,
					textBoxBy.text,
					textBoxValue.text
				);
			}
			
		]]> 
		
	</fx:Script>
	
	<s:Panel x="0" y="0" width="550" height="488" chromeColor="#555555" color="#CCCCCC"
			 title="De Casteljau Bezier Curve">

		<mx:HSlider id="aSlider" x="10" y="387" width="167" buttonMode="true"
					change="sliderChange(event);" chromeColor="#B9B9B9" labels="['0','1']"
					liveDragging="true" maximum="1" minimum="0" tickInterval="2" value="0.5"/>
		<s:Button id="resetBtn" x="240" y="10" width="94" label="Reset" chromeColor="#CCCCCC"
				  click="reset()" color="#202020" fontSize="12"
				  toolTip="Reset the values ​​to their initial states."/>
		<s:Button id="closeBtn" click="closeScriptWindow()" x="444" y="10" width="94" label="Close" chromeColor="#CCCCCC"
				  color="#202020" fontSize="12" toolTip="Close the script Window."/>
		<s:Button id="infoBtn" click="aboutScript()" x="342" y="10" width="94" label="About" chromeColor="#CCCCCC"
				  color="#202020" fontSize="12" toolTip="Informations about the script."/>
		<s:Button id="createBtn" click="createAEcomp()" x="10" y="10" width="145" label="Create AE comp"
				  chromeColor="#CCCCCC" color="#202020" fontSize="12"
				  toolTip="Create the After Effects composition."/>
		<s:Label id="LabelA" x="95" y="281" backgroundAlpha="1.0" backgroundColor="#FFFFFF"
				 color="#000000" fontSize="14" text="A"/>
		<s:Label id="LabelB" x="415" y="282" backgroundAlpha="1.0" backgroundColor="#FFFFFF"
				 color="#000000" fontSize="14" text="B"/>
		<s:Label id="LabeltangA" x="52" y="80" backgroundAlpha="1.0" backgroundColor="#FFFFFF"
				 color="#000000" fontSize="14" text="tgA"/>
		<s:Label id="LabeltangB" x="435" y="79" backgroundAlpha="1.0" backgroundColor="#FFFFFF"
				 color="#000000" fontSize="14" text="tgB"/>
		<mx:Label id="textBoxAx" x="296" y="397" width="32" height="22" color="#000000" text="150"/>
		<mx:Label id="textBoxtangAx" x="408" y="397" width="32" height="22" color="#000000"
				   text="100"/>
		<mx:Label id="textBoxBx" x="296" y="423" width="32" height="22" color="#000000" text="400"/>
		<mx:Label id="textBoxtangBx" x="408" y="423" width="32" height="22" color="#000000"
				   text="450"/>
		<mx:Label id="textBoxValue" x="185" y="413" width="57" height="22" color="#000000"
				   text="0.5"/>
		<mx:Label id="textBoxAy" x="326" y="397" width="32" height="22" color="#000000" text="300"/>
		<mx:Label id="textBoxtangAy" x="438" y="397" width="32" height="22" color="#000000"
				   text="100"/>
		<mx:Label id="textBoxBy" x="326" y="423" width="32" height="22" color="#000000" text="300"/>
		<mx:Label id="textBoxtangBy" x="438" y="423" width="32" height="22" color="#000000"
				   text="100"/>
		<mx:Label x="273" y="423" color="#000000" fontSize="12" text="B : ("/>
		<mx:Label x="376" y="423" color="#000000" fontSize="12" text="tgB : ("/>
		<mx:Label x="274" y="397" color="#000000" fontSize="12" text="A : ("/>
		<mx:Label x="353" y="397" color="#000000" fontSize="12" text=")"/>
		<mx:Label x="465" y="397" color="#000000" fontSize="12" text=")"/>
		<mx:Label x="353" y="423" color="#000000" fontSize="12" text=")"/>
		<mx:Label x="465" y="423" color="#000000" fontSize="12" text=")"/>
		<mx:Label x="322" y="397" color="#000000" fontSize="12" text=","/>
		<mx:Label x="435" y="397" color="#000000" fontSize="12" text=","/>
		<mx:Label x="322" y="423" color="#000000" fontSize="12" text=","/>
		<mx:Label x="435" y="423" color="#000000" fontSize="12" text=","/>
		<mx:Label x="376" y="397" color="#000000" fontSize="12" text="tgA : ("/>
	</s:Panel>
	
</s:Application>

*/
