//*********************************************************
//this is a script to make a 3d cube with a null object with which to control the cube
//to run, simply have an empty comp ready, select it in the project window,
//and run the script. the cube's sides are held in place through expressions
//so they will 'always' hold their positions.
//thanks to dan ebberts and everyone at www.creativecow.net for their help.

//nicholas white
//vitamin_man@email.com
//ww.wemads.com


//****************************************************
// setting up project
side_size = prompt ("how big will each layer be?", "");
side_size = side_size/1
offset = side_size/2
myComp = app.project.item(1);
//***************************************************

//****************************
//create new 3d layers
for (i=1; i<=6; i++)
{
solid_name = i;
mySolid = myComp.layers.addSolid([1.0,0.5,0.3], "side " +i , side_size, side_size, 1);
//make 3d
mySolid.threeDLayer = true;
//add expression to fix the anchor point to the dead center of the solid
solid_anchor_expression = "anchor = [" +offset+ "," +offset+ ",0]";
mySolid.property("anchorPoint").expression = solid_anchor_expression;
//add expression to fix the x,y and z rotations to 0
var rot_axis;
for (r=1; r<=3; r++)
{
switch(r)
{
case 1:
rot_axis = 'X';
break;
case 2:
rot_axis = 'Y';
break;
case 3:
rot_axis = 'Z';
break;
default:
}
rot_axis_expression = "rotation" +rot_axis+ " = 0";
var rot_property = (rot_axis + " Rotation");
mySolid.property(rot_property).expression = rot_axis_expression;
}
//add expressions to orient the layers so they all face the right direction in 3d space
var or_array;
{
switch(i)
{
case 1:
or_array = '[0,0,0]';
break;
case 2:
or_array = '[0,90,0]';
break;
case 3:
or_array = '[0,90,0]';
break;
case 4:
or_array = '[0,0,0]';
break;
case 5:
or_array = '[90,0,0]';
break;
case 6:
or_array = '[90,0,0]';
break;
default:
}
or_array_expression = "orientation = " +or_array;
mySolid.property("Orientation").expression = or_array_expression;
}
//add expressions to position the layers correctly in 3d space
var pos_array;
{
switch(i)
{
case 1:
pos_array = "[" +offset+ "," +offset+ ",0]";
break;
case 2:
pos_array = "[" +side_size+ "," +offset+ "," +offset+ "]";
break;
case 3:
pos_array = "[0," +offset+ "," +offset+ "]";
break;
case 4:
pos_array = "[" +offset+ "," +offset+ "," +side_size+ "]";
break;
case 5:
pos_array = "[" +offset+ ",0," +offset+ "]";
break;
case 6:
pos_array = "[" +offset+ "," +side_size+ "," +offset+ "]";
break;
default:
}
pos_array_expression = "position = " +pos_array;
mySolid.property("Position").expression = pos_array_expression;
}
}
//******************************************

//******************************************
//add null object, make it the parent of the solids

//add a null object with which to control the layers' movement
myNull = myComp.layers.addNull();
//make 3d
myNull.threeDLayer = true;
//add expression to fix the anchor point to the dead center of the null object
null_anchor_expression = "anchor = [0,0,0]";
myNull.property("anchorPoint").expression = null_anchor_expression;
//add expression to position the null in the dead center of the cube
myComp.layer(1).property("Position").setValue([offset,offset,offset]);
//set the solids to be children of the null object
var null_parent;
null_parent = myComp.layer(1);
for (c=2; c<=7; c++)
{
myComp.layer(c).parent = null_parent;
}
//***********************************************


alert ("done!");
