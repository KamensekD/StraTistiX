var env = {
    buildNumber: 230, // v2.3.0 release
//    based on ThomasChampagne's v2.2.1
    preview: false, // Must be false in release
    analyticsTrackingID: 'UA-62527089-1', 	// my "Release" Google Analytics Code
//    analyticsTrackingID: 'UA-62527089-2', 		// my "Development" Google Analytics Code

    debugMode: 0, // Debugmode/level - 0 or false=off, 1=some dbg.messages, 2=all dbg. messages   Must be false in release
//    debugMode: false, // Must be false in release, also check Helper.js and Content.js for debug!!!
    forceUpdated: false, // Must be false in release
    useActivityStreamCache: true // Must be true in release
};
