if (env.debugMode) console.warn('Begin     ActivityProcessor.js');
/**
 *   Contructor
 */

function ActivityProcessor(vacuumProcessor, userHrrZones, zones) {
    this.vacuumProcessor_ = vacuumProcessor;
    this.userHrrZones_ = userHrrZones;
    this.zones = zones;
}



ActivityProcessor.cachePrefix = 'stravistix_activity_';



// *** PUT THIS STUFF IN CONFIGURABLE SETTINGS! ***
ActivityProcessor.movingThresholdKph    = 2.0;  // Kph          !!!   make this separate for biking and other activities   !!!
                                                // it has very BIG impact on calculation of flat/up/down times and because of that also on "word gradeProfile estimate"
                                                // since using altitude filtering, it is better, though
                                                // should use bigger threshold for worse GPS devices and could use lesser for best GPS devices
ActivityProcessor.cadenceThresholdRpm   = 30;   // RPMs
ActivityProcessor.cadenceLimitRpm       = 150;
ActivityProcessor.defaultBikeWeight     = 10;   // KGs
ActivityProcessor.gradeClimbingLimit    =  2.0; // thresholds for UP/DOWN vs FLAT   *** also used as treshold for VAM calculations
ActivityProcessor.gradeDownHillLimit    = -2.0; // for not very good GPS data, flat time can be underestimated if this setting too low

velocity_avgThreshold                   = 0.5;  // Kph - average velocity threshold to consider activity "stationary" aka "on trainer"

ActivityProcessor.gradeProfileDownhill_MinDownPercentD = 75;    // if at least 75% of distance is down
ActivityProcessor.gradeProfileDownhill = 'DOWNHILL';

ActivityProcessor.gradeProfileMostlyDown_MinDownPercentD = 50;  // if at least 50% of distance is down
ActivityProcessor.gradeProfileMostlyDown_MaxUpPercentD = 25;    // and at most 25% of distance is up
ActivityProcessor.gradeProfileMostlyDown = 'MOSTLY DOWN';

ActivityProcessor.gradeProfileFlat_MinFlatPercentT = 75;        // if at least 75% of time is flat
ActivityProcessor.gradeProfileFlat_MaxUpDownPercentD = 20;      // and up/down distance distance percentage is less then 20%
ActivityProcessor.gradeProfileFlat_MaxClimbed = 11;             // or total vertical meters climbed less then 11m
ActivityProcessor.gradeProfileFlat_MaxAvgGradeEst = 1.0;//1.5   // or average (estimated) grade of climbing% is less then 1.0%
ActivityProcessor.gradeProfileFlat = 'FLAT';

ActivityProcessor.gradeProfileMostlyFlat_MinFlatPercentT = 33;//50// if at least 33% of time is flat
ActivityProcessor.gradeProfileMostlyFlat_MaxAvgGradeEst = 3.3;//4%// and average (estimated) grade of climbing% is less then 3%
ActivityProcessor.gradeProfileMostlyFlat_MaxDeltaH = 222;       // and at most 222m difference of highest and lowest altitude
ActivityProcessor.gradeProfileMostlyFlat = 'MOSTLY FLAT';


ActivityProcessor.gradeProfileVeryHilly_MaxFlatPercentT = 50;   // less than 50% of time is flat
ActivityProcessor.gradeProfileVeryHilly_MinAvgGradeEst = 4.5;     // and average (estimated) grade of climbing% is more than 5%
ActivityProcessor.gradeProfileVeryHilly_MinDeltaH = 400;        // and at least 400m difference between highest and lowest altitude
ActivityProcessor.gradeProfileVeryHilly_MinClimbed = 500;//600  // and at least 600m vertical meters climbed
								// or AvgGradeEst >10% *** check
ActivityProcessor.gradeProfileVeryHilly = 'VERY HILLY';

ActivityProcessor.gradeProfileMountainous_MaxFlatPercentT = 60; // less than 60% of time is flat
ActivityProcessor.gradeProfileMountainous_MinAvgGradeEst = 5;   // and average (estimated) grade of climbing% is more than 5%
ActivityProcessor.gradeProfileMountainous_MinDeltaH = 600;      // and at least 600m difference between highest and lowest altitude
ActivityProcessor.gradeProfileMountainous_MinClimbed = 1000;//800// and at least 800m vertical meters climbed
ActivityProcessor.gradeProfileMountainous = 'MOUNTAINOUS';

ActivityProcessor.gradeProfileAlpine_MaxFlatPercentT = 50;      // less than 50% of time is flat
ActivityProcessor.gradeProfileAlpine_MinAvgGradeEst = 5.5;        // and average (estimated) grade of climbing% is more than 5%
ActivityProcessor.gradeProfileAlpine_MinDeltaH = 1500;          // and at least 1500m difference of highest and lowest altitude
ActivityProcessor.gradeProfileAlpine = 'ALPINE';

ActivityProcessor.gradeProfileHilly = 'HILLY';                  // All other scenarios - hilly


// !!!   try to lower MinClimbed figures, because these are not total climbed, but climbed @ at least "gradeClimbingLimit"   !!!


/**
 * Define prototype
 */
ActivityProcessor.prototype = {





    /**
     *
     */
    setActivityType: function setActivityType(activityType) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        this.activityType = activityType;
    },



    /**
     *
     */
    getAnalysisData: function getAnalysisData(activityId, userGender, userRestHr, userMaxHr, userFTP, callback) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        if (!this.activityType) {
            console.error('No activity type set for ActivityProcessor');
        }

        // Find in cache first is data exist
if (env.debugMode) console.log('--- (f: ActivityProcessor.js) >   Try to read  -Analysis Data-  from cache/localStorage (' + arguments.callee.toString().match(/function ([^\(]+)/)[1] + ')' )
        var cacheResult = JSON.parse(localStorage.getItem(ActivityProcessor.cachePrefix + activityId));
                if (cacheResult) {
if (env.debugMode) console.log('...   FOUND in cache - using cached Analysis Data   ...' );
                } else {
if (env.debugMode) console.log('...   NOT in cache - calculating Analysis Data   ...' );
                }

                
        if (!_.isNull(cacheResult) && env.useActivityStreamCache) {
if (env.debugMode) console.log("Using existing activity cache in non debug mode: " + JSON.stringify(cacheResult));
            callback(cacheResult);
            return;
        }

        userFTP = parseInt(userFTP);



        // Else no cache... then call VacuumProcessor for getting data, compute them and cache them

if (env.debugMode) console.warn('Executing   VacuumProcessor_.getActivityStream   from   ActivityProcessor.js');
        this.vacuumProcessor_.getActivityStream(function getActivityStream(activityStatsMap, activityStream, athleteWeight, hasPowerMeter) { // Get stream on page

            // Append altitude_smooth to fetched strava activity stream before compute analysis data on
            if (typeof activityStream.altitude !== 'undefined') {
                    activityStream.altitude_smooth = this.smoothAltitude_(activityStream, activityStatsMap.elevation);
                }

            var result = this.computeAnalysisData_(userGender, userRestHr, userMaxHr, userFTP, athleteWeight, hasPowerMeter, activityStatsMap, activityStream);


if (env.debugMode) console.log('--- (f: ActivityProcessor.js) >   Try to write  -Analysis Data-  to cache/localStorage (' + arguments.callee.toString().match(/function ([^\(]+)/)[1] + ')' )
            localStorage.setItem(ActivityProcessor.cachePrefix + activityId, JSON.stringify(result)); // Cache the result to local storage
if (env.debugMode) console.log("\nWritten to cache/localstorage: " + ActivityProcessor.cachePrefix + activityId + "\n\n" + JSON.stringify(result) + "\n\n\n");
            callback(result);

        }.bind(this));
    },



    /**
     *
     */
// =================================================================================================
    computeAnalysisData_: function computeAnalysisData_(userGender, userRestHr, userMaxHr, userFTP, athleteWeight, hasPowerMeter, activityStatsMap, activityStream) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )


//
// check if no velocity data or average velocity really low -> either activity without GPS or with GPS, but on same spot
//

    /**
     * calculate average velocity if whole activity, or set it to zero if no velocityArray
     */
        velocity_avg=0;
        if (!_.isEmpty(activityStream.velocity_smooth)) {
                var velocity_sum = 0;
                for( var i = 0; i < activityStream.velocity_smooth.length; i++ ) {
                velocity_sum += activityStream.velocity_smooth[i];
                }
        }// if we got velocity_sum, calculate velocity_avg, else set it to zero
        try {
                if (!_.isUndefined(velocity_sum) ) {
                        velocity_avg = velocity_sum/activityStream.velocity_smooth.length;
                }
        } catch (err) { }



        // Move ratio
        var moveRatio = this.moveRatio_(activityStatsMap, activityStream);

        // Toughness score
        var toughnessScore = this.toughnessScore_(activityStatsMap, activityStream, moveRatio);

        // Include speed and pace
        var moveData = [null, null];
        if (activityStream.velocity_smooth) {
            moveData = this.moveData_(activityStatsMap, activityStream.velocity_smooth, activityStream.time);
        }

        // Q1 Speed
        // Median Speed
        // Q3 Speed
        // Standard deviation Speed
//        if (moveData) var speedData = moveData[0];
        var speedData = (_.isEmpty(moveData)) ? null : moveData[0];

        // Q1 Pace
        // Median Pace
        // Q3 Pace
        // Standard deviation Pace
//        if (moveData) var paceData = moveData[1];
        var paceData = (_.isEmpty(moveData)) ? null : moveData[1];

        // Estimated Normalized power
        // Estimated Variability index
        // Estimated Intensity factor
        // Normalized Watt per Kg
        var powerData = this.powerData_(athleteWeight, hasPowerMeter, userFTP, activityStatsMap, activityStream.watts, activityStream.velocity_smooth, activityStream.time);

        // TRaining IMPulse
        // %HRR Avg
        // %HRR Zones
        // Q1 HR
        // Median HR
        // Q3 HR
        var heartRateData = this.heartRateData_(userGender, userRestHr, userMaxHr, activityStream.heartrate, activityStream.time, activityStream.velocity_smooth, activityStatsMap);

        // Cadence percentage
        // Time Cadence
        // Crank revolution
        var cadenceData = this.cadenceData_(activityStream.cadence, activityStream.velocity_smooth, activityStatsMap, activityStream.time);


        // Avg grade
        // Q1/Q2/Q3 grade
        var gradeData = this.gradeData_(activityStream.grade_smooth, activityStream.velocity_smooth, activityStream.time, activityStream.distance, activityStream.altitude_smooth);
//        var gradeData = this.gradeData_(activityStream.grade_smooth, activityStream.velocity_smooth, activityStream.time, activityStream.distance, activityStream.altitude);

        // Avg grade
        // Q1/Q2/Q3 grade
        var elevationData = this.elevationData_(activityStream, activityStatsMap);

        // Return an array with all that shit...
        return {
            'moveRatio': moveRatio,
            'toughnessScore': toughnessScore,
            'speedData': speedData,
            'paceData': paceData,
            'powerData': powerData,
            'heartRateData': heartRateData,
            'cadenceData': cadenceData,
            'gradeData': gradeData,
            'elevationData': elevationData
        };
    },// computeAnalysisData
// =================================================================================================



    /**
     * ...
     */
    moveRatio_: function moveRatio_(activityStatsMap, activityStream) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        if (_.isNull(activityStatsMap.movingTime) || _.isNull(activityStatsMap.elapsedTime)) {
            Helper.log('WARN', 'Unable to compute ActivityRatio on this activity with following data: ' + JSON.stringify(activityStatsMap))
            return null;
//                                              return 1;
        }
                                if (activityStatsMap.movingTime) {
                var ratio = activityStatsMap.movingTime / activityStatsMap.elapsedTime;
        }
        return ratio;
    },



    /**
     * ...
     */
    toughnessScore_: function toughnessScore_(activityStatsMap, activityStream, moveRatio) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        if (_.isNull(activityStatsMap.elevation) || _.isNull(activityStatsMap.avgPower) || _.isNull(activityStatsMap.averageSpeed) || _.isNull(activityStatsMap.distance)) {
            return null;
        }

        var toughnessScore = Math.sqrt(
            Math.sqrt(
                Math.pow(activityStatsMap.elevation, 2) *
                activityStatsMap.avgPower *
                Math.pow(activityStatsMap.averageSpeed, 2) *
                Math.pow(activityStatsMap.distance, 2) *
                moveRatio
            )
        ) / 20;

        return toughnessScore;
    },



    /**
     *
     */
    getZoneFromDistributionStep_: function getZoneFromDistributionStep_(value, distributionStep, minValue) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        return parseInt((value - minValue) / (distributionStep));
    },



    /**
     *
     */
    getZoneId: function getZoneId(zones, value) {
//if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        for (zoneId = 0; zoneId < zones.length; zoneId++) {
            if (value <= zones[zoneId].to) {
                return zoneId;
            }
        }
    },



    /**
     *
     */
    prepareZonesForDistribComputation: function prepareZonesForDistribComputation(sourceZones) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        var preparedZones = [];
        for (zone in sourceZones) {
            sourceZones[zone].s = 0;
            sourceZones[zone].percentDistrib = null;
            preparedZones.push(sourceZones[zone]);
        }
        return preparedZones;
    },



    /**
     *
     */
    finalizeDistribComputationZones: function finalizeDistribComputationZones(zones) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        var total = 0;
        for (zone of zones) {
            if (zone['s']) {
                total += zone['s'];
            }
            zone['percentDistrib'] = 0;
        }
        if (total > 0) {
            for (zone of zones) {
                if (zone['s']) {
                    zone['percentDistrib'] = ((zone['s'] / total).toFixed(4) * 100);
                }
            }
        }
        return zones;
    },



    /**
     *
     */
    valueForSum_: function valueForSum_(currentValue, previousValue, delta) {
//if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        // discrete integral
        return currentValue * delta - ((currentValue - previousValue) * delta) / 2;
    },





//  --------------------------------------------------------------------------------------------------------------------
    moveData_: function moveData_(activityStatsMap, velocityArray, timeArray) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

//        if (!velocityArray) {
        if (_.isEmpty(velocityArray) || _.isEmpty(timeArray)) {
            return null;
        }

        var genuineAvgSpeedSum = 0,
            genuineAvgSpeedSumCount = 0;
        var speedsNonZero = Array();
        var speedsNonZeroDuration = Array();
        var speedVarianceSum = 0;
        var currentSpeed;

                var realAvgSpeed = 3600 * activityStatsMap.distance / activityStatsMap.elapsedTime;
        var maxSpeed = _.max(velocityArray) * 3.6;
        var minSpeed = _.min(velocityArray) * 3.6;

        var speedZones = this.prepareZonesForDistribComputation(this.zones.speed);
        var paceZones = this.prepareZonesForDistribComputation(this.zones.pace);

        var durationInSeconds = 0;

        // End Preparing zone
        for (var i = 0; i < velocityArray.length; i++) { // Loop on samples

            // Compute speed
            currentSpeed = velocityArray[i] * 3.6; // Multiply by 3.6 to convert to kph; 

            if (currentSpeed > 0) { // If moving...

                // Compute distribution for graph/table
                if (i > 0) {

                    durationInSeconds = (timeArray[i] - timeArray[i - 1]); // Getting deltaTime in seconds (current sample and previous one)

                    speedsNonZero.push(currentSpeed);
                    speedsNonZeroDuration.push(durationInSeconds);

                    // Compute variance speed
                    speedVarianceSum += Math.pow(currentSpeed, 2);

                    // distance
                    genuineAvgSpeedSum += this.valueForSum_( velocityArray[i] * 3.6, velocityArray[i - 1] * 3.6, durationInSeconds );
                    // time
                    genuineAvgSpeedSumCount += durationInSeconds;

                    // Find speed zone id
                    var speedZoneId = this.getZoneId(this.zones.speed, currentSpeed);
                    if (!_.isUndefined(speedZoneId) && !_.isUndefined(speedZones[speedZoneId])) {
                        speedZones[speedZoneId]['s'] += durationInSeconds;
                    }

                    // Find pace zone
                    var paceZoneId = this.getZoneId(this.zones.pace, this.convertSpeedToPace(currentSpeed));
                    if (!_.isUndefined(paceZoneId) && !_.isUndefined(paceZones[paceZoneId])) {
                        paceZones[paceZoneId]['s'] += durationInSeconds;
                    }

                }
            }
        }

        // Update zone distribution percentage
        speedZones = this.finalizeDistribComputationZones(speedZones);
        paceZones = this.finalizeDistribComputationZones(paceZones);

        // Finalize compute of Speed
        var genuineAvgSpeed = genuineAvgSpeedSum / genuineAvgSpeedSumCount;
        var varianceSpeed = (speedVarianceSum / speedsNonZero.length) - Math.pow(activityStatsMap.averageSpeed, 2);
        var standardDeviationSpeed = (varianceSpeed > 0) ? Math.sqrt(varianceSpeed) : 0;
        var percentiles = Helper.weightedPercentiles(speedsNonZero, speedsNonZeroDuration, [ 0.25, 0.5, 0.75 ]);

        return [{
            'genuineAvgSpeed': genuineAvgSpeed,
            'realAvgSpeed': realAvgSpeed,
            'avgPace': parseInt(((1 / genuineAvgSpeed) * 60 * 60).toFixed(0)), // send in seconds
            'lowerQuartileSpeed': percentiles[0],
            'medianSpeed': percentiles[1],
            'upperQuartileSpeed': percentiles[2],
            'varianceSpeed': varianceSpeed,
            'standardDeviationSpeed': standardDeviationSpeed,
            'speedZones': speedZones,
            'maxSpeed': maxSpeed,
        }, {
            'lowerQuartilePace': this.convertSpeedToPace(percentiles[0]),
            'medianPace': this.convertSpeedToPace(percentiles[1]),
            'upperQuartilePace': this.convertSpeedToPace(percentiles[2]),
            'variancePace': this.convertSpeedToPace(varianceSpeed),
            'paceZones': paceZones
        }];
    },



    /**
     * @param speed in kph
     * @return pace in seconds/km
     */
    convertSpeedToPace: function convertSpeedToPace(speed) {
//if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        return (speed === 0) ? 'infinite' : parseInt((1 / speed) * 60 * 60);
    },





//  --------------------------------------------------------------------------------------------------------------------
    powerData_: function powerData_(athleteWeight, hasPowerMeter, userFTP, activityStatsMap, powerArray, velocityArray, timeArray) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

//        if (_.isEmpty(powerArray) || _.isEmpty(velocityArray)) {
//        if (_.isEmpty(powerArray) || _.isEmpty(velocityArray) || _.isEmpty(timeArray)) {
        if (_.isEmpty(powerArray) || _.isEmpty(timeArray)) {
            return null;
        }

        var accumulatedWattsOnMoveFourRoot = 0;
        var accumulatedWattsOnMove = 0;
        var wattSampleOnMoveCount = 0;
        var wattsSamplesOnMove = [];
        var wattsSamplesOnMoveDuration = [];

        var powerZones = this.prepareZonesForDistribComputation(this.zones.power);

        var durationInSeconds;

        for (var i = 0; i < powerArray.length; i++) { // Loop on samples

          if (i > 0) {

//            if ( ( ( velocityArray[i] * 3.6 > ActivityProcessor.movingThresholdKph ) || ( velocity_avg < velocity_avgThreshold ) )  && i > 0) {
                if ( // if moving or if avg. speed < threshold
                                !_.isEmpty(velocityArray) && ( ( currentSpeed = velocityArray[i] * 3.6 ) > ActivityProcessor.movingThresholdKph )
                        || ( velocity_avg < velocity_avgThreshold ) || (_.isEmpty(velocityArray)) )
                        {// Multiply by 3.6 to convert to kph; 
                // Compute average and normalized power
                accumulatedWattsOnMoveFourRoot += Math.pow(powerArray[i], 3.925);
                // Compute distribution for graph/table
                durationInSeconds = (timeArray[i] - timeArray[i - 1]); // Getting deltaTime in seconds (current sample and previous one)

                wattsSamplesOnMove.push(powerArray[i]);
                wattsSamplesOnMoveDuration.push(durationInSeconds);

                // average over time
                accumulatedWattsOnMove += this.valueForSum_(powerArray[i], powerArray[i - 1], durationInSeconds);
                wattSampleOnMoveCount += durationInSeconds;

                var powerZoneId = this.getZoneId(this.zones.power, powerArray[i]);

                if (!_.isUndefined(powerZoneId) && !_.isUndefined(powerZones[powerZoneId])) {
                    powerZones[powerZoneId]['s'] += durationInSeconds;
                }
            }
          }
        }

        // Finalize compute of Power
        var avgWatts = accumulatedWattsOnMove / wattSampleOnMoveCount;

        var weightedPower;

        if (hasPowerMeter) {
            weightedPower = activityStatsMap.weightedPower;
        } else {
            weightedPower = Math.sqrt(Math.sqrt(accumulatedWattsOnMoveFourRoot / wattSampleOnMoveCount));
        }

        var variabilityIndex = weightedPower / avgWatts;
        var punchFactor = (_.isNumber(userFTP) && userFTP > 0) ? (weightedPower / userFTP) : null;
        var weightedWattsPerKg = weightedPower / (athleteWeight + ActivityProcessor.defaultBikeWeight);
        
        var percentiles = Helper.weightedPercentiles(wattsSamplesOnMove, wattsSamplesOnMoveDuration, [ 0.25, 0.5, 0.75, 1 ]);

        // Update zone distribution percentage
        powerZones = this.finalizeDistribComputationZones(powerZones);

        return {
            'hasPowerMeter': hasPowerMeter,
            'avgWatts': avgWatts,
            'weightedPower': weightedPower,
            'variabilityIndex': variabilityIndex,
            'punchFactor': punchFactor,
            'weightedWattsPerKg': weightedWattsPerKg,
            'lowerQuartileWatts': percentiles[0],
            'medianWatts': percentiles[1],
            'upperQuartileWatts': percentiles[2],
            'maxWatts': percentiles[3],
            'powerZones': powerZones // Only while moving
        };

    },





//  --------------------------------------------------------------------------------------------------------------------
    heartRateData_: function heartRateData_(userGender, userRestHr, userMaxHr, heartRateArray, timeArray, velocityArray, activityStatsMap) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        if (_.isEmpty(heartRateArray) || _.isEmpty(timeArray) ) {
            return null;
        }



        // if no velocity data, or very low average velocity
        // compute heartrate stats "the old way" - this is for activities either without GPS data or with GPS data, but done on (more or less) same spot
        if ( _.isEmpty(velocityArray) || ( velocity_avg < velocity_avgThreshold ) ) {
        //
        // "OLD" WAY of calculating HR stats - not only for "moving" part of activity



        var TRIMP = 0;
        var TRIMPGenderFactor = (userGender == 'men') ? 1.92 : 1.67;
        var aRPEeGenderFactor = (userGender == 'men') ? 25 : 20;
        var hrrSecondsCount = 0;
        var hrrZonesCount = Object.keys(this.userHrrZones_).length;
        var hr, heartRateReserveAvg, durationInSeconds, durationInMinutes, zoneId;
        var hrSum = 0;
        var hrCount = 0;
// check VacuumProcessor
        var maxHeartRate = Math.max.apply(Math, heartRateArray);
        activityStatsMap.maxHeartRate=maxHeartRate;

        // Find HR for each Hrr of each zones
        for (var zone in this.userHrrZones_) {
            this.userHrrZones_[zone]['fromHr'] = parseFloat(Helper.heartrateFromHeartRateReserve(this.userHrrZones_[zone]['fromHrr'], userMaxHr, userRestHr));
            this.userHrrZones_[zone]['toHr'] = parseFloat(Helper.heartrateFromHeartRateReserve(this.userHrrZones_[zone]['toHrr'], userMaxHr, userRestHr));
            this.userHrrZones_[zone]['fromHrr'] = parseFloat(this.userHrrZones_[zone]['fromHrr']);
            this.userHrrZones_[zone]['toHrr'] = parseFloat(this.userHrrZones_[zone]['toHrr']);
            this.userHrrZones_[zone]['s'] = 0;
            this.userHrrZones_[zone]['percentDistrib'] = null;
        }

        for (var i = 0; i < heartRateArray.length; i++) { // Loop on samples

            // Compute heartrate data
            if (i > 0) {

                hrSum += heartRateArray[i];

                // Compute TRIMP
                hr = (heartRateArray[i] + heartRateArray[i - 1]) / 2; // Getting HR avg between current sample and previous one.
                heartRateReserveAvg = Helper.heartRateReserveFromHeartrate(hr, userMaxHr, userRestHr); //(hr - userSettings.userRestHr) / (userSettings.userMaxHr - userSettings.userRestHr);
                durationInSeconds = (timeArray[i] - timeArray[i - 1]); // Getting deltaTime in seconds (current sample and previous one)
                durationInMinutes = durationInSeconds / 60;

                // TRIMP += durationInMinutes * heartRateReserveAvg * Math.pow(0.64, TRIMPGenderFactor * heartRateReserveAvg);
                TRIMP += durationInMinutes * heartRateReserveAvg * 0.64 * Math.exp(TRIMPGenderFactor * heartRateReserveAvg);
                                                                
                // Count Heart Rate Reserve distribution
                zoneId = this.getHrrZoneId(hrrZonesCount, heartRateReserveAvg * 100);

                if (!_.isUndefined(zoneId)) {
                    this.userHrrZones_[zoneId]['s'] += durationInSeconds;
                }

                hrrSecondsCount += durationInSeconds;
                hrCount++;
            }
        }

        var heartRateArraySorted = heartRateArray.sort(function(a, b) {
            return a - b;
        });

        // Update zone distribution percentage
        for (var zone in this.userHrrZones_) {
            this.userHrrZones_[zone]['percentDistrib'] = ((this.userHrrZones_[zone]['s'] / hrrSecondsCount).toFixed(4) * 100);
        }

// check VacuumProcessor
        activityStatsMap.averageHeartRate = Math.round((hrSum / hrCount)*10)/10;

        TRIMP = Math.round(TRIMP*10)/10;
// using of moving time sometimes results in too big TRIMP/hr numbers, but it mostly works OK for biking (Ride)
// because moving time is detected a lot more reliable than for example in running uphill
//      if (activityStatsMap.movingTime && (window.activityType == 'Ride')) {
//              var TRIMP_hr = TRIMP/(activityStatsMap.movingTime/3600);
//      }else{
//              var TRIMP_hr = TRIMP/(activityStatsMap.elapsedTime/3600);
//      }
//      var TRIMP_hr = Math.round((TRIMP/(activityStatsMap.elapsedTime/3600))*10)/10;
//
// when calculating TRIMP, non-movin time HR should count in for TRIMP!

        var TRIMPPerHour = TRIMP / hrrSecondsCount * 60 * 60;
//        var TRIMP_hr = Math.round(TRIMPPerHour*10)/10;
//        var percentiles = Helper.weightedPercentiles(heartRateArrayMoving, heartRateArrayMovingDuration, [ 0.25, 0.5, 0.75 ]);
                var percentiles=[];
        percentiles[0]=Helper.lowerQuartile(heartRateArraySorted);
        percentiles[1]=Helper.median(heartRateArraySorted);
        percentiles[2]=Helper.upperQuartile(heartRateArraySorted);



        } else {
        //
        // "NEW" WAY of calculating HR stats - only for "moving" part of activity



        var TRIMP = 0;
        var TRIMPGenderFactor = (userGender == 'men') ? 1.92 : 1.67;
        var aRPEeGenderFactor = (userGender == 'men') ? 25 : 20;
        var hrrSecondsCount = 0;
        var hrrZonesCount = Object.keys(this.userHrrZones_).length;
        var hr, heartRateReserveAvg, durationInSeconds, durationInMinutes, zoneId;
        var hrSum = 0;
        var heartRateArrayMoving = [];
        var heartRateArrayMovingDuration = [];

        // Find HR for each Hrr of each zones
        for (var zone in this.userHrrZones_) {
            this.userHrrZones_[zone]['fromHr'] = parseFloat(Helper.heartrateFromHeartRateReserve(this.userHrrZones_[zone]['fromHrr'], userMaxHr, userRestHr));
            this.userHrrZones_[zone]['toHr'] = parseFloat(Helper.heartrateFromHeartRateReserve(this.userHrrZones_[zone]['toHrr'], userMaxHr, userRestHr));
            this.userHrrZones_[zone]['fromHrr'] = parseFloat(this.userHrrZones_[zone]['fromHrr']);
            this.userHrrZones_[zone]['toHrr'] = parseFloat(this.userHrrZones_[zone]['toHrr']);
            this.userHrrZones_[zone]['s'] = 0;
            this.userHrrZones_[zone]['percentDistrib'] = null;
        }

        for (var i = 0; i < heartRateArray.length; i++) { // Loop on samples
            if ( ( velocityArray[i] * 3.6 > ActivityProcessor.movingThresholdKph ) && i > 0 ) {
                // Compute heartrate data while moving from now
                durationInSeconds = (timeArray[i] - timeArray[i - 1]); // Getting deltaTime in seconds (current sample and previous one)
                // average over time
                hrSum += this.valueForSum_(heartRateArray[i], heartRateArray[i - 1], durationInSeconds);
                hrrSecondsCount += durationInSeconds;

                heartRateArrayMoving.push(heartRateArray[i]);
                heartRateArrayMovingDuration.push(durationInSeconds);

                // Compute TRIMP
                hr = (heartRateArray[i] + heartRateArray[i - 1]) / 2; // Getting HR avg between current sample and previous one.
                heartRateReserveAvg = Helper.heartRateReserveFromHeartrate(hr, userMaxHr, userRestHr); //(hr - userSettings.userRestHr) / (userSettings.userMaxHr - userSettings.userRestHr);
                durationInMinutes = durationInSeconds / 60;

                TRIMP += durationInMinutes * heartRateReserveAvg * 0.64 * Math.exp(TRIMPGenderFactor * heartRateReserveAvg);

                // Count Heart Rate Reserve distribution
                zoneId = this.getHrrZoneId(hrrZonesCount, heartRateReserveAvg * 100);

                if (!_.isUndefined(zoneId)) {
                    this.userHrrZones_[zoneId]['s'] += durationInSeconds;
                }
            }
        }

        var heartRateArraySorted = heartRateArray.sort(function(a, b) {
            return a - b;
        });

        // Update zone distribution percentage
        userHrrZones_ = this.finalizeDistribComputationZones(this.userHrrZones_);

// check VacuumProcessor
        activityStatsMap.averageHeartRate = hrSum / hrrSecondsCount;
        activityStatsMap.maxHeartRate = heartRateArraySorted[heartRateArraySorted.length - 1];

        var TRIMPPerHour = TRIMP / hrrSecondsCount * 60 * 60;
        var percentiles = Helper.weightedPercentiles(heartRateArrayMoving, heartRateArrayMovingDuration, [ 0.25, 0.5, 0.75 ]);

        } //if

        return {
            'TRIMP': TRIMP,
//              'TRIMP_hr': TRIMP_hr,
//              'aRPEe': Math.round((TRIMP_hr / aRPEeGenderFactor)*10)/10,
                'aRPEe': Math.round((TRIMPPerHour / aRPEeGenderFactor)*10)/10,
            'TRIMPPerHour': TRIMPPerHour,
            'hrrZones': this.userHrrZones_,
            'lowerQuartileHeartRate': percentiles[0],
            'medianHeartRate': percentiles[1],
            'upperQuartileHeartRate': percentiles[2],
// check VacuumProcessor
            'averageHeartRate': activityStatsMap.averageHeartRate,
//              'maxHeartRate': maxHeartRate,
                'maxHeartRate': activityStatsMap.maxHeartRate,
 //          'activityHeartRateReserve': Helper.heartRateReserveFromHeartrate(activityStatsMap.averageHeartRate, userMaxHr, userRestHr) * 100,
             'activityHeartRateReserve': Math.round((100*Helper.heartRateReserveFromHeartrate(activityStatsMap.averageHeartRate, userMaxHr, userRestHr))*10)/10,
            'activityHeartRateReserveMax': Helper.heartRateReserveFromHeartrate(activityStatsMap.maxHeartRate, userMaxHr, userRestHr) * 100,
                'MaxHr':userMaxHr,
                'RestHr':userRestHr
        };

    },



    /**
     *
     */
    getHrrZoneId: function getHrrZoneId(hrrZonesCount, hrrValue) {
//if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        for (zoneId = 0; zoneId < hrrZonesCount; zoneId++) {
            if (hrrValue <= this.userHrrZones_[zoneId]['toHrr']) {
                return zoneId;
            }
        }
    },





//  --------------------------------------------------------------------------------------------------------------------
    cadenceData_: function cadenceData_(cadenceArray, velocityArray, activityStatsMap, timeArray) { // TODO add cadence type here
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

//        if (_.isUndefined(cadenceArray) || _.isUndefined(velocityArray)) {
//        if (_.isEmpty(cadenceArray) || _.isEmpty(velocityArray) || _.isEmpty(timeArray)) {
        if (_.isEmpty(cadenceArray) || _.isEmpty(timeArray)) {
          return null;
        }

        // recomputing crank revolutions using cadence data
        var crankRevolutions = 0;
        // On Moving
        var cadenceSumOnMoving = 0;
        var cadenceSumDurationOnMoving = 0;
        var cadenceVarianceSumOnMoving = 0;
        var cadenceOnMoveSampleCount = 0;
        var movingSampleCount = 0;



        var cadenceZoneTyped;
        if (this.activityType === 'Ride') {
            cadenceZoneTyped = this.zones.cyclingCadence;
        } else if (this.activityType === 'Run') {
            cadenceZoneTyped = this.zones.runningCadence;
        } else {
        // !!!   cadence for other that Ride or Run -> use Ride cadence for now, in future make own zones   !!!
            cadenceZoneTyped = this.zones.cyclingCadence;
//            return null;
        }

        var cadenceZones = this.prepareZonesForDistribComputation(cadenceZoneTyped);

        var durationInSeconds = 0;
        var cadenceArrayMoving = [];
        var cadenceArrayDuration = [];

        for (var i = 0; i < cadenceArray.length; i++) {

            if (i > 0) {
                durationInSeconds = (timeArray[i] - timeArray[i - 1]); // Getting deltaTime in seconds (current sample and previous one)
                // recomputing crank revolutions using cadence data
                crankRevolutions += this.valueForSum_(cadenceArray[i], cadenceArray[i - 1], durationInSeconds / 60);
//   !!!   check if this really makes sense   !!!

                    if ( 
                           !_.isEmpty(velocityArray) && ( velocityArray[i] * 3.6 > ActivityProcessor.movingThresholdKph )
                        || ( velocity_avg < velocity_avgThreshold ) || (_.isEmpty(velocityArray)) )
                        {

                    movingSampleCount++;

                    // Rider is moving here..
                    if (cadenceArray[i] > ActivityProcessor.cadenceThresholdRpm) {
                        // Rider is moving here while cadence
                        cadenceOnMoveSampleCount++;
                        // cadence averaging over time
                        cadenceSumOnMoving += this.valueForSum_(cadenceArray[i], cadenceArray[i - 1], durationInSeconds);
                        cadenceSumDurationOnMoving += durationInSeconds;
                        cadenceVarianceSumOnMoving += Math.pow(cadenceArray[i], 2);
                        cadenceArrayMoving.push(cadenceArray[i]);
                        cadenceArrayDuration.push(durationInSeconds);
                    }

                    var cadenceZoneId = this.getZoneId(cadenceZoneTyped, cadenceArray[i]);

                    if (!_.isUndefined(cadenceZoneId) && !_.isUndefined(cadenceZones[cadenceZoneId])) {
                        cadenceZones[cadenceZoneId]['s'] += durationInSeconds;
                    }
                }
            }
        }

        var cadenceRatioOnMovingTime = cadenceOnMoveSampleCount / movingSampleCount;
        var averageCadenceOnMovingTime = cadenceSumOnMoving / cadenceSumDurationOnMoving;

        var varianceCadence = (cadenceVarianceSumOnMoving / cadenceOnMoveSampleCount) - Math.pow(averageCadenceOnMovingTime, 2);
        var standardDeviationCadence = (varianceCadence > 0) ? Math.sqrt(varianceCadence) : 0;

        // Update zone distribution percentage
        cadenceZones = this.finalizeDistribComputationZones(cadenceZones);

        var percentiles = Helper.weightedPercentiles(cadenceArrayMoving, cadenceArrayDuration, [ 0.25, 0.5, 0.75, 1]);

        return {
            'cadencePercentageMoving': cadenceRatioOnMovingTime * 100,
            'cadenceTimeMoving': (cadenceRatioOnMovingTime * activityStatsMap.movingTime),
//            'pedalingTime': (cadenceRatioOnMovingTime * activityStatsMap.movingTime),
            'averageCadenceMoving': averageCadenceOnMovingTime,
            'standardDeviationCadence': standardDeviationCadence.toFixed(1),
            'crankRevolutions': crankRevolutions,
            'lowerQuartileCadence': percentiles[0],
            'medianCadence': percentiles[1],
            'upperQuartileCadence': percentiles[2],
            'maxCadence': percentiles[3],
            'cadenceZones': cadenceZones
        };
    },





//  --------------------------------------------------------------------------------------------------------------------
    gradeData_: function gradeData_(gradeArray, velocityArray, timeArray, distanceArray, altitudeArray) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
//        if (_.isEmpty(gradeArray) || _.isEmpty(timeArray)) {
//        if (_.isEmpty(gradeArray) || _.isEmpty(velocityArray) || _.isEmpty(timeArray) || _.isEmpty(altitudeArray) || ( velocity_avg < velocity_avgThreshold ) ){
        if ( _.isEmpty(gradeArray) || _.isEmpty(timeArray) || ( velocity_avg < velocity_avgThreshold ) ) {
            return null;
        }


        // If home trainer
        if (window.pageView && window.pageView.activity && window.pageView.activity().get('trainer')) {
            return null;
        }

        var gradeSum = 0,
            gradeCount = 0;

        var gradeZones = this.prepareZonesForDistribComputation(this.zones.grade);
        var upFlatDownInSeconds = {
            up: 0,
            flat: 0,
            down: 0,
            total: 0
        };
        var upFlatDownInMeters = {
            up: 0,
            flat: 0,
            down: 0,
            total: 0
        };
        var upFlatDownAltitudeInMeters = {      // altitude meters climbed, lost, altitude ballance
            climbed: 0,
            lost: 0,
            ignore: 0,
            ballance: 0
        };


        var maxGrade = _.max(gradeArray);
        var minGrade = _.min(gradeArray);

        // Currently deals with avg speed/pace
        var upFlatDownMoveData = {
            up: 0,
            flat: 0,
            down: 0
        };

        var durationInSeconds = 0;
        var distance = 0;
        var deltaAltitude = 0;
        var currentSpeed = 0;

        var gradeArrayMoving = [];
        var gradeArrayDistance = [];

        for (var i = 0; i < gradeArray.length; i++) { // Loop on samples

            if (i > 0) {

                // Compute distribution for graph/table
//                if (currentSpeed > 0) { // If moving...
//                    if ( ( currentSpeed > 0 ) || ( velocity_avg < velocity_avgThreshold ) ) { 
                    if ( // if moving or if avg. speed < threshold
                           !_.isEmpty(velocityArray) && ( ( currentSpeed = velocityArray[i] * 3.6 ) > ActivityProcessor.movingThresholdKph )
                        || ( velocity_avg < velocity_avgThreshold ) || (_.isEmpty(velocityArray)) )
                        {// Multiply by 3.6 to convert to kph; 


                    durationInSeconds = (timeArray[i] - timeArray[i - 1]); // Getting deltaTime in seconds (current sample and previous one)
                    distance = distanceArray[i] - distanceArray[i - 1];
                    deltaAltitude = altitudeArray[i] - altitudeArray[i - 1];

                    // elevation? gain
                    gradeSum += this.valueForSum_(gradeArray[i], gradeArray[i - 1], distance);
                    // distance
                    gradeCount += distance;

                    gradeArrayMoving.push(gradeArray[i]);
                    gradeArrayDistance.push(distance);

                    var gradeZoneId = this.getZoneId(this.zones.grade, gradeArray[i]);

                    if (!_.isUndefined(gradeZoneId) && !_.isUndefined(gradeZones[gradeZoneId])) {
                        gradeZones[gradeZoneId]['s'] += durationInSeconds;
                    }

                    upFlatDownInSeconds.total += durationInSeconds;
                    upFlatDownInMeters.total += distance;
                    upFlatDownAltitudeInMeters.ballance += deltaAltitude;


                    // Compute DOWN/FLAT/UP duration
                    if (gradeArray[i] > ActivityProcessor.gradeClimbingLimit) {
                    // UPHILL
                        // time
                        upFlatDownInSeconds.up += durationInSeconds;
                        // distance
                        upFlatDownInMeters.up += distance;
                        upFlatDownMoveData.up += currentSpeed * durationInSeconds;
                        // altitude
                        upFlatDownAltitudeInMeters.climbed += deltaAltitude;
                    } else if (gradeArray[i] < ActivityProcessor.gradeDownHillLimit) {
                    // DOWNHILL
                        // time
                        upFlatDownInSeconds.down += durationInSeconds;
                        // distance
                        upFlatDownInMeters.down += distance;
                        upFlatDownMoveData.down += currentSpeed * durationInSeconds;
                        // altitude
                        upFlatDownAltitudeInMeters.lost += deltaAltitude;
                    } else {
                    // FLAT
                        // time
                        upFlatDownInSeconds.flat += durationInSeconds;
                        // distance
                        upFlatDownInMeters.flat += distance;
                        upFlatDownMoveData.flat += currentSpeed * durationInSeconds;
                        // altitude
                        upFlatDownAltitudeInMeters.ignore += deltaAltitude;
                    }
                }// if
                }// if
        }// for

        // Compute speed while up, flat down
        upFlatDownMoveData.up = upFlatDownMoveData.up / upFlatDownInSeconds.up;
        upFlatDownMoveData.down = upFlatDownMoveData.down / upFlatDownInSeconds.down;
        upFlatDownMoveData.flat = upFlatDownMoveData.flat / upFlatDownInSeconds.flat;

        var avgGrade = gradeSum / gradeCount;

        // Update zone distribution percentage
        gradeZones = this.finalizeDistribComputationZones(gradeZones);

        var percentiles = Helper.weightedPercentiles(gradeArrayMoving, gradeArrayDistance, [ 0.25, 0.5, 0.75 ]);



        // "Compute" grade profile word description
        //
        // Downhill < Mostly Down < Flat < Mostly Flat <   Hilly   < Very Hilly < Mountanous < Alpine
        //
        var gradeProfile;
                var minAlt              = Helper.getMinOfArray(StravaStreams.altitude);
                var maxAlt              = Helper.getMaxOfArray(StravaStreams.altitude);
                var AltRange            = maxAlt-minAlt;
                var upPercentT          = 100 * upFlatDownInSeconds.up / upFlatDownInSeconds.total;
                var flatPercentT        = 100 * upFlatDownInSeconds.flat / upFlatDownInSeconds.total;
                var downPercentT        = 100 * upFlatDownInSeconds.down / upFlatDownInSeconds.total;
                var upPercentD          = 100 * upFlatDownInMeters.up / upFlatDownInMeters.total;
                var flatPercentD        = 100 * upFlatDownInMeters.flat / upFlatDownInMeters.total;
                var downPercentD        = 100 * upFlatDownInMeters.down / upFlatDownInMeters.total;
                var upAvgGradeEstimate  = 100 * ( upFlatDownAltitudeInMeters.climbed + upFlatDownAltitudeInMeters.ignore ) / upFlatDownInMeters.up;
                
        if (            // DOWNHILL
                        ( downPercentD >= ActivityProcessor.gradeProfileDownhill_MinDownPercentD )
        )               { gradeProfile = ActivityProcessor.gradeProfileDownhill; }

        else if (       // MOSTLY DOWN
                        ( downPercentD >= ActivityProcessor.gradeProfileMostlyDown_MinDownPercentD )
                        &&      ( upPercentD < ActivityProcessor.gradeProfileMostlyDown_MaxUpPercentD )
                )               { gradeProfile = ActivityProcessor.gradeProfileMostlyDown; }

        else if (       // FLAT
                        (
                        ( flatPercentT >= ActivityProcessor.gradeProfileFlat_MinFlatPercentT )
                        &&      ( ( upPercentD + downPercentD ) < ActivityProcessor.gradeProfileFlat_MaxUpDownPercentD )
                        ) || (  // or
                                ( upAvgGradeEstimate < ActivityProcessor.gradeProfileFlat_MaxAvgGradeEst )
                        ) || (  // or
                                ( upFlatDownAltitudeInMeters.climbed < ActivityProcessor.gradeProfileFlat_MaxClimbed )
                        )
                )               { gradeProfile = ActivityProcessor.gradeProfileFlat; }


        else if (       // MOSTLY FLAT
                        ( flatPercentT >= ActivityProcessor.gradeProfileMostlyFlat_MinFlatPercentT )
                        &&      ( upAvgGradeEstimate < ActivityProcessor.gradeProfileMostlyFlat_MaxAvgGradeEst )
                        &&      ( AltRange < ActivityProcessor.gradeProfileMostlyFlat_MaxDeltaH )
                )               { gradeProfile = ActivityProcessor.gradeProfileMostlyFlat; }


        else if (       // ALPINE
                        ( flatPercentT < ActivityProcessor.gradeProfileAlpine_MaxFlatPercentT )
                &&      ( upAvgGradeEstimate > ActivityProcessor.gradeProfileAlpine_MinAvgGradeEst )
                &&      ( AltRange > ActivityProcessor.gradeProfileAlpine_MinDeltaH )
        )               { gradeProfile = ActivityProcessor.gradeProfileAlpine; }

        else if (       // MOUNTAINOUS
                        ( flatPercentT < ActivityProcessor.gradeProfileMountainous_MaxFlatPercentT )
                        &&      ( upAvgGradeEstimate > ActivityProcessor.gradeProfileMountainous_MinAvgGradeEst )
                        &&      ( upFlatDownAltitudeInMeters.climbed > ActivityProcessor.gradeProfileMountainous_MinClimbed )
                        &&      ( AltRange > ActivityProcessor.gradeProfileMountainous_MinDeltaH )
                )               { gradeProfile = ActivityProcessor.gradeProfileMountainous; }

        else if (       // VERY HILLY
                        ( flatPercentT < ActivityProcessor.gradeProfileVeryHilly_MaxFlatPercentT )
                        &&      ( upAvgGradeEstimate > ActivityProcessor.gradeProfileVeryHilly_MinAvgGradeEst )
                        &&      ( upFlatDownAltitudeInMeters.climbed > ActivityProcessor.gradeProfileVeryHilly_MinClimbed )
                        &&      ( AltRange > ActivityProcessor.gradeProfileVeryHilly_MinDeltaH )
                )               { gradeProfile = ActivityProcessor.gradeProfileVeryHilly; }

        else            // HILLY
                        { gradeProfile = ActivityProcessor.gradeProfileHilly; }



        return {
            'avgGrade': avgGrade,
            'lowerQuartileGrade': percentiles[0],
            'medianGrade': percentiles[1],
            'upperQuartileGrade': percentiles[2],
            'gradeZones': gradeZones,
            'upFlatDownInSeconds': upFlatDownInSeconds,
            'upFlatDownInMeters': upFlatDownInMeters,
            'upAvgGradeEstimate': upAvgGradeEstimate,
            'upFlatDownMoveData': upFlatDownMoveData,
            'gradeProfile': gradeProfile,
            'maxGrade': maxGrade
        };

    },





//  --------------------------------------------------------------------------------------------------------------------
    elevationData_: function elevationData_(activityStream, activityStatsMap) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        var distanceArray = activityStream.distance;
        var timeArray = activityStream.time;
        var velocityArray = activityStream.velocity_smooth;
        var altitudeArray = activityStream.altitude_smooth;
//        var altitudeArray = activityStream.altitude;

//        if (_.isEmpty(distanceArray) || _.isEmpty(timeArray) || _.isEmpty(velocityArray) || _.isEmpty(altitudeArray) || !( velocity_avg < velocity_avgThreshold ) ) {
        if (_.isEmpty(distanceArray) || _.isEmpty(timeArray) || _.isEmpty(velocityArray) || _.isEmpty(altitudeArray) ) {
            return null;
        }

        var accumulatedElevation = 0;
        var accumulatedElevationAscent = 0;
        var accumulatedElevationDescent = 0;
        var accumulatedDistance = 0;

        // specials arrays for ascent speeds
        var ascentSpeedMeterPerHourSamples = [];
        var ascentSpeedMeterPerHourDistance = [];
        var ascentSpeedMeterPerHourTime = [];
        var ascentSpeedMeterPerHourSum = 0;

        var elevationSampleCount = 0;
        var elevationSamples = [];
        var elevationSamplesDistance = [];
        var elevationZones = this.prepareZonesForDistribComputation(this.zones.elevation);
        var ascentSpeedZones = this.prepareZonesForDistribComputation(this.zones.ascent);
        var durationInSeconds = 0;
        var distance = 0;
        var ascentDurationInSeconds = 0;

        for (var i = 0; i < altitudeArray.length; i++) { // Loop on samples

            // Compute distribution for graph/table
//            if (i > 0 && velocityArray[i] * 3.6 > ActivityProcessor.movingThresholdKph) {
            if ( ( i > 0 ) && ( ( velocityArray[i] * 3.6 > ActivityProcessor.movingThresholdKph ) || ( velocity_avg < velocity_avgThreshold ) ) ) { // if moving or if avg. speed < threshold

                durationInSeconds = (timeArray[i] - timeArray[i - 1]); // Getting deltaTime in seconds (current sample and previous one)
                distance = distanceArray[i] - distanceArray[i - 1];

                // Compute average and normalized 

                // average elevation over distance
                accumulatedElevation += this.valueForSum_(altitudeArray[i], altitudeArray[i - 1], distance);
                elevationSampleCount += distance;
                elevationSamples.push(altitudeArray[i]);
                elevationSamplesDistance.push(distance);

                var elevationZoneId = this.getZoneId(this.zones.elevation, altitudeArray[i]);

                if (!_.isUndefined(elevationZoneId) && !_.isUndefined(elevationZones[elevationZoneId])) {
                    elevationZones[elevationZoneId]['s'] += durationInSeconds;
                }

                // Meters climbed between current and previous
                var elevationDiff = altitudeArray[i] - altitudeArray[i - 1];

                // If previous altitude lower than current then => climbing
                if (elevationDiff > 0) {

                    accumulatedElevationAscent += elevationDiff;
                    ascentDurationInSeconds = timeArray[i] - timeArray[i - 1];

                    var ascentSpeedMeterPerHour = elevationDiff / ascentDurationInSeconds * 3600; // m climbed / seconds

                    // only if grade is > ActivityProcessor.gradeClimbingLimit
                    if (distance > 0 && ( 100*(elevationDiff / distance) > ActivityProcessor.gradeClimbingLimit ) ) {
                        accumulatedDistance += distanceArray[i] - distanceArray[i - 1];
                        ascentSpeedMeterPerHourSamples.push(ascentSpeedMeterPerHour);
                        ascentSpeedMeterPerHourDistance.push(accumulatedDistance);
                        ascentSpeedMeterPerHourTime.push(ascentDurationInSeconds);
                        ascentSpeedMeterPerHourSum += ascentSpeedMeterPerHour;
                    }
                } else {
                    accumulatedElevationDescent -= elevationDiff;
                }

            }
        }

        var ascentSpeedArray = ascentSpeedMeterPerHourSamples; //this.filterData_(ascentSpeedMeterPerHourSamples, ascentSpeedMeterPerHourDistance, 200);
        var j = 0;
        for (j = 0; j < ascentSpeedArray.length; j++) {
            var ascentSpeedZoneId = this.getZoneId(this.zones.ascent, ascentSpeedArray[j]);

            if (!_.isUndefined(ascentSpeedZoneId) && !_.isUndefined(ascentSpeedZones[ascentSpeedZoneId])) {
                ascentSpeedZones[ascentSpeedZoneId]['s'] += ascentSpeedMeterPerHourTime[j];
            }
        }

        // Finalize compute of Elevation
        var avgElevation = accumulatedElevation / elevationSampleCount;

        var ascentSpeedMeterPerHourSamplesSorted = ascentSpeedMeterPerHourSamples.sort(function(a, b) {
            return a - b;
        });

        var avgAscentSpeed = ascentSpeedMeterPerHourSum / ascentSpeedMeterPerHourSamples.length;

        // Update zone distribution percentage
        elevationZones = this.finalizeDistribComputationZones(elevationZones);
        ascentSpeedZones = this.finalizeDistribComputationZones(ascentSpeedZones);

        var percentilesElevation = Helper.weightedPercentiles(elevationSamples, elevationSamplesDistance, [ 0.25, 0.5, 0.75 ]);
        var percentilesAscent = Helper.weightedPercentiles(ascentSpeedMeterPerHourSamples, ascentSpeedMeterPerHourDistance, [ 0.25, 0.5, 0.75 ]);

        return {
            'avgElevation': avgElevation.toFixed(0),
            'accumulatedElevationAscent': accumulatedElevationAscent,
            'accumulatedElevationDescent': accumulatedElevationDescent,
            'lowerQuartileElevation': percentilesElevation[0].toFixed(0),
            'medianElevation': percentilesElevation[1].toFixed(0),
            'upperQuartileElevation': percentilesElevation[2].toFixed(0),
            'elevationZones': elevationZones, // Only while moving
            'ascentSpeedZones': ascentSpeedZones, // Only while moving
            'ascentSpeed': {
                'avg': avgAscentSpeed,
                'lowerQuartile': percentilesAscent[0].toFixed(0),
                'median': percentilesAscent[1].toFixed(0),
                'upperQuartile': percentilesAscent[2].toFixed(0)
            }
        };
    },



    /**
     *
     */
    smoothAltitude_: function smoothAltitude(activityStream, stravaElevation) {
if (env.debugMode) console.warn(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        var activityAltitudeArray = activityStream.altitude;
        var distanceArray = activityStream.distance;  // for smoothing by distance
//        var timeArray = activityStream.time;  // for smoothing by time
        var velocityArray = activityStream.velocity_smooth;
        var smoothingL = 10;
        var smoothingH = 600;
        var smoothing;
        var altitudeArray;
        while (smoothingH - smoothingL >= 1) {
            smoothing = smoothingL + (smoothingH - smoothingL) / 2;
            altitudeArray = this.lowPassDataSmoothing_(activityAltitudeArray, distanceArray, smoothing);	// smoothing by distance
//            altitudeArray = this.lowPassDataSmoothing_(activityAltitudeArray, timeArray, smoothing);	// smoothing by time
            var totalElevation = 0;
            for (var i = 0; i < altitudeArray.length; i++) { // Loop on samples
                if (i > 0 && velocityArray[i] * 3.6 > VacuumProcessor.movingThresholdKph) {
                    var elevationDiff = altitudeArray[i] - altitudeArray[i - 1];
                    if (elevationDiff > 0) {
                        totalElevation += elevationDiff;
                    }
                }
            }

if (env.debugMode) console.log("          ...Altitude smoothing factor:" + smoothing.toFixed(2) + "   Strava Elev.: " + stravaElevation + "   Smoothed: " + totalElevation.toFixed(2) );
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
    lowPassDataSmoothing_: function lowPassDataSmoothing_(data, distance, smoothing) {
if (env.debugMode) console.log(' > (f: ActivityProcessor.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        // Below algorithm is applied in this method
        // http://phrogz.net/js/framerate-independent-low-pass-filter.html
        // value += (currentValue - value) / (smoothing / timeSinceLastSample);
        // it is adapted for stability - if (smoothing / timeSinceLastSample) is less then 1, set it to 1 -> no smoothing for that sample
        if (data && distance) {
            var smooth_factor=0;
            var result = [];
            result[0] = data[0];
            for (i = 1, max = data.length; i < max; i++) {
                if (smoothing === 0) {
                    result[i] = data[i];
                } else {
               	    smooth_factor = smoothing / (distance[i] - distance[i - 1]);
                    result[i] = result[i - 1] + (data[i] - result[i - 1]) / ( smooth_factor>1 ? smooth_factor : 1 ); // low limit smooth_factor to 1!!!
                    // only apply filter if smooth_factor > 1, else this leads to instability !!!
                }
            }
            return result;
        }
    }





}; // prototype



if (env.debugMode) console.warn('End       ActivityProcessor.js');
