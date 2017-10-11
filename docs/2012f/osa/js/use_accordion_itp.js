var itsOver = false;

//get the day
var myDays = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];
today = new Date();
thisDay = today.getDay();
//get the date
var month = today.getMonth() + 1;
var day = today.getDate();
var year = today.getFullYear();
//get the time
var hours = today.getHours();
var minutes = today.getMinutes();
var numDays = 14;
var openThis;

function setup_itp() {
	if(!itsOver && year<=2012){
		for(var i = 0; i < numDays; i++){
		$("#day"+(i+1)).hide();
		}

		if((day >= 5 && month >= 9) || month > 9){  //5 sep 12
		$("#day1").show();
		openThis = 13;
		}
		if((day >= 12 && month >= 9) || month > 9){  //12 sep 12
		$("#day2").show();
		openThis = 12;
		}
		if((day >= 19 && month >= 9) || month > 9){  //19 sep 12
		$("#day3").show();
		openThis = 11;
		}
		if((day >= 26 && month >= 9) || month > 9){  //26 sep 12
		$("#day4").show();
		openThis = 10;
		}
		if((day >= 3 && month >= 10) || month > 10){  //3 oct 12
		$("#day5").show();
		openThis = 9;
		}
		if((day >= 10 && month >= 10) || month > 10){  //10 oct 12
		$("#day6").show();
		openThis = 8;
		}
		if((day >= 17 && month >= 10) || month > 10){  //17 oct 12
		$("#day7").show();
		openThis = 7;
		}
		if((day >= 24 && month >= 10) || month > 10){  //24 oct 12
		$("#day8").show();
		openThis = 6;
		}
		if((day >= 31 && month >= 10) || month > 10){  //31 oct 12
		$("#day9").show();
		openThis = 5;
		}
		if((day >= 7 && month >= 11) || month > 11){  //7 nov 12
		$("#day10").show();
		openThis = 4;
		}
		if((day >= 14 && month >= 11) || month > 11){  //14 nov 12
		$("#day11").show();
		openThis = 3;
		}
		if((day >= 21 && month >= 11) || month > 11){  //21 nov 12
		$("#day12").show();
		openThis = 2;
		}
		if((day >= 28 && month >= 11) || month > 11){  //28 nov 12
		$("#day13").show();
		openThis = 1;
		}
		if((day >= 5 && month >= 12) || month > 12){  //5 dec 12
		$("#day14").show();
		openThis = 0;
	}
}
/*
if((day >= 12 && month >= 12) || month > 12){  //12 dec 12
$("#day15").show();
openThis = 0;
}
*/


	$("#accordion2").accordion({
		autoHeight: false,
		navigation: true,
		active: openThis
	});
}

$(setup_itp);
