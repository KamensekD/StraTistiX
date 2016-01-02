//if (env.debugMode) console.warn('Begin     StravistiX.js');
//  \--- this line should't be here, because then BestSplits and Updated message don't work. No idea why?!?!?
/**
 *   StravistiX is responsible of linking processors with modfiers and user settings/health data
 *






/*    check for correct working with following acitivities:

      Downhill < Mostly Down < Flat < Mostly Flat < A Bit Hilly <  Hilly  < Very Hilly < Mountanous < Alpine

                                                StravaType      Streams                         Comment                                 Problems
Bike:                                           ______________  ______________________________  ______________________________________  ____________________________________________
~~~~~                                           
https://www.strava.com/activities/423623105     Ride            (GPS)                           downhill      ANT

https://www.strava.com/activities/122932386     Ride            (GPS, HR, cadence)              mostly down   My

https://www.strava.com/activities/338896255     Ride            (GPS, power, HR, cadence, T)    flat          Marcel Wyss TdF TT
https://www.strava.com/activities/339726290     Ride            (GPS, power, HR, cadence, T)    flat          Marcel Wyss TdF 2

https://www.strava.com/activities/355194013     Ride            (GPS, power, HR, cadence, T)    mostly flat   Marcel Wyss TdF 21

https://www.strava.com/activities/342465523     Ride            (GPS, power, HR, cadence, T)    a bit hilly   Marcel Wyss TdF 6

https://www.strava.com/activities/340423634     Ride            (GPS, power, HR, cadence, T)    hilly         Marcel Wyss TdF 3
https://www.strava.com/activities/275555059     Ride            (GPS, HR, cadence)              hilly         TTR
https://www.strava.com/activities/155030220     Ride            (GPS)                           hilly         Tojzl						* badQ gps -> VAM calculations not good
https://www.strava.com/activities/69193942      Ride            (GPS)                           hilly         trikotna

https://www.strava.com/activities/145492114     Ride            (GPS)                           very hilly    Žavcar
https://www.strava.com/activities/345973208     Ride            (GPS, power, HR, cadence, T)    very hilly    Wyss TdF 10

https://www.strava.com/activities/441531034     Ride            (GPS*, HR, cadence) *baro       mountainous   My Rið
https://www.strava.com/activities/347389644     Ride            (GPS, power, HR, cadence, T)    mountainous   Marcel Wyss TdF 12
https://www.strava.com/activities/344723361     Ride            (GPS*, HR, cadence) *baro       mountainous   My

https://www.strava.com/activities/353116695     Ride            (GPS, power, HR, cadence, T)    alpine        Marcel Wyss TdF 19


Bike - stationary: (with GPS)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
https://www.strava.com/activities/443325145     Workout         (*GPS*, power, HR, cadence, T)  GPS, but really stationary   Elle
                                                                                                -> avg_velocity << 1 (velocity_avgThreshold ~ 0.5)

Bike - trainer: (no GPS)
~~~~~~~~~~~~~~~~~~~~~~~~
https://www.strava.com/activities/442775904     Workout         (HR, cadence, power, speed)     on trainer - with speed  Julian
https://www.strava.com/activities/442206536     Workout         (HR, cadence, power)            on trainer - no speed    Denzyl			* pedaling time shows 0, elapsed and moving time bad



Run:
~~~~
https://www.strava.com/activities/255144956     Run             (GPS, HR, cadence)              downhill      My
*https://www.strava.com/activities/249069073    Run             (GPS, HR, cadence)              downhill      My                        UP grade avg shows negative?

https://www.strava.com/activities/245769754     Run             (GPS, HR, cadence)              mostly down   My

https://www.strava.com/activities/200732119     Run             (GPS, HR, cadence)              flat          My Banovci

https://www.strava.com/activities/325514295     Run             (GPS, HR, cadence)              mostly flat   My Tek trojk				*RACE* elaped and moving time 0 until reload at overview
https://www.strava.com/activities/429614312     Run             (GPS, HR, cadence)              mostly flat   My
https://www.strava.com/activities/152922062     Run             (GPS, HR, cadence)              mostly flat   My nabrežje

https://www.strava.com/activities/307138432     Run             (GPS, HR, cadence)              a bit hilly   My park, 3r

https://www.strava.com/activities/442681892     Run             (GPS, HR, cadence)              hilly         My panorama
https://www.strava.com/activities/107829725     Run             (GPS, HR, cadence)              hilly         My 2x Kalvarija
https://www.strava.com/activities/107829727     Run             (GPS, HR, cadence)              hilly         My 3x Kalvarija
https://www.strava.com/activities/159495959     Run             (GPS, HR, cadence)              hilly         My proti obr. domu

https://www.strava.com/activities/235711434     Run             (GPS, HR, cadence)              very hilly    My zppp, stolp, šani

https://www.strava.com/activities/380222430     Run             (GPS, HR, cadence)              mountainous   My trail maraton 22km		*RACE* elaped and moving time 0 until reload at overview
https://www.strava.com/activities/379977674     Run             (GPS, HR, cadence, T)           mountainous   Balazs Trail Maraton 42km

*alpine*


Hike (*** hike=run ***)
~~~~~
https://www.strava.com/activities/119185669     hike            (GPS, HR, cadence)              dowhnill

* mostly down *

https://www.strava.com/activities/83625036      hike            (only GPS) / badQ GPS           flat           My Vrbanski plato

https://www.strava.com/activities/83623294      hike            (only GPS) / badQ GPS           mostly flat    My LJ

* a bit hilly *

https://www.strava.com/activities/83625038      hike            (only GPS)                      hilly (could also be a bit hilly) my

https://www.strava.com/activities/214252443     hike            (GPS, HR, cadence)              hilly          My trikotna

* very hilly *

https://www.strava.com/activities/433810631     hike            (GPS, power, HR, cadence, T)    mountainous

* alpine *



Row: (on trainer)
~~~~~~~~~~~~~~~~~
https://www.strava.com/activities/269549200     StationaryOther (HR, cadence)










Console Activity Data Access examples:
================================================================================

this
this.parent

$.browser

this.VacuumProcessor.prototype.getActivityCommonStats()
this.VacuumProcessor.prototype.getActivityCommonStats().movingTime
this.VacuumProcessor.prototype.getActivityCommonStats().elapsedTime

activityProcessor.activityStream      - streams					   - accessible if not cached
activityProcessor.activityStatsMap    - common stats (from vacuum) - accessible if not cached

this.stravistiX			this.StravistiX
this.stravistiX.userSettings_
this.stravistiX.vacuumProcessor_.getActivityCommonStats()
this.stravistiX.appResources_

this.stravistiX.activityProcessor_
this.stravistiX.activityProcessor_.zones			zone distribution (ascent, cadence, elevation, grade, pace, power, speed)
this.stravistiX.activityProcessor_.userHrrZones_	zone distribution HRR

this.strava				this.Strava				this.StravaStreams

this.ActivityProcessor
this.Helper

this.RPEnote1

this.VacuumProcessor

this.activityName
this.currentAthlete.attributes

this.document

this.env

this.lightboxdata     pageView.lightboxData()     pageView.lightboxData().title

this.version	??? v2.2

this.pageView     this.pageView.activity().attributes
this.pageView.streams().streamData.data.altitude		=		this.pageView.streams().attributes.altitude


================================================================================






 */
function StravistiX(userSettings, appResources) {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        this.userSettings_              = userSettings;
        this.appResources_              = appResources;
        this.extensionId_               = this.appResources_.extensionId;


        this.vacuumProcessor_           = new VacuumProcessor();
        this.activityProcessor_         = new ActivityProcessor(this.vacuumProcessor_, this.userSettings_.userHrrZones, this.userSettings_.zones);


// first get basic about athlete and activity
        this.athleteId_                 = this.vacuumProcessor_.getAthleteId();
        this.athleteName_               = this.vacuumProcessor_.getAthleteName();
        this.athleteIdAuthorOfActivity_ = this.vacuumProcessor_.getAthleteIdAuthorOfActivity();
        this.isPremium_                 = this.vacuumProcessor_.getPremiumStatus();
        this.isPro_                     = this.vacuumProcessor_.getProStatus();
        this.activityId_                = this.vacuumProcessor_.getActivityId();
        this.activityName_              = this.vacuumProcessor_.getActivityName();
        this.activityTime_              = this.vacuumProcessor_.getActivityTime();



    // Make the work...
    this.init_();
    


env.debugMode>0   && console.log("--------------------");
if (env.debugMode && (typeof pageView !== 'undefined')) console.warn( "Activity: " + pageView.activity().get('type') + " (" + pageView.activity().get('id') + ")" );
if (env.debugMode && (typeof pageView !== 'undefined')) if( pageView.activityAthlete() != null ) console.warn( "Athlete:  " + pageView.activityAthlete().get('display_name') + " (" + pageView.activityAthlete().get('id') + ")" );
env.debugMode>0   && console.log("--------------------");
} // StravistiX




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



//  --------------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    init_: function init_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )



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
env.debugMode>0   && console.warn('\n > (f: StravistiX.js) >   COMMON   < ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] + '\n\n')
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





                //
        this.handleExtendedActivityData_();
                //





        // Bike
env.debugMode>0   && console.warn(' > (f: StravistiX.js) >   BIKE   < ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        this.handleNearbySegments_();
        this.handleActivityBikeOdo_();
        this.handleActivitySegmentTimeComparison_();
        this.handleActivityBestSplits_();



        // Run
env.debugMode>0   && console.warn(' > (f: StravistiX.js) >   RUN   < ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        this.handleRunningGradeAdjustedPace_();
        this.handleRunningHeartRate_();
        this.handleMoveFooterOutofWay_();



        // All activities
env.debugMode>0   && console.warn(' > (f: StravistiX.js) >   ALL   < ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        this.handleActivityQRCodeDisplay_();
        this.handleVirtualPartner_();
        this.handleAthletesStats();



        // Must be done at the end
env.debugMode>0   && console.warn(' > (f: StravistiX.js) >   FINAL   < ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        this.handleTrackTodayIncommingConnection_();
        this.handleGoogleMapsComeBackModifier();



    }, //_init
    /**
     *
     */
//  --------------------------------------------------------------------------------------------------------------------





    /**
     *
     */
    handleForwardToWWW_: function handleForwardToWWW() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

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
    handleExtensionHasJustUpdated_: function handleExtensionHasJustUpdated_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )


        // Clear localstorage
        // Especially for activies data stored in cache
        localStorage.clear(); sessionStorage.clear();
        console.error("Extension Has Updated ->   !!!   localstorage cleared   !!!");


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
     *   update message popup can be started with: "StravistiX.prototype.handleUpdateRibbon_()"
     */
    handleUpdateRibbon_: function handleUpdateRibbon_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

//        var title = 'StraTistiX updated/installed to <strong>v' + this.appResources_.extVersion + '</strong>';
        var title = 'StraTistiX recently added/updated/fixed features - v2.2.4';
        var message = '';
    message += "<font size=+1>"
        message += "- statistics now computed on <strong>weighted percentiles</strong><br/>"
        message += "&nbsp&nbsp(might have big impact for activities with dynamic sampling period!)<br/>"
        message += "- heart rate extended statistics now computed based on <strong>moving time</strong>, not total time<br/>"
        message += "&nbsp&nbsp(still not quite sure, which method is better... might decide to include both in future)<br/>"
        message += "<br/>"
        message += "- Added CSV export (for easy analysis in spreadsheet software)<br/>"
        message += "- Added Ascent speed statistics (VAM) for cycling<br/>"
        message += "- Improved 'Best Splits' - click to highlight the part of activity they represent!<br/>"
        message += "- Improved elevation data accuracy while computing extended statistics.<br/>"
        message += "&nbsp&nbsp(Elevation data smoothed using low pass filter with gain matched to Strava's)<br/>"
        message += "- Added cadence, power and altitude data in overview table<br/>"
		message += "- reordered and added some new data in extended statistics<br/>"
        message += "- Weather unis preferences<br/>"
        message += "- Various smaller additions and fixes, <span style='text-decoration: underline'>sorry</span> for bigbug in 2.0.0.1 - settings menu not working :/<br/>"
        
        message += "<br/></font>"
        message += "<font size=+1><strong>From previous updates:</strong></font><br><font size=-1>";
        message += "- improved grade profile word description<br>"
        message += "- Added year progression (activity count, distance, elevation, time) table and chart<br>"
        message += "- Added 'Best Splits' (distance, time, elevation, hr,...) to biking activities<br>"
        message += "- export of segments as Virtual Partner (cycling: button under segment compare)<br>"
        message += "- Added segment builder link to segments page<br>"
        message += "- Added biking segment time comparisons to KOM's and PR's<br>"
        message += "- Added weather at activity date/time (wind/temp/clouds/humidity)<br>"
        message += "- more analysis data (climbing time and speed, pedalling time,...)<br>"
        message += "- Searchable common settings<br>"
        message += "- Moved leftside buttons/links under Edit/Action buttons<br>"
        message += "- Moved some leftside links to menu, reordered menu a bit<br>"
        message += "- Changed HR related computations from total to moving time<br>"
        message += "- Filtering altitude for gain computations<br>"
        message += "- Various Fixes<br></font>"
        message += "<br>* Credits for many of new features go to <a href=https://github.com/tazmanska>tomasz.terlecki / tazmanska</a> and <a href=https://github.com/glandais>Gabriel Landais / glandais</a> !"

//        message += "</h4>";
//        message += "<h4><strong>BUGFIXES:</strong></h4><h5>";
//        message += "- bugfix<br/>"
//        message += "</h5><br>";

        message += "<br><br><div align='center'>";
        message += "<h4>This is <strong><a href='https://chrome.google.com/webstore/detail/stratistix-with-arpee-sco/bilbbbdgdimchenccmooakpfomfajepd'>StraTistiX</a></strong> - Dejan Kamensek's <a href='https://github.com/KamensekD/StraTistiX'>fork</a> of <a href='https://chrome.google.com/webstore/detail/stravistix-for-strava/dhiaggccakkgdfcadnklkbljcgicpckn'>StravistiX</a><br>";
        message += '<div align><font size=-1>Original StravistiX (formerly named StravaPlus) is being developed by Thomas Champagne</font></h4></div>';
//        message += '<h4><a target="_blank" href="' + this.appResources_.settingsLink + '#/donate">Donate Thomas Champagne to get more features</a></h4>';

        $.fancybox('<h2>' + title + '</h2>' + message);
    },




    /**
     *
     */
    handleAthletesStats: function handleAthletesStats() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        // If we are not on the athletes page then return...
        if (!window.location.pathname.match(new RegExp("/athletes/" + this.athleteId_ + "$", "g"))) {
            return;
        }

        var athleteStatsModifier = new AthleteStatsModifier(this.appResources_);
        athleteStatsModifier.modify();
    },



    /**
     *
     */
    handlePreviewRibbon_: function handlePreviewRibbon_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
        var globalStyle = 'background-color: #FFF200; color: rgb(84, 84, 84); font-size: 12px; padding: 5px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; text-align: center;';
        var html = '<div id="updateRibbon" style="' + globalStyle + '"><strong>WARNING</strong> You are running a preview of <strong>StravistiX</strong>, to remove it, open a new tab and type <strong>chrome://extensions</strong></div>';
        $('body').before(html);
    },



    /**
     *
     */
    handleMenu_: function handleMenu_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        var menuModifier = new MenuModifier(this.athleteId_, this.userSettings_.highLightStravistiXFeature, this.appResources_);
        menuModifier.modify();
    },



    /**
     *
     */
    handleRemoteLinks_: function handleRemoteLinks_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        // If we are not on a segment or activity page then return...
//        if (!window.location.pathname.match(/^\/segments\/(\d+)$/) && !window.location.pathname.match(/^\/activities/)) {
        if (!window.location.pathname.match(/^\/segments\/(\d+)$/) && !window.location.pathname.match(/^\/activities/) && !window.location.pathname.match(/^\/publishes\/wizard\\?/)) {
            return;
        }

        if (!this.userSettings_.remoteLinks) {
            return;
        }

        var remoteLinksModifier = new RemoteLinksModifier(this.userSettings_.highLightStravistiXFeature, this.appResources_, (this.athleteIdAuthorOfActivity_ === this.athleteId_), this.userSettings_.customMapboxStyle);
        remoteLinksModifier.modify();
    },



    /**
     *
     */
    handleWindyTyModifier_: function handleWindyTyModifier_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

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

        var windyTyModifier = new WindyTyModifier(this.activityId_, this.appResources_, this.userSettings_);
        windyTyModifier.modify();
    },



    /**
     *
     */
    handleActivityScrolling_: function handleActivityScrolling_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        if (!this.userSettings_.feedAutoScroll) {
            return;
        }

        var activityScrollingModifier = new ActivityScrollingModifier();
        activityScrollingModifier.modify();
    },



    /**
     *
     */
    handleDefaultLeaderboardFilter_: function handleDefaultLeaderboardFilter_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        // If we are not on a segment or activity page then return...
        if (!window.location.pathname.match(/^\/segments\/(\d+)$/) && !window.location.pathname.match(/^\/activities/)) {
            return;
        }

        // Kick out if we are not on SegmentLeaderboardView
        try {
            eval('Strava.Labs.Activities.SegmentLeaderboardView');
        } catch (err) {
env.debugMode>0   && console.log('Kick out no Strava.Labs.Activities.SegmentLeaderboardView available');
            return;
        }

        var defaultLeaderboardFilterModifier = new DefaultLeaderboardFilterModifier(this.userSettings_.defaultLeaderboardFilter);
        defaultLeaderboardFilterModifier.modify();
    },



    /**
     *
     */
    handleSegmentRankPercentage_: function handleSegmentRankPercentage_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        if (!this.userSettings_.displaySegmentRankPercentage) {
            return;
        }

        // If we are not on a segment page then return...
        if (!window.location.pathname.match(/^\/segments\/(\d+)$/)) {
            return;
        }

        var segmentRankPercentage = new SegmentRankPercentageModifier();
        segmentRankPercentage.modify();
    },



    /**
     *
     */
    handleActivityGoogleMapType_: function handleActivityGoogleMapType_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        // Test where are on an activity...
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }

        var activityGoogleMapTypeModifier = new ActivityGoogleMapTypeModifier(this.userSettings_.activityGoogleMapType);
        activityGoogleMapTypeModifier.modify();
    },



    /**
     *
     */
    handleCustomMapboxStyle_: function handleCustomMapboxStyle_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        // Test where are on an activity...
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }

    },



    /**
     *
     */
    handleHidePremium_: function handleHidePremium_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        // Eject premium users of this "Hiding" feature
        // Even if they checked "ON" the hide premium option
        if (this.isPremium_) {
            return;
        }

        if (!this.userSettings_.hidePremiumFeatures) {
            return;
        }

        var hidePremiumModifier = new HidePremiumModifier();
        hidePremiumModifier.modify();
    },



    /**
     *
     */
    handleHideFeed_: function handleHideFeed_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        // Test if where are on dashboard page
        if (!window.location.pathname.match(/^\/dashboard/)) {
            return;
        }

        if (!this.userSettings_.feedHideChallenges && !this.userSettings_.feedHideCreatedRoutes) {
            return;
        }

        var hideFeedModifier = new HideFeedModifier(this.userSettings_.feedHideChallenges, this.userSettings_.feedHideCreatedRoutes);
        hideFeedModifier.modify();
    },



    /**
     *
     */
    handleDisplayFlyByFeedModifier_: function handleDisplayFlyByFeedModifier_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        // Test if where are on dashboard page
        if (!window.location.pathname.match(/^\/dashboard/)) {
            return;
        }

        var displayFlyByFeedModifier = new DisplayFlyByFeedModifier();
        displayFlyByFeedModifier.modify();
    },



    /**
     *
     */
    handleNearbySegments_: function handleNearbySegments_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        if (!this.userSettings_.displayNearbySegments) {
            return;
        }

        // If we are not on a segment page then return...
        var segmentData = window.location.pathname.match(/^\/segments\/(\d+)$/);
        if (_.isNull(segmentData)) {
            return;
        }

        // Getting segment id
        var segmentId = parseInt(segmentData[1]);

        var segmentProcessor = new SegmentProcessor(this.vacuumProcessor_, segmentId);

        var arrayOfNearbySegments = segmentProcessor.getNearbySegmentsAround(function(jsonSegments) {

env.debugMode>0   && console.log(jsonSegments);

            var nearbySegmentsModifier = new NearbySegmentsModifier(jsonSegments, this.appResources_, this.userSettings_.highLightStravistiXFeature);
            nearbySegmentsModifier.modify();

        }.bind(this));
    },



    /**
     *
     */
    handleActivityBikeOdo_: function handleActivityBikeOdo_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

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

        var bikeOdoProcessor = new BikeOdoProcessor(this.vacuumProcessor_, this.athleteIdAuthorOfActivity_);
        bikeOdoProcessor.getBikeOdoOfAthlete(function(bikeOdoArray) {

            var activityBikeOdoModifier = new ActivityBikeOdoModifier(bikeOdoArray, bikeOdoProcessor.getCacheKey());
            activityBikeOdoModifier.modify();

        }.bind(this));
    },



    /**
     *
     */
    handleActivitySegmentTimeComparison_: function handleActivitySegmentTimeComparison_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

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

        var activitySegmentTimeComparisonModifier = new ActivitySegmentTimeComparisonModifier(this.userSettings_);
        activitySegmentTimeComparisonModifier.modify();
    },



    /**
     *
     */
    handleActivityBestSplits_: function handleActivityBestSplits_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

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

        var self = this;

        // TODO Implement cache here: get stream from cache if exist
        this.vacuumProcessor_.getActivityStream(function(activityCommonStats, jsonResponse, athleteWeight, hasPowerMeter) {
            Helper.getFromStorage(self.extensionId_, StorageManager.storageSyncType, 'bestSplitsConfiguration', function(response) {
//                var activityBestSplitsModifier = new ActivityBestSplitsModifier(self.userSettings_, jsonResponse, activityCommonStats, hasPowerMeter, response.data, function(splitsConfiguration) {
                var activityBestSplitsModifier = new ActivityBestSplitsModifier(self.activityId_, self.userSettings_, jsonResponse, hasPowerMeter, response.data, function(splitsConfiguration) {
                    Helper.setToStorage(self.extensionId_, StorageManager.storageSyncType, 'bestSplitsConfiguration', splitsConfiguration, function(response) {});
                });
                activityBestSplitsModifier.modify();
            });
        }.bind(this));
    },



    /**
     *
     */
    handleRunningGradeAdjustedPace_: function handleRunningGradeAdjustedPace_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

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

        var runningGradeAdjustedPace = new RunningGradeAdjustedPaceModifier();
        runningGradeAdjustedPace.modify();
    },



    /**
     *
     */
    handleRunningHeartRate_: function handleRunningHeartRate_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

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

        var runningHeartRateModifier = new RunningHeartRateModifier();
        runningHeartRateModifier.modify();
    },



    /**
     *
     */
    handleMoveFooterOutofWay_: function handleMoveFooterOutofWay_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

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
env.debugMode>0   && console.log("Moving footer out of way..."+fh);
                if ( typeof $('footer')[1] !== 'undefined' )   $('footer')[1].setAttribute("style", "position: relative; top: "+(fh-300)+"px; opacity: 0.33;");
                if ( typeof $('footer')[2] !== 'undefined' )   $('footer')[2].setAttribute("style", "position: relative; top: "+(300)+"px; opacity: 0.33;");
    },



    /**
     *
     */
    handleActivityQRCodeDisplay_: function handleActivityQRCodeDisplay_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

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
    handleVirtualPartner_: function handleVirtualPartner_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

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
        handleGoogleMapsComeBackModifier: function handleGoogleMapsComeBackModifier() {  
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )
   
                if (window.location.pathname.match(/\/truncate/)) { // Skipping on activity cropping
                        return;
                }
                
                if (!this.userSettings_.reviveGoogleMaps) {  
                return;  
        }  
 
        // Test where are on an activity...  or segment... // doesn't work on segment view, yet
//          if ((!window.location.pathname.match(/^\/activities/)) && (!window.location.pathname.match(/^\/segments/))) {  
            if (!window.location.pathname.match(/^\/activities/)) {  
                return;  
        }  
 
        var googleMapsComeBackModifier = new GoogleMapsComeBackModifier(this.activityId_, this.appResources_, this.userSettings_);
        googleMapsComeBackModifier.modify();  
   },  



    /**
     * Launch a track event once a day (is user use it once a day), to follow is account type
     */
    handleTrackTodayIncommingConnection_: function handleTrackTodayIncommingConnection_() {
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        var userHasConnectSince24Hour = StorageManager.getCookie('stravistix_daily_connection_done');

env.debugMode>0   && console.log("Cookie 'stravistix_daily_connection_done' value found is: " + userHasConnectSince24Hour);

        if (_.isNull(this.athleteId_)) {
env.debugMode>0   && console.log("athleteId is empty value: " + this.athleteId_);
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

env.debugMode>0   && console.log("Cookie 'stravistix_daily_connection_done' not found, send track <IncomingConnection> / <" + accountType + "> / <" + eventName + ">");

            if (!env.debugMode) {
                _spTrack('send', 'event', 'DailyConnection', eventAction, eventName);
            }

            // Create cookie to avoid push during 1 day
            StorageManager.setCookie('stravistix_daily_connection_done', true, 1);

        } else {

env.debugMode>0   && console.log("Cookie 'stravistix_daily_connection_done' exist, DO NOT TRACK IncomingConnection");

        }
    },





//  --------------------------------------------------------------------------------------------------------------------
    /**
     *
     */
    handleExtendedActivityData_: function handleExtendedActivityData_() {
env.debugMode>0   && console.warn(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

        if (_.isUndefined(window.pageView)) {
            return;
        }

// without var -> global scope (window.activityType)
        activityType = pageView.activity().get('type');		// move into "// first get basic about athlete and activity" section
//        var activityType = pageView.activity().get('type');

        // Skip manual activities
        if (activityType === 'Manual') {
env.debugMode>0   && console.log("--- StravistiX.js skip Manual activity: " + activityType);
            return;
        }



        this.activityProcessor_.setActivityType(activityType);
env.debugMode>0   && console.warn("--- StravistiX.js Getting activity data and analysing... ");





//  ------------------------------------
        this.activityProcessor_.getAnalysisData(
            this.activityId_,
            this.userSettings_.userGender,
            this.userSettings_.userRestHr,
            this.userSettings_.userMaxHr,
            this.userSettings_.userFTP,

            function getAnalysisData (analysisData) { // Callback when analysis data has been computed
env.debugMode>0   && console.log(' > (f: StravistiX.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] )

                var extendedActivityDataModifier = null;
                var basicInfos = {
//                    activityName: this.vacuumProcessor_.getActivityName(),
//                    activityTime: this.vacuumProcessor_.getActivityTime()
                    activityName: this.activityName_,
                    activityTime: this.activityTime_
                }

                // write activity type on page for all except Ride/Run activities
	        	var html = '';
    	    	if (this.isPremium_)    html += '<div  style="line-height:90%; padding: 0px 0px 0px 22px;';
        		else            		html += '<div  style="line-height:90%; padding: 0px 0px 0px 0px;';
                html += 'font-size: 8px;color: rgb(180, 180, 180);">Activity type:   - <strong>'+window.pageView.activity().attributes.type+'</strong> -</div>';
                $(".js-activity-privacy").after(html);

env.debugMode>0   && console.log("--- StravistiX.js switch (activityType): " + activityType);
                switch (activityType) {


                    case 'Ride':
                        extendedActivityDataModifier = new CyclingExtendedActivityDataModifier(analysisData, this.appResources_, this.userSettings_, this.athleteId_, this.athleteIdAuthorOfActivity_, basicInfos);
                        break;


                    case 'Run':
                        extendedActivityDataModifier = new RunningExtendedActivityDataModifier(analysisData, this.appResources_, this.userSettings_, this.athleteId_, this.athleteIdAuthorOfActivity_, basicInfos);
                        break;


                    case 'StationaryOther':
                    // for Workout, Rowing,...
                        extendedActivityDataModifier = new GenericExtendedActivityDataModifier(analysisData, this.appResources_, this.userSettings_, this.athleteId_, this.athleteIdAuthorOfActivity_, basicInfos);
                        break;


                    case 'Swim':
                    // for Swimming,...
                        extendedActivityDataModifier = new GenericExtendedActivityDataModifier(analysisData, this.appResources_, this.userSettings_, this.athleteId_, this.athleteIdAuthorOfActivity_, basicInfos);
                        break;


                    default:
                        // extendedActivityDataModifier = new GenericExtendedActivityDataModifier(analysisData, this.appResources_, this.userSettings_, this.athleteId_, this.athleteIdAuthorOfActivity_); // DELAYED_FOR_TESTING
                        var html = '<p style="padding: 10px;background: #FFF0A0;font-size: 12px;color: rgb(103, 103, 103);">StraTistiX don\'t support <strong>Extended Data Features</strong> for this type of activity at the moment.</br></p>';
                        $('.inline-stats.section').parent().children().last().after(html);
                        break;


                }// switch

                if (extendedActivityDataModifier) {
                    extendedActivityDataModifier.modify();
                }

            }.bind(this)  // getAnalysisData
        );// this.activityProcessor_.getAnalysisData
//  ------------------------------------





        // Send opened activity type to ga for stats
        var updatedToEvent = {
            categorie: 'Analyse',
            action: 'openedActivityType',
            name: activityType
        };
        _spTrack('send', 'event', updatedToEvent.categorie, updatedToEvent.action, updatedToEvent.name);
    }// handleExtendedActivityData
    /**
     *
     */
//  --------------------------------------------------------------------------------------------------------------------





};// prototype



env.debugMode>0   && console.warn('End       StravistiX.js');
