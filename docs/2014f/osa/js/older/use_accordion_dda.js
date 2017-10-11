//get the day
var myDays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
today=new Date();
thisDay=today.getDay();
//get the date
var month = today.getMonth() + 1;
var day = today.getDate();
var year = today.getFullYear();
//get the time
var hours = today.getHours();
var minutes = today.getMinutes();

var openThis;

//-----

/*
function setup_facs() {
if(myDays[thisDay]=="Thursday"&&((hours==8&&minutes>=30)||(hours==9)||(hours==10)||(hours==11&&minutes<=29))) {
openThis=1;
} else if(myDays[thisDay]=="Wednesday"&&((hours==8&&minutes>=30)||(hours==9)||(hours==10)||(hours==11&&minutes<=29))) {
openThis=0;
} else if(myDays[thisDay]=="Wednesday"&&((hours==11&&minutes>=30)||(hours==12)||(hours==13)||(hours==14&&minutes<=29))) {
openThis=2;
} else {
openThis="false";
}
	$("#accordion2").accordion({
		autoHeight: false,
		navigation: true,
		//active: openThis
        active: 14
	});
}
*/
//--------

function setup_dda() {
for(var i=0;i<15;i++){
$("#day"+(i+1)).hide();
}

if((day>=30&&month>=8)||month>8){  //30 aug 11
$("#day1").show();
openThis=14;
}
if((day>=6&&month>=9)||month>9){  //6 sep 11
$("#day2").show();
openThis=13;
}
if((day>=13&&month>=9)||month>9){  //13 sep 11
$("#day3").show();
openThis=12;
}
if((day>=20&&month>=9)||month>9){  //20 sep 11
$("#day4").show();
openThis=11;
}
if((day>=27&&month>=9)||month>9){  //27 sep 11
$("#day5").show();
openThis=10;
}
if((day>=4&&month>=10)||month>10){  //4 oct 11
$("#day6").show();
openThis=9;
}
if((day>=11&&month>=10)||month>10){  //11 oct 11
$("#day7").show();
openThis=8;
}
if((day>=13&&month>=10)||month>10){  //13 oct 11 makeup
$("#day8").show();
openThis=7;
}
if((day>=1&&month>=11)||month>11){  //1 nov 11
$("#day9").show();
openThis=6;
}
if((day>=8&&month>=11)||month>11){  //8 nov 11
$("#day10").show();
openThis=5;
}
if((day>=15&&month>=11)||month>11){  //15 nov 11
$("#day11").show();
openThis=4;
}
if((day>=22&&month>=11)||month>11){  //22 nov 11
$("#day12").show();
openThis=3;
}
if((day>=29&&month>=11)||month>11){  //29 nov 11
$("#day13").show();
openThis=2;
}
if((day>=6&&month>=12)||month>12){  //6 dec 11
$("#day14").show();
openThis=1;
}
if((day>=13&&month>=12)||month>12){  //13 dec 11
$("#day15").show();
openThis=0;
}

/*
else {
openThis="false";
}
*/
	$("#accordion2").accordion({
		autoHeight: false,
		navigation: true,
		active: openThis
	});
}

$(setup_dda);
