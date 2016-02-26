var AbstractExtendedActivityDataModifier = Fiber.extend(function(base) {

    return {

        content: '',

        isAuthorOfViewedActivity: null,

        dataViews: [],

        summaryGrid: null,

        init: function(analysisData, appResources, userSettings, athleteId, athleteIdAuthorOfActivity, basicInfos) {

            this.analysisData_ = analysisData;
            this.appResources_ = appResources;
            this.userSettings_ = userSettings;
            this.athleteId_ = athleteId;
            this.athleteIdAuthorOfActivity_ = athleteIdAuthorOfActivity;
            this.basicInfos = basicInfos;

            this.isAuthorOfViewedActivity = (this.athleteIdAuthorOfActivity_ == this.athleteId_);

            this.speedUnitsData = this.getSpeedUnitData();

            this.setDataViewsNeeded();
        },



        modify: function() {
            
            _.each(this.dataViews, function(view) {
                // Append result of view.render() to this.content
                view.render();
                this.content += view.getContent();
            }.bind(this));


// has to be done here, so that it works for all types of activities, not only cycling and running
			// Add Show extended statistics to page
//            this.placeSummaryPanel(function() {});
            this.placeExtendedStatsButton(function() {
	        if (env.debugMode) console.log("Execute placeExtendedStatsButton");
            });


        },
        
        
        


        placeSummaryPanel: function(panelAdded) {
        if (env.debugMode) console.log("Execute placeSummaryPanel");

//            this.makeSummaryGrid(2, 4);
            this.makeSummaryGrid(2, 2);

            this.insertContentSummaryGridContent();

            $('.inline-stats.section').first().after(this.summaryGrid.html()).each(function() {
                // Grid placed
                if (panelAdded) panelAdded();
            });
        },


        placeExtendedStatsButton: function(buttonAdded) {
        if (env.debugMode) console.log("Execute placeExtendedStatsButton");



		// print TRIMP and aRPEe Score under inline-stats section
		var html = '<div style="font-size: 15px; padding: 10px 0px 10px 0px; border-bottom: 0px solid #ccc; border-top: 1px solid #ccc; margin-bottom:4px;" id="histats">';

		if (this.analysisData_.heartRateData != null) {
			HRnote = "\n\n* Depends heavily on appropriate MaxHR ("+this.analysisData_.heartRateData.MaxHr+") and RestHR ("+this.analysisData_.heartRateData.RestHr+"), so set them right in Health Settings!";
			HRnote+= "\n   ! when looking at other athlete's wokouts, note that calculations are done with YOUR HR settings !";
			RPEnote  = "aRPEe score - Average RPE (Rated Perceived Exertion) Estimate\n";
			RPEnote += "aRPEe = TRIMP/hr / n   (n=25 for Men and 20 for Women)\n";
			RPEnote += "\naRPEe is a simple number with short description of how hard Your workout was for\nYour Heart (Might also seem a bit off for You as RPE is very user perception dependent)\n";
			RPEnote1 = "\n   1\t[NIL]\tYou really consider THAT a Workout?!\n   2\t[R]\tRecovery\n   3\t[ER]\tEasy-Recovery\n   4\t[LM]\tLower Medium\n   5\t[M]\tMedium\n  5.5\t[UM]\tUpper Medium\n   6\t[H]\tHard\n   7\t[VH]\tVery Hard\n   8\t[EH]\tExtremely Hard\n   9\t[HaH]\tHard as Hell!\n   9+\t[DeaD]\tHave You really had survived THAT!?!";
			RPEnote2 = "\n\n-= (C) by Kamac - aRPEe concept and design by Dejan Kamensek, sLOVEnia =-";

			html += '<span style="color: #800 ;font-size: 18px;" title="HR based TRIMP (TRaining IMPulse)\nEstimation of TOTAL Training Load of the Workout'+HRnote+'">';
			html += ' TRIMP: <strong>'+this.analysisData_.heartRateData.TRIMP.toFixed(0)+'</strong></span>';

			html += '<span style="color: #800; font-size: 18px;" title="TRIMP/hour\nEstimation of Hourly AVERAGE Training Load of the Workout\n\n* Given the right HR settings, TRIMP/hr max is 262 for Men and 204 for Women'+HRnote+'">';
			html += ' | <strong>'+this.analysisData_.heartRateData.TRIMPPerHour.toFixed(0)+'</strong>/hour';
			html += '&nbsp</span>';

			if (this.analysisData_.toughnessScore != null) {
				html += '<span style="font-size: 18px;" title="Toughness Score (TS)\nTS = sqrt( sqrt( elevation^2 * avgPower * avgSpeed^2 * distance^2 * moveRatio ) ) /20">&nbsp&nbspToughness Score: <strong>'+this.analysisData_.toughnessScore.toFixed(0)+'</strong></span>';
			}
									 	
			$('.inline-stats.section').first().after(html);
		};



		if (this.analysisData_.heartRateData != null) {

			// prepare aRPEe gauge
			html = '<div id="RPE" style="margin-bottom:2px;" title="'+RPEnote+RPEnote1+HRnote+RPEnote2+'">';
			html += '<div id="RPEgauge"><div id="RPEgauge1"><div id="RPEtxt"></div></div></div><div id="RPElin"></div></div><font size=-3></font>';
			html += '<style>';
			html += '#RPE {height: 6px;position: relative;padding: 0px;border: 2px solid #333;background: linear-gradient(to right, #77E, rgb(86,122,172),rgb(11,127,22),rgb(133,195,0),rgb(255,244,0),rgb(255,190,0)   ,   rgb(255,11,0),rgb(200,0,0),rgb(150,0,0),rgb(100,0,0),rgb(50,0,0));border-radius: 2px;box-shadow: 1px 1px 1px #888;}';
			html += '#RPEgauge {position: relative;top: -4px;width: 0px;height: 0px;border-left: 0px solid transparent;border-right: 10px solid transparent;border-top: 11px solid #633; box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.100);}';
			html += '#RPEgauge1 {position: relative;top: -9px;width: 0px;height: 0px;border-left: 0px solid transparent;border-right: 4px solid transparent;border-top: 5px solid #C33;}';
			html += '#RPEtxt {position: relative;left: 0px;top: -20Px; color: #000000;text-align:center;font-family: sans-serif;font-size: 9px;font-weight: bold;}';
			html += '#RPElin {height: 3px;position: relative;top: -6px;left: 1px;background: #F00;}';
			html += '</style>';

			// Add aRPEe to page
			var aRPEe=this.analysisData_.heartRateData.aRPEe;

//			html+= '<div style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">';
			html+= '<div style="border-bottom: 0px solid #ccc;">';
			html+='<table style="margin:0px;" title="'+RPEnote+RPEnote1+HRnote+RPEnote2+'"><tr><td width=50px style="padding:0px;border-bottom: 0px;">';
			html+='<img src="' + this.appResources_.aRPEeIcon + '" style="padding-top:4px"></td>';
			html+='<td style="padding:0px;border-bottom: 0px;"><font style="font-size: 14px; vertical-align: middle;">';
//			aRPEe=1;
			if (aRPEe >= 9.5){	html+='<font style="color: rgb(50,0,0);"[DeaD]</font> Have You really had survived THAT!?!';
			} else if (aRPEe >= 8.5) {	html+='<font style="color: rgb(100,0,0);">[HaH]</font> Hard as Hell!';
			} else if (aRPEe >= 7.5) {	html+='<font style="color: rgb(150,0,0);">[EH]</font> Extremely Hard';
			} else if (aRPEe >= 6.5) {	html+='<font style="color: rgb(200,0,0);">[VH]</font> Very Hard';
			} else if (aRPEe >= 5.75){	html+='<font style="color: rgb(255,11,0);">[H]</font> Hard';
			} else if (aRPEe >= 5.25){	html+='<font style="color: rgb(255,111,0);">[UM]</font> Upper Medium';
			} else if (aRPEe >= 4.5) {	html+='<font style="color: rgb(255,190,0);">[M\]</font> Medium';
			} else if (aRPEe >= 3.5) {	html+='<font style="color: rgb(220,220,0);">[LM]</font> Lower Medium';
			} else if (aRPEe >= 2.5) {	html+='<font style="color: rgb(133,195,0);">[ER]</font> Easy-Recovery';
			} else if (aRPEe >= 1.5) {	html+='<font style="color: rgb(11,127,22);">[R]</font> Recovery';
			} else {	html+='<font style="color: rgb(86,122,172);">[NIL]</font> You really consider THAT a Workout?!';
			}
                    
			html+='</font></strong></td></tr></table></div>';


html+='<div class="TRIMPcharts" align=left style="padding-bottom: 5px;border-bottom: 1px solid #ccc;">';
html+='<span style="display: inline-block; vertical-align:">';
html+='<canvas id="TRIMPpie" width="120" height="100"  title="% of Time spent in\neach aRPEe Zone"></canvas>';
html+='<div class="donut-inner" style="margin-top: -61px; margin-left: 50px;">';
html+='<span style="font-size: 20px;font-family:verdana;line-height:0px;color: rgba(100,100,100,0.5);">%</span>';
html+='</div>';
html+='</span>';
html+='<span style="display: inline-block; vertical-align:middle">';
html+='<canvas id="TRIMPchart" width="320" height="110"  title="Minutes spent in\neach aRPEe Zone"></canvas>';
html+='</span>';
html+='</div>';

			$('.inline-stats.section').first().next().after(html);

var CTXpie   = document.getElementById("TRIMPpie").getContext("2d");
var CTXchart = document.getElementById("TRIMPchart").getContext("2d");


//    chart online test
//    http://jsfiddle.net/t3fjkmf1/
//    http://jsfiddle.net/t3fjkmf1/7/


var myData=[
    Math.round( StravaStreamsA.TRIMPPerHourZones[0].percentDistrib ),
    Math.round( StravaStreamsA.TRIMPPerHourZones[1].percentDistrib ),
    Math.round( StravaStreamsA.TRIMPPerHourZones[2].percentDistrib ),
    Math.round( StravaStreamsA.TRIMPPerHourZones[3].percentDistrib ),
    Math.round( StravaStreamsA.TRIMPPerHourZones[4].percentDistrib ),
    Math.round( StravaStreamsA.TRIMPPerHourZones[5].percentDistrib ),
    Math.round( StravaStreamsA.TRIMPPerHourZones[6].percentDistrib ),
    Math.round( StravaStreamsA.TRIMPPerHourZones[7].percentDistrib ),
    Math.round( StravaStreamsA.TRIMPPerHourZones[8].percentDistrib ),
    Math.round( StravaStreamsA.TRIMPPerHourZones[9].percentDistrib ),
    Math.round( StravaStreamsA.TRIMPPerHourZones[10].percentDistrib)
];

var myDataMinutes=[
    Math.round( StravaStreamsA.TRIMPPerHourZones[0].percentDistrib * globalActivityStatsMap.elapsedTime/6000),
    Math.round( StravaStreamsA.TRIMPPerHourZones[1].percentDistrib * globalActivityStatsMap.elapsedTime/6000),
    Math.round( StravaStreamsA.TRIMPPerHourZones[2].percentDistrib * globalActivityStatsMap.elapsedTime/6000),
    Math.round( StravaStreamsA.TRIMPPerHourZones[3].percentDistrib * globalActivityStatsMap.elapsedTime/6000),
    Math.round( StravaStreamsA.TRIMPPerHourZones[4].percentDistrib * globalActivityStatsMap.elapsedTime/6000),
    Math.round( StravaStreamsA.TRIMPPerHourZones[5].percentDistrib * globalActivityStatsMap.elapsedTime/6000),
    Math.round( StravaStreamsA.TRIMPPerHourZones[6].percentDistrib * globalActivityStatsMap.elapsedTime/6000),
    Math.round( StravaStreamsA.TRIMPPerHourZones[7].percentDistrib * globalActivityStatsMap.elapsedTime/6000),
    Math.round( StravaStreamsA.TRIMPPerHourZones[8].percentDistrib * globalActivityStatsMap.elapsedTime/6000),
    Math.round( StravaStreamsA.TRIMPPerHourZones[9].percentDistrib * globalActivityStatsMap.elapsedTime/6000),
    Math.round( StravaStreamsA.TRIMPPerHourZones[10].percentDistrib * globalActivityStatsMap.elapsedTime/6000)
];

// test data for chart
//myData=[30,20,30,40,50,55,50,40,30,20,30];
//myData=[5,10,15,10,5,10,5,10,15,10,5];
//myData=[5,10,5,10,15,10,15,10,5,10,5];


var DATApie = [ 
    { value: myData[0], color: "rgb(86,122,172)", highlight: "rgba(220,220,220,0.75)", label: "1 [NIL]" },
    { value: myData[1], color: "rgb(11,127,22)",  highlight: "rgba(220,220,220,0.75)", label: "2 [R]" },
    { value: myData[2], color: "rgb(133,195,0)",  highlight: "rgba(220,220,220,0.75)", label: "3 [ER]" },
    { value: myData[3], color: "rgb(255,244,0)",  highlight: "rgba(220,220,220,0.75)", label: "4 [LM]" },
    { value: myData[4], color: "rgb(255,190,0)",  highlight: "rgba(220,220,220,0.75)", label: "5 [M]" },
    { value: myData[5], color: "rgb(255,110,0)",  highlight: "rgba(220,220,220,0.75)", label: "5.5 [UM]" },
    { value: myData[6], color: "rgb(255,11,0)",   highlight: "rgba(220,220,220,0.75)", label: "6 [H]" },
    { value: myData[7], color: "rgb(200,0,0)",    highlight: "rgba(220,220,220,0.75)", label: "7 [VH]" },
    { value: myData[8], color: "rgb(150,0,0)",    highlight: "rgba(220,220,220,0.75)", label: "8 [EH]" },
    { value: myData[9], color: "rgb(100,0,0)",    highlight: "rgba(220,220,220,0.75)", label: "9 [HaH]" },
    { value: myData[10],color: "rgb(50,0,0)",    highlight: "rgba(220,220,220,0.75)", label: "9+ [DeaD]" }
];


var DATAchart = {
    labels: ["NIL", "R", "ER", "LM", "M", "UM", "H", "VH", "EH", "HaH", "DeaD"],
    datasets: [
        {
            label: "aRPEe Zones distribution in minutes",
			fillColor: "rgba(220,180,180,0.2)",
            highlightFill: "rgba(220,220,220,0.75)",
//            strokeColor: "rgba(220,180,180,1)",
//            pointColor: "rgba(220,120,120,1)",
//            pointStrokeColor: "#fff",
//            pointHighlightFill: "#fff",
//            pointHighlightStroke: "rgba(220,120,120,1)",
            data: myDataMinutes
        }
    ]
};



var myOPTpie = { 
    responsive : false, 
    percentageInnerCutout : 33,
    tooltipFontSize: 10,
    tooltipFontFamily : "Verdana",
    segmentStrokeWidth : 1,
    showScale : false,
  tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%",
} 

var myOPTchart = { 
//    multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
    responsive : false, 
    pointDot : true,
    tooltipFontSize: 10,
    tooltipFontFamily : "Verdana",
    scaleFontSize : 7,
    scaleFontFamily : "Verdana",
    barValueSpacing : 2,
  tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %> min",
} 


myTRIMPpie = new Chart(CTXpie).Doughnut(DATApie, myOPTpie);
//myTRIMPpie = new Chart(CTXpie).PolarArea(DATApie, myOPTpie);
myTRIMPchart = new Chart(CTXchart).Bar(DATAchart, myOPTchart);
//myTRIMPchart = new Chart(CTXchart).Line(DATAchart, myOPTchart);

// set custom bar's colors
    myTRIMPchart.datasets[0].bars[0].fillColor = "rgb(86,122,172)";
    myTRIMPchart.datasets[0].bars[1].fillColor = "rgb(11,127,22)"; 
    myTRIMPchart.datasets[0].bars[2].fillColor = "rgb(133,195,0)"; 
    myTRIMPchart.datasets[0].bars[3].fillColor = "rgb(255,244,0)"; 
    myTRIMPchart.datasets[0].bars[4].fillColor = "rgb(255,190,0)"; 
    myTRIMPchart.datasets[0].bars[5].fillColor = "rgb(255,110,0)"; 
    myTRIMPchart.datasets[0].bars[6].fillColor = "rgb(255,11,0)";
    myTRIMPchart.datasets[0].bars[7].fillColor = "rgb(200,0,0)";
    myTRIMPchart.datasets[0].bars[8].fillColor = "rgb(150,0,0)";
    myTRIMPchart.datasets[0].bars[9].fillColor = "rgb(100,0,0)";
    myTRIMPchart.datasets[0].bars[10].fillColor ="rgb(50,0,0)";
    myTRIMPchart.update();


			function myRPE(val,full,wid){
			if (env.debugMode) console.log("Execute myRPE");
			// *** for women use correction factor!!! MAX TRIM for man is 4.37/min (262/h) and for woman 3.4/min (204/h) !!!
    			document.getElementById("RPE").style.width=wid+1+'px';
    			var perc=Math.round((val*100)/full);
    			document.getElementById("RPEgauge").style.left=perc+'%';
    			document.getElementById("RPEgauge1").style.left=2+'px';
    			document.getElementById("RPEtxt").innerHTML=Math.round(perc,1)/10;
    			document.getElementById("RPEtxt").style.left=5-Math.round(getTextWidth(document.getElementById("RPEtxt").innerHTML, "8.5pt sans-serif")/2)+'px';
    			document.getElementById("RPElin").style.width=document.getElementById("RPE").style.width.slice(0,-2)*val/full+'px';
//				console.log(getTextWidth(document.getElementById("RPEtxt").innerHTML, "6.5pt sans-serif"))

			if (val >= 9.5){	        document.getElementById("RPElin").style.background="rgb(50,0,0)";
			} else if (val >= 8.5) {	document.getElementById("RPElin").style.background="rgb(100,0,0)";
			} else if (val >= 7.5) {	document.getElementById("RPElin").style.background="rgb(150,0,0)";
			} else if (val >= 6.5) {	document.getElementById("RPElin").style.background="rgb(200,0,0)";
			} else if (val >= 5.75){	document.getElementById("RPElin").style.background="rgb(255,11,0)";
			} else if (val >= 5.25){	document.getElementById("RPElin").style.background="rgb(255,111,0)";
			} else if (val >= 4.5) {	document.getElementById("RPElin").style.background="rgb(255,190,0)";
			} else if (val >= 3.5) {	document.getElementById("RPElin").style.background="rgb(255,244,0)";
			} else if (val >= 2.5) {	document.getElementById("RPElin").style.background="rgb(133,195,0)";
			} else if (val >= 1.5) {	document.getElementById("RPElin").style.background="rgb(11,127,22)";
			} else {                    document.getElementById("RPElin").style.background="rgb(86,122,172)";
			}


			};

			function getTextWidth(text, font) {
    			var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    			var context = canvas.getContext("2d");
    			context.font = font;
    			var metrics = context.measureText(text);
    			return metrics.width;
			};

			// insert RPE gauge

//			myRPE(this.analysisData_.heartRateData.TRIMP_hr,250,90);
			myRPE(aRPEe,10,180);
		}//if




		html = '<div><a title="Click to show extended statistics" id="extendedStatsButton" href="#">';
		html += '<style>.statsplus td {text-align:center; border: 0px 0px 0px 1px; padding: 1px;}</style>';
		html += '<table class="statsplus" style="margin: 0px; width:100%;">';
		html += '<tr style="color: rgb(30, 30, 30)"><td>Move Ratio<br><strong>';
		if (this.analysisData_.moveRatio != null) {html+=this.analysisData_.moveRatio.toFixed(2)} else {html+="-"};
		html +=	'</strong></td>';
		html += '<td><strong>Average</strong></td><td>Q1<br><font style="font-size:9px">low 25%</font></td><td>Median<br><font style="font-size:9px">50th percentile</font></td><td>Q3<br><font style="font-size:9px">high 75%</font></td><td><strong>Max</strong></td></tr>';

		if (this.analysisData_.heartRateData != null) {
			html += '<tr style="color: rgb(240, 40, 60)"><td style="line-height: 0.8">';
			 html += '<img src="' + this.appResources_.heartbeatIcon + '"height=18 style="padding:3px"><br>';
			 html += '<font size=-2>'+this.analysisData_.heartRateData.RestHr+'-'+this.analysisData_.heartRateData.MaxHr+' bpm</font></td>';
			html += '<td style="line-height: 1.1">';
			 html+= '<font style="font-size:10px">'+Helper.hrPercentFromHeartrate(this.analysisData_.heartRateData.averageHeartRate,this.analysisData_.heartRateData.MaxHr).toFixed(0)+'%</font><font style="font-size:7px">HRM</font>';
			 html+= '<br><font style="font-size:12px"><strong>'+this.analysisData_.heartRateData.averageHeartRate.toFixed(0)+'</strong> bpm</font>';
			 html+= '<br><font style="font-size:10px">'+Helper.hrrPercentFromHeartrate(this.analysisData_.heartRateData.averageHeartRate,this.analysisData_.heartRateData.MaxHr,this.analysisData_.heartRateData.RestHr).toFixed(0)+'</strong>%</font><font style="font-size:7px">HRR</font>';
			 html+= '</td>';
			html += '<td style="line-height: 1.1">';
			 html+= '<font style="font-size:10px">'+Helper.hrPercentFromHeartrate(this.analysisData_.heartRateData.lowerQuartileHeartRate,this.analysisData_.heartRateData.MaxHr).toFixed(0)+'%</font><font style="font-size:7px">HRM</font>';
			 html+= '<br><font style="font-size:12px"><strong>'+this.analysisData_.heartRateData.lowerQuartileHeartRate.toFixed(0)+'</strong> bpm</font>';
			 html+= '<br><font style="font-size:10px">'+Helper.hrrPercentFromHeartrate(this.analysisData_.heartRateData.lowerQuartileHeartRate,this.analysisData_.heartRateData.MaxHr,this.analysisData_.heartRateData.RestHr).toFixed(0)+'</strong>%</font><font style="font-size:7px">HRR</font>';
			 html+= '</td>';
			html += '<td style="line-height: 1.1">';
			 html+= '<font style="font-size:10px">'+Helper.hrPercentFromHeartrate(this.analysisData_.heartRateData.medianHeartRate,this.analysisData_.heartRateData.MaxHr).toFixed(0)+'%</font><font style="font-size:7px">HRM</font>';
			 html+= '<br><font style="font-size:12px"><strong>'+this.analysisData_.heartRateData.medianHeartRate.toFixed(0)+'</strong> bpm</font>';
			 html+= '<br><font style="font-size:10px">'+Helper.hrrPercentFromHeartrate(this.analysisData_.heartRateData.medianHeartRate,this.analysisData_.heartRateData.MaxHr,this.analysisData_.heartRateData.RestHr).toFixed(0)+'</strong>%</font><font style="font-size:7px">HRR</font>';
			 html+= '</td>';
			html += '<td style="line-height: 1.1">';
			 html+= '<font style="font-size:10px">'+Helper.hrPercentFromHeartrate(this.analysisData_.heartRateData.upperQuartileHeartRate,this.analysisData_.heartRateData.MaxHr).toFixed(0)+'%</font><font style="font-size:7px">HRM</font>';
			 html+= '<br><font style="font-size:12px"><strong>'+this.analysisData_.heartRateData.upperQuartileHeartRate.toFixed(0)+'</strong> bpm</font>';
			 html+= '<br><font style="font-size:10px">'+Helper.hrrPercentFromHeartrate(this.analysisData_.heartRateData.upperQuartileHeartRate,this.analysisData_.heartRateData.MaxHr,this.analysisData_.heartRateData.RestHr).toFixed(0)+'</strong>%</font><font style="font-size:7px">HRR</font>';
			 html+= '</td>';
			html += '<td style="line-height: 1.1">';
			 html+= '<font style="font-size:10px">'+Helper.hrPercentFromHeartrate(this.analysisData_.heartRateData.maxHeartRate,this.analysisData_.heartRateData.MaxHr).toFixed(0)+'%</font><font style="font-size:7px">HRM</font>';
			 html+= '<br><font style="font-size:12px"><strong>'+this.analysisData_.heartRateData.maxHeartRate.toFixed(0)+'</strong> bpm</font>';
			 html+= '<br><font style="font-size:10px">'+Helper.hrrPercentFromHeartrate(this.analysisData_.heartRateData.maxHeartRate,this.analysisData_.heartRateData.MaxHr,this.analysisData_.heartRateData.RestHr).toFixed(0)+'</strong>%</font><font style="font-size:7px">HRR</font>';
			 html+= '</td>';
		};

		if (this.analysisData_.powerData != null ) {
			html += '<tr style="color: rgb(173,173,173)"><td>Power';
			if (!this.analysisData_.powerData.hasPowerMeter) html+= '<font style="font-size:10px"> (Estimate)</font>';
			html += '</td>';
			html += '<td><strong>'+this.analysisData_.powerData.avgWatts.toFixed(1)+'</strong> W</td>';
			html += '<td><strong>'+this.analysisData_.powerData.lowerQuartileWatts.toFixed(1)+'</strong> W</td>';
			html += '<td><strong>'+this.analysisData_.powerData.medianWatts.toFixed(1)+'</strong> W</td>';
			html += '<td><strong>'+this.analysisData_.powerData.upperQuartileWatts.toFixed(1)+'</strong> W</td>';
			html += '<td><strong>'+this.analysisData_.powerData.maxWatts.toFixed(1)+'</strong> W</td></tr>';
		};

		if (this.analysisData_.speedData != null) {
			html += '<tr style="color: rgb(60,155, 200)"><td>Speed [km/h]</td>';
//			html += '<td><strong>'+(3600*window.distance/window.elapsedTime).toFixed(1)+'</strong></td>';
			html += '<td><strong>'+this.analysisData_.speedData.realAvgSpeed.toFixed(1)+'</strong></td>';
			html += '<td><strong>'+this.analysisData_.speedData.lowerQuartileSpeed.toFixed(1)+'</strong></td>';
			html += '<td><strong>'+this.analysisData_.speedData.medianSpeed.toFixed(1)+'<br>'+'</strong></td>';
			html += '<td><strong>'+this.analysisData_.speedData.upperQuartileSpeed.toFixed(1)+'</strong></td>';
			html += '<td><strong>'+this.analysisData_.speedData.maxSpeed.toFixed(1)+'</strong></td></tr>';
			html += '<tr style="color: rgb(60,155,200)"><td>Pace [min/km]</td>';
//			html += '<td><strong>'+Helper.secondsToHHMMSS((window.elapsedTime/window.distance).toFixed(0)).replace('00:','')+'</strong></td>';
			html += '<td><strong>'+Helper.secondsToHHMMSS((3600/this.analysisData_.speedData.realAvgSpeed).toFixed(0)).replace('00:','')+'</strong></td>';
			html += '<td><strong>'+Helper.secondsToHHMMSS((3600/this.analysisData_.speedData.lowerQuartileSpeed).toFixed(0)).replace('00:','')+'</strong></td>';
			html += '<td><strong>'+Helper.secondsToHHMMSS((3600/this.analysisData_.speedData.medianSpeed).toFixed(0)).replace('00:','')+'</strong></td>';
			html += '<td><strong>'+Helper.secondsToHHMMSS((3600/this.analysisData_.speedData.upperQuartileSpeed).toFixed(0)).replace('00:','')+'</strong></td>';
			html += '<td><strong>'+Helper.secondsToHHMMSS((3600/this.analysisData_.speedData.maxSpeed).toFixed(0)).replace('00:','')+'</strong></td></tr>';
		};

		if (this.analysisData_.cadenceData != null ) {
			html += '<tr style="color: rgb(231,125,222)"><td>Cadence [rpm]</td>';
			html += '<td><strong>'+this.analysisData_.cadenceData.averageCadenceMoving.toFixed(1)+'</strong></td>';
			html += '<td><strong>'+this.analysisData_.cadenceData.lowerQuartileCadence.toFixed(1)+'</strong></td>';
			html += '<td><strong>'+this.analysisData_.cadenceData.medianCadence.toFixed(1)+'</strong></td>';
			html += '<td><strong>'+this.analysisData_.cadenceData.upperQuartileCadence.toFixed(1)+'</strong></td>';
			html += '<td><strong>'+this.analysisData_.cadenceData.maxCadence.toFixed(1)+'</strong> rpm</td></tr>';
		};

		if (this.analysisData_.elevationData != null && this.analysisData_.gradeData != null ) {
			if (this.analysisData_.elevationData.ascentSpeed.avg>0) {
				html += '<tr style="color: rgb(44,0,204)"><td>VAM [vm/s]</td>';
				html += '<td><strong>'+this.analysisData_.elevationData.ascentSpeed.avg.toFixed(0)+'</strong></td>';
				html += '<td><strong>'+this.analysisData_.elevationData.ascentSpeed.lowerQuartile+'</strong></td>';
				html += '<td><strong>'+this.analysisData_.elevationData.ascentSpeed.median+'</strong></td>';
				html += '<td><strong>'+this.analysisData_.elevationData.ascentSpeed.upperQuartile+'</strong></td>';
				html += '<td><div style="line-height:0.9em;"><font style="font-size:8px">ascent time<br></font><font style="font-size:11px">'+Helper.secondsToHHMMSS(this.analysisData_.elevationData.ascentTimeOverGradeClimbingLimit)+'</div></font></td></tr>';
			}
		};

		if (this.analysisData_.gradeData != null ) {
//		if (this.analysisData_.gradeData != null && !(this.analysisData_.gradeData.lowerQuartileGrade == 0 && this.analysisData_.gradeData.upperQuartileGrade == 0)) {
			html += '<tr style="color: rgb(20,120,20)"><td>Grade [%]<strong></td>';
			html += '<td><strong>'+this.analysisData_.gradeData.avgGrade.toFixed(1);
			html += '<td><strong>'+this.analysisData_.gradeData.lowerQuartileGrade.toFixed(1)+'</strong></td>';
			html += '<td><strong>'+this.analysisData_.gradeData.medianGrade.toFixed(1)+'</strong></td>';
			html += '<td><strong>'+this.analysisData_.gradeData.upperQuartileGrade.toFixed(1)+'</strong></td>';
			html += '<td><strong>'+this.analysisData_.gradeData.minGrade.toFixed(1)+" / "+this.analysisData_.gradeData.maxGrade.toFixed(1)+'</strong></td></tr>';

			html += '<tr style="color: rgb(20,120,20)"><td><strong>'+this.analysisData_.gradeData.gradeProfile+'</strong><br>';
			html += '<font style="font-size:10px">';
			html += this.analysisData_.gradeData.minAlt.toFixed(0)+'-'+this.analysisData_.gradeData.maxAlt.toFixed(0)+' ['+(this.analysisData_.gradeData.maxAlt-this.analysisData_.gradeData.minAlt).toFixed(0)+'m]';
			html += '</font></td>';
			html += '<td>moving %<br>Dist. / Time</td>';
			html += '<td>DH<br>'
				+(this.analysisData_.gradeData.upFlatDownInMeters.down / this.analysisData_.gradeData.upFlatDownInMeters.total * 100).toFixed(0)
				+' / '+(this.analysisData_.gradeData.upFlatDownInSeconds.down / this.analysisData_.gradeData.upFlatDownInSeconds.total * 100).toFixed(0)+'</td>';
			html += '<td>FLAT<br>'
				+(this.analysisData_.gradeData.upFlatDownInMeters.flat / this.analysisData_.gradeData.upFlatDownInMeters.total * 100).toFixed(0)
				+' / '+(this.analysisData_.gradeData.upFlatDownInSeconds.flat / this.analysisData_.gradeData.upFlatDownInSeconds.total * 100).toFixed(0)+'</td>';
			html += '<td>UP<br>'
				+(this.analysisData_.gradeData.upFlatDownInMeters.up / this.analysisData_.gradeData.upFlatDownInMeters.total * 100).toFixed(0)
				+' / '+(this.analysisData_.gradeData.upFlatDownInSeconds.up / this.analysisData_.gradeData.upFlatDownInSeconds.total * 100).toFixed(0)+'</td>';
			html += '<td>avgGradeUP<br>'+this.analysisData_.gradeData.upAvgGradeEstimate.toFixed(1)+'% (est.)</td></tr>';
		};

		html += '</table></a></div>';


		// if there are no other athletes on this activity, remove Strava's flybys link,
		// as it is already present in remote views and only "eats-up" a lot of page space in this case
		if ($('.other-athletes').length==0) {
			$('.flybys').remove();
	 		$('.others-section').css({'padding-top': '0px'});
		} else {	// if there are other athletes, make a line between them and statistics table
		 	$('.others-section').css({'border-bottom': '1px solid', color:'#eee','padding-top': '0px'});
		};


		// insert statistics table
		$('.others-section').first().after(html).each(function() {


		$('#extendedStatsButton').click(function() {

			$.fancybox({
				'autoSize' : false,
				'fitToView'	: true,
				'maxWidth'	: 1150,
				'width': '100%',
				'height': '100%',
				'autoScale': true,
				'transitionIn': 'fade',
				'transitionOut': 'fade',
				'type': 'iframe',
				'content': '<div class="stravistiXExtendedData">' + this.content + '</div>'
			});

			// For each view start making the assossiated graphs
			_.each(this.dataViews, function(view) {
				view.displayGraph();
			}.bind(this));

		}.bind(this));

		if (buttonAdded) buttonAdded();

		}.bind(this));
        },	//placeExtendedStatsButton





        makeSummaryGrid: function(columns, rows) {
       	if (env.debugMode) console.log("Execute makeSummaryGrid");

            var summaryGrid = '';
            summaryGrid += '<div>';
            summaryGrid += '<div class="summaryGrid">';
            summaryGrid += '<table>';

            for (var i = 0; i < rows; i++) {
                summaryGrid += '<tr>';
                for (var j = 0; j < columns; j++) {
                    summaryGrid += '<td data-column="' + j + '" data-row="' + i + '">';
                    summaryGrid += '</td>';
                }
                summaryGrid += '</tr>';
            }
            summaryGrid += '</table>';
            summaryGrid += '</div>';
            summaryGrid += '</div>';
            this.summaryGrid = $(summaryGrid);
        },

        insertContentAtGridPosition: function(columnId, rowId, data, title, units, userSettingKey) {
       	if (env.debugMode) console.log("Execute insertContentAtGridPosition ("+title+")");

            var onClickHtmlBehaviour = "onclick='javascript:window.open(\"" + this.appResources_.settingsLink + "#/commonSettings?viewOptionHelperId=" + userSettingKey + "\",\"_blank\");'";

            if (this.summaryGrid) {
                var content = '<span class="summaryGridDataContainer" ' + onClickHtmlBehaviour + '>' + data + ' <span class="summaryGridUnits">' + units + '</span><br /><span class="summaryGridTitle">' + title + '</span></span>';
                this.summaryGrid.find('[data-column=' + columnId + '][data-row=' + rowId + ']').html(content);
            } else {
                console.error('Grid is not initialized');
            }
        },

        insertContentSummaryGridContent: function() {
       	if (env.debugMode) console.log("Execute insertContentSummaryGridContent");
/*
            // Insert summary data
            var moveRatio = '-';
            if (this.analysisData_.moveRatio && this.userSettings_.displayActivityRatio) {
                moveRatio = this.analysisData_.moveRatio.toFixed(2);
            }
            this.insertContentAtGridPosition(0, 0, moveRatio, 'Move Ratio', '', 'displayActivityRatio');
*/
            // ...
/*
            var TRIMP = activityHeartRateReserve = '-';
            var activityHeartRateReserveUnit = '%';
            if (this.analysisData_.heartRateData && this.userSettings_.displayAdvancedHrData) {
                TRIMP = this.analysisData_.heartRateData.TRIMP.toFixed(0) + ' <span class="summarySubGridTitle">(' + this.analysisData_.heartRateData.TRIMPPerHour.toFixed(0) + ' / hour)</span>';
                activityHeartRateReserve = this.analysisData_.heartRateData.activityHeartRateReserve.toFixed(0);
                activityHeartRateReserveUnit = '%  <span class="summarySubGridTitle">(Max: ' + this.analysisData_.heartRateData.activityHeartRateReserveMax.toFixed(0) + '% @ ' + this.analysisData_.heartRateData.maxHeartRate + 'bpm)</span>';
            }
            this.insertContentAtGridPosition(0, 1, TRIMP, 'TRaining IMPulse', '', 'displayAdvancedHrData');
            this.insertContentAtGridPosition(1, 1, activityHeartRateReserve, 'Heart Rate Reserve Avg', activityHeartRateReserveUnit, 'displayAdvancedHrData');
*/
            // ...
            var climbTime = '-';
            var climbTimeExtra = '';
            if (this.analysisData_.gradeData && this.userSettings_.displayAdvancedGradeData) {
                climbTime = Helper.secondsToHHMMSS(this.analysisData_.gradeData.upFlatDownInSeconds.up);
                climbTimeExtra = '<span class="summarySubGridTitle">(' + (this.analysisData_.gradeData.upFlatDownInSeconds.up / this.analysisData_.gradeData.upFlatDownInSeconds.total * 100).toFixed(0) + '% of time)</span>';
            }

            if (climbTime != '-') this.insertContentAtGridPosition(0, 0, climbTime, 'Time climbing', climbTimeExtra, 'displayAdvancedGradeData');

        },





        /**
         * Affect default view needed
         */
        setDataViewsNeeded: function() {
       	if (env.debugMode) console.log("Execute setDataViewsNeeded");

            // By default we have... If data exist of course...

            // Featured view
            if (this.analysisData_) {
                var featuredDataView = new FeaturedDataView(this.analysisData_, this.userSettings_, this.basicInfos);
                featuredDataView.setAppResources(this.appResources_);
                featuredDataView.setIsAuthorOfViewedActivity(this.isAuthorOfViewedActivity);
                this.dataViews.push(featuredDataView);
            }

            // Heart view
            if (this.analysisData_.heartRateData && this.userSettings_.displayAdvancedHrData) {
                var heartRateDataView = new HeartRateDataView(this.analysisData_.heartRateData, 'hrr', this.userSettings_);
                heartRateDataView.setAppResources(this.appResources_);
                heartRateDataView.setIsAuthorOfViewedActivity(this.isAuthorOfViewedActivity);
                this.dataViews.push(heartRateDataView);
            }
        },
        
        getSpeedUnitData: function() {
            var measurementPreference = currentAthlete.get('measurement_preference');
            var units = (measurementPreference == 'meters') ? 'km' : 'mi';
            var speedUnitPerhour = (measurementPreference == 'meters') ? 'km/h' : 'mi/h';
            var speedUnitFactor = (speedUnitPerhour == 'km/h') ? 1 : 0.62137;
            return [speedUnitPerhour, speedUnitFactor, units];
        },
    }
});
