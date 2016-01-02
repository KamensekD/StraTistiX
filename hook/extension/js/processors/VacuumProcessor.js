if (env.debugMode) console.warn('Begin     VacuumProcessor.js');
/**
 *   Contructor
 */

function VacuumProcessor() {
}



VacuumProcessor.cachePrefix = 'StraTistiX_activityStream_';



/**
 * Define prototype
 */
VacuumProcessor.prototype = {





    /**
     *  Get the strava athlete id connected
     *  @returns the strava athlete id
     */
    getAthleteId: function getAthleteId() {
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
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
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
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
    getAthleteIdAuthorOfActivity: function getAthleteIdAuthorOfActivity() {
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );

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
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );

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
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );

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
     *  @returns ActivityId
     */
    getActivityId: function getActivityId() {
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
        return (_.isUndefined(window.pageView)) ? null : pageView.activity().id;
    },



    /**
     *  ...
     *  @returns ActivityName
     */
    getActivityName: function getActivityName() {
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );

        var actStatsContainer = $(".activity-summary-container");

        // Get Activity Name
// without var -> global scope (window.activityName)
        activityName = actStatsContainer.find('.marginless.activity-name').text();
//        var activityName = actStatsContainer.find('.marginless.activity-name').text();
        return activityName;
    },



    /**
     *  ...
     *  @returns ActivityTime
     */
    getActivityTime: function getActivityTime() {
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );

        var actStatsContainer = $(".activity-summary-container");

        // Get Activity Time
// without var -> global scope (window.activityTime)
        activityTime = actStatsContainer.find('time').text();
//        var activityTime = actStatsContainer.find('time').text();
        return activityTime;
    },










    /**
     *  ...
     *  @returns AthleteWeight
     */
    getAthleteWeight: function getAthleteWeight() {
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
        return (_.isUndefined(window.pageView)) ? null : pageView.activityAthleteWeight();
    },










    /**
     * @returns Common activity stats given by Strava throught right panel
     */
    getActivityCommonStats: function getActivityStats() {
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );

        var actStatsContainer = $(".activity-summary-container");



        // Get Distance
// without var -> global scope (window.distance)
        distance = this.formatActivityDataValue_(
//        var distance = this.formatActivityDataValue_(
            actStatsContainer.find('.inline-stats.section').children().first().text(),
            false, false, true, false);



// Elapsed and Moving time


        // Get Moving Time
        movingTime = this.formatActivityDataValue_(
            actStatsContainer.find('.inline-stats.section').children().first().next().text(),
            true, false, false, false);

        // Get Elapsed Time
        elapsedTime = this.formatActivityDataValue_(
            $('[data-glossary-term*=definition-elapsed-time]').parent().parent().children().last().text(),
            true, false, false, false);

        // Try to get it another way. (Running races)
        if (!elapsedTime) {
            elapsedTime = this.formatActivityDataValue_(
                $('.section.more-stats').children().last().text(),
                true, false, false, false);
        }

        // Invert movingTime and elapsedTime. Theses values seems to be inverted in running races (https://www.strava.com/activities/391338398)
        if (elapsedTime - movingTime < 0) {
            var elapsedTimeCopy = elapsedTime;
            elapsedTime = movingTime;
            movingTime = elapsedTimeCopy;
        }



/*  old code

        // Get Elapsed Time
// without var -> global scope (window.elapsedTime)
        var elapsedTimeRaw=$('[data-glossary-term*=definition-elapsed-time]').parent().next().text();

//        var elapsedTime = this.formatActivityDataValue_(
//            $('[data-glossary-term*=definition-elapsed-time]').parent().parent().children().last().text(),	// bugfix

		if (elapsedTimeRaw.length<11) elapsedTime = this.formatActivityDataValue_(   elapsedTimeRaw   , true, false, false, false);

// elapsedTimeRaw=$('[data-glossary-term*=definition-elapsed-time]').parent().next().text()
// if (elapsedTimeRaw.length<11) elapsedTime = VacuumProcessor.prototype.formatActivityDataValue_(   elapsedTimeRaw   , true, false, false, false);

        if (isNaN(elapsedTime)) {
if (env.debugMode) console.warn("Can't get elapsed time - probably 'race'");
		// if 'race' elapsed and moving time are swapped on Strava overview screen
        // Get Elapsed Time
        elapsedTime = this.formatActivityDataValue_(
            $('[data-glossary-term*=definition-elapsed-time]').parent().first().prev().text()
            , true, false, false, false);

        movingTime = this.formatActivityDataValue_(
            $('[data-glossary-term*=definition-moving-time]').parent().next().text()
            , true, false, false, false);
	      } else
	      {
        // Get Moving Time
        movingTime = this.formatActivityDataValue_(
            $('[data-glossary-term*=definition-moving-time]').parent().first().next().text()
            , true, false, false, false);
				}

*/


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

        if (typeof averageSpeed === 'undefined') {
if (env.debugMode) console.warn("Can't get average speed... tryin' to get pace");
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



        // Create activityData Map ( ActivityStatsMap )
        return {
            'distance': distance,
            'movingTime': movingTime,
            'elevation': elevation,
            'avgPower': avgPower,
            'weightedPower': weightedPower,
            'energyOutput': energyOutput,
            'calories': calories,
            'elapsedTime': elapsedTime,
            'averageSpeed': averageSpeed
//            'averageHeartRate': averageHeartRate,	// calculated in ActivityProcessor.js
//            'maxHeartRate': maxHeartRate			// calculated in ActivityProcessor.js
//            'altitude_smooth': altitude_smooth,	// calculated in ActivityProcessor.js
        };
    },













    /**
     * @returns formated/cleaned activity data
     */
    formatActivityDataValue_: function formatActivityDataValue_(dataIn, parsingTime, parsingElevation, parsingDistance, parsingEnergy) {
//if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
env.debugMode>1   && console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );


        if (dataIn == "") {
            return null;
        }


        // Common clean
        var cleanData = dataIn.replace('/100mPace', '');  // remove /100mPace (for Swim Pace)
        cleanData = cleanData.replace('/', '');					// remove slash     (for Pace /km)
        cleanData = cleanData.replace(/\s/g, '').trim('string');
        cleanData = cleanData.replace(/[\n\r]/g, '');

/*
       var cleanData = dataIn.toLowerCase();
        cleanData = cleanData.replace(new RegExp(/\s/g), '');
        cleanData = cleanData.replace(new RegExp(/[aáâaäa]/g), '');
        cleanData = cleanData.replace(new RegExp(/a/g), '');
        cleanData = cleanData.replace(new RegExp(/ç/g), '');
        cleanData = cleanData.replace(new RegExp(/[eéeë]/g), '');
        cleanData = cleanData.replace(new RegExp(/[iíîi]/g), '');
        cleanData = cleanData.replace(new RegExp(/n/g), '');
        cleanData = cleanData.replace(new RegExp(/[oóôoö]/g), '');
        cleanData = cleanData.replace(new RegExp(/o/g), "o");
        cleanData = cleanData.replace(new RegExp(/[uúuü]/g), '');
        cleanData = cleanData.replace(new RegExp(/[ýy]/g), '');
        cleanData = cleanData.replace(/\s/g, '').trim('string');
        cleanData = cleanData.replace(/[\n\r]/g, '');
        cleanData = cleanData.replace(/([a-z]|[A-Z])+/g, '').trim();
*/


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





	//------------------------------------------------------
    /**
     * @returns activity streams in callback
     */
    getActivityStream: function getActivityStream(callback) {
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );

if (env.debugMode) console.log('>>>(f: VacuumProcessor.js) >   Try to read  -Activity '+this.getActivityId()+' Streams-  from cache/sessionStorage (' + arguments.callee.toString().match(/function ([^\(]+)/)[1] + ')' )
      var cache = sessionStorage.getItem(VacuumProcessor.cachePrefix + this.getActivityId());
      if (cache) {
if (env.debugMode) console.error('...   FOUND in cache - using cached Activity Streams   ...' );


            cache = JSON.parse(cache);
            StravaStreams=cache.stream;								// set StravaStreams from cache
//            StravaActivityCommonStats=cache.activityCommonStats;	// set StravaActivityCommonStats from cache
//            callback(cache.activityCommonStats, cache.stream, cache.athleteWeight, cache.hasPowerMeter);
            callback( cache.activityCommonStats, cache.stream, cache.athleteWeight, cache.hasPowerMeter);
            return;
            

      } else {
if (env.debugMode) console.error('...   NOT in cache - getting Activity Streams from Strava   ...');
//      }


//        var url = "/activities/" + this.getActivityId() + "/streams?stream_types[]=watts_calc&stream_types[]=watts&stream_types[]=velocity_smooth&stream_types[]=time&stream_types[]=distance&stream_types[]=cadence&stream_types[]=heartrate&stream_types[]=grade_smooth&stream_types[]=altitude&stream_types[]=latlng";
        var url = "/activities/" + this.getActivityId() + "/streams";  // get all available streams for activity

        $.ajax(url).done( function ajax_done (jsonResponse) {

            var hasPowerMeter = true;

            if (_.isEmpty(jsonResponse.watts)) {
                jsonResponse.watts = jsonResponse.watts_calc;
                hasPowerMeter = false;
            }

            try {
                // Save result to cache
if (env.debugMode) console.log('<<<(f: VacuumProcessor.js) >   Try to write  -Activity '+pageView.activityId()+' Streams-  to cache < ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );

            globalActivityStreams	= jsonResponse;						// set globalActivityStreams
        	globalActivityStatsMap	= this.getActivityCommonStats();	// set globalActivityStatsMap

            	var result = {
                    activityCommonStats:	globalActivityStatsMap,
                    stream:				 	globalActivityStreams,
                    athleteWeight: 			this.getAthleteWeight(),
                    hasPowerMeter: 			hasPowerMeter
                };

            	var result1 = { // only for debug console.log
                    activityCommonStats: 	globalActivityStatsMap,
                    stream: 				"...Activity Streams...",
                    athleteWeight: 			this.getAthleteWeight(),
                    hasPowerMeter: 			hasPowerMeter
                };


			//
			// write streams to cache here
			//


                sessionStorage.setItem(VacuumProcessor.cachePrefix + this.getActivityId(), JSON.stringify(result));
if (env.debugMode) console.log('   > Written streams to cache/sessionstorage' );
if (env.debugMode) console.log("\nWritten streams to cache/sessionstorage: " + VacuumProcessor.cachePrefix + this.getActivityId() + "\n\n" + JSON.stringify(result1) + "\n\n\n");
				result=null; result1=null// Memory clean
            } catch (err) {
                console.warn(err);
                sessionStorage.clear();
            }


/*
 var full_array=[{t:1,x:0,y:10},{t:2,x:10,y:11},{t:3,x:20,y:13},{t:4,x:30,y:12},{t:5,x:40,y:11}];
var simpl_array=simplify(full_array,0.1,1);
*/


	StravaStreams = jsonResponse;	// store original Strava streams JSON response in a global variable


            callback( globalActivityStatsMap, globalActivityStreams, this.getAthleteWeight(), hasPowerMeter );
            jsonResponse = null; // Memory clean
        }.bind(this) ); // ajax
      }// if no cache
    },  //function getActivityStream
	//------------------------------------------------------





    /**
     * @returns Segments in callback
     */
    getSegmentsFromBounds: function getSegmentsFromBounds(vectorA, vectorB, callback) {
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );

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
     * @returns Strava Segment Stream in callback
     */
    getSegmentStream: function getSegmentStream(segmentId, callback) {
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );

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
     * @returns Array of bikes/odo in callback
     */
    getBikeOdoOfAthlete: function getBikeOdoOfAthlete(athleteId, callback) {
if (env.debugMode) console.log(' > (f: VacuumProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );

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





}; // prototype



if (env.debugMode) console.warn('End       VacuumProcessor.js');
