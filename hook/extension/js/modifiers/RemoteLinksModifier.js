/**
 *   RemoteLinksModifier is responsible of ...
 */
function RemoteLinksModifier(highLightStravistiXFeature, appResources, authorOfActivity, customMapboxStyle) {
    this.appResources_ = appResources;
    this.highLightStravistiXFeature_ = highLightStravistiXFeature;
    this.htmlRemoteViewStyle = '';
    this.htmlRemoteViewForSegmentStyle = '';
    this.authorOfActivity = authorOfActivity;
    this.customMapboxStyle_ = customMapboxStyle;
}

/**
 * Define prototype
 */
RemoteLinksModifier.prototype = {

    modify: function modify() {

        if (this.highLightStravistiXFeature_) {
            this.htmlRemoteViewStyle = 'background: #fc4c02; color: #333;'; // TODO Make colors global
            this.htmlRemoteViewForSegmentStyle = 'background: #fc4c02; color: white;'; // TODO Make colors global
            this.htmlRemoteViewTextStyle = 'color: white;'; // TODO Make colors global
        }

        if (!_.isUndefined(window.pageView)) {
            this.modifyActivityPage_();
        }
        // if segment page is matching url
        if (!_.isNull(window.location.pathname.match(/^\/segments\/(\d+)$/))) {
            this.modifySegmentPage_();
        }
        // if create segment page is matching url
        if (!_.isNull(window.location.pathname.match(/^\/publishes\/wizard\\?/))) {
            this.modifyCreateSegmentPage_();
        }
    },

    /**
     * ...
     */
    modifyActivityPage_: function modifyActivityPage_() {
   	    customMapboxStyle=this.customMapboxStyle_;

        var remoteViewActivityLinksArray = [  // [ 0:image/text , 1:link (ID will be added) , 2:additional_string ]   for special cases 2= heatmap, simple_link, mapflipper

            ["<img width='16px' src='" + this.appResources_.labIcon + "'/> FlyBy",  'http://labs.strava.com/flyby/viewer/#',  ''],
            ["<img width='16px' src='" + this.appResources_.raceshapeIcon + "'/> Surface",  'http://strava-tools.raceshape.com/erea/?url=',  ''],
            ["HeatMap", "<img width='16px' src='" + this.appResources_.heatmapIcon + "'/>",
            	'heatmap', 'Strava Global Heatmap'],
            ["<img  src='" + this.appResources_.multimapIcon + "'/> MultiMap", 'http://www.jonathanokeeffe.com/strava/map.php',
            	'simple_link', "Jonathan o\'Keeffe\'s Multiple Ride Mapper"],
            ["<img width='16px' src='" + this.appResources_.veloviewerIcon + "'/> VeloViewer", 'http://veloviewer.com/activities/', '?referrer=stravistiX'],
            ["<img width='16px' src='" + this.appResources_.AnnualSummIcon + "'/> AnnualSumm", 'http://www.jonathanokeeffe.com/strava/annualSummary.php',
            	'simple_link', "Jonathan o\'Keeffe\'s Annual Summary"],
            ["<img src='" + this.appResources_.gpsvisualizerIcon + "'/>", 'http://www.gpsvisualizer.com/',
            	'gpsvisualizer', this.appResources_.gpsvMapIcon, this.appResources_.gpsvProfileIcon],
            ["MapFlipper", '',
            	'mapflipper',  this.appResources_.OCMIcon, this.appResources_.OCMlsIcon, this.appResources_.OCModIcon, this.appResources_.OSMIcon, this.appResources_.MBIcon, this.appResources_.OSMhbIcon]
];


        // Activity page
        // Adding remote view links on left panel
        var htmlRemoteView = "<ul class='pagenav' id='StraTistiX'><li class='group' style='" + this.htmlRemoteViewStyle + "'>";
        htmlRemoteView += "<ul class=''>";




//        $.each(remoteViewActivityLinksArray, function(customMapboxStyle) {
        $.each(remoteViewActivityLinksArray, function() {

            htmlRemoteView += "<li>";
			//
            // gpsvisualizer
            //
            if (this[2] == 'gpsvisualizer') {
                htmlRemoteView += "<a title='Advanced online utility for creating maps and profiles from geographic data' data-menu='' target='_blank' style='color: #333; padding-bottom: 0px' href='" + this[1] + "'>" + this[0] + "</a>";
                htmlRemoteView += "<span style='color: #333; padding-left: 30px'>";
                htmlRemoteView += "<font size='-2'><font color='darkorange'>S</font><font color='orange'>l</font><font color='green'>o</font><font color='red'>p</font><font color='blue'>e</font></font> ";
                htmlRemoteView += " <img id='GPSVisMapButton' title='Show slope colored Map' src='" + this[3]+ "' style='border:1px solid green; vertical-align: text-top;' />";
                htmlRemoteView += " <img id='GPSVisProfileButton' title='Show slope colored Profile' src='" + this[4]+ "' style='border:1px solid green; vertical-align: text-top;' />";
                 htmlRemoteView += "</span></li>";
			}
			//
            // mapflipper
            //
            else if (this[2] == 'mapflipper') {

                htmlRemoteView += '<a title="Click here to disable MapFlipper!" data-menu="" style="color: #333; padding-bottom: 0px" onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){};document.getElementById(\'map-type-control\').getElementsByTagName(\'li\')[1].getElementsByTagName(\'a\')[0].click();document.getElementById(\'map-type-control\').getElementsByTagName(\'li\')[1].getElementsByTagName(\'a\')[0].click()}">' + this[0] + '</a>';

                htmlRemoteView += "<span style='color: #333; padding-left: 30px'>";

                htmlRemoteView += '<img onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'http://tile.openstreetmap.org/$1/$2/$3.png\');})},1000)}"   title="Open Street Map" width="20px" src="' + this[6]+ '"/>';

                htmlRemoteView += '&nbsp<img onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'https://tile.thunderforest.com/cycle/$1/$2/$3.png\');})},1000)}"   title="Open Cycle Map" width="20px" src="' + this[3]+ '"/>';

                htmlRemoteView += '<img onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'https://tile.thunderforest.com/landscape/$1/$2/$3.png\');})},1000)}"   title="Open Cycle Map Landscape" width="20px" src="' + this[4]+ '"/>';

                htmlRemoteView += '<img onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'https://tile.thunderforest.com/outdoors/$1/$2/$3.png\');})},1000)}"   title="Open Cycle Map Outdoors" width="20px" src="' + this[5]+ '"/>';

                htmlRemoteView += '&nbsp<img onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'https://tiles.wmflabs.org/hikebike/$1/$2/$3.png\');})},1000)}"   title="Hike Bike Map" width="20px" src="' + this[8]+ '"/>';
                htmlRemoteView += "</span></li>";

                htmlRemoteView += "<span style='color: #333; padding-left: 30px'>";

//				console.log("Mapbox style: "+customMapboxStyle);

	            htmlRemoteView += '<img onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){if (this.src.indexOf(\'googleapis\')>-1){return}else{return this.src.replace(/mapbox\\.com\\/v4\\/strava\\.map-.+?\\d+\\//i,\'mapbox.com/v4/\'+customMapboxStyle+\'/\');}})},1000)}{document.getElementById(\'map-type-control\').getElementsByTagName(\'li\')[0].getElementsByTagName(\'a\')[0].click();}"   title="Toggle Replace Standard Map with Custom Mapbox Style" height="20px" src="' + this[7]+ '"/>';
    
    	        htmlRemoteView += '<span id="show_in_GM"></span>';

                
                htmlRemoteView += "</span></li>";
			//
            // heatmap
            //
            } else if (this[2] == 'heatmap') {
				// TODO Move geolocation permission ask out ?
				//
				var heatmap;
        		if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
                	function(position) {
 						// console.log("Position: "+position.coords.longitude+","+position.coords.latitude);
	            		heatmap = "http://labs.strava.com/heatmap/#12/" + position.coords.longitude + "/" + position.coords.latitude + "/yellow/both";
	                    $('#heatmap').attr('href', heatmap);
                		},
                		function(error) {
                    		if (error != null) {
                        		$('#heatmap').attr('href', '#');
                        		$('#heatmap').attr('target', '_self');
                        		$('#heatmap').attr('onclick', 'alert("Some StravistiX functions will not work without your location position. Please make sure you have allowed location tracking on this site. Click on the location icon placed on the right inside the chrome web address bar => Clear tracking setting => Refresh page > Allow tracking.")');
     	         	      	}
        	        	}
            		);
 				}
                htmlRemoteView += '<a id="heatmap" title="'+this[3]+'" data-menu=""  target="_blank" style="color: #333;" href="#">' + this[1] + this[0]+'</a>';
			//
            // simple link
            //
            } else if (this[2] == 'simple_link') {
                htmlRemoteView += '<a title="'+this[3]+'" data-menu="" target="_blank" style="color: #333;" href="' + this[1] + '">' + this[0] + '</a>';
			//
            // everything else ([0:link]+activity_id+[1:additional_string])
            //
            } else {
                htmlRemoteView += "<a data-menu='' target='_blank' style='color: #333;' href='" + this[1] + pageView.activity().id + this[2] + "'>" + this[0] + "</a>";                
            };
		    htmlRemoteView += "</li>";
        });
        htmlRemoteView += "</ul></ul>";
        htmlRemoteView += "</li><ul>";

        htmlRemoteView = $(htmlRemoteView);


//        $("#pagenav").append(htmlRemoteView);
        $(document.getElementsByClassName("actions-menu")).parent().append(htmlRemoteView); // move under edit



        // Add tcx export
        if (this.authorOfActivity) {
            var htmlForTCXExport = "<li><a href='" + window.location.pathname + "/export_tcx'>Export TCX</a></li>";
            $(".actions-menu .slide-menu .options").append(htmlForTCXExport);
        }



		/*  GPS Visualizer functions

			"activates" GPS visualizer map and profile "buttons"

		*/
		$('#GPSVisMapButton').click(function() {
			post('http://www.gpsvisualizer.com/map_input', {
				data: GPSvis_Data(pageView._streams.attributes),			// get to streams with pageView._streams....
				bg_map: 'google_4umaps', bg_opacity: 75, form: 'google', google_full_screen: 1,
				google_trk_clickable: 0, google_trk_outline: '0', google_wpt_filter_sort: 0,
				width: 960,	height: 660, trk_width: 4, trk_stats: 1, trk_hue: 120, tickmark_interval: '1km',
				trk_colorize: 'slope', colorize_max: 36, colorize_min: -36, colorize_gray: '0', colorize_reverse: 0, hue1: 0, hue2: 330,
				colorize_spectrum: 'http://shrani.si/f/o/U/vn1DrfO/1/reliefmap-36-36.png', legend_steps: 25,
//				trk_distance_threshold: 33, moving_average: 3
//				trk_distance_threshold: 25, moving_average: 2
				trk_distance_threshold: 20, moving_average: 5
			});
		})


		$('#GPSVisProfileButton').click(function() {
			
			trk_distance=pageView._activity.attributes.distance;
			// console.log("Distance: "+Math.round(trk_distance));
			var altit=pageView._streams.attributes.altitude.concat();		// get copy of altitude stream with pageView._streams.altitude
			altit.sort(function(a, b){return a-b});
			trk_altitudeMin=altit[0]; 
			trk_altitudeMax=altit[altit.length - 1];
			trk_altitudeRng=trk_altitudeMax-trk_altitudeMin;
			// console.log("Min alt.: "+Math.round(trk_altitudeMin));
			// console.log("Max alt.: "+Math.round(trk_altitudeMax));

			// calculate profile picture width from track distance (few fixed scales for better comparability)
			if (trk_distance>100000) {
				var profile_width  = Math.round( trk_distance / 10000 * 100 ); //    10px /1km from 1000 up
			} else if (trk_distance>50000) {
				var profile_width  = Math.round( trk_distance / 10000 * 200 ); //    20px /1km from 1000 up to 2000
			} else if (trk_distance>20000) {
				var profile_width  = Math.round( trk_distance / 10000 * 500 ); //    50px /1km from 1000 up to 2500
			} else if (trk_distance>10000) {
				var profile_width  = Math.round( trk_distance / 10000 * 1000 ); //  100px /1km from 1000 up to 2000
			} else if (trk_distance>5000) {
				var profile_width  = Math.round( trk_distance / 10000 * 2000 ); //  200px /1km from 1000 up to 2000
			} else if (trk_distance>2000) {
				var profile_width  = Math.round( trk_distance / 10000 * 5000 ); //  500px /1km from 1000 up to 2500
			} else { var profile_width = 800};	// minimum width is 800
//			console.log("Trk dist.: "+trk_distance+"m  profile_width:"+profile_width);

			// calculate profile picture height from track altitude range (few fixed scales for better comparability of similar workouts)
			if (trk_altitudeRng>2000) {
				var profile_height = Math.round( (trk_altitudeRng)/1000 * 200 ); //   200px /1000m from 400 up
			} else if (trk_altitudeRng>1000) {
				var profile_height = Math.round( (trk_altitudeRng)/1000 * 500 ); //   500px /1000m from 500 up to 1000
			} else if (trk_altitudeRng>500) {
				var profile_height = Math.round( (trk_altitudeRng)/1000 * 1000 ); //  100px /100m  from 500 up to 1000
			} else if (trk_altitudeRng>100) {
				var profile_height = Math.round( (trk_altitudeRng)/1000 * 2000 ); //  200px /100m  from 200 up to 1000
			} else { var profile_height = 140};	// minimum height is 140
//			console.log("Trk alt.rng: "+trk_altitudeRng+"m ["+trk_altitudeMin+"-"+trk_altitudeMax+"]  profile_height:"+profile_height);
//			console.log( Math.round(10000*profile_width/trk_distance) + "px/10km x " + Math.round(100*profile_height/trk_altitudeRng) + "px/100m");
			
			
			post('http://www.gpsvisualizer.com/profile_input', {
				data: GPSvis_Data(pageView._streams.attributes),		// get to streams with pageView._streams....
				width: profile_width, height: profile_height, trk_width: 3, trk_stats: 1,
				trk_colorize: 'slope', colorize_max: 36, colorize_min: -36, colorize_gray: '0', colorize_reverse: 0, hue1: 0, hue2: 330,
				colorize_spectrum: 'http://shrani.si/f/o/U/vn1DrfO/1/reliefmap-36-36.png', legend_steps: 25,
//				trk_distance_threshold: 33, moving_average: 3
//				trk_distance_threshold: 25, moving_average: 2
				trk_distance_threshold: 20, moving_average: 5
			});
		})



		/* **************************************************	post
	 	creates invisible form and makes post request with
	 	provided parameters

		usage:
				post('http://target-address', {
					parameter1: value1,
					parameter2: value1
					}, 'method*')			* can be omitted if method should be post

		*/
		function post(path, params, method) {
    		method = method || "post"; // Set method to post by default if not specified.
			var form = document.createElement("form");
			form.setAttribute("method", method);
			form.setAttribute("target", "_blank");
			form.setAttribute("action", path);

		    for(var key in params) {
		        if(params.hasOwnProperty(key)) {
            		var hiddenField = document.createElement("input");
            		hiddenField.setAttribute("type", "hidden");
            		hiddenField.setAttribute("name", key);
            		hiddenField.setAttribute("value", params[key]);
		            form.appendChild(hiddenField);
         		}
    		}
	    	document.body.appendChild(form);
    		form.submit();
		}
		/* **************************************************	post



		/* **************************************************	GPSvis_Data
	 	return gps data from streams in apropriate format for
	 	usage with GPSVisualizer submit form
		*/
		function GPSvis_Data(streams){

		var gps_data='';
		/*   example of data:
		var gps_data='type,latitude,longitude,alt,name,desc\n';
		gps_data+='W,36.977000,-122.027000,7,SC,Santa Cruz\n';
		gps_data+='T,36.972163,-122.035610,26,Track 1\n';
		gps_data+='T,36.988383,-122.021993,26\n';
		gps_data+='T,36.987797,-121.991105,30\n';
		*/
		gps_data+='latitude,longitude,alt\n';
		for (i = 0; i < streams.distance.length; i++) {
			gps_data+=streams.latlng[i]+',';		// latitude and longitude
			gps_data+=streams.altitude[i]+"\n";  	// altitude (m)
		}
		return gps_data;
		}
		// **************************************************	GPSvis_Data



    },// modifyActivityPage_






    /**
     * ...
     */
    modifySegmentPage_: function modifySegmentPage_() {
   	    customMapboxStyle=this.customMapboxStyle_;

        // // Segment external links
        var segmentData = window.location.pathname.match(/^\/segments\/(\d+)$/);

        if (segmentData == null) {
            return;
        }

        // Getting segment id
        var segmentId = segmentData[1];

        var remoteViewSegmentLinksArray = [
            ["<img width='24px' style='vertical-align:middle' src='" + this.appResources_.veloviewerIcon + "'/> <span>VeloViewer</span>", 'http://veloviewer.com/segment/', '?referrer=stravistiX'],
            ["<img width='24px' style='vertical-align:middle' src='" + this.appResources_.pollIcon + "'/> <span>Segment Stats</span>", 'http://www.jonathanokeeffe.com/strava/segmentDetails.php?segmentId=', '']
        ];
        var html = "<div class='module' style='padding-bottom: 10px;'>";
//        html += "<div class='drop-down-menu' style='width: 100%; background: #fc4c02; color: white;'>";
//        html += "<div class='selection' style='" + this.htmlRemoteViewForSegmentStyle + "'><img style='vertical-align:middle' src='" + this.appResources_.remoteViewIcon + "'/> <span>Remote Segment View</span></div>";
        html += "<ul class='options' style='" + this.htmlRemoteViewStyle + "'>";

        $.each(remoteViewSegmentLinksArray, function() {
            html += "<li><a target='_blank' href='" + this[1] + segmentId + this[2] + "' style='" + this.htmlRemoteViewTextStyle + "'>" + this[0] + "</a></li>";
        });



        var remoteViewSegmentLinksArray = [  // [ 0:image/text , 1:link (ID will be added) , 2:additional_string ]   for special cases 2= heatmap, simple_link, mapflipper

            ["<img width='24px' style='vertical-align:middle' src='" + this.appResources_.pollIcon + "'/> <span>Segment Stats</span>", 'http://www.jonathanokeeffe.com/strava/segmentDetails.php?segmentId=', ''],
            ["MapFlipper", '',
            	'mapflipper',  this.appResources_.OCMIcon, this.appResources_.OCMlsIcon, this.appResources_.OCModIcon, this.appResources_.OSMIcon, this.appResources_.MBIcon, this.appResources_.OSMhbIcon]
];


        // Segment page
        // Adding remote view links on right panel
        var htmlRemoteViewS = "<ul class='group' style='" + this.htmlRemoteViewStyle + "'>";
        //htmlRemoteViewS += "<ul>";




        $.each(remoteViewSegmentLinksArray, function() {
            htmlRemoteViewS += "<li>";
			//
            // mapflipper
            //
            if (this[2] == 'mapflipper') {
                htmlRemoteViewS += '<li><a title="Click here to disable MapFlipper!" data-menu="" style="color: #333; padding-bottom: 0px; vertical-align:middle" onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){};document.getElementById(\'map-type-control\').getElementsByTagName(\'li\')[1].getElementsByTagName(\'a\')[0].click();document.getElementById(\'map-type-control\').getElementsByTagName(\'li\')[1].getElementsByTagName(\'a\')[0].click()}">' + this[0] + '</a></li>';

                htmlRemoteViewS += "<span style='color: #333; padding-left: 0px; vertical-align:middle'>";

            	htmlRemoteViewS += '<img style="vertical-align:middle" onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){if (this.src.indexOf(\'googleapis\')>-1){return}else{return this.src.replace(/mapbox\\.com\\/v4\\/strava\\.map-.+?\\d+\\//i,\'mapbox.com/v4/\'+customMapboxStyle+\'/\');}})},1000)}{document.getElementById(\'map-type-control\').getElementsByTagName(\'li\')[0].getElementsByTagName(\'a\')[0].click();}"   title="Toggle Replace Standard Map with Custom Mapbox Style" height="24px" src="' + this[7]+ '"/>&nbsp';

				htmlRemoteViewS += '<span id="show_in_GM"></span>';

                htmlRemoteViewS += '<img style="vertical-align:middle" onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'http://tile.openstreetmap.org/$1/$2/$3.png\');})},1000)}"   title="Open Street Map" width="24px" src="' + this[6]+ '"/>';

                htmlRemoteViewS += '<img style="vertical-align:middle" onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'https://tile.thunderforest.com/cycle/$1/$2/$3.png\');})},1000)}"   title="Open Cycle Map" width="24px" src="' + this[3]+ '"/>';

                htmlRemoteViewS += '<img style="vertical-align:middle" onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'https://tile.thunderforest.com/landscape/$1/$2/$3.png\');})},1000)}"   title="Open Cycle Map Landscape" width="24px" src="' + this[4]+ '"/>';

                htmlRemoteViewS += '<img style="vertical-align:middle" onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'https://tile.thunderforest.com/outdoors/$1/$2/$3.png\');})},1000)}"   title="Open Cycle Map Outdoors" width="24px" src="' + this[5]+ '"/>';

                htmlRemoteViewS += '<img style="vertical-align:middle" onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'https://tiles.wmflabs.org/hikebike/$1/$2/$3.png\');})},1000)}"   title="Hike Bike Map" width="24px" src="' + this[8]+ '"/>';
                htmlRemoteViewS += "</span></li>";

                htmlRemoteViewS += "<span style='color: #333; padding-left: 30px'>";


                
                htmlRemoteViewS += "</span></li>";
			//
            // simple link
            //
            } else if (this[2] == 'simple_link') {
                htmlRemoteViewS += '<a title="'+this[3]+'" data-menu="" target="_blank" style="color: #333;" href="' + this[1] + '">' + this[0] + '</a>';
			//
            // everything else ([0:link]+activity_id+[1:additional_string])
            //
            } else {
//                htmlRemoteViewS += "<a data-menu='' target='_blank' style='color: #333;' href='" + this[1] + pageView.activity().id + this[2] + "'>" + this[0] + "</a>";                
            };
		    htmlRemoteViewS += "</li>";
        });
        htmlRemoteViewS += "</ul>";
        htmlRemoteViewS += "</li>";





		html += htmlRemoteViewS;

        html += "</ul>";
        html += "</div>";
        $(html).prependTo('.sidebar.spans5');
    },// modifySegmentPage_



    /**
     * ...
     */
    modifyCreateSegmentPage_: function modifyCreateSegmentPage_() {

        var remoteCreateSegmentLinksArray = [  // [ 0:image/text , 1:link (ID will be added) , 2:additional_string ]   for special cases 2= heatmap, simple_link, mapflipper

            ["<img width='24px' style='vertical-align:middle' src='" + this.appResources_.pollIcon + "'/> <span>Segment Stats</span>", 'http://www.jonathanokeeffe.com/strava/segmentDetails.php?segmentId=', ''],
            ["MapFlipper", this.appResources_.veloviewerIcon,
            	'mapflipper',  this.appResources_.OCMIcon, this.appResources_.OCMlsIcon, this.appResources_.OCModIcon, this.appResources_.OSMIcon, this.appResources_.MBIcon, this.appResources_.OSMhbIcon]
];


        // Segment page
        // Adding remote view links on left panel
        var htmlRemoteViewS = "<ul class='group' style='" + this.htmlRemoteViewStyle + "'>";
        //htmlRemoteViewS += "<ul>";




        $.each(remoteCreateSegmentLinksArray, function() {
            htmlRemoteViewS += "<li>";
			//
            // mapflipper
            //
            if (this[2] == 'mapflipper') {
                htmlRemoteViewS += '<br><li><a title="Click here to disable MapFlipper and reset to satellite view!" data-menu="" style="color: #333; padding-bottom: 0px; vertical-align:middle" onclick="{vvmf_on=0;try{clearInterval(vv_t)}catch(e){}};$(\'div[title~=\\\'Show\\\']\')[0].click(); setTimeout(function(){$(\'div[title~=\\\'Show\\\']\')[2].click()},200);">' + this[0] + '</a>&nbsp';

                htmlRemoteViewS += "<img style='vertical-align:middle' onclick='if(window.vvmf_on==1){vvmf_on=0;try{clearInterval(mf)}catch(e){}}{vvmf_on=1;flip1()}' title='Click to enable VeloViewer MapFlipper' width='24px' src='" + this[1]+ "'/><script>function flip1(){if(typeof(vv_flipMap)==='undefined'){var s=document.createElement('script');s.src='https://s3.amazonaws.com/s3.veloviewer.com/js/vv.mapFlipper.js?v='+Math.floor(Math.random()*1000);document.getElementsByTagName('head')[0].appendChild(s);s.onload=function(){vv_flipMap('cycle');}}else{vv_flipMap('cycle');}}</script>";

                htmlRemoteViewS += "<span style='color: #333; padding-left: 20px; vertical-align:middle'>";

                htmlRemoteViewS += '<img style="vertical-align:middle" onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'http://tile.openstreetmap.org/$1/$2/$3.png\');})},1000)}"   title="Open Street Map" width="24px" src="' + this[6]+ '"/>';

                htmlRemoteViewS += '<img style="vertical-align:middle" onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'https://tile.thunderforest.com/cycle/$1/$2/$3.png\');})},1000)}"   title="Open Cycle Map" width="24px" src="' + this[3]+ '"/>';

                htmlRemoteViewS += '<img style="vertical-align:middle" onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'https://tile.thunderforest.com/landscape/$1/$2/$3.png\');})},1000)}"   title="Open Cycle Map Landscape" width="24px" src="' + this[4]+ '"/>';

                htmlRemoteViewS += '<img style="vertical-align:middle" onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'https://tile.thunderforest.com/outdoors/$1/$2/$3.png\');})},1000)}"   title="Open Cycle Map Outdoors" width="24px" src="' + this[5]+ '"/>';

                htmlRemoteViewS += '<img style="vertical-align:middle" onclick="if(window.mf_on==1){mf_on=0;try{clearInterval(mf)}catch(e){}}{mf_on=1;mf=setInterval(function() {d3.selectAll(\'#map_canvas img, #map-canvas img\').attr(\'src\',function(d){return this.src.replace(/.*\\/([0-9]*)\\/([0-9]*)\\/([0-9]*)\\.png/,\'https://tiles.wmflabs.org/hikebike/$1/$2/$3.png\');})},1000)}"   title="Hike Bike Map" width="24px" src="' + this[8]+ '"/>';

                htmlRemoteViewS += "&nbsp&nbsp&nbsp*<font size=-4> Click VV to enable!</font></span></li>";

                htmlRemoteViewS += "<span style='color: #333; padding-left: 30px'>";


/*
                htmlRemoteViewForActivity += "<img onclick='flip1()' title='Open Cycle Map' width='24px' src='" + this[3]+ "'/><script>function flip1(){if(typeof(vv_flipMap)==='undefined'){var s=document.createElement('script');s.src='https://s3.amazonaws.com/s3.veloviewer.com/js/vv.mapFlipper.js?v='+Math.floor(Math.random()*1000);document.getElementsByTagName('head')[0].appendChild(s);s.onload=function(){vv_flipMap('cycle');}}else{vv_flipMap('cycle');}}</script>";
                htmlRemoteViewForActivity += "<img onclick='flip2()' title='Open Cycle Map Landscape' width='24px' src='" + this[4] + "'/><script>function flip2(){if(typeof(vv_flipMap)==='undefined'){var s=document.createElement('script');s.src='https://s3.amazonaws.com/s3.veloviewer.com/js/vv.mapFlipper.js?v='+Math.floor(Math.random()*1000);document.getElementsByTagName('head')[0].appendChild(s);s.onload=function(){vv_flipMap('landscape');}}else{vv_flipMap('landscape')}}</script>";
                htmlRemoteViewForActivity += "<img onclick='flip3()' title='Open Cycle Map Outdoor' width='24px' src='" + this[5] + "'/><script>function flip3(){if(typeof(vv_flipMap)==='undefined'){var s=document.createElement('script');s.src='https://s3.amazonaws.com/s3.veloviewer.com/js/vv.mapFlipper.js?v='+Math.floor(Math.random()*1000);document.getElementsByTagName('head')[0].appendChild(s);s.onload=function(){vv_flipMap('outdoors');}}else{vv_flipMap('outdoors')}}</script>";
                htmlRemoteViewForActivity += "<img onclick='flip4()' title='Open Street Map' width='24px' src='" + this[6] + "'/><script>function flip4(){if(typeof(vv_flipMap)==='undefined'){var s=document.createElement('script');s.src='https://s3.amazonaws.com/s3.veloviewer.com/js/vv.mapFlipper.js?v='+Math.floor(Math.random()*1000);document.getElementsByTagName('head')[0].appendChild(s);s.onload=function(){vv_flipMap('street');}}else{vv_flipMap('street')}}</script>";
*/



                
                htmlRemoteViewS += "</span></li>";
			//
            // simple link
            //
            } else if (this[2] == 'simple_link') {
                htmlRemoteViewS += '<a title="'+this[3]+'" data-menu="" target="_blank" style="color: #333;" href="' + this[1] + '">' + this[0] + '</a>';
			//
            // everything else ([0:link]+activity_id+[1:additional_string])
            //
            } else {
//                htmlRemoteViewS += "<a data-menu='' target='_blank' style='color: #333;' href='" + this[1] + pageView.activity().id + this[2] + "'>" + this[0] + "</a>";                
            };
		    htmlRemoteViewS += "</li>";
        });
        htmlRemoteViewS += "</ul>";
        htmlRemoteViewS += "</li>";

        htmlRemoteViewS = $(htmlRemoteViewS);
        $("#segment-wizard").append(htmlRemoteViewS);

    },// modifyCreateSegmentPage_    
    
    
    
};
