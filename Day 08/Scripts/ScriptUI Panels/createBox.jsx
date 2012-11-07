/*
    Name............createBox.jsx    
    Version.........1.5    
    Author..........www.nabscripts.com
    Description.....This script creates a white 3D box and adds three sliders to control its size.
    Support.........6.5/7.0/CS3
*/


{
    /*---------------------------------------------------------------------------------------------------------*/    
    function initGlobals(G)
    /*---------------------------------------------------------------------------------------------------------*/
    {                
        G.NAME                      =   "createBox.jsx";
        G.TITLE                     =   "Create Box";
        //-----------------------------------------------------------------------------------------------------
        G.CONTROLLER_LAYER_NAME     =   {en:"Controller", fr:"Contrôleur"};
        G.SLIDER_NAMES              =   ["X","Y","Z"];
        G.SLIDERS_DFLT              =   [100,100,100];
        G.COLOR_DFLT                =   [1,1,1]; // white
        G.FLOOR_AND_ROOF_LAYER_NAME =   {en:"Floor and Roof", fr:"Plancher et Toit"}
        G.FLOOR_LAYER_NAME          =   {en:"Floor", fr:"Plancher"};
        G.ROOF_LAYER_NAME           =   {en:"Roof", fr:"Toit"};
        G.LEFT_AND_RIGHT_LAYER_NAME =   {en:"Left and Right", fr:"Gauche et Droite"};
        G.LEFT_LAYER_NAME           =   {en:"Left", fr:"Gauche"};
        G.RIGHT_LAYER_NAME          =   {en:"Right", fr:"Droite"};
        G.FRONT_AND_BACK_LAYER_NAME =   {en:"Front and Back", fr:"Devant et Derrière"};
        G.FRONT_LAYER_NAME          =   {en:"Front", fr:"Devant"};
        G.BACK_LAYER_NAME           =   {en:"Back", fr:"Derrière"};        
        //-----------------------------------------------------------------------------------------------------
        G.NO_PROJ_ERR               =   {en:"Open a project first.", fr:"Ouvrez d'abord un projet."};
        G.NO_COMP_ERR               =   {en:"Select a composition first.", fr:"Sélectionnez d'abord une composition."};
    }

    /*---------------------------------------------------------------------------------------------------------*/
    function loc(str) 
    /*---------------------------------------------------------------------------------------------------------*/
    {
        return app.language == Language.FRENCH ? str["fr"] : str["en"];
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    function throwMsg(msg)
    /*---------------------------------------------------------------------------------------------------------*/
    {
        alert(loc(msg), G.TITLE);
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    function createNull(comp) 
    /*---------------------------------------------------------------------------------------------------------*/
    {
        var nullL = comp.layers.addNull();    
        
        nullL.name = loc(G.CONTROLLER_LAYER_NAME);
        nullL.threeDLayer = true;
        nullL.enabled = false;
        
        for (var i = 0; i < G.SLIDER_NAMES.length; i++)
        {        
            var slider = nullL.Effects.addProperty("ADBE Slider Control");
            slider.name = G.SLIDER_NAMES[i];
            slider.property(1).setValue(G.SLIDERS_DFLT[i]);
        }
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    function createFloorAndRoof(comp) 
    /*---------------------------------------------------------------------------------------------------------*/
    {
        // floor layer
        var floorL = comp.layers.addSolid(G.COLOR_DFLT,loc(G.FLOOR_AND_ROOF_LAYER_NAME),G.SLIDERS_DFLT[0],G.SLIDERS_DFLT[0],comp.pixelAspect,comp.duration); 
        floorL.name = loc(G.FLOOR_LAYER_NAME); 
        floorL.threeDLayer = true;
        floorL.collapseTransformation = true;    
        
        floorL.anchorPoint.setValue([0,G.SLIDERS_DFLT[0],0]);    
        
        var newPos = floorL.position.value + [-G.SLIDERS_DFLT[0]/2,G.SLIDERS_DFLT[0]/2,0];        
        floorL.position.setValue(newPos);
        
        floorL.scale.expression = "sx = thisComp.layer(\"" + loc(G.CONTROLLER_LAYER_NAME) + "\").effect(\"" + G.SLIDER_NAMES[0] + "\")(1); \r" +
                                  "sy = thisComp.layer(\"" + loc(G.CONTROLLER_LAYER_NAME) + "\").effect(\"" + G.SLIDER_NAMES[2] + "\")(1); \r" +
                                  "[sx,sy,value[2]]";
        
        floorL.orientation.setValue([270,0,0]);    
        
        // roof layer
        var roofL = comp.layer(loc(G.FLOOR_LAYER_NAME)).duplicate();    
        roofL.name = loc(G.ROOF_LAYER_NAME);;   
        
        newPos = roofL.position.value + [0,-G.SLIDERS_DFLT[0],0];
        roofL.position.setValue(newPos);
        roofL.position.expression = "value + [0,100 - thisComp.layer(\"" + loc(G.CONTROLLER_LAYER_NAME) + "\").effect(\"" + G.SLIDER_NAMES[1] + "\")(1),0]";    
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    function createLeftAndRight(comp) 
    /*---------------------------------------------------------------------------------------------------------*/
    {    
        // left layer
        var leftL = comp.layers.addSolid(G.COLOR_DFLT,loc(G.LEFT_AND_RIGHT_LAYER_NAME),G.SLIDERS_DFLT[0],G.SLIDERS_DFLT[0],comp.pixelAspect,comp.duration); 
        leftL.name = loc(G.LEFT_LAYER_NAME);   
        leftL.threeDLayer = true;
        leftL.collapseTransformation = true;
        
        leftL.anchorPoint.setValue([0,G.SLIDERS_DFLT[0],0]); 
        var newPos = leftL.position.value + [-G.SLIDERS_DFLT[0]/2,G.SLIDERS_DFLT[0]/2,0];
        leftL.position.setValue(newPos);
        leftL.scale.expression = "sx = thisComp.layer(\"" + loc(G.CONTROLLER_LAYER_NAME) + "\").effect(\"" + G.SLIDER_NAMES[2] + "\")(1); \r" +
                                 "sy = thisComp.layer(\"" + loc(G.CONTROLLER_LAYER_NAME) + "\").effect(\"" + G.SLIDER_NAMES[1] + "\")(1); \r" +
                                 "[sx,sy,value[2]]";    
                                 
        leftL.orientation.setValue([0,270,0]);    
        
        // right layer
        var rightL = comp.layer("Left").duplicate();    
        rightL.name = loc(G.RIGHT_LAYER_NAME);;     
        
        newPos = rightL.position.value + [G.SLIDERS_DFLT[0],0,0];
        rightL.position.setValue(newPos);
        rightL.position.expression = "value + [thisComp.layer(\"" + loc(G.CONTROLLER_LAYER_NAME) + "\").effect(\"" + G.SLIDER_NAMES[0] + "\")(1) - 100,0,0]";   
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    function createFrontAndBack(comp) 
    /*---------------------------------------------------------------------------------------------------------*/    
    {
        // front layer
        var frontL = comp.layers.addSolid(G.COLOR_DFLT,loc(G.FRONT_AND_BACK_LAYER_NAME),G.SLIDERS_DFLT[0],G.SLIDERS_DFLT[0],comp.pixelAspect,comp.duration); 
        frontL.name = loc(G.FRONT_LAYER_NAME); 
        frontL.threeDLayer = true;
        frontL.collapseTransformation = true;
        
        frontL.anchorPoint.setValue([0,G.SLIDERS_DFLT[0],0]);    
        var newPos = frontL.position.value + [-G.SLIDERS_DFLT[0]/2,G.SLIDERS_DFLT[0]/2,0];
        frontL.position.setValue(newPos);
        frontL.scale.expression = "sx = thisComp.layer(\"" + loc(G.CONTROLLER_LAYER_NAME) + "\").effect(\"" + G.SLIDER_NAMES[0] + "\")(1); \r" +
                                  "sy = thisComp.layer(\"" + loc(G.CONTROLLER_LAYER_NAME) + "\").effect(\"" + G.SLIDER_NAMES[1] + "\")(1); \r" +
                                  "[sx,sy,value[2]]";
        
        // back layer
        var backL = comp.layer(loc(G.FRONT_LAYER_NAME)).duplicate();    
        backL.name = loc(G.BACK_LAYER_NAME);           
        
        newPos = backL.position.value + [0,0,100];
        backL.position.setValue(newPos);
        backL.position.expression = "value + [0,0,thisComp.layer(\"" + loc(G.CONTROLLER_LAYER_NAME) + "\").effect(\"" + G.SLIDER_NAMES[2] + "\")(1) - " + G.SLIDERS_DFLT[0] + "]";    
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    function moveControl(comp) 
    /*---------------------------------------------------------------------------------------------------------*/
    {
        
        comp.layer(loc(G.CONTROLLER_LAYER_NAME)).moveToBeginning();
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    function parentLayers(comp) 
    /*---------------------------------------------------------------------------------------------------------*/
    {
        comp.layer(loc(G.FLOOR_LAYER_NAME)).parent = comp.layer(loc(G.CONTROLLER_LAYER_NAME));
        comp.layer(loc(G.ROOF_LAYER_NAME)).parent = comp.layer(loc(G.CONTROLLER_LAYER_NAME));
        comp.layer(loc(G.LEFT_LAYER_NAME)).parent = comp.layer(loc(G.CONTROLLER_LAYER_NAME));
        comp.layer(loc(G.RIGHT_LAYER_NAME)).parent = comp.layer(loc(G.CONTROLLER_LAYER_NAME));
        comp.layer(loc(G.FRONT_LAYER_NAME)).parent = comp.layer(loc(G.CONTROLLER_LAYER_NAME));
        comp.layer(loc(G.BACK_LAYER_NAME)).parent = comp.layer(loc(G.CONTROLLER_LAYER_NAME));
        
        while (comp.selectedLayers.length)
        {
            comp.selectedLayers[0].selected = false;
        }
        comp.layer(loc(G.CONTROLLER_LAYER_NAME)).selected = true;
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    function createBox(comp) 
    /*---------------------------------------------------------------------------------------------------------*/
    {    
        createNull(comp);
        createFloorAndRoof(comp);        
        createLeftAndRight(comp);
        createFrontAndBack(comp);        
        moveControl(comp);
        parentLayers(comp);
    }
    
    /*---------------------------------------------------------------------------------------------------------*/ 
    function Main() 
    /*---------------------------------------------------------------------------------------------------------*/ 
    {
        var proj = app.project;
        if (!proj)
        {
            throwMsg(G.NO_PROJ_ERR);
            return;
        }
        var comp = proj.activeItem;
        if (!comp || !(comp instanceof CompItem))
        {
            throwMsg(G.NO_COMP_ERR);
            return;
        }
        
        app.beginUndoGroup(G.TITLE);    
        
        createBox(comp);    
        
        app.endUndoGroup();
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    // Entry Point
    /*---------------------------------------------------------------------------------------------------------*/
    var G = new Object();
    initGlobals(G);
    
    Main();

}        
        
    
