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
	if(!itsOver && year<=2014){
		for(var i = 0; i < numDays; i++){
		$("#day"+(i+1)).hide();
		}

		if((day >= 2 && month >= 9) || month > 9){  //2 sep 14
		$("#day1").show();
		openThis = 13;
		}
		if((day >= 9 && month >= 9) || month > 9){  //9 sep 14
		$("#day2").show();
		openThis = 12;
		}
		if((day >= 16 && month >= 9) || month > 9){  //16 sep 14
		$("#day3").show();
		openThis = 11;
		}
		if((day >= 23 && month >= 9) || month > 9){  //23 sep 14
		$("#day4").show();
		openThis = 10;
		}
		if((day >= 30 && month >= 9) || month > 9){  //30 sep 14
		$("#day5").show();
		openThis = 9;
		}
		if((day >= 7 && month >= 10) || month > 10){  //7 oct 14
		$("#day6").show();
		openThis = 8;
		}
		if((day >= 21 && month >= 10) || month > 10){  //21 oct 14
		$("#day7").show();
		openThis = 7;
		}
		if((day >= 28 && month >= 10) || month > 10){  //28 oct 14
		$("#day8").show();
		openThis = 6;
		}
		if((day >= 4 && month >= 11) || month > 11){  //4 nov 14
		$("#day9").show();
		openThis = 5;
		}
		if((day >= 11 && month >= 11) || month > 11){  //11 nov 14
		$("#day10").show();
		openThis = 4;
		}
		if((day >= 18 && month >= 11) || month > 11){  //18 nov 14
		$("#day11").show();
		openThis = 3;
		}
		if((day >= 25 && month >= 11) || month > 11){  //25 nov 14
		$("#day12").show();
		openThis = 2;
		}
		if((day >= 2 && month >= 12) || month > 12){  //2 dec 14
		$("#day13").show();
		openThis = 1;
		}
		if((day >= 9 && month >= 12) || month > 12){  //9 dec 14
		$("#day14").show();
		openThis = 0;
	}
}

	$("#accordion2").accordion({
		autoHeight: false,
		navigation: true,
		active: openThis
	});
}

$(setup_itp);
