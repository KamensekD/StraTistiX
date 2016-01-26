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
		var html = '<div style="font-size: 15px; padding: 10px 0px 10px 0px; border-bottom: 0px; margin-bottom:4px;" id="histats">';

		if (this.analysisData_.heartRateData != null) {
			HRnote = "\n\n* Depends heavily on appropriate user MaxHR ("+this.analysisData_.heartRateData.MaxHr+") and RestHR ("+this.analysisData_.heartRateData.RestHr+") settings!";
			RPEnote  = "aRPEe score - Average RPE (Rated Perceived Exertion) Estimate is a simple\nnumber and short description of how hard Your workout was for Your Heart\n";
			RPEnote1 = "\n   1\t[NIL]\tYou really consider THAT a Workout?!\n   2\t[R]\tRecovery\n   3\t[ER]\tEasy-Recovery\n   4\t[LM]\tLower Medium\n   5\t[M]\tMedium\n  5.5\t[UM]\tUpper Medium\n   6\t[H]\tHard\n   7\t[VH]\tVery Hard\n   8\t[EH]\tExtremely Hard\n   9\t[HaH]\tHard as Hell!\n   9+\t[DeaD]\tHave You really had survived THAT!?!";
			RPEnote2 = "\n** Might seem off for You, as RPE is very user perception dependent.";
			RPEnote3 = "\n*** aRPEe = TRIMP/hr / n   (for Men n=25, for Women n=20)\n\n-= (C) by Kamac - aRPEe concept and design by Dejan Kamensek, sLOVEnia =-";

			html += '<span style="color: #800 ;font-size: 18px;" title="HR based TRIMP (TRaining IMPulse)\nEstimation of TOTAL Training Load of the Workout'+HRnote+'">';
			html += ' TRIMP: <strong>'+this.analysisData_.heartRateData.TRIMP.toFixed(0)+'</strong></span>';

			html += '<span style="color: #800; font-size: 18px;" title="TRIMP/hour\nEstimation of Hourly AVERAGE Training Load of the Workout'+HRnote+'\n** Given the right HR settings, TRIMP/hr max for Men is 262 and for Women 204">';
			html += ' | <strong>'+this.analysisData_.heartRateData.TRIMPPerHour.toFixed(0)+'</strong>/hour';
			html += '&nbsp</span>';

			if (this.analysisData_.toughnessScore != null) {
				html += '<span style="font-size: 18px;" title="Toughness Score (TS)\nTS = sqrt( sqrt( elevation^2 * avgPower * avgSpeed^2 * distance^2 * moveRatio ) ) /20">&nbsp&nbspToughness Score: <strong>'+this.analysisData_.toughnessScore.toFixed(0)+'</strong></span>';
			}
									 	
			$('.inline-stats.section').first().after(html);
		};



		if (this.analysisData_.heartRateData != null) {

			// prepare aRPEe gauge
			html = '<div id="RPE" style="margin-bottom:2px;" title="'+RPEnote+RPEnote1+HRnote+RPEnote2+RPEnote3+'">';
			html += '<div id="RPEgauge"><div id="RPEgauge1"><div id="RPEtxt"></div></div></div><div id="RPElin"></div></div><font size=-3></font>';
			html += '<style>';
			html += '#RPE {height: 6px;position: relative;padding: 0px;border: 2px solid #333;background: linear-gradient(to right, #77E, green, yellow, orange, #F00, #C00, #900);border-radius: 2px;box-shadow: 1px 1px 1px #888;}';
			html += '#RPEgauge {position: relative;top: -4px;width: 0px;height: 0px;border-left: 0px solid transparent;border-right: 10px solid transparent;border-top: 11px solid #633; box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.100);}';
			html += '#RPEgauge1 {position: relative;top: -9px;width: 0px;height: 0px;border-left: 0px solid transparent;border-right: 4px solid transparent;border-top: 5px solid #EEE;}';
			html += '#RPEtxt {position: relative;left: 0px;top: -20Px; color: #000000;text-align:center;font-family: sans-serif;font-size: 9px;font-weight: bold;}';
			html += '#RPElin {height: 3px;position: relative;top: -6px;left: 1px;background: #F00;}';
			html += '</style>';

			// Add aRPEe to page
			var aRPEe=this.analysisData_.heartRateData.aRPEe;

//			html+= '<div style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">';
			html+= '<div style="padding-bottom: 5px;">';
			html+='<table style="margin:0px;" title="'+RPEnote+RPEnote1+HRnote+RPEnote2+RPEnote3+'"><tr><td width=50px style="padding:0px;">';
			html+='<img src="' + this.appResources_.aRPEeIcon + '" style="padding-top:4px"></td>';
			html+='<td style="padding:0px;"><font style="font-size: 14px; vertical-align: middle;">';
//			aRPEe=1;
			if (aRPEe >= 9.5){	html+='<font style="color: rgb(128,0,0);"[DeaD]</font> Have You really had survived THAT!?!';
			} else if (aRPEe >= 8.5) {	html+='<font style="color: rgb(128,0,0);">[HaH]</font> Hard as Hell!';
			} else if (aRPEe >= 7.5) {	html+='<font style="color: rgb(204,0,0);">[EH]</font> Extremely Hard';
			} else if (aRPEe >= 6.5) {	html+='<font style="color: rgb(255,0,0);">[VH]</font> Very Hard';
			} else if (aRPEe >= 5.8) {	html+='<font style="color: rgb(255,51,0);">[H]</font> Hard';
			} else if (aRPEe >= 5.3) {	html+='<font style="color: rgb(255,153,0);">[UM]</font> Upper Medium';
			} else if (aRPEe >= 4.5) {	html+='<font style="color: rgb(255,192,0);">[M\]</font> Medium';
			} else if (aRPEe >= 3.5) {	html+='<font style="color: rgb(200,200,0);">[LM]</font> Lower Medium';
			} else if (aRPEe >= 2.5) {	html+='<font style="color: rgb(146,208,80);">[ER]</font> Easy-Recovery';
			} else if (aRPEe >= 1.5) {	html+='<font style="color: rgb(0,176,80);">[R]</font> Recovery';
			} else {	html+='<font style="color: rgb(79,129,189);">[NIL]</font> You really consider THAT a Workout?!';
			}
                    
			html+='</font></strong></td></tr></table></div>';

			$('.inline-stats.section').first().next().after(html);


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
			html += '<tr style="color: rgb(231,125,222)"><td>Cadence</td>';
			html += '<td><strong>'+this.analysisData_.cadenceData.averageCadenceMoving.toFixed(1)+'</strong> rpm</td>';
			html += '<td><strong>'+this.analysisData_.cadenceData.lowerQuartileCadence.toFixed(1)+'</strong> rpm</td>';
			html += '<td><strong>'+this.analysisData_.cadenceData.medianCadence.toFixed(1)+'</strong> rpm</td>';
			html += '<td><strong>'+this.analysisData_.cadenceData.upperQuartileCadence.toFixed(1)+'</strong> rpm</td>';
			html += '<td><strong>'+this.analysisData_.cadenceData.maxCadence.toFixed(1)+'</strong> rpm</td></tr>';
		};

		if (this.analysisData_.gradeData != null ) {
//		if (this.analysisData_.gradeData != null && !(this.analysisData_.gradeData.lowerQuartileGrade == 0 && this.analysisData_.gradeData.upperQuartileGrade == 0)) {
			html += '<tr style="color: rgb(20,120,20)"><td>Grade<strong></td>';
			html += '<td><strong>'+this.analysisData_.gradeData.avgGrade.toFixed(1);
			html += '<td><strong>'+this.analysisData_.gradeData.lowerQuartileGrade.toFixed(1)+'</strong>%</td>';
			html += '<td><strong>'+this.analysisData_.gradeData.medianGrade.toFixed(1)+'</strong>%</td>';
			html += '<td><strong>'+this.analysisData_.gradeData.upperQuartileGrade.toFixed(1)+'</strong>%</td>';
			html += '<td><strong>'+this.analysisData_.gradeData.maxGrade.toFixed(1)+'</strong>%</td></tr>';

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
