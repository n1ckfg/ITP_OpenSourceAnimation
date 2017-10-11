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

$(document).ready(function() {
if(myDays[thisDay]=="Thursday"&&((hours==8&&minutes>=30)||(hours==9)||(hours==10)||(hours==11&&minutes<=29))) {
openThis=1;
} else if(myDays[thisDay]=="Wednesday"&&((hours==8&&minutes>=30)||(hours==9)||(hours==10)||(hours==11&&minutes<=29))) {
openThis=0;
} else if(myDays[thisDay]=="Wednesday"&&((hours==11&&minutes>=30)||(hours==12)||(hours==13)||(hours==14&&minutes<=29))) {
openThis=2;
} else {
openThis="false";
}
	$("#accordion1").accordion({
		autoHeight: false,
		navigation: true,
		active: openThis
	});
});