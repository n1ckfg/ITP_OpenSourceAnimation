/*
    Name............createCube.jsx    
    Version.........2.0   
    Author..........www.nabscripts.com
    Description.....This script creates a cube from the selected layers or from new solids.
    Support.........7.0/CS3
*/


{
    /*---------------------------------------------------------------------------------------------------------*/    
    function initGlobals(G)
    /*---------------------------------------------------------------------------------------------------------*/
    {                
        G.NAME                      =   "createCube.jsx";
        G.VERSION                   =   "2.0";
        G.TITLE                     =   "Create Cube";
        G.AUTHOR                    =   "www.nabscripts.com";
        G.DESCR                     =   {en: "This script creates a cube from the selected layers or from new solids.\rLayers must be squares with the same size, and the pixel aspect ratio must\rbe 1.0.", fr:"Ce script crée un cube à partir des calques sélectionnés ou de nouveaux solides.\rLes calques doivent être des carrés de même taille et le format des pixels doit\r être 1.0."};
        G.ABOUT                     =   {en:"\"" + G.NAME + "\", v" + G.VERSION + "\r" + G.AUTHOR + "\r\r" + loc(G.DESCR), fr:"\"" + G.NAME + "\", v" + G.VERSION + "\r" + G.AUTHOR + "\r\r" + loc(G.DESCR)};        
        //-----------------------------------------------------------------------------------------------------
        G.ABOUT_BTN_NAME            =   "?";
        G.SETTINGS_PNL_NAME         =   {en:"Settings", fr:"Paramètres"};
        G.LAYERS_ST_NAME            =   {en:"Layers:", fr:"Calques:"};
        G.LAYERS_LST_CHOICES        =   {en:["New Solids", "Selected Layers"], fr:["Nouveaux Solides", "Calques Sélectionnés"]};
        G.LAYERS_PER_FACE_ST_NAME   =   {en:"Layers Per Face:", fr:"Calques Par Face:"};
        G.LAYERS_PER_FACE_DFLT      =   1;
        G.SIZE_ST_NAME              =   {en:"Size:", fr:"Taille:"};
        G.SIZE_DFLT                 =   100;
        G.USE_EXPR_ST_NAME          =   {en:"Expressions:", fr:"Expressions:"};
        G.ENABLE_CB_NAME            =   {en:"Enable", fr:"Autoriser"};
        G.SOURCE_ST_NAME            =   {en:"Source:", fr:"Source:"};
        G.SOURCE_CB_NAME            =   {en:"Unique", fr:"Unique"};
        G.CREATE_BTN_NAME           =   {en:"Create", fr:"Créer"};
        //-----------------------------------------------------------------------------------------------------
        G.FACE_NAMES                =   {en:["Front Face","Right Face","Back Face","Left Face","Bottom Face","Top Face"], fr:["Face Avant","Face Droite","Face Arrière","Face Gauche","Face Bas","Face Haut"]};
        G.FACE_NAME                 =   {en:"Face", fr:"Face"};
        G.SOLID_COLOR               =   [1,1,1]; // white
        G.CONTROLLER_LAYER_NAME     =   {en:"Controller", fr:"Contrôleur"};
        G.LAYERS_PER_FACE_SLD_NAME  =   {en:"Layers Per Face", fr:"Calques Par Face"};
        //-----------------------------------------------------------------------------------------------------
        G.LAYERS_CHOICE             =   0;
        G.LAYERS_PER_FACE           =   G.LAYERS_PER_FACE_DFLT;
        G.SIZE                      =   G.SIZE_DFLT;
        G.USE_EXPR                  =   false;
        G.UNIQUE_SOURCE             =   true;        
        //-----------------------------------------------------------------------------------------------------
        G.APP_VERSION               =   parseFloat(app.version);
        G.MIN_VERSION               =   7.0;
        //-----------------------------------------------------------------------------------------------------
        G.BAD_VERSION_ERR           =   {en:"This script requires AE 7.0 or later.", fr:"Ce script nécessite AE 7.0 ou supérieur."};
        G.NO_COMP_ERR               =   {en:"Select a composition first.", fr:"Sélectionnez d'abord une composition."};
        G.BAD_LAYERS_PER_FACE_ERR   =   {en:"The number of layers per face must be at least 1 and must be a square number (1, 4, 9, etc).", fr:"Le nombre de calques par face doit être au moins 1 et être un nombre carré (1, 4, 9, etc)."}; 
        G.BAD_SIZE_ERR              =   {en:"Cube size must be between 1 and 30000.", fr:"La taille du cube doit être comprise entre 1 et 30000."};
        G.BAD_PAR_ERR               =   {en:"The pixel aspect ratio must be 1.0.", fr:"Le format des pixels doit être 1.0."};        
        G.BAD_SELECTED_LAYERS_ERR   =   {en:"The selected layers must be square AVLayers of equal size.\rThe pixel aspect ratio must be 1.0.\rYou must select \"6 * LayersPerFace\" layers.", fr:"Les calques sélectionnés doivent être des calques AudioVidéo carrés et tous de même taille\r.Le format des pixels doit être 1.0.\rVous devez sléectionner \"6 * CalquesParFace\" calques."}; 
        G.WARNING                   =   {en:"Using this script in a composition containing extra layers may yield incorrect results.\rDo you want to abort ?", fr:"Utiliser ce script dans une composition contenant des calques additionnels peut conduire à des résultats incorrects.\rVoulez-vous annuler ?"}; 
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    function initUI(UI)
    /*---------------------------------------------------------------------------------------------------------*/
    {
        // palette
        UI.pal = new Window("palette", G.TITLE, [0,0,250,235]);
        UI.pal.add("statictext", [10,7,170,20], G.TITLE);
        UI.pal.add("panel", [5,22,217,26]);
        
        // about button
        UI.pal.aboutBtn = UI.pal.add("button", [220,5,245,25], G.ABOUT_BTN_NAME);
        
        // settings panel
        UI.pal.settingsPnl = UI.pal.add("panel", [5,30,245,195], loc(G.SETTINGS_PNL_NAME));
        
        UI.pal.settingsPnl.add("statictext", [10,15,100,32], loc(G.LAYERS_ST_NAME));
        UI.pal.settingsPnl.layersLst = UI.pal.settingsPnl.add("dropdownlist", [100,10,217,30], loc(G.LAYERS_LST_CHOICES));
        UI.pal.settingsPnl.layersLst.selection = 0;
        
        UI.pal.settingsPnl.layersPerFaceSt = UI.pal.settingsPnl.add("statictext", [10,43,100,60], loc(G.LAYERS_PER_FACE_ST_NAME));
        UI.pal.settingsPnl.layersPerFaceEdt = UI.pal.settingsPnl.add("edittext", [100,40,145,60], G.LAYERS_PER_FACE_DFLT);
        
        UI.pal.settingsPnl.sizeSt = UI.pal.settingsPnl.add("statictext", [10,73,100,90], loc(G.SIZE_ST_NAME));
        UI.pal.settingsPnl.sizeEdt = UI.pal.settingsPnl.add("edittext", [100,70,145,90], G.SIZE_DFLT);

        UI.pal.settingsPnl.add("statictext", [10,103,100,120], loc(G.USE_EXPR_ST_NAME));
        UI.pal.settingsPnl.exprCb = UI.pal.settingsPnl.add("checkbox", [100,100,175,120], loc(G.ENABLE_CB_NAME));

        UI.pal.settingsPnl.sourceSt = UI.pal.settingsPnl.add("statictext", [10,133,100,150], loc(G.SOURCE_ST_NAME));
        UI.pal.settingsPnl.sourceCb = UI.pal.settingsPnl.add("checkbox", [100,130,175,150], loc(G.SOURCE_CB_NAME));
        UI.pal.settingsPnl.sourceCb.value = true;
        
        // create button
        UI.pal.createBtn = UI.pal.add("button", [70,205,180,225], loc(G.CREATE_BTN_NAME));

        // events
        UI.pal.aboutBtn.onClick = function () 
        { 
            throwMsg(G.ABOUT); 
        };
        
        UI.pal.settingsPnl.layersLst.onChange = function () 
        { 
            if (this.selection.index == 1)
            {
                UI.pal.settingsPnl.sizeSt.enabled = false;
                UI.pal.settingsPnl.sizeEdt.enabled = false;
                
                UI.pal.settingsPnl.sourceSt.enabled = false;
                UI.pal.settingsPnl.sourceCb.enabled = false;
            }
            else
            {
                UI.pal.settingsPnl.sizeSt.enabled = true;
                UI.pal.settingsPnl.sizeEdt.enabled = true;
                
                UI.pal.settingsPnl.sourceSt.enabled = true;
                UI.pal.settingsPnl.sourceCb.enabled = true;                
            }
        };        
        
        UI.pal.settingsPnl.layersPerFaceEdt.onChange = function ()
        {
            var dataIn = this.text;
            if (isNaN(dataIn) || parseInt(dataIn) < 1 || parseFloat(Math.sqrt(parseInt(dataIn))) != parseInt(Math.sqrt(parseInt(dataIn))))
            {
                throwMsg(G.BAD_LAYERS_PER_FACE_ERR);
                this.text = G.LAYERS_PER_FACE_DFLT;
            }
            else
            {
                this.text = Math.round(dataIn);
            }
        };
        
        UI.pal.settingsPnl.sizeEdt.onChange = function ()
        {
            var dataIn = this.text;
            if (isNaN(dataIn) || parseInt(dataIn) < 1 || parseInt(dataIn) > 30000)
            {
                throwMsg(G.BAD_SIZE_ERR);
                this.text = G.SIZE_DFLT;
            }
            else
            {
                this.text = Math.round(dataIn);
            }
        };        
        
        UI.pal.createBtn.onClick = Main;
        
        // show        
        UI.pal.center();
        UI.pal.show();        
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
    function checkSelectedLayers(layers)
    /*---------------------------------------------------------------------------------------------------------*/
    {
        var err = false;
        
        if (layers.length != 6 * G.LAYERS_PER_FACE)
        {
            err =  true;
        }
        if (!err)
        {
            for (var i = 0; !err && i < layers.length; i++)
            {
                if (!(layers[i] instanceof AVLayer)) // we reject text/camera/light layers
                {
                    err = true;
                }
                if (!err)
                {
                    if (layers[i].source.pixelAspect != 1.0 || layers[i].width != layers[i].height || layers[i].width != layers[0].width)
                    {
                        err = true;
                    }
                }
            }
        }
        
        return err;
    }

    /*---------------------------------------------------------------------------------------------------------*/
    function getPosition(layerSize)
    /*---------------------------------------------------------------------------------------------------------*/
    {
        var pos;
        
        var half = layerSize / 2; 
        var numPerRow = Math.sqrt(G.LAYERS_PER_FACE);
        
        if (G.LAYERS_CHOICE == 1)
        {
            G.SIZE = layerSize * Math.sqrt(G.LAYERS_PER_FACE);
        }            

        if (!G.USE_EXPR)
        {
            pos = new Array();            
            
            // front face
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {
                var x = half + (j % numPerRow) * layerSize;
                var y = half + Math.floor(j / numPerRow) * layerSize;
                var z = 0;                    
                pos.push([x,y,z]);
            }
            
            // right face
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {
                var x = G.SIZE;
                var y = half + Math.floor(j / numPerRow) * layerSize;
                var z = half + (j % numPerRow) * layerSize;
                pos.push([x,y,z]);
            }  
            
            // back face
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {
                var x = half + (numPerRow - 1) * layerSize - (j % numPerRow) * layerSize;
                var y = half + Math.floor(j / numPerRow) * layerSize;
                var z = numPerRow * layerSize;                    
                pos.push([x,y,z]);
            } 
            
           // left face
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {
                var x = 0;
                var y = half + Math.floor(j / numPerRow) * layerSize;
                var z = half + (numPerRow - 1) * layerSize - (j % numPerRow) * layerSize;
                pos.push([x,y,z]);
            }    
                        
            // bottom face
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {
                var x = half + (j % numPerRow) * layerSize;
                var y = G.SIZE;
                var z = half + Math.floor(j / numPerRow) * layerSize;
                pos.push([x,y,z]);
            }                                        
            
            // top face
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {
                var x = half + Math.floor(j / numPerRow) * layerSize;
                var y = 0;
                var z = half + (j % numPerRow) * layerSize;
                pos.push([x,y,z]);
            }
            
        }
        else
        {
            pos =         
            "layersPerFace = thisComp.layer(\"" + loc(G.CONTROLLER_LAYER_NAME) + "\").effect(\"" + loc(G.LAYERS_PER_FACE_SLD_NAME) + "\")(1);\r" +
            "cols = Math.sqrt(layersPerFace);\r" +
            "w = width;\r" +
            "i = index - parent.index;\r" +
            "j = i - 1;\r" +
            "origin1 = [w / 2, w / 2, 0];\r" +
            "origin2 = [w * cols, w / 2, w / 2];\r" +
            "origin3 = [w * cols - w / 2, w / 2, w * cols];\r" +
            "origin4 = [0, w / 2, w * cols - w / 2];\r" +
            "origin5 = [w / 2, w * cols, w / 2];\r" +
            "origin6 = [w / 2, 0, w / 2];\r" +
            "if (i / layersPerFace <= 1)\r" +
            "   pos = origin1 + [(j % cols) * w, Math.floor(j / cols) * w, 0];\r" +
            "else if (i / layersPerFace <= 2)\r" +
            "   pos=origin2 + [0,Math.floor((j - layersPerFace) / cols) * w, (j % cols) * w];\r"+
            "else if (i / layersPerFace <= 3)\r" +
            "   pos = origin3 + [- (j % cols) * w, Math.floor((j - 2 * layersPerFace) / cols) * w, 0];\r"+
            "else if (i / layersPerFace <= 4)\r" +
            "   pos = origin4 + [0, Math.floor((j - 3 * layersPerFace) / cols) * w, - (j % cols) * w];\r"+
            "else if (i / layersPerFace <= 5)\r" +
            "   pos = origin5 + [(j % cols) * w, 0, Math.floor((j - 4 * layersPerFace) / cols) * w];\r"+
            "else \r" +
            "   pos = origin6 + [Math.floor((j - 5 * layersPerFace) / cols) * w, 0, (j % cols) * w ];\r";                   
        }        

        
        return pos;
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    function getOrientation()
    /*---------------------------------------------------------------------------------------------------------*/
    {
        var ori;
        
        if (!G.USE_EXPR)
        {
            ori = new Array();
            
            // front face
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {
                ori.push([0,0,0]);
            }
            
            // right face
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {
                ori.push([0,270,0]);
            }
            
            // back face
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {
                ori.push([0,180,0]);
            } 
            
            // left face
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {
                ori.push([0,90,0]);
            }                       
            
            // bottom face
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {
                ori.push([90,0,0]);
            }      
            
            // top face
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {
                ori.push([270,0,0]);
            }                               
        }
        else
        {
            ori =
            "ori = value;\r" +
            "vals = [[0,0,0], [0,270,0], [0,180,0], [0,90,0], [90,0,0], [270,0,0]];\r" +
            "names = [";
            for (var i = 0; i < loc(G.FACE_NAMES).length; i++)
            {
                ori += "[\"" + loc(G.FACE_NAMES)[i] + "\"]";
                if (i < loc(G.FACE_NAMES).length - 1)
                {
                    ori += ", ";
                }
                else
                {
                    ori += "];\r";
                }
            }
            ori +=
            "for (i = 0; i < 6; i++)\r" +
            "{\r" +
            "   if (name.indexOf(names[i]) != -1)\r" +
            "   {\r" +
            "      ori = vals[i];\r" +
            "      break;\r" +
            "   }\r" +
            "}\r" +
            "ori;";
        }
        
        return ori;        
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    function addController(comp, layers)
    /*---------------------------------------------------------------------------------------------------------*/
    {
        var controllerL = comp.layers.addNull();
        
        controllerL.name = loc(G.CONTROLLER_LAYER_NAME);
        controllerL.threeDLayer = true; 
        
        if (G.LAYERS_CHOICE == 1)
        {
            G.SIZE = layers[0].width * Math.sqrt(G.LAYERS_PER_FACE);
        }            
        
        controllerL.anchorPoint.setValue([G.SIZE / 2, G.SIZE / 2, G.SIZE / 2]);
        
        if (G.USE_EXPR)
        {
            var layersPerFaceE = controllerL.Effects.addProperty("ADBE Slider Control");
            
            layersPerFaceE.name = loc(G.LAYERS_PER_FACE_SLD_NAME);
            layersPerFaceE.property(1).setValue(G.LAYERS_PER_FACE);            
        }
        
        return controllerL;
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    function createCubeFromNewSolids(comp)
    /*---------------------------------------------------------------------------------------------------------*/
    {
        var layerSize = G.SIZE / Math.sqrt(G.LAYERS_PER_FACE);
        
        var pos = getPosition(layerSize);
        var ori = getOrientation();

        var controllerL = addController(comp, null);     
        
        var layerSize = G.SIZE / Math.sqrt(G.LAYERS_PER_FACE);
        var iter = 0;
        var layer;
        
        for (var i = 0; i < 6; i++)
        {
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {   
                if (!G.UNIQUE_SOURCE || (G.UNIQUE_SOURCE && i + j == 0))
                {
                    layer = comp.layers.addSolid(G.SOLID_COLOR, G.UNIQUE_SOURCE ? loc(G.FACE_NAME) : loc(G.FACE_NAMES)[i], layerSize, layerSize, 1.0);        
                }
                else
                {
                    layer = comp.layers.add(layer.source);    
                }
                
                layer.name = loc(G.FACE_NAMES)[i];
                
                layer.threeDLayer = true; 
                
                layer.parent = controllerL;
                
                if (!G.USE_EXPR)
                {
                    layer.position.setValue(pos[iter]);                
                    layer.orientation.setValue(ori[iter++]); 
                }
                else
                {
                    layer.position.expression = pos;
                    layer.orientation.expression = ori;                                         
                }
                
                layer.selected = false;
                
                if (i > 0)
                {
                    layer.moveAfter(comp.layer(comp.numLayers));
                }               
            }
        }
        
        controllerL.moveToBeginning(); 
        controllerL.selected = true;
    }

    /*---------------------------------------------------------------------------------------------------------*/
    function createCubeFromSelectedLayers(comp, layers)
    /*---------------------------------------------------------------------------------------------------------*/
    {
        var layerSize = layers[0].width;
        
        var pos = getPosition(layerSize);
        var ori = getOrientation();

        var iter = 0;
        var layer;
        var nameSeparator = " * ";
        
        var controllerL = addController(comp, layers);
        
        for (var i = 0; i < 6; i++)
        {
            for (var j = 0; j < G.LAYERS_PER_FACE; j++)
            {
                layer = layers[iter];
                
                layer.name = loc(G.FACE_NAMES)[i] + nameSeparator + layers[iter].name.substring(0,31 - nameSeparator.length - loc(G.FACE_NAMES)[i].length);
                
                layer.threeDLayer = true; 
                
                layer.parent = controllerL;
                
                if (!G.USE_EXPR)
                {
                    layer.position.setValue(pos[iter]);                
                    layer.orientation.setValue(ori[iter]); 
                }
                else
                {
                    layer.position.expression = pos;
                    layer.orientation.expression = ori;                                         
                }
                
                layer.selected = false;
                
                if (i > 0)
                {
                    layer.moveAfter(comp.layer(comp.numLayers));
                }
                
                iter++;
            }
        }
        
        controllerL.moveToBeginning(); 
        controllerL.selected = true;        
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    function Main() 
    /*---------------------------------------------------------------------------------------------------------*/
    {
        var err = false;
        
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem))
        {
            throwMsg(G.NO_COMP_ERR);
            return;
        }
        
        if (comp.pixelAspect != 1.0)
        {
            throwMsg(G.BAD_PAR_ERR);
            return;
        }
        
        G.LAYERS_CHOICE     = UI.pal.settingsPnl.layersLst.selection.index;
        G.LAYERS_PER_FACE   = parseInt(UI.pal.settingsPnl.layersPerFaceEdt.text);
        G.SIZE              = parseInt(UI.pal.settingsPnl.sizeEdt.text);
        G.USE_EXPR          = UI.pal.settingsPnl.exprCb.value;
        G.UNIQUE_SOURCE     = UI.pal.settingsPnl.sourceCb.value;
        
        if (comp.numLayers > 0)
        {
            if (G.LAYERS_CHOICE == 0 || (G.LAYERS_CHOICE == 1 && comp.numLayers > comp.selectedLayers.length))
            {
                if (confirm(loc(G.WARNING),false,G.TITLE))
                {
                    return;
                }
            }
        }

        app.beginUndoGroup(G.TITLE);
        
        if (G.LAYERS_CHOICE == 0)
        {
            createCubeFromNewSolids(comp);
        }
        else if (G.LAYERS_CHOICE == 1)
        {
            var selLayers = comp.selectedLayers;
            
            err = checkSelectedLayers(selLayers);
            if (err)
            {
                throwMsg(G.BAD_SELECTED_LAYERS_ERR);
                return;
            }
            
            createCubeFromSelectedLayers(comp, selLayers);
        }
        
        app.endUndoGroup();
    }
    
    /*---------------------------------------------------------------------------------------------------------*/
    // Entry Point
    /*---------------------------------------------------------------------------------------------------------*/
    var G = new Object();
    initGlobals(G);
    
    if (G.APP_VERSION < G.MIN_VERSION)
    {
        throwMsg(G.BAD_VERSION_ERR);
    }
    else
    {
        var UI = new Object();                  
        initUI(UI);        
    }

}    