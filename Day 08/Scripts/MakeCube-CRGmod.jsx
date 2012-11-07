//*********************************************************
// INTRODUCING VERSION NUMBERS STARTING 7-10-09
// VERSION 2

//this is a script to make a 3d cube with a null object with which to control the cube
//to run, simply have an empty comp ready, select it in the project window,
//and run the script.
//thanks to dan ebberts and everyone at www.creativecow.net for their help.

//nicholas white
//vitamin_man@email.com
//ww.wemads.com

//Re-write to center cube and cube height by Atom.
//8-29-2007

// 12/2007 -- modified by CRGreen to include:
//       UI, formulae entry implementation for UI (just for kicks, to teach myself the ECMA try block), undo for entire process
//       also made camera not auto-orient (99.9999% of the time this is the way i want a camera), 
//       removed pixel aspect ratio stuff -- all square pixels now (but will warn of mismatch if user forgot to check comp setting).
//       making "Controller" null change to matching (square) p.a.r. after parenting makes shape work in any p.a.r. comp
//       made opacities of layers at 65% to show off box better
//       parenting stage now works with unique collection of solids ... so city-building now possible  :-)
////////////////////////
//  4/07/2008 -- tweak by CRGreen to make all sides 'facing' out (quasi-normals tweak)
//  7/10/2009 -- tweak by CRGreen to place cube in comp center, and do same w/camera, also added semi-intelligent camera placement
//////////////////////////////////////

var w = buildUI();
if (w != null) {
    w.show();
}

function buildUI(thisObj) {
    //to do: make scriptUI panel version
    var win =  new Window('palette', 'Build 3D Cube',[300,100,670,270]);

    
    currentPA=1;
    /*
    if (app.project.activeItem != null) {
        if (app.project.activeItem instanceof CompItem) {
            var currentPA = app.project.activeItem.pixelAspect.toString();
        }
    }
    */
    if (win != null) {
        win.originPnl = win.add('panel', [17,17,117,137], 'Style:');
        win.originCenRad = win.originPnl.add('radiobutton', [14,15,84,37], 'Center');
        win.originTopRad = win.originPnl.add('radiobutton', [14,45,84,67], 'Top');
        win.originBotRad = win.originPnl.add('radiobutton', [14,74,84,96], 'Bottom');
        win.originBotRad.value = true;
        
        win.sideSizLbl = win.add('statictext', [141,16,253,38], 'Side Size:');
        win.sideSizT = win.add('edittext', [258,13,348,35], '500');
        win.cubeHtLbl = win.add('statictext', [141,46,253,68], 'Cube Height:');
        win.cubeHtT = win.add('edittext', [258,43,348,65], '500');
        
        win.pixARLbl = win.add('statictext', [141,76,253,98], 'Pixel Aspect Ratio:');
        win.pixARLbl.enabled=false;
        win.pixART = win.add('edittext', [258,74,348,96], currentPA);
        win.pixART.enabled=false;
        
        win.camCheck = win.add('checkbox', [141,105,291,125], ' Add Camera');
        win.camCheck.value = true;
        
        win.okBtn = win.add('button', [273,136,353,158], 'Build', {name:'Build'});
        win.okBtn.onClick = function () {buildCube(win);};
    }
    return win
}

function checkNumberEntry(entree) {
    // see if we can evaluate the entry
    // if we can't, nullify it;
    try {
        rezult=eval(entree);
    } catch ( error ) {
        rezult=null;
    }
    // if we can, make sure it evals to a number; nullify it if it doesn't
    // this allows us to include formulae in our number entries (like "2*1200" for example) -- just like most of AE's number entry fields
    if ( isNaN(parseFloat(rezult)) ) { rezult=null; }
    return rezult;
}

function buildCube(windo) {
    
    entryError = "";
    
    side_size = checkNumberEntry(windo.sideSizT.text);
    if ( (side_size == null) || (side_size == 0) || (side_size == undefined) ) {
        entryError = "invalid entry for side size\r";
        windo.sideSizT.text = "";
    }
    cube_height = checkNumberEntry(windo.cubeHtT.text);
    if ( (cube_height == null) || (cube_height == 0) || (cube_height == undefined) ) {
        entryError = (entryError + "invalid entry for cube height\r");
        windo.cubeHtT.text = "";
    }
    side_height = cube_height-side_size;   //This number should not go negative!
    
    // left over:
    pixel_aspect = checkNumberEntry(windo.pixART.text);
    if ( (pixel_aspect == null) || (pixel_aspect == 0) || (pixel_aspect == undefined) ) {
        entryError = (entryError + "invalid entry for pixel aspect ratio\r");
        windo.pixART.text = "";
    }
    
    if (entryError == "") {
        if (windo.originCenRad.value) {
            origin_index = 0;
        } else if (windo.originTopRad.value) {
            origin_index = 1;
        } else if (windo.originBotRad.value) {
            origin_index = 2;
        }
        add_camera = windo.camCheck.value;
        
        side_size = side_size/1;
        offset = side_size*.5;
        
        if (app.project.activeItem != null) {
            if (app.project.activeItem instanceof CompItem) {
                
                myComp = app.project.activeItem;
                theCompPA = myComp.pixelAspect;
                var confirmedPA=true;
                
                if ( theCompPA != parseFloat(pixel_aspect) ) {
                    confirmedPA=confirm("Pixel Aspect Ratio of the Cube's solids does not match your comp. Is this Okay?");
                }
                if (confirmedPA) {
                    app.beginUndoGroup("Build Cube");
                    //Create new 3d layers
                    var sidesCollection = new Array();
                    for (i=1; i<=6; i++)
                    {
                        //Construct a color and a name for each side.
                        side_adjust = side_height;         //All other sides need side adjust to facilitate new height parameter.
                        
                        switch(i)
                        {
                        case 1:
                            side_color = [1.0,0.5,0.3];
                            side_name = "front";
                            break;
                        case 2:// R
                            side_color = [1.0,0.3,0.5];
                            side_name = "right";
                            break;
                        case 3:// L
                            side_color = [0.5,1.0,0.3];
                            side_name = "left";
                            break;
                        case 4:
                            side_color = [0.3,1.0,0.5];
                            side_name = "back";
                            break;
                        case 5:
                            side_color = [0.3,0.5,1.0];
                            side_name = "top";
                            side_adjust = 0;         //Top needs no side adjust.
                            break;
                        case 6:
                            side_color = [0.5,0.3,1.0];
                            side_name = "bottom";
                            side_adjust = 0;         //Bottom needs no side adjust.
                            break;
                        }
                        mySolid = myComp.layers.addSolid(side_color, side_name, side_size, side_size+side_adjust , pixel_aspect);
                        mySolid.threeDLayer = true;   //make 3d
                        mySolid.property("opacity").setValue(65);
                        
                        //Set the orientation for each layer.
                        myProperty = mySolid.property("orientation");
                        switch(i)
                        {
                        case 1:
                            myProperty.setValue ([0,0,0]);
                            break;
                        case 2:
                            myProperty.setValue ([0,270,0]);
                            break;
                        case 3:
                            myProperty.setValue ([0,90,0]);
                            break;
                        case 4:
                            myProperty.setValue ([180,0,0]);
                            break;
                        case 5:
                            myProperty.setValue ([270,0,0]);
                            break;
                        case 6:
                            myProperty.setValue ([90,0,0]);
                            break;
                        default:
                        }
                        
                        //Set the position of each layer in 3D space.
                        myProperty = mySolid.property("position");
                        switch(i)
                        {
                        case 1:
                            myProperty.setValue ([offset, offset+(side_height*.5) ,0]);
                            break;
                        case 2:// R
                            myProperty.setValue ([side_size, offset+(side_height*.5) ,offset]);
                            break;
                        case 3:// L
                            myProperty.setValue ([0,offset+(side_height*.5) , offset]);
                            break;
                        case 4:
                            myProperty.setValue ([offset, offset+(side_height*.5),side_size]);
                            break;
                        case 5:
                            //Top.
                            myProperty.setValue ([offset, 0,offset]);
                            break;
                        case 6:
                            //Bottom.
                            myProperty.setValue ([offset, cube_height ,offset]);
                            break;
                        default:
                        }
                        // build collection of solids here
                        sidesCollection[(i-1)] = mySolid;
                    }
                    //end for...
                    
                    //Add null object, make it the parent of the solids
                    myNull = myComp.layers.addNull();
                    myNull.name = "Controller";
                    myNull.threeDLayer = true;         //Make 3D.

                    //Set the anchor point style for the cube.
                    switch(origin_index)
                    {
                    case 1:
                        //Anchor to bottom of cube.
                        myNull.property("position").setValue([offset,0,offset]);
                        writeLn ("Cube origin at top.");
                        break;
                    case 2:
                        //Anchor to top of cube.
                        myNull.property("position").setValue([offset,cube_height,offset]);
                        writeLn ("Cube origin at bottom.");
                        break;
                    default:
                        //Anchor to center of cube.
                        myNull.property("position").setValue([offset,offset+(side_height*.5),offset]);
                        writeLn ("Cube origin at center.");
                    }
                    
                    // what if we want to make more than one box in a comp?
                    // changed to earlier make a collection of new solids, then use that collection here
                    //Set the solids to be children of the null object.
                    for (c=0; c<=5; c++)
                    {
                        sidesCollection[c].parent = myNull;
                    }
                    
                    //this corrects for left and right pixel aspect problem in non-square comps:
                    myNull.source.pixelAspect = 1;

                    //    added for 7-10-09 version:
                        myNull.property("position").setValue([myComp.width*.5, myComp.height*.5, 0]);
                    
                    if (add_camera == true)
                    {
                        //Add a camera.
                        myCamera = myComp.layers.addCamera("Camera1",[myComp.width*.5,myComp.height*.5]);
                        myCamera.moveToBeginning();
                        myCamera.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
                        //    added for 7-10-09 version:
                        // yet another cheesey rough-trial-and-error-developed method for moving a camera into position to view our subject
                        myCamera.property("position").setValue([myComp.width*.5, myComp.height*.5, (offset*2*-1)-(offset*4)]);
                    }
                    app.endUndoGroup("Build Cube");
                }
            }
        }
    } else {
        alert("oops\r" + entryError);
    }
}
