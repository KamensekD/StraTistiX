/**
 *   Contructor
 */
function VacuumProcessor() {

}

VacuumProcessor.movingThresholdKph = 3.5; // Kph
//VacuumProcessor.movingThresholdKph = 2.5; // Kph

/**
 * Define prototype
 */
VacuumProcessor.prototype = {

    /**
     *  Get the strava athlete id connected
     *  @returns the strava athlete id
     */
    getAthleteId: function getAthleteId() {

        var athleteId = null;
        try {
            if (!_.isUndefined(currentAthlete) && !_.isUndefined(currentAthlete.id)) {
                athleteId = currentAthlete.id;
            }
        } catch (err) {
            if (env.debugMode) console.warn(err);
        }

        return athleteId;
    },



    /**
     *  Get the strava athlete name connected
     *  @returns the strava athlete id
     */
    getAthleteName: function getAthleteName() {
        var athleteName = null;
        try {
            if (!_.isUndefined(currentAthlete) && !_.isUndefined(currentAthlete.get('display_name'))) {
                athleteName = currentAthlete.get('display_name');
            }
        } catch (err) {
            if (env.debugMode) console.warn(err);
        }

        return athleteName;
    },



    /**
     *  Get the strava athlete id connected
     *  @returns the strava athlete id
     */
    getAthleteIdAuthorOfActivity: function getAthleteId() {

        if (_.isUndefined(window.pageView)) {
            return null;
        }

        if (!window.pageView.activityAthlete()) {
            return null;
        }

        if (_.isUndefined(window.pageView.activityAthlete().get('id'))) {
            return null;
        }

        return window.pageView.activityAthlete().get('id');
    },



    /**
     *  Get the strava athlete premium status
     *  @returns premium status
     */
    getPremiumStatus: function getPremiumStatus() {

        var premiumStatus = null;
        try {
            if (!_.isUndefined(currentAthlete)) {
                premiumStatus = currentAthlete.attributes.premium;
            }
        } catch (err) {
            if (env.debugMode) console.warn(err);
        }

        return premiumStatus;
    },



    /**
     *  Get the strava athlete pro status
     *  @returns the strava pro athlete id
     */
    getProStatus: function getProStatus() {

        var proStatus = null;

        try {

            if (!_.isUndefined(currentAthlete)) {

                if (!_.isUndefined(currentAthlete.attributes.pro)) {

                    proStatus = currentAthlete.attributes.pro;

                } else {
                    return null;
                }

            }
        } catch (err) {
            if (env.debugMode) console.warn(err);
        }

        return proStatus;
    },



    /**
     *  ...
     *  @returns ...
     */
    getActivityId: function getActivityId() {
        return (_.isUndefined(window.pageView)) ? null : pageView.activity().id;
    },



    /**
     *  ...
     *  @returns ...
     */
    getActivityName: function getActivityName() {

        var actStatsContainer = $(".activity-summary-container");

        // Get Activity Name
// without var -> global scope (window.activityName)
        activityName = actStatsContainer.find('.marginless.activity-name').text();
//        var activityName = actStatsContainer.find('.marginless.activity-name').text();
        return activityName;
    },



    /**
     *  ...
     *  @returns ...
     */
    getActivityTime: function getActivityTime() {

        var actStatsContainer = $(".activity-summary-container");

        // Get Activity Time
// without var -> global scope (window.activityTime)
        activityTime = actStatsContainer.find('time').text();
//        var activityTime = actStatsContainer.find('time').text();
        return activityTime;
    },



    /**
     *  ...
     *  @returns ...
     */
    getAthleteWeight: function getAthleteWeight() {
        return (_.isUndefined(window.pageView)) ? null : pageView.activityAthleteWeight();
    },





    /**
     * @returns Common activity stats given by Strava throught right panel
     */
    getActivityCommonStats: function getActivityStats(activityStream) {

        var actStatsContainer = $(".activity-summary-container");



        // Get Distance
// without var -> global scope (window.distance)
        distance = this.formatActivityDataValue_(
//        var distance = this.formatActivityDataValue_(
            actStatsContainer.find('.inline-stats.section').children().first().text(),
            false, false, true, false);



// Elapsed and Moving time

        // Get Elapsed Time
// without var -> global scope (window.elapsedTime)
        elapsedTime = this.formatActivityDataValue_(
//        var elapsedTime = this.formatActivityDataValue_(
//            $('[data-glossary-term*=definition-elapsed-time]').parent().parent().children().last().text(),	// bugfix
            $('[data-glossary-term*=definition-elapsed-time]').parent().next().text()
            , true, false, false, false);

        if (isNaN(elapsedTime)) {
//					console.warn("Can't get elapsed time - probably 'race'");
				// if 'race' elapsed and moving time are swapped on Strava overview screen
        // Get Elapsed Time
// without var -> global scope (window.elapsedTime)
        elapsedTime = this.formatActivityDataValue_(
//        var elapsedTime = this.formatActivityDataValue_(
            $('[data-glossary-term*=definition-elapsed-time]').parent().first().prev().text()
            , true, false, false, false);

// without var -> global scope (window.movingTime)
        movingTime = this.formatActivityDataValue_(
//        var movingTime = this.formatActivityDataValue_(
            $('[data-glossary-term*=definition-moving-time]').parent().next().text()
            , true, false, false, false);
	      } else
	      {
        // Get Moving Time
// without var -> global scope (window.movingTime)
        movingTime = this.formatActivityDataValue_(
//        var movingTime = this.formatActivityDataValue_(
            $('[data-glossary-term*=definition-moving-time]').parent().first().prev().text()
            , true, false, false, false);
				}



        // Get Elevation
		switch (window.activityType) {
      case 'Ride':
        var elevation = this.formatActivityDataValue_(
            actStatsContainer.find('.inline-stats.section').children().first().next().next().text(),
            false, true, false, false);
				break;
    	case 'Run':
     		var elevation = this.formatActivityDataValue_(
          	$('[class*="section more-stats"]').children().children().first().next().text(),
//          var test = $('[class*="section more-stats"]').children().children().first().next().text();
            false, false, false, false);
        break;
      default:
        break;
			}



        // Get Estimated Average Power
        var avgPower = this.formatActivityDataValue_(
            $('[data-glossary-term*=definition-average-power]').parent().parent().children().first().text(),
            false, false, false, false);

        var weightedPower = this.formatActivityDataValue_(
            $('[data-glossary-term*=definition-weighted-average-power]').parent().parent().children().first().text(),
            false, false, false, false);

        

        // Get Calories
		switch (window.activityType) {
      case 'Ride':
     		var calories = this.formatActivityDataValue_(
            actStatsContainer.find('.section.more-stats').find('.unstyled').children().first().next().next().children().first().next().next().children().first().next().text(),
        false, false, false, false);
				break;
    	case 'Run':
     		var calories = this.formatActivityDataValue_(
          	$('[class*="section more-stats"]').children().children().first().next().next().next().text(),
//          var test = $('[class*="section more-stats"]').children().children().first().next().next().next().text();
            false, false, false, false);
        break;
      default:
        break;
			}



        // Get Energy Output
        var energyOutput = this.formatActivityDataValue_(
            actStatsContainer.find('.inline-stats.section.secondary-stats').children().first().next().children().first().text(),
            false, false, false, true);



        // Get Average speed
		switch (window.activityType) {
      case 'Ride':
// without var -> global scope (window.averageSpeed)		// preveri pravilnost!
        averageSpeed = this.formatActivityDataValue_(
//        var averageSpeed = this.formatActivityDataValue_(
            actStatsContainer.find('.section.more-stats').find('.unstyled').children().first().next().children().first().children().first().next().text(),
            false, false, false, false);
				break;
    	case 'Run':
        break;
      default:
        break;
			}

        if (typeof averageSpeed == 'undefined') {
            averageSpeed = this.formatActivityDataValue_(			// If no average speed availabe, try to get pace instead and transform to speed
                $('[class*="inline-stats section"]').children().first().next().next().children().text()
//                $('[data-glossary-term*=definition-moving-time]').parent().parent().first().next().children().text()
                , true, false, false, false);
        		if (averageSpeed) {
            		averageSpeed = 1 / averageSpeed; // invert to km per seconds
            		averageSpeed = averageSpeed * 60 * 60; // We are in KPH here
        		}
				}

            var measurementPreference = currentAthlete.get('measurement_preference');
            var speedFactor = (measurementPreference == 'meters') ? 1 : 0.62137;
            averageSpeed = averageSpeed / speedFactor; // Always give PKH here



        // Get Average and Max Heartrate			*** done in ActivityProcesor.js
/*
		switch (window.activityType) {
			var maxHeartRate = ;
      case 'Ride':
      case 'StationaryOther':
     		var averageHeartRate = this.formatActivityDataValue_(
            actStatsContainer.find('.section.more-stats').find('.unstyled').children().first().next().next().children().first().children().first().next().has('abbr').text(),
            false, false, false, false);
//        var maxHeartRate = this.formatActivityDataValue_(
//            actStatsContainer.find('.section.more-stats').find('.unstyled').children().first().next().next().children().first().children().first().next().next().text(),
//            false, false, false, false);
				break;
    	case 'Run':
     		var averageHeartRate = this.formatActivityDataValue_(
          $('[class*=gap]').next().text(),
//          var test =  $('[class*=gap]').next().text();
            false, false, false, false);
        break;
      default:
        break;
			}
*/


        if (typeof elevation !== 'undefined') {
        	var altitude_smooth = this.smoothAltitude_(activityStream, elevation);
        }

        // Create activityData Map
        return {
            'distance': distance,
            'movingTime': movingTime,
            'elevation': elevation,
            'avgPower': avgPower,
            'weightedPower': weightedPower,
            'energyOutput': energyOutput,
            'calories': calories,
            'elapsedTime': elapsedTime,
            'averageSpeed': averageSpeed,
//            'averageHeartRate': averageHeartRate,	// calculated in ActivityProcessor.js
//            'maxHeartRate': maxHeartRate					// calculated in ActivityProcessor.js
            'altitude_smooth': altitude_smooth,
        };
    },

    filterData_: function(data, distance, smoothing) {
        // http://phrogz.net/js/framerate-independent-low-pass-filter.html
        if (data && distance) {
            var result = [];
            result[0] = data[0];
            for (i = 1, max = data.length; i < max; i++) {
                if (smoothing === 0) {
                    result[i] = data[i];
                } else {
                    result[i] = result[i-1] + (distance[i] - distance[i-1]) * (data[i] - result[i-1]) / smoothing;
                }
            }
            return result;
        }
    },

    smoothAltitude_: function smoothAltitude(activityStream, stravaElevation) {
        var activityAltitudeArray = activityStream.altitude;
        var distanceArray = activityStream.distance;
        var velocityArray = activityStream.velocity_smooth;
        var smoothingL = 10;
        var smoothingH = 600;
        var smoothing;
        var altitudeArray; 
        while (smoothingH - smoothingL >= 1) {
            smoothing = smoothingL + (smoothingH - smoothingL) / 2;
            altitudeArray = this.filterData_(activityAltitudeArray, distanceArray, smoothing);
            var totalElevation = 0;
            for (var i = 0; i < altitudeArray.length; i++) { // Loop on samples
                if (i > 0 && velocityArray[i] * 3.6 > VacuumProcessor.movingThresholdKph) {
                    var elevationDiff = altitudeArray[i] - altitudeArray[i - 1];
                    if (elevationDiff > 0) {
                        totalElevation += elevationDiff;
                    }
                }
            }
            
			if (env.debugMode) console.log("VacuumProcessor: Altitude smoothing factor:" + smoothing + "   Strava Elevation:" + stravaElevation + "   Smoothed Elevation:" + totalElevation);
            if (totalElevation < stravaElevation) {
                smoothingH = smoothing;
            } else {
                smoothingL = smoothing;
            }
        }
        return altitudeArray;
    },

    /**
     *
     */
    formatActivityDataValue_: function formatActivityDataValue_(dataIn, parsingTime, parsingElevation, parsingDistance, parsingEnergy) {


        if (dataIn == "") {
            return null;
        }


        // Common clean
        var cleanData = dataIn.replace('/100mPace', '');  // remove /100mPace (for Swim Pace)
        cleanData = cleanData.replace('/', '');					// remove slash     (for Pace /km)
        cleanData = cleanData.replace(/\s/g, '').trim('string');
        cleanData = cleanData.replace(/[\n\r]/g, '');


				if (parsingDistance && (cleanData.indexOf("m") != -1)) {	// ce je m
        	if (cleanData.indexOf("km") == -1) { // ce ni km je m
	        	cleanData = cleanData.replace(/([a-z]|[A-Z])+/g, '').trim();
        		cleanData = cleanData.replace(',','');
        		cleanData = cleanData/1000; 	// change to km
        	}
				} else {
	        cleanData = cleanData.replace(/([a-z]|[A-Z])+/g, '').trim();
				}


        if (parsingTime) {
            // Remove text from date, format time to hh:mm:ss
            cleanData = Helper.HHMMSStoSeconds(cleanData);
        } else if (parsingElevation) {
            cleanData = cleanData.replace(' ', '').replace(',', '');
        } else if (parsingDistance) {
            if (typeof cleanData == 'string') cleanData = cleanData.replace(',', '.');
        } else if (parsingEnergy) {
            cleanData = cleanData.replace(',', '.').replace('.', '');
        } else {
            cleanData = cleanData.replace(',', '.');
        }
        return parseFloat(cleanData);
    },



    /**
     * @returns activity streams in callback
     */
    getActivityStream: function getActivityStream(callback) {

//        var url = "/activities/" + this.getActivityId() + "/streams?stream_types[]=watts_calc&stream_types[]=watts&stream_types[]=velocity_smooth&stream_types[]=time&stream_types[]=distance&stream_types[]=cadence&stream_types[]=heartrate&stream_types[]=grade_smooth&stream_types[]=altitude";
        var url = "/activities/" + this.getActivityId() + "/streams";  // get all available streams for activity
//        var url = "/activities/" + this.getActivityId() + "/streams?stream_types[]=watts_calc&stream_types[]=watts&stream_types[]=velocity_smooth&stream_types[]=time&stream_types[]=distance&stream_types[]=cadence&stream_types[]=heartrate&stream_types[]=grade_smooth&stream_types[]=altitude&stream_types[]=latlng";

        $.ajax(url).done(function(jsonResponse) {

            var hasPowerMeter = true;

/*
 var full_array=[{t:1,x:0,y:10},{t:2,x:10,y:11},{t:3,x:20,y:13},{t:4,x:30,y:12},{t:5,x:40,y:11}];
var simpl_array=simplify(full_array,0.1,1);
*/


	StravaStreams = jsonResponse;	// store original Strava streams JSON response in a global variable




            if (_.isEmpty(jsonResponse.watts)) {
                jsonResponse.watts = jsonResponse.watts_calc;
                hasPowerMeter = false;
            }

            callback(this.getActivityCommonStats(jsonResponse), jsonResponse, this.getAthleteWeight(), hasPowerMeter);

            jsonResponse = null; // Memory clean

        }.bind(this));
    },



    /**
     * @returns
     */
    getSegmentsFromBounds: function getSegmentsFromBounds(vectorA, vectorB, callback) {

        var segmentsUnify = {
            cycling: null,
            running: null
        };

        $.when(

            $.ajax({
                url: '/api/v3/segments/search',
                data: {
                    bounds: vectorA + ',' + vectorB,
                    min_cat: '0',
                    max_cat: '5',
                    activity_type: 'cycling'
                },
                type: 'GET',
                crossDomain: true, // enable this
                dataType: 'jsonp',
                success: function(xhrResponseText) {
                    segmentsUnify.cycling = xhrResponseText;
                },
                error: function(err) {
                    console.error(err);
                }
            }),

            $.ajax({
                url: '/api/v3/segments/search',
                data: {
                    bounds: vectorA + ',' + vectorB,
                    min_cat: '0',
                    max_cat: '5',
                    activity_type: 'running'
                },
                type: 'GET',
                crossDomain: true, // enable this
                dataType: 'jsonp',
                success: function(xhrResponseText) {
                    segmentsUnify.running = xhrResponseText;
                },
                error: function(err) {
                    console.error(err);
                }
            })

        ).then(function() {
            callback(segmentsUnify);
        });

    },



    /**
     * @returns
     */
    getSegmentStream: function getSegmentStream(segmentId, callback) {

        $.ajax({
            url: '/stream/segments/' + segmentId,
            type: 'GET',
            success: function(xhrResponseText) {
                callback(xhrResponseText);
            },
            error: function(err) {
                console.error(err);
            }
        });
    },



    /**
     * @returns Array of bikes/odo
     */
    getBikeOdoOfAthlete: function(athleteId, callback) {

        if (_.isUndefined(window.pageView)) {
            callback(null);
            return;
        }

        if (pageView.activity().attributes.type != "Ride") {
            callback(null);
            return;
        }

        var url = location.protocol + "//www.strava.com/athletes/" + athleteId;

        $.ajax(url).always(function(data) {

            var bikeOdoArray = {};
            _.each($(data.responseText).find('div.gear>table>tbody>tr'), function(element) {
                var bikeName = $(element).find('td').first().text().trim();
                var bikeOdo = $(element).find('td').last().text().trim().replace(/\.[0-9]/,'');
                bikeOdoArray[btoa(unescape(encodeURIComponent(bikeName)))] = bikeOdo;
            });

            callback(bikeOdoArray);
        });
    },

    getActivityTime: function getActivityTime() {
        var activityTime = $(".activity-summary-container").find('time').text().trim();
        return (activityTime) ? activityTime : null;
    },

    getActivityName: function getActivityName() {
        var activityName = $(".activity-summary-container").find('.marginless.activity-name').text().trim();
        return (activityName) ? activityName : null;
    },
};
