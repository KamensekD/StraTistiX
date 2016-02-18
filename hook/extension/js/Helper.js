var helperDebug=0;  	// 0-off  1-some dbg. messages  2-most dbg. messages  3-all dbg. messages
			// MUST BE 0 FOR RELEASE !!!
			// helper has its own helperDebug, because it doesn't know about debugMode var
helperDebug>0   && console.warn('Begin     Helper.js');
/**
 *   Contructor
 */
function Helper() {

}

/**
 * Define prototype
 */
Helper.prototype = {

};



/**
 * Static method call test
 */
Helper.log = function(tag, object) {
    if (helperDebug) {
        console.log('<' + tag + '>');
        console.log(object);
        console.log('</' + tag + '>');
    }
};



/**
 *
 */
Helper.HHMMSStoSeconds = function HHMMSStoSeconds(str) {
helperDebug>1   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    var p = str.split(':'),
        s = 0,
        m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return s;
};



/**
 *
 */
Helper.secondsToHHMMSS = function secondsToHHMMSS(secondsParam, trimLeadingZeros) {
helperDebug>2   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    var sec_num = parseInt(secondsParam, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = hours + ':' + minutes + ':' + seconds;
    return trimLeadingZeros ? Helper.trimLeadingZerosHHMMSS(time) : time;
};



/**
 *
 */
Helper.weightedPercentiles = function weightedPercentiles(values, weights, percentiles) {
helperDebug>0   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    // inspired from https://en.wikipedia.org/wiki/Weighted_median and https://en.wikipedia.org/wiki/Percentile#Definition_of_the_Weighted_Percentile_method
    //
    // percentiles to be calculated should be given from lowest to highest,
    // otherwise any lower percentile after higher one won't be calculated properly!
    //
    // example:   Helper.weightedPercentiles([1,2,3,4,5,6,7,8,9,10] , [1,1,1,1,1,1,1,1,1,1], [ 0 , 0.5 , 1])  returns  [1, 5, 10]
    //            Helper.weightedPercentiles(_.range(1,101) , Array(100).fill(1) , [ 0.25 , 0.5 , 0.75])      returns  [25, 50, 75]
    //            Helper.weightedPercentiles([1,2,3,4,5] , [1,1,1,1,1], [ 0.5 ])                              returns  [3]
    //            Helper.weightedPercentiles([1,2,3,4,5] , [2,1,1,1,1], [ 0.5 ])                              returns  [2]
    //

    var list = [];
    var tot = 0;

    // prepare sorted list of values with weights and calculate total weight
    for (var i = 0; i < values.length; i++) {
        list.push({ value : values[i], weight : weights[i]});
        tot += weights[i];
    }
    list.sort(function(a, b) {
        return a.value - b.value;
    });

	// prepare empty results array
    var result = Array(percentiles.length).fill(0);

    // prepare percentile target values
    var percentiletargets = [];
    for (var j = 0; j < percentiles.length; j++) {
    	percentiletargets[j] = percentiles[j] * tot;
    }

    var cur=0;
	j = 0;
    for (var i = 0; i < list.length; i++) {
        // loop through list to find sample matching percentile target values
        cur += list[i].weight;
        if (cur >= percentiletargets[j] ) {	// target reached?
            result[j] = list[i].value;      // save result
            j++;	// next target
        }
        if (j==percentiles.length) break;   // if last target reached, exit loop
    }

    return result;
};



/**
 *
 */
Helper.median = function median(valuesSorted) {
helperDebug>0   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    var half = Math.floor(valuesSorted.length / 2);
    if (valuesSorted.length % 2)
        return valuesSorted[half];
    else
        return (valuesSorted[half - 1] + valuesSorted[half]) / 2.0;
};



/**
 *
 */
Helper.upperQuartile = function upperQuartile(valuesSorted) {
helperDebug>0   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
	if(valuesSorted.length<3) return (0);
//	if(valuesSorted.length<3) return ("-");
	if(Helper.isEven(valuesSorted.length)) { 
		var valuesSortedUpperHalf=valuesSorted.slice(valuesSorted.length/2);
	} else {
		var valuesSortedUpperHalf=valuesSorted.slice((valuesSorted.length+1)/2);
	}
	return Helper.median(valuesSortedUpperHalf);
//    var q3 = Math.round(0.75 * (valuesSorted.length + 1));
//    return (valuesSorted[q3]);
};



/**
 *
 */
Helper.lowerQuartile = function lowerQuartile(valuesSorted) {
helperDebug>0   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
	if(valuesSorted.length<3) return (0);
//	if(valuesSorted.length<3) return ("-");
	if(Helper.isEven(valuesSorted.length)) {
		var valuesSortedLowerHalf=valuesSorted.slice(0,valuesSorted.length/2);
	} else {
		var valuesSortedLowerHalf=valuesSorted.slice(0,(valuesSorted.length-1)/2);
	}
	return Helper.median(valuesSortedLowerHalf);
//    var q1 = Math.round(0.25 * (valuesSorted.length + 1));
//    return (valuesSorted[q1]);
};



/**
 *
 */
// Use abstract equality == for "is number" test
Helper.isEven = function isEven(n) {
helperDebug>0   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    return n == parseFloat(n) ? !(n % 2) : void 0;
}



/**
 *
 */
Helper.heartrateFromHeartRateReserve = function heartrateFromHeartRateReserve(hrr, maxHr, restHr) {
helperDebug>2   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    return (parseFloat(hrr) / 100 * (parseInt(maxHr) - parseInt(restHr)) + parseInt(restHr)).toFixed(0);
};



/**
 *
 */
Helper.heartRateReserveFromHeartrate = function heartRateReserveFromHeartrate(hr, maxHr, restHr) {
helperDebug>2   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    return (parseFloat(hr) - parseInt(restHr)) / (parseInt(maxHr) - parseInt(restHr));
};



/**
 *
 */
Helper.hrrPercentFromHeartrate = function hrrPercentFromHeartrate(hr, maxHr, restHr) {
helperDebug>1   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    return 100 * (parseFloat(hr) - parseInt(restHr)) / (parseInt(maxHr) - parseInt(restHr));
};



/**
 *
 */
Helper.hrPercentFromHeartrate = function hrPercentFromHeartrate(hr, maxHr) {
helperDebug>1   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    return 100 * parseFloat(hr) / parseInt(maxHr);
};



/**
 *
 */
Helper.setToStorage = function setToStorage(extensionId, storageType, key, value, callback) {
helperDebug>0   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    // Sending message to background page
    chrome.runtime.sendMessage(extensionId, {
            method: StravistiX.setToStorageMethod,
            params: {
                storage: storageType,
                'key': key,
                'value': value
            }
        },
        function(response) {
            callback(response);
        }
    );
};



/**
 *
 */
Helper.getFromStorage = function getFromStorage(extensionId, storageType, key, callback) {
helperDebug>0   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    // Sending message to background page
    chrome.runtime.sendMessage(extensionId, {
            method: StravistiX.getFromStorageMethod,
            params: {
                storage: storageType,
                'key': key
            }
        },
        function(response) {
            callback(response);
        }
    );
};



/**
 *
 */
Helper.includeJs = function includeJs(scriptUrl) {
helperDebug>0   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    var link = document.createElement('link');
    link.href = chrome.extension.getURL(scriptUrl);
    link.type = 'text/css';
    link.rel = 'stylesheet';
    (document.head || document.documentElement).appendChild(link);
};



/**
 *
 */
Helper.formatNumber = function formatNumber(n, c, d, t) {
helperDebug>2   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};



/**
 *
 */
Helper.secondsToDHM = function secondsToDHM(sec_num, trimZeros) {
helperDebug>2   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    var days = Math.floor(sec_num / 86400);
    var hours = Math.floor((sec_num - (days * 86400)) / 3600);
    var minutes = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60);
    if (trimZeros && days === 0) {
        if (hours === 0) {
            return minutes + 'm';
        }
        return hours + 'h ' + minutes + 'm';
    }
    return days + 'd ' + hours + 'h ' + minutes + 'm';
};



/**
 *
 */
Helper.trimLeadingZerosHHMMSS = function trimLeadingZerosHHMMSS(time) {
helperDebug>2   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    var result = time.replace(/^(0*:)*/, '').replace(/^0*/, '') || "0";
    if (result.indexOf(":") < 0) {
        return result + "s";
    }
    return result;
};



/**
 *
 */
Helper.guid = function guid() {
helperDebug>0   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
    // from http://stackoverflow.com/a/105074
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};



/**
 *
 */
Helper.csv = function csv(export_array) {
helperDebug>0   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
	// export original Strava streams to csv for easy analysis in Excel
	var csvContent = "data:text/csv;charset=utf-8,";
    var Keys = Object.keys(StravaStreams);
    var KeysExp = [];
    var Size = StravaStreams[Keys[0]].length;
    var Sizes = [];

	index=0;
	index1=0;
	for (val of Keys) {
		if (typeof StravaStreams[Keys[index]] !== 'undefined') {
			KeysExp[index1++]=Keys[index];
			Sizes[index]= (typeof StravaStreams[Keys[index]].length === 'undefined') ? 1 : (StravaStreams[val].length);
			console.log(index+1+": "+val+" ("+Sizes[index++]+")");
		} else index++;
//		console.log(index+1+": "+val+" ("+Sizes[index++]+")");
//		console.log(index+1+": "+val+" ("+ (typeof Sizes[index++] === 'undefined') ? "-" : Sizes[index++]  +")");
	}

	for (index = 0; index < KeysExp.length; index++) {
	    csvContent+='"'+(KeysExp[index])+'"'; if(index<KeysExp.length-1) csvContent+=";";
	}
	csvContent+="\n";

	for (indexn = 0; indexn < Size; indexn++) {				// all rows
		for (index = 0; index < KeysExp.length; index++) {		// all columns
	    	csvContent+='"'+(StravaStreams[KeysExp[index]][indexn]).toString().replace(",",";").replace(".",",")+'"'; if(index<KeysExp.length-1) csvContent+=";";
		}
		csvContent+="\n";
	}
	

	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
//	link.setAttribute("href", escape(csvContent));
	link.setAttribute("download", pageView.activityId()+".csv");
	link.click(); // This will download the data file named "my_data.csv"
	window.open(encodedUri);
	expcsv=window.open("", "", "toolbar=yes, width=600, height=200");
	expcsv.document.write(csvContent);
	
	
};



/**
 *
 */
Helper.getMaxOfArray = function getMaxOfArray(numArray) {
helperDebug>0   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
  return Math.max.apply(null, numArray);
};



/**
 *
 */
Helper.getMinOfArray = function getMinOfArray(numArray) {
helperDebug>0   && console.log(' > > (f:  Helper.js) >   ' + arguments.callee.toString().match(/function ([^\(]+)/)[1] );
  return Math.min.apply(null, numArray);
};
helperDebug>0   && console.warn('End       Helper.js');
