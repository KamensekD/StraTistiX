/**
 *   StravistiX is responsible of linking processors with modfiers and user settings/health data
 */
function StravistiX(userSettings, appResources) {

    this.userSettings_ = userSettings;
    this.appResources_ = appResources;
    this.extensionId_ = this.appResources_.extensionId;
    this.vacuumProcessor_ = new VacuumProcessor();
    this.activityProcessor_ = new ActivityProcessor(this.vacuumProcessor_, this.userSettings_.userHrrZones, this.userSettings_.zones);
    this.athleteId_ = this.vacuumProcessor_.getAthleteId();
    this.athleteName_ = this.vacuumProcessor_.getAthleteName();
    this.athleteIdAuthorOfActivity_ = this.vacuumProcessor_.getAthleteIdAuthorOfActivity();
    this.isPremium_ = this.vacuumProcessor_.getPremiumStatus();
    this.isPro_ = this.vacuumProcessor_.getProStatus();
    this.activityId_ = this.vacuumProcessor_.getActivityId();
    this.activityName_ = this.vacuumProcessor_.getActivityName();
    this.activityTime_ = this.vacuumProcessor_.getActivityTime();

    // Make the work...
    this.init_();
}


/**
 *   Static vars
 */
StravistiX.getFromStorageMethod = 'getFromStorage';
StravistiX.setToStorageMethod = 'setToStorage';
StravistiX.defaultIntervalTimeMillis = 750;


/**
 * Define prototype
 */
StravistiX.prototype = {

    init_: function() {

        // Redirect app.strava.com/* to www.strava.com/*
        if (this.handleForwardToWWW_()) {
            return; // Skip rest of init to be compliant with www.strava.com/* on next reload
        }

        // Handle some tasks to od when update occurs
        if (this.userSettings_.extensionHasJustUpdated || env.forceUpdated) {
            this.handleExtensionHasJustUpdated_();
        }

        if (env.preview) {
            this.handlePreviewRibbon_();
        }

        if (this.userSettings_.localStorageMustBeCleared) {
            localStorage.clear();
            Helper.setToStorage(this.extensionId_, StorageManager.storageSyncType, 'localStorageMustBeCleared', false, function(response) {
                console.log('localStorageMustBeCleared is now ' + response.data.localStorageMustBeCleared);
            });
        }

        // Common
        this.handleMenu_();
        this.handleRemoteLinks_();
        this.handleWindyTyModifier_();
        this.handleActivityScrolling_();
        this.handleDefaultLeaderboardFilter_();
        this.handleSegmentRankPercentage_();
        this.handleActivityGoogleMapType_();
        this.handleCustomMapboxStyle_();
        this.handleHidePremium_();
        this.handleHideFeed_();
        this.handleDisplayFlyByFeedModifier_();

        // Bike
        this.handleExtendedActivityData_();
        this.handleNearbySegments_();
        this.handleActivityBikeOdo_();
        this.handleActivitySegmentTimeComparison_();
        this.handleActivityBestSplits_();

        // Run
        this.handleRunningGradeAdjustedPace_();
        this.handleRunningHeartRate_();
        this.handleMoveFooterOutofWay_();

        // All activities
        this.handleActivityQRCodeDisplay_();
        this.handleVirtualPartner_();
        this.handleAthletesStats();

        // Must be done at the end
        this.handleTrackTodayIncommingConnection_();
        this.handleGoogleMapsComeBackModifier();

    },


    /**
     *
     */
    handleForwardToWWW_: function() {

        if (_.isEqual(window.location.hostname, 'app.strava.com')) {
            var forwardUrl = window.location.protocol + "//www.strava.com" + window.location.pathname;
            window.location.href = forwardUrl;
            return true;
        }
        return false;
    },


    /**
     *
     */
    handleExtensionHasJustUpdated_: function() {

        // Clear localstorage
        // Especially for activies data stored in cache
        console.log("ExtensionHasJustUpdated, localstorage clear");
        localStorage.clear();

        if (!window.location.pathname.match(/^\/dashboard/)) {
            return;
        }

        // Display ribbon update message
        this.handleUpdateRibbon_();

        // Send update info to ga
        var updatedToEvent = {
            categorie: 'Exploitation',
            action: 'updatedVersion',
            name: this.appResources_.extVersion
        };

        _spTrack('send', 'event', updatedToEvent.categorie, updatedToEvent.action, updatedToEvent.name);
        _spTrack('send', 'event', updatedToEvent.categorie, updatedToEvent.action, updatedToEvent.name+'_'+this.athleteName_+ ' #' + this.athleteId_,1);

        // Now mark extension "just updated" to false...
        Helper.setToStorage(this.extensionId_, StorageManager.storageSyncType, 'extensionHasJustUpdated', false, function(response) {});
    },


    /**
     *
     */
    handleUpdateRibbon_: function() {

//        var title = 'StraTistiX updated/installed to <strong>v' + this.appResources_.extVersion + '</strong>';
        var title = '<strong>StraTistiX</strong> updated/installed to <strong>v0.6.1.2</strong>';
        var message = '';
        message += "<br><h4><strong>NEW FEATURES:</strong></h4><h4>";

        message += "- Added year progression (activity count, distance, elevation, time) table and chart (credit https://github.com/tazmanska)<br/>"
		message += "- Added biking segment time comparison to KOM's and PR's<br>"
		message += "- export of segments as Virtual Partner<br>"
		message += "- Added weather (wind/temp/clouds/humidity)<br>"
		message += "- more analysis data (climbing time and speed, pedalling time,...)<br>"
		message += "- Search-able common settings<br>"
		message += "- Moved leftside buttons/links under Edit/Action buttons<br>"

        message += "</h4>";
//        message += "<h4><strong>BUGFIXES:</strong></h4><h5>";
//        message += "- bugfix<br/>"
//        message += "</h5><br>";

        message += "<br>";
        message += "<h4>This is <strong><a href='https://chrome.google.com/webstore/detail/stratistix-with-arpee-sco/bilbbbdgdimchenccmooakpfomfajepd'>StraTistiX</a></strong> - Dejan Kamensek's <a href='https://github.com/KamensekD/StraTistiX'>fork</a> of <a href='https://chrome.google.com/webstore/detail/stravistix-for-strava/dhiaggccakkgdfcadnklkbljcgicpckn'>StravistiX</a>";
        message += '<br><font size=-1>Original StravistiX (formerly named StravaPlus) is being developed by Thomas Champagne</font></h4>';
        message += '<h4><a target="_blank" href="' + this.appResources_.settingsLink + '#/donate">Donate Thomas Champagne to get more features</a></h4>';

        $.fancybox('<h2>' + title + '</h2>' + message);
    },


    /**
     *
     */
    handleAthletesStats: function() {

        // If we are not on the athletes page then return...
        if (!window.location.pathname.match(new RegExp("/athletes/" + this.athleteId_ + "$", "g"))) {
            return;
        }

        if (env.debugMode) console.log("Execute handleAthletesStats()");

        var athleteStatsModifier = new AthleteStatsModifier(this.appResources_);
        athleteStatsModifier.modify();
    },


    /**
     *
     */
    handlePreviewRibbon_: function() {
        var globalStyle = 'background-color: #FFF200; color: rgb(84, 84, 84); font-size: 12px; padding: 5px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; text-align: center;';
        var html = '<div id="updateRibbon" style="' + globalStyle + '"><strong>WARNING</strong> You are running a preview of <strong>StravistiX</strong>, to remove it, open a new tab and type <strong>chrome://extensions</strong></div>';
        $('body').before(html);
    },


    /**
     *
     */
    handleMenu_: function() {

        if (env.debugMode) console.log("Execute handleMenu_()");

        var menuModifier = new MenuModifier(this.athleteId_, this.userSettings_.highLightStravistiXFeature, this.appResources_);
        menuModifier.modify();
    },


    /**
     *
     */
    handleRemoteLinks_: function() {

        // If we are not on a segment or activity page then return...
//        if (!window.location.pathname.match(/^\/segments\/(\d+)$/) && !window.location.pathname.match(/^\/activities/)) {
        if (!window.location.pathname.match(/^\/segments\/(\d+)$/) && !window.location.pathname.match(/^\/activities/) && !window.location.pathname.match(/^\/publishes\/wizard\\?/)) {
            return;
        }

        if (!this.userSettings_.remoteLinks) {
            return;
        }

        if (env.debugMode) console.log("Execute handleRemoteLinks_()");

        var remoteLinksModifier = new RemoteLinksModifier(this.userSettings_.highLightStravistiXFeature, this.appResources_, (this.athleteIdAuthorOfActivity_ === this.athleteId_), this.userSettings_.customMapboxStyle);
        remoteLinksModifier.modify();
    },


    /**
     *
     */
    handleWindyTyModifier_: function() {

        // If we are not on a segment or activity page then return...
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }

        if (!window.pageView) {
            return;
        }

        // Avoid running Extended data at the moment
        if (window.pageView.activity().get('type') != "Ride") {
            return;
        }

        // If home trainer skip (it will use gps data to locate weather data)
        if (window.pageView.activity().get('trainer')) {
            return;
        }

        if (env.debugMode) console.log("Execute handleWindyTyModifier_()");

        var windyTyModifier = new WindyTyModifier(this.activityId_, this.appResources_);
        windyTyModifier.modify();
    },


    /**
     *
     */
    handleActivityScrolling_: function() {

        if (!this.userSettings_.feedAutoScroll) {
            return;
        }

        if (env.debugMode) console.log("Execute handleActivityScrolling_()");

        var activityScrollingModifier = new ActivityScrollingModifier();
        activityScrollingModifier.modify();
    },


    /**
     *
     */
    handleDefaultLeaderboardFilter_: function() {

        // If we are not on a segment or activity page then return...
        if (!window.location.pathname.match(/^\/segments\/(\d+)$/) && !window.location.pathname.match(/^\/activities/)) {
            return;
        }

        // Kick out if we are not on SegmentLeaderboardView
        try {
            eval('Strava.Labs.Activities.SegmentLeaderboardView');
        } catch (err) {
            if (env.debugMode) console.log('Kick out no Strava.Labs.Activities.SegmentLeaderboardView available');
            return;
        }

        if (env.debugMode) console.log("Execute handleDefaultLeaderboardFilter_()");

        var defaultLeaderboardFilterModifier = new DefaultLeaderboardFilterModifier(this.userSettings_.defaultLeaderboardFilter);
        defaultLeaderboardFilterModifier.modify();
    },


    /**
     *
     */
    handleSegmentRankPercentage_: function() {

        if (!this.userSettings_.displaySegmentRankPercentage) {
            return;
        }

        // If we are not on a segment page then return...
        if (!window.location.pathname.match(/^\/segments\/(\d+)$/)) {
            return;
        }

        if (env.debugMode) console.log("Execute handleSegmentRankPercentage_()");

        var segmentRankPercentage = new SegmentRankPercentageModifier();
        segmentRankPercentage.modify();
    },


    /**
     *
     */
    handleActivityGoogleMapType_: function() {

        // Test where are on an activity...
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }

        if (env.debugMode) console.log("Execute handleActivityGoogleMapType_()");

        var activityGoogleMapTypeModifier = new ActivityGoogleMapTypeModifier(this.userSettings_.activityGoogleMapType);
        activityGoogleMapTypeModifier.modify();
    },


    /**
     *
     */
    handleCustomMapboxStyle_: function() {

        // Test where are on an activity...
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }

        if (env.debugMode) console.log("Execute handleCustomMapboxStyle_()");

    },


    /**
     *
     */
    handleHidePremium_: function() {

        // Eject premium users of this "Hiding" feature
        // Even if they checked "ON" the hide premium option
        if (this.isPremium_) {
            return;
        }

        if (!this.userSettings_.hidePremiumFeatures) {
            return;
        }

        if (env.debugMode) console.log("Execute handleHidePremium_()");

        var hidePremiumModifier = new HidePremiumModifier();
        hidePremiumModifier.modify();
    },


    /**
     *
     */
    handleHideFeed_: function() {

        // Test if where are on dashboard page
        if (!window.location.pathname.match(/^\/dashboard/)) {
            return;
        }

        if (env.debugMode) console.log("Execute handleHideFeed_()");

        if (!this.userSettings_.feedHideChallenges && !this.userSettings_.feedHideCreatedRoutes) {
            return;
        }

        var hideFeedModifier = new HideFeedModifier(this.userSettings_.feedHideChallenges, this.userSettings_.feedHideCreatedRoutes);
        hideFeedModifier.modify();
    },


    /**
     *
     */
    handleDisplayFlyByFeedModifier_: function() {

        // Test if where are on dashboard page
        if (!window.location.pathname.match(/^\/dashboard/)) {
            return;
        }

        if (env.debugMode) console.log("Execute handleDisplayFlyByFeedModifier_()");

        var displayFlyByFeedModifier = new DisplayFlyByFeedModifier();
        displayFlyByFeedModifier.modify();
    },


    /**
     *
     */
    handleExtendedActivityData_: function() {

        if (_.isUndefined(window.pageView)) {
            return;
        }

// without var -> global scope (window.activityType)
        activityType = pageView.activity().get('type');
//        var activityType = pageView.activity().get('type');

        // Skip manual activities
        if (activityType === 'Manual') {
            return;
        }

        if (env.debugMode) console.log("Execute handleExtendedActivityData_()");

        this.activityProcessor_.setActivityType(activityType);

        this.activityProcessor_.getAnalysisData(
            this.activityId_,
            this.userSettings_.userGender,
            this.userSettings_.userRestHr,
            this.userSettings_.userMaxHr,
            this.userSettings_.userFTP,

            function(analysisData) { // Callback when analysis data has been computed
//console.log("Analysis done; TRIMP:"+analysisData.heartRateData.TRIMP.toFixed(0));
                var extendedActivityDataModifier = null;

                var basicInfos = {
                    activityName: this.vacuumProcessor_.getActivityName(),
                    activityTime: this.vacuumProcessor_.getActivityTime()
                }

                // tell activity type for other than Ride/Run activities
				if ( (activityType !== "Ride") && (activityType !== "Run") ) {
                    var html = '<div  style="padding: 0px 0px 0px 0px;background: #FFFFFF;font-size: 9px;color: rgb(103, 103, 103);">&nbsp&nbsp&nbspActivity type: '+window.pageView.activity().attributes.type+'</div>';
                    $('.inset').parent().children().first().before(html);
				}

                switch (activityType) {
                    case 'Ride':
                        extendedActivityDataModifier = new CyclingExtendedActivityDataModifier(analysisData, this.appResources_, this.userSettings_, this.athleteId_, this.athleteIdAuthorOfActivity_, basicInfos);
                        break;
                    case 'Run':
                        extendedActivityDataModifier = new RunningExtendedActivityDataModifier(analysisData, this.appResources_, this.userSettings_, this.athleteId_, this.athleteIdAuthorOfActivity_, basicInfos);
                        break;

                    // for Workout, Rowing,...
                    case 'StationaryOther':
                        extendedActivityDataModifier = new GenericExtendedActivityDataModifier(analysisData, this.appResources_, this.userSettings_, this.athleteId_, this.athleteIdAuthorOfActivity_, basicInfos);
                        break;

                    // for Workout, Rowing,...
                    case 'Swim':
                        extendedActivityDataModifier = new GenericExtendedActivityDataModifier(analysisData, this.appResources_, this.userSettings_, this.athleteId_, this.athleteIdAuthorOfActivity_, basicInfos);
                        break;

                    default:
                        // extendedActivityDataModifier = new GenericExtendedActivityDataModifier(analysisData, this.appResources_, this.userSettings_, this.athleteId_, this.athleteIdAuthorOfActivity_); // DELAYED_FOR_TESTING
                        var html = '<p style="padding: 10px;background: #FFF0A0;font-size: 12px;color: rgb(103, 103, 103);">StraTistiX don\'t support <strong>Extended Data Features</strong> for this type of activity at the moment. Feature will be available in version 0.6.x. Working hard! Please wait... ;).</br></br>Stay tunned via <a href="https://twitter.com/champagnethomas">@champagnethomas</a></p>';
                        $('.inline-stats.section').parent().children().last().after(html);
                        break;
                }

                if (extendedActivityDataModifier) {
                    extendedActivityDataModifier.modify();
							
                }

            }.bind(this)
        );

        // Send opened activity type to ga for stats
        var updatedToEvent = {
            categorie: 'Analyse',
            action: 'openedActivityType',
            name: activityType
        };
        _spTrack('send', 'event', updatedToEvent.categorie, updatedToEvent.action, updatedToEvent.name);
    },


    /**
     *
     */
    handleNearbySegments_: function() {

        if (!this.userSettings_.displayNearbySegments) {
            return;
        }

        // If we are not on a segment page then return...
        var segmentData = window.location.pathname.match(/^\/segments\/(\d+)$/);
        if (_.isNull(segmentData)) {
            return;
        }

        if (env.debugMode) console.log("Execute handleNearbySegments_()");

        // Getting segment id
        var segmentId = parseInt(segmentData[1]);

        var segmentProcessor = new SegmentProcessor(this.vacuumProcessor_, segmentId);

        var arrayOfNearbySegments = segmentProcessor.getNearbySegmentsAround(function(jsonSegments) {

            if (env.debugMode) console.log(jsonSegments);

            var nearbySegmentsModifier = new NearbySegmentsModifier(jsonSegments, this.appResources_, this.userSettings_.highLightStravistiXFeature);
            nearbySegmentsModifier.modify();

        }.bind(this));
    },


    /**
     *
     */
    handleActivityBikeOdo_: function() {

        if (!this.userSettings_.displayBikeOdoInActivity) {
            return;
        }

        // Test where are on an activity...
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }

        if (_.isUndefined(window.pageView)) {
            return;
        }

        // Avoid running Extended data at the moment
        if (window.pageView.activity().attributes.type != "Ride") {
            return;
        }

        if (env.debugMode) console.log("Execute handleActivityBikeOdo_()");

        var bikeOdoProcessor = new BikeOdoProcessor(this.vacuumProcessor_, this.athleteIdAuthorOfActivity_);
        bikeOdoProcessor.getBikeOdoOfAthlete(function(bikeOdoArray) {

            var activityBikeOdoModifier = new ActivityBikeOdoModifier(bikeOdoArray, bikeOdoProcessor.getCacheKey());
            activityBikeOdoModifier.modify();

        }.bind(this));
    },


    /**
     *
     */
    handleActivitySegmentTimeComparison_: function() {

        // Test where are on an activity...
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }

        if (_.isUndefined(window.pageView)) {
            return;
        }

        // Only cycling is supported
        if (window.pageView.activity().attributes.type != "Ride") {
            return;
        }

        // Only for own activities
        if (this.athleteId_ != this.athleteIdAuthorOfActivity_) {
            return;
        }

        if (env.debugMode) console.log("Execute handleActivitySegmentTimeComparison_()");

        var activitySegmentTimeComparisonModifier = new ActivitySegmentTimeComparisonModifier(this.userSettings_);
        activitySegmentTimeComparisonModifier.modify();
    },


    /**
     *
     */
    handleActivityBestSplits_: function() {

        if (!this.userSettings_.displayActivityBestSplits) {
            return;
        }

        // Test where are on an activity...
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }

        if (_.isUndefined(window.pageView)) {
            return;
        }

        // Only cycling is supported
        if (window.pageView.activity().attributes.type != "Ride") {
            return;
        }

        if (env.debugMode) console.log("Execute handleActivityBestSplits_()");

        var self = this;

        this.vacuumProcessor_.getActivityStream(function(activityCommonStats, jsonResponse, athleteWeight, hasPowerMeter) {
            Helper.getFromStorage(self.extensionId_, StorageManager.storageSyncType, 'bestSplitsConfiguration', function(response) {
                var activityBestSplitsModifier = new ActivityBestSplitsModifier(self.userSettings_, jsonResponse, hasPowerMeter, response.data, function(splitsConfiguration) {
                    Helper.setToStorage(self.extensionId_, StorageManager.storageSyncType, 'bestSplitsConfiguration', splitsConfiguration, function(response) {});
                });
                activityBestSplitsModifier.modify();
            });
        }.bind(this));
    },

    /**
     *
     */
    handleRunningGradeAdjustedPace_: function() {

        if (!this.userSettings_.activateRunningGradeAdjustedPace) {
            return;
        }

        if (_.isUndefined(window.pageView)) {
            return;
        }

        // Avoid bike activity
        if (window.pageView.activity().attributes.type != "Run") {
            return;
        }


        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }

        if (env.debugMode) console.log("Execute handleRunningGradeAdjustedPace_()");

        var runningGradeAdjustedPace = new RunningGradeAdjustedPaceModifier();
        runningGradeAdjustedPace.modify();
    },


    /**
     *
     */
    handleRunningHeartRate_: function() {

        if (!this.userSettings_.activateRunningHeartRate) {
            return;
        }

        if (_.isUndefined(window.pageView)) {
            return;
        }

        // Avoid bike activity
        if (window.pageView.activity().attributes.type != "Run") {
            return;
        }


        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }

        if (env.debugMode) console.log("Execute handleRunningHeartRate_()");

        var runningHeartRateModifier = new RunningHeartRateModifier();
        runningHeartRateModifier.modify();
    },


    /**
     *
     */
    handleMoveFooterOutofWay_: function() {

        // If we are not on a activitie's segment page then return...
        if (!window.location.pathname.match(/activities\/\d*\/segments/)) {
            return;
        }

        // Only for running activity
        if (window.pageView.activity().attributes.type != "Run") {
            return;
        }

		// ** manually refresh activity segment page if you want to move away footer **
		fh=document.getElementsByClassName("run segments-list")[0].offsetHeight;
		if (env.debugMode) console.log("Moving footer out of way..."+fh);
		$('footer')[1].setAttribute("style", "position: relative; top: "+(fh-300)+"px; opacity: 0.33;");
		$('footer')[2].setAttribute("style", "position: relative; top: "+(300)+"px; opacity: 0.33;");
    },


    /**
     *
     */
    handleActivityQRCodeDisplay_: function() {

        // Test where are on an activity...
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }

        if (_.isUndefined(window.pageView)) {
            return;
        }

        var activityQRCodeDisplayModifier = new ActivityQRCodeDisplayModifier(this.appResources_, this.activityId_);
        activityQRCodeDisplayModifier.modify();

    },


    /**
     *
     */
    handleVirtualPartner_: function() {

        // Test where are on an activity...
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }

        var virtualPartnerModifier = new VirtualPartnerModifier(this.activityId_);
        virtualPartnerModifier.modify();
    },


    /**
     *
     */
	handleGoogleMapsComeBackModifier: function() {  
   
		if (window.location.pathname.match(/\/truncate/)) { // Skipping on activity cropping
			return;
		}
		
	  	if (!this.userSettings_.reviveGoogleMaps) {  
	    	return;  
    	}  
 
    	// Test where are on an activity...  or segment... // doesn't work on segment view, yet
//	    if ((!window.location.pathname.match(/^\/activities/)) && (!window.location.pathname.match(/^\/segments/))) {  
	    if (!window.location.pathname.match(/^\/activities/)) {  
	    	return;  
    	}  
 
    	var googleMapsComeBackModifier = new GoogleMapsComeBackModifier(this.activityId_, this.appResources_, this.userSettings_);
    	googleMapsComeBackModifier.modify();  
   },  


    /**
     * Launch a track event once a day (is user use it once a day), to follow is account type
     */
    handleTrackTodayIncommingConnection_: function() {

        var userHasConnectSince24Hour = StorageManager.getCookie('stravistix_daily_connection_done');

        if (env.debugMode) console.log("Cookie 'stravistix_daily_connection_done' value found is: " + userHasConnectSince24Hour);

        if (_.isNull(this.athleteId_)) {
            if (env.debugMode) console.log("athleteId is empty value: " + this.athleteId_);
            return;
        }

        if (_.isNull(userHasConnectSince24Hour) || _.isEmpty(userHasConnectSince24Hour)) {

            var accountType = 'Free';
            var accountName = this.athleteName_;

            // We enter in that condition if user is premium or pro
            if (!_.isNull(this.isPremium_) && this.isPremium_ === true) {
                accountType = 'Premium';
            }

            // accountType is overridden with "pro" if that condition is true
            if (!_.isNull(this.isPro_) && this.isPro_ === true) {
                accountType = 'Pro';
            }

            var eventAction = 'DailyConnection_Account_' + accountType;

            // Push IncomingConnection to piwik
            var eventName = accountName + ' #' + this.athleteId_ + ' v' + this.appResources_.extVersion;

            if (env.debugMode) console.log("Cookie 'stravistix_daily_connection_done' not found, send track <IncomingConnection> / <" + accountType + "> / <" + eventName + ">");

            if (!env.debugMode) {
                _spTrack('send', 'event', 'DailyConnection', eventAction, eventName);
            }

            // Create cookie to avoid push during 1 day
            StorageManager.setCookie('stravistix_daily_connection_done', true, 1);

        } else {

            if (env.debugMode) console.log("Cookie 'stravistix_daily_connection_done' exist, DO NOT TRACK IncomingConnection");

        }
    }
};
