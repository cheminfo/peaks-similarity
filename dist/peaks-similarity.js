(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["peaksSimilarity"] = factory();
	else
		root["peaksSimilarity"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var COMMON_NO=0;
	var COMMON_FIRST=1;
	var COMMON_SECOND=2;
	var COMMON_BOTH=3; // should be a binary operation !

	var Stat = __webpack_require__(1).array;


	module.exports = function Comparator(options) {
	    
	    var widthTop, widthBottom, from, to;
	    var array1Extract, array2Extract, widthSlope, array1ExtractInfo, array2ExtractInfo;
	    var common, commonFactor;

	    setOptions(options);

	    var array1=[];
	    var array2=[];
	 
	    /*
	     2 formats are allowed:
	     [[x1,x2,...],[y1,y2,...]] or [[x1,y1],[x2,y2], ...]
	    */

	    function setOptions(newOptions) {
	        options=newOptions || {};
	        if (typeof options.common === 'string') {
	            if (options.common.toLowerCase()==='first') {
	                common=COMMON_FIRST;
	            } else if (options.common.toLowerCase()==='second') {
	                common=COMMON_SECOND;
	            } else if (options.common.toLowerCase()==='both') {
	                common=COMMON_BOTH;
	            } else {
	                common=COMMON_NO;
	            }
	        } else {
	            if (options.common==true) {
	                common=COMMON_BOTH;
	            } else {
	                common=COMMON_NO;
	            }
	        }
	        commonFactor=options.commonFactor || commonFactor || 4;

	        if (options.widthBottom==undefined) {
	            options.widthBottom=widthBottom || 2;
	        }
	        if (options.widthTop==undefined) {
	            options.widthTop=widthTop || 1;
	        }
	        setTrapezoid(options.widthBottom, options.widthTop);
	        setFromTo(options.from || from, options.to || to);
	    }

	    function setPeaks1(anArray) {
	        array1=checkArray(anArray);

	        if (common) {
	            var extracts=commonExtractAndNormalize(array1, array2, widthBottom, from, to, common);
	            array1Extract=extracts.data1;
	            array1ExtractInfo=extracts.info1;
	            array2Extract=extracts.data2;
	            array2ExtractInfo=extracts.info2;
	        } else {
	            var extract=extractAndNormalize(array1, from, to);
	            array1Extract=extract.data;
	            array1ExtractInfo=extract.info;
	        }
	    }
	    function setPeaks2(anArray) {
	        array2=checkArray(anArray);
	        if (common) {
	            var extracts=commonExtractAndNormalize(array1, array2, widthBottom, from, to, common);
	            array1Extract=extracts.data1;
	            array1ExtractInfo=extracts.info1;
	            array2Extract=extracts.data2;
	            array2ExtractInfo=extracts.info2;
	        } else {
	            var extract = extractAndNormalize(array2, from, to);
	            array2Extract = extract.data;
	            array2ExtractInfo = extract.info;
	        }
	    }

	    function getExtract1() {
	        return array1Extract;
	    }

	    function getExtract2() {
	        return array2Extract;
	    }


	    function getExtractInfo1() {
	        return array1ExtractInfo;
	    }

	    function getExtractInfo2() {
	        return array2ExtractInfo;
	    }

	    function setTrapezoid(newWidthBottom, newWidthTop) {
	        widthTop=newWidthTop;
	        widthBottom=newWidthBottom;
	        widthSlope=(widthBottom-widthTop)/2;
	        if (widthBottom<widthTop) throw "widthBottom has to be larger than widthTop";
	    }

	    function setFromTo(newFrom, newTo) {
	        if (newFrom===from && newTo===to) return
	        from=newFrom;
	        to=newTo;
	        if (common) {
	            var extracts=commonExtractAndNormalize(array1, array2, widthBottom, from, to, common, commonFactor);
	            array1Extract=extracts.data1;
	            array1ExtractInfo=extracts.info1;
	            array2Extract=extracts.data2;
	            array2ExtractInfo=extracts.info2;
	        } else {
	            var extract=extractAndNormalize(array1, from, to);
	            array1Extract=extract.data;
	            array1ExtractInfo=extract.info;
	            var extract=extractAndNormalize(array2, from, to);
	            array2Extract=extract.data;
	            array2ExtractInfo=extract.info;
	        }
	    }


	    function getOverlap(x1, y1, x2, y2) {
	        if (y1===0 || y2===0) return 0;

	        // TAKE CARE !!! We multiply the diff by 2 !!!
	        var diff=Math.abs(x1-x2)*2;

	        if (diff>widthBottom) return 0;
	        if (diff<=widthTop) {
	            return Math.min(y1,y2);
	        }

	        var maxValue=Math.max(y1,y2)*(widthBottom-diff)/(widthBottom-widthTop);
	        return Math.min(y1, y2, maxValue);

	        return NaN;
	    }

	    // This is the old trapezoid similarity
	    function getOverlapTrapezoid(x1, y1, x2, y2) {

	        var factor=2/(widthTop+widthBottom); // correction for surface=1
	        if (y1===0 || y2===0) return 0;
	        if (x1===x2) { // they have the same position
	            return Math.min(y1,y2);
	        }

	        var diff=Math.abs(x1-x2);
	        if (diff>=widthBottom) return 0;
	        if (y1===y2) { // do they have the same height ???
	            // we need to find the common length
	            if (diff<=widthTop) {
	                return (((widthTop+widthBottom)/2-diff)*y1)*factor;
	            } else if (diff<=widthBottom) {
	                return (widthBottom-diff)*y1/2*(diff-widthTop)/(widthBottom-widthTop)*factor;
	            }
	            return 0;
	        } else { // the height are different and not the same position ...
	            // we need to consider only one segment to find its intersection

	            var small=Math.min(y1,y2);
	            var big=Math.max(y1,y2);

	            var targets=[
	                [[0,0],[widthSlope,small]],
	                [[widthSlope,small],[widthSlope+widthTop,small]],
	                [[widthTop+widthSlope,small],[widthBottom,0]]
	            ];
	            if ((x1>x2 && y1>y2) || (x1<x2 && y1<y2)) {
	                var segment=[[diff,0],[diff+widthSlope,big]];
	            } else {
	                var segment=[[diff+widthSlope,big],[diff,0]];
	            }



	            for (var i=0; i<3; i++) {
	                var intersection=getIntersection(targets[i],segment);
	                if (intersection) {
	                    switch (i) {
	                        case 0:
	                            return small-((diff*intersection.y/2))*factor;
	                        case 1: // to simplify ...
	                            //     console.log("           ",widthSlope,small,big,intersection.x)
	                            return ((widthSlope*small/(2*big))*small+
	                                (widthTop+widthSlope-intersection.x)*small+
	                                widthSlope*small/2)*factor;
	                        case 2:
	                            return ((widthBottom-diff)*intersection.y/2)*factor;
	                    }
	                }
	            }
	        }
	        return NaN;
	    }



	    // this method calculates the total diff. The sum of positive value will yield to overlap
	    function calculateDiff() {
	        // we need to take 2 pointers
	        // and travel progressively between them ...
	        var newFirst=[
	            [].concat(array1Extract[0]),
	            [].concat(array1Extract[1])
	        ];
	        var newSecond=[
	            [].concat(array2Extract[0]),
	            [].concat(array2Extract[1])
	        ];
	        var array1Length=array1Extract[0] ? array1Extract[0].length : 0;
	        var array2Length=array2Extract[0] ? array2Extract[0].length : 0;

	        var pos1=0;
	        var pos2=0;
	        var previous2=0;
	        while (pos1<array1Length) {
	            var diff=newFirst[0][pos1]-array2Extract[0][pos2];
	            if (Math.abs(diff)<widthBottom) { // there is some overlap
	                if (options.trapezoid) {
	                    var overlap=getOverlapTrapezoid(newFirst[0][pos1], newFirst[1][pos1], newSecond[0][pos2], newSecond[1][pos2], widthTop, widthBottom);
	                } else {
	                    var overlap=getOverlap(newFirst[0][pos1], newFirst[1][pos1], newSecond[0][pos2], newSecond[1][pos2], widthTop, widthBottom);
	                }
	                newFirst[1][pos1]-=overlap;
	                newSecond[1][pos2]-=overlap;
	                if (pos2<(array2Length-1)) {
	                    pos2++;
	                } else {
	                    pos1++;
	                    pos2=previous2;
	                }
	            } else {
	                if (diff>0 && pos2<(array2Length-1)) {
	                    pos2++;
	                    previous2=pos2;
	                } else {
	                    pos1++;
	                    pos2=previous2;
	                }
	            }
	        }
	        return newSecond;
	    }


	    /*
	        This code requires the use of an array like  [[x1,y1],[x2,y2], ...]
	        If it is not the right format, we will just convert it
	        Otherwise we return the correct format
	     */
	    function checkArray(points) {
	        // if it is already a 2D array of points, we just return them
	        if (Array.isArray(points) && Array.isArray(points[0]) && points.length===2) return points;
	        var x=new Array(points.length);
	        var y=new Array(points.length);
	        for (var i=0; i<points.length; i++) {
	            x[i]=points[i][0];
	            y[i]=points[i][1];
	        }
	        return [x,y];
	    }

	    function getSimilarity(newPeaks1, newPeaks2) {
	        if (newPeaks1) setPeaks1(newPeaks1);
	        if (newPeaks2) setPeaks2(newPeaks2);
	        var result={};
	        result.diff=calculateDiff();
	        result.extract1=getExtract1();
	        result.extract2=getExtract2();
	        result.extractInfo1=getExtractInfo1();
	        result.extractInfo2=getExtractInfo2();
	        result.similarity=calculateOverlapFromDiff(result.diff);
	        return result;
	    }

	    /*
	        This works mainly when you have a array1 that is fixed
	        newPeaks2 have to be normalized ! (sum to 1)
	     */
	    function fastSimilarity(newPeaks2, from, to, common) {
	        array1Extract=extract(array1, from, to);
	        array2Extract=newPeaks2;
	        if (common) array1Extract= getCommonArray(array1Extract, array2Extract, widthBottom)
	        normalize(array1Extract);
	        var diff=calculateDiff();
	        return calculateOverlapFromDiff(diff);
	    }


	    this.setPeaks1 = setPeaks1;
	    this.setPeaks2 = setPeaks2;
	    this.getExtract1 = getExtract1;
	    this.getExtract2 = getExtract2;
	    this.getExtractInfo1 = getExtractInfo1;
	    this.getExtractInfo2 = getExtractInfo2;
	    this.setFromTo = setFromTo;
	    this.setOptions = setOptions;
	    this.setTrapezoid = setTrapezoid;
	    this.getSimilarity = getSimilarity;
	    this.getCommonArray = getCommonArray;

	    this.fastSimilarity = fastSimilarity;

	};


	// returns an new array based on array1 where there is a peak of array2 at a distance under width/2
	function getCommonArray(array1, array2, width) {
	    var newArray=[[],[]];
	    var pos2=0;
	    width/=2;
	    var j=0;
	    var array1Length=array1[0] ? array1[0].length : 0;
	    var array2Length=array2[0] ? array2[0].length : 0;

	    for (var i=0; i<array1Length; i++) {
	        while (pos2<array2Length && (array1[0][i]>(array2[0][pos2]+width))) {
	            pos2++;
	        }
	        if ((pos2<array2Length) && (array1[0][i]>array2[0][pos2]-width)) {
	            newArray[0][j]=array1[0][i];
	            newArray[1][j]=array1[1][i];
	            j++;
	        }
	    }
	    return newArray;
	}


	// Adapted from: http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
	function getIntersection(segment1, segment2) {
	    var p0_x=segment1[0][0];
	    var p0_y=segment1[0][1];
	    var p1_x=segment1[1][0];
	    var p1_y=segment1[1][1];
	    var p2_x=segment2[0][0];
	    var p2_y=segment2[0][1];
	    var p3_x=segment2[1][0];
	    var p3_y=segment2[1][1];

	    var s1_x, s1_y, s2_x, s2_y;
	    s1_x = p1_x - p0_x;
	    s1_y = p1_y - p0_y;
	    s2_x = p3_x - p2_x;
	    s2_y = p3_y - p2_y;
	    var s, t;
	    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
	    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
	    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
	        return {
	            x:p0_x + (t * s1_x),
	            y:p0_y + (t * s1_y)
	        }
	    }
	    return null; // No collision
	}

	function normalize(array) {
	    var min=Stat.min(array[1]);
	    var max=Stat.max(array[1]);
	    var sum=Stat.sum(array[1]);
	    var length=array[1] ? array[0].length : 0;
	    if (sum!=0) {
	        for (var i=0; i<length; i++) {
	            array[1][i]/=sum;
	        }
	    }
	    return {
	        sum: sum,
	        min: min,
	        max: max
	    };
	}

	// this method will systemtatically take care of both array
	function commonExtractAndNormalize(array1, array2, width, from, to, common) {
	    if (! (Array.isArray(array1)) || ! (Array.isArray(array2))) return {
	        info: undefined,
	        data: undefined
	    };
	    var extract1=extract(array1, from, to);
	    var extract2=extract(array2, from, to);
	    var common1, common2, info1, info2;
	    if (common & COMMON_SECOND) {
	        common1=getCommonArray(extract1, extract2, width);
	        info1=normalize(common1);
	    } else {
	        common1=extract1;
	        info1=normalize(common1);
	    }
	    if (common & COMMON_FIRST) {
	        common2=getCommonArray(extract2, extract1, width);
	        info2=normalize(common2);
	    } else {
	        common2=extract2;
	        info2=normalize(common2);
	    }

	    return {
	        info1: info1,
	        info2: info2,
	        data1: common1,
	        data2: common2
	    }
	}

	function extract(array, from, to) {
	    var newArray=[[],[]];
	    var j=0;
	    var length=array[0] ? array[0].length : 0;
	    for (var i=0; i<length; i++) {
	        if ( (! from || array[0][i]>=from)  && (! to || array[0][i]<=to)) {
	            newArray[0][j] = array[0][i];
	            newArray[1][j] = array[1][i];
	            j++
	        }
	    }
	    return newArray;
	}

	function extractAndNormalize(array, from, to) {
	    if (! (Array.isArray(array))) return {
	        info: undefined,
	        data: undefined
	    };
	    var newArray=extract(array, from, to);
	    var info=normalize(newArray);
	    return {
	        info: info,
	        data: newArray
	    };
	}

	function calculateOverlapFromDiff(diffs) {
	    var sumPos=0;
	    for (var i=0; i<diffs[1].length; i++) {
	        sumPos+=Math.abs(diffs[1][i]);
	    }
	    return 1-sumPos;
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.array = __webpack_require__(2);
	exports.matrix = __webpack_require__(3);


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	function compareNumbers(a, b) {
	    return a - b;
	}

	/**
	 * Computes the sum of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.sum = function sum(values) {
	    var sum = 0;
	    for (var i = 0; i < values.length; i++) {
	        sum += values[i];
	    }
	    return sum;
	};

	/**
	 * Computes the maximum of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.max = function max(values) {
	    var max = -Infinity;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] > max) max = values[i];
	    }
	    return max;
	};

	/**
	 * Computes the minimum of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.min = function min(values) {
	    var min = Infinity;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] < min) min = values[i];
	    }
	    return min;
	};

	/**
	 * Computes the min and max of the given values
	 * @param {Array} values
	 * @returns {{min: number, max: number}}
	 */
	exports.minMax = function minMax(values) {
	    var min = Infinity;
	    var max = -Infinity;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] < min) min = values[i];
	        if (values[i] > max) max = values[i];
	    }
	    return {
	        min: min,
	        max: max
	    };
	};

	/**
	 * Computes the arithmetic mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.arithmeticMean = function arithmeticMean(values) {
	    var sum = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        sum += values[i];
	    }
	    return sum / l;
	};

	/**
	 * {@link arithmeticMean}
	 */
	exports.mean = exports.arithmeticMean;

	/**
	 * Computes the geometric mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.geometricMean = function geometricMean(values) {
	    var mul = 1;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        mul *= values[i];
	    }
	    return Math.pow(mul, 1 / l);
	};

	/**
	 * Computes the mean of the log of the given values
	 * If the return value is exponentiated, it gives the same result as the
	 * geometric mean.
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.logMean = function logMean(values) {
	    var lnsum = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        lnsum += Math.log(values[i]);
	    }
	    return lnsum / l;
	};

	/**
	 * Computes the weighted grand mean for a list of means and sample sizes
	 * @param {Array} means - Mean values for each set of samples
	 * @param {Array} samples - Number of original values for each set of samples
	 * @returns {number}
	 */
	exports.grandMean = function grandMean(means, samples) {
	    var sum = 0;
	    var n = 0;
	    var l = means.length;
	    for (var i = 0; i < l; i++) {
	        sum += samples[i] * means[i];
	        n += samples[i];
	    }
	    return sum / n;
	};

	/**
	 * Computes the truncated mean of the given values using a given percentage
	 * @param {Array} values
	 * @param {number} percent - The percentage of values to keep (range: [0,1])
	 * @param {boolean} [alreadySorted=false]
	 * @returns {number}
	 */
	exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
	    if (alreadySorted === undefined) alreadySorted = false;
	    if (!alreadySorted) {
	        values = values.slice().sort(compareNumbers);
	    }
	    var l = values.length;
	    var k = Math.floor(l * percent);
	    var sum = 0;
	    for (var i = k; i < (l - k); i++) {
	        sum += values[i];
	    }
	    return sum / (l - 2 * k);
	};

	/**
	 * Computes the harmonic mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.harmonicMean = function harmonicMean(values) {
	    var sum = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        if (values[i] === 0) {
	            throw new RangeError('value at index ' + i + 'is zero');
	        }
	        sum += 1 / values[i];
	    }
	    return l / sum;
	};

	/**
	 * Computes the contraharmonic mean of the given values
	 * @param {Array} values
	 * @returns {number}
	 */
	exports.contraHarmonicMean = function contraHarmonicMean(values) {
	    var r1 = 0;
	    var r2 = 0;
	    var l = values.length;
	    for (var i = 0; i < l; i++) {
	        r1 += values[i] * values[i];
	        r2 += values[i];
	    }
	    if (r2 < 0) {
	        throw new RangeError('sum of values is negative');
	    }
	    return r1 / r2;
	};

	/**
	 * Computes the median of the given values
	 * @param {Array} values
	 * @param {boolean} [alreadySorted=false]
	 * @returns {number}
	 */
	exports.median = function median(values, alreadySorted) {
	    if (alreadySorted === undefined) alreadySorted = false;
	    if (!alreadySorted) {
	        values = values.slice().sort(compareNumbers);
	    }
	    var l = values.length;
	    var half = Math.floor(l / 2);
	    if (l % 2 === 0) {
	        return (values[half - 1] + values[half]) * 0.5;
	    } else {
	        return values[half];
	    }
	};

	/**
	 * Computes the variance of the given values
	 * @param {Array} values
	 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
	 * @returns {number}
	 */
	exports.variance = function variance(values, unbiased) {
	    if (unbiased === undefined) unbiased = true;
	    var theMean = exports.mean(values);
	    var theVariance = 0;
	    var l = values.length;

	    for (var i = 0; i < l; i++) {
	        var x = values[i] - theMean;
	        theVariance += x * x;
	    }

	    if (unbiased) {
	        return theVariance / (l - 1);
	    } else {
	        return theVariance / l;
	    }
	};

	/**
	 * Computes the standard deviation of the given values
	 * @param {Array} values
	 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
	 * @returns {number}
	 */
	exports.standardDeviation = function standardDeviation(values, unbiased) {
	    return Math.sqrt(exports.variance(values, unbiased));
	};

	exports.standardError = function standardError(values) {
	    return exports.standardDeviation(values) / Math.sqrt(values.length);
	};

	exports.quartiles = function quartiles(values, alreadySorted) {
	    if (typeof(alreadySorted) === 'undefined') alreadySorted = false;
	    if (!alreadySorted) {
	        values = values.slice();
	        values.sort(compareNumbers);
	    }

	    var quart = values.length / 4;
	    var q1 = values[Math.ceil(quart) - 1];
	    var q2 = exports.median(values, true);
	    var q3 = values[Math.ceil(quart * 3) - 1];

	    return {q1: q1, q2: q2, q3: q3};
	};

	exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
	    return Math.sqrt(exports.pooledVariance(samples, unbiased));
	};

	exports.pooledVariance = function pooledVariance(samples, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var sum = 0;
	    var length = 0, l = samples.length;
	    for (var i = 0; i < l; i++) {
	        var values = samples[i];
	        var vari = exports.variance(values);

	        sum += (values.length - 1) * vari;

	        if (unbiased)
	            length += values.length - 1;
	        else
	            length += values.length;
	    }
	    return sum / length;
	};

	exports.mode = function mode(values) {
	    var l = values.length,
	        itemCount = new Array(l),
	        i;
	    for (i = 0; i < l; i++) {
	        itemCount[i] = 0;
	    }
	    var itemArray = new Array(l);
	    var count = 0;

	    for (i = 0; i < l; i++) {
	        var index = itemArray.indexOf(values[i]);
	        if (index >= 0)
	            itemCount[index]++;
	        else {
	            itemArray[count] = values[i];
	            itemCount[count] = 1;
	            count++;
	        }
	    }

	    var maxValue = 0, maxIndex = 0;
	    for (i = 0; i < count; i++) {
	        if (itemCount[i] > maxValue) {
	            maxValue = itemCount[i];
	            maxIndex = i;
	        }
	    }

	    return itemArray[maxIndex];
	};

	exports.covariance = function covariance(vector1, vector2, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var mean1 = exports.mean(vector1);
	    var mean2 = exports.mean(vector2);

	    if (vector1.length !== vector2.length)
	        throw "Vectors do not have the same dimensions";

	    var cov = 0, l = vector1.length;
	    for (var i = 0; i < l; i++) {
	        var x = vector1[i] - mean1;
	        var y = vector2[i] - mean2;
	        cov += x * y;
	    }

	    if (unbiased)
	        return cov / (l - 1);
	    else
	        return cov / l;
	};

	exports.skewness = function skewness(values, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var theMean = exports.mean(values);

	    var s2 = 0, s3 = 0, l = values.length;
	    for (var i = 0; i < l; i++) {
	        var dev = values[i] - theMean;
	        s2 += dev * dev;
	        s3 += dev * dev * dev;
	    }
	    var m2 = s2 / l;
	    var m3 = s3 / l;

	    var g = m3 / (Math.pow(m2, 3 / 2.0));
	    if (unbiased) {
	        var a = Math.sqrt(l * (l - 1));
	        var b = l - 2;
	        return (a / b) * g;
	    }
	    else {
	        return g;
	    }
	};

	exports.kurtosis = function kurtosis(values, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var theMean = exports.mean(values);
	    var n = values.length, s2 = 0, s4 = 0;

	    for (var i = 0; i < n; i++) {
	        var dev = values[i] - theMean;
	        s2 += dev * dev;
	        s4 += dev * dev * dev * dev;
	    }
	    var m2 = s2 / n;
	    var m4 = s4 / n;

	    if (unbiased) {
	        var v = s2 / (n - 1);
	        var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
	        var b = s4 / (v * v);
	        var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));

	        return a * b - 3 * c;
	    }
	    else {
	        return m4 / (m2 * m2) - 3;
	    }
	};

	exports.entropy = function entropy(values, eps) {
	    if (typeof(eps) === 'undefined') eps = 0;
	    var sum = 0, l = values.length;
	    for (var i = 0; i < l; i++)
	        sum += values[i] * Math.log(values[i] + eps);
	    return -sum;
	};

	exports.weightedMean = function weightedMean(values, weights) {
	    var sum = 0, l = values.length;
	    for (var i = 0; i < l; i++)
	        sum += values[i] * weights[i];
	    return sum;
	};

	exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
	    return Math.sqrt(exports.weightedVariance(values, weights));
	};

	exports.weightedVariance = function weightedVariance(values, weights) {
	    var theMean = exports.weightedMean(values, weights);
	    var vari = 0, l = values.length;
	    var a = 0, b = 0;

	    for (var i = 0; i < l; i++) {
	        var z = values[i] - theMean;
	        var w = weights[i];

	        vari += w * (z * z);
	        b += w;
	        a += w * w;
	    }

	    return vari * (b / (b * b - a));
	};

	exports.center = function center(values, inPlace) {
	    if (typeof(inPlace) === 'undefined') inPlace = false;

	    var result = values;
	    if (!inPlace)
	        result = values.slice();

	    var theMean = exports.mean(result), l = result.length;
	    for (var i = 0; i < l; i++)
	        result[i] -= theMean;
	};

	exports.standardize = function standardize(values, standardDev, inPlace) {
	    if (typeof(standardDev) === 'undefined') standardDev = exports.standardDeviation(values);
	    if (typeof(inPlace) === 'undefined') inPlace = false;
	    var l = values.length;
	    var result = inPlace ? values : new Array(l);
	    for (var i = 0; i < l; i++)
	        result[i] = values[i] / standardDev;
	    return result;
	};

	exports.cumulativeSum = function cumulativeSum(array) {
	    var l = array.length;
	    var result = new Array(l);
	    result[0] = array[0];
	    for (var i = 1; i < l; i++)
	        result[i] = result[i - 1] + array[i];
	    return result;
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var arrayStat = __webpack_require__(2);

	// https://github.com/accord-net/framework/blob/development/Sources/Accord.Statistics/Tools.cs

	function entropy(matrix, eps) {
	    if (typeof(eps) === 'undefined') {
	        eps = 0;
	    }
	    var sum = 0,
	        l1 = matrix.length,
	        l2 = matrix[0].length;
	    for (var i = 0; i < l1; i++) {
	        for (var j = 0; j < l2; j++) {
	            sum += matrix[i][j] * Math.log(matrix[i][j] + eps);
	        }
	    }
	    return -sum;
	}

	function mean(matrix, dimension) {
	    if (typeof(dimension) === 'undefined') {
	        dimension = 0;
	    }
	    var rows = matrix.length,
	        cols = matrix[0].length,
	        theMean, N, i, j;

	    if (dimension === -1) {
	        theMean = [0];
	        N = rows * cols;
	        for (i = 0; i < rows; i++) {
	            for (j = 0; j < cols; j++) {
	                theMean[0] += matrix[i][j];
	            }
	        }
	        theMean[0] /= N;
	    } else if (dimension === 0) {
	        theMean = new Array(cols);
	        N = rows;
	        for (j = 0; j < cols; j++) {
	            theMean[j] = 0;
	            for (i = 0; i < rows; i++) {
	                theMean[j] += matrix[i][j];
	            }
	            theMean[j] /= N;
	        }
	    } else if (dimension === 1) {
	        theMean = new Array(rows);
	        N = cols;
	        for (j = 0; j < rows; j++) {
	            theMean[j] = 0;
	            for (i = 0; i < cols; i++) {
	                theMean[j] += matrix[j][i];
	            }
	            theMean[j] /= N;
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }
	    return theMean;
	}

	function standardDeviation(matrix, means, unbiased) {
	    var vari = variance(matrix, means, unbiased), l = vari.length;
	    for (var i = 0; i < l; i++) {
	        vari[i] = Math.sqrt(vari[i]);
	    }
	    return vari;
	}

	function variance(matrix, means, unbiased) {
	    if (typeof(unbiased) === 'undefined') {
	        unbiased = true;
	    }
	    means = means || mean(matrix);
	    var rows = matrix.length;
	    if (rows === 0) return [];
	    var cols = matrix[0].length;
	    var vari = new Array(cols);

	    for (var j = 0; j < cols; j++) {
	        var sum1 = 0, sum2 = 0, x = 0;
	        for (var i = 0; i < rows; i++) {
	            x = matrix[i][j] - means[j];
	            sum1 += x;
	            sum2 += x * x;
	        }
	        if (unbiased) {
	            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / (rows - 1);
	        } else {
	            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / rows;
	        }
	    }
	    return vari;
	}

	function median(matrix) {
	    var rows = matrix.length, cols = matrix[0].length;
	    var medians = new Array(cols);

	    for (var i = 0; i < cols; i++) {
	        var data = new Array(rows);
	        for (var j = 0; j < rows; j++) {
	            data[j] = matrix[j][i];
	        }
	        data.sort();
	        var N = data.length;
	        if (N % 2 === 0) {
	            medians[i] = (data[N / 2] + data[(N / 2) - 1]) * 0.5;
	        } else {
	            medians[i] = data[Math.floor(N / 2)];
	        }
	    }
	    return medians;
	}

	function mode(matrix) {
	    var rows = matrix.length,
	        cols = matrix[0].length,
	        modes = new Array(cols),
	        i, j;
	    for (i = 0; i < cols; i++) {
	        var itemCount = new Array(rows);
	        for (var k = 0; k < rows; k++) {
	            itemCount[k] = 0;
	        }
	        var itemArray = new Array(rows);
	        var count = 0;

	        for (j = 0; j < rows; j++) {
	            var index = itemArray.indexOf(matrix[j][i]);
	            if (index >= 0) {
	                itemCount[index]++;
	            } else {
	                itemArray[count] = matrix[j][i];
	                itemCount[count] = 1;
	                count++;
	            }
	        }

	        var maxValue = 0, maxIndex = 0;
	        for (j = 0; j < count; j++) {
	            if (itemCount[j] > maxValue) {
	                maxValue = itemCount[j];
	                maxIndex = j;
	            }
	        }

	        modes[i] = itemArray[maxIndex];
	    }
	    return modes;
	}

	function skewness(matrix, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var means = mean(matrix);
	    var n = matrix.length, l = means.length;
	    var skew = new Array(l);

	    for (var j = 0; j < l; j++) {
	        var s2 = 0, s3 = 0;
	        for (var i = 0; i < n; i++) {
	            var dev = matrix[i][j] - means[j];
	            s2 += dev * dev;
	            s3 += dev * dev * dev;
	        }

	        var m2 = s2 / n;
	        var m3 = s3 / n;
	        var g = m3 / Math.pow(m2, 3 / 2);

	        if (unbiased) {
	            var a = Math.sqrt(n * (n - 1));
	            var b = n - 2;
	            skew[j] = (a / b) * g;
	        } else {
	            skew[j] = g;
	        }
	    }
	    return skew;
	}

	function kurtosis(matrix, unbiased) {
	    if (typeof(unbiased) === 'undefined') unbiased = true;
	    var means = mean(matrix);
	    var n = matrix.length, m = matrix[0].length;
	    var kurt = new Array(m);

	    for (var j = 0; j < m; j++) {
	        var s2 = 0, s4 = 0;
	        for (var i = 0; i < n; i++) {
	            var dev = matrix[i][j] - means[j];
	            s2 += dev * dev;
	            s4 += dev * dev * dev * dev;
	        }
	        var m2 = s2 / n;
	        var m4 = s4 / n;

	        if (unbiased) {
	            var v = s2 / (n - 1);
	            var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
	            var b = s4 / (v * v);
	            var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));
	            kurt[j] = a * b - 3 * c;
	        } else {
	            kurt[j] = m4 / (m2 * m2) - 3;
	        }
	    }
	    return kurt;
	}

	function standardError(matrix) {
	    var samples = matrix.length;
	    var standardDeviations = standardDeviation(matrix), l = standardDeviations.length;
	    var standardErrors = new Array(l);
	    var sqrtN = Math.sqrt(samples);

	    for (var i = 0; i < l; i++) {
	        standardErrors[i] = standardDeviations[i] / sqrtN;
	    }
	    return standardErrors;
	}

	function covariance(matrix, dimension) {
	    return scatter(matrix, undefined, dimension);
	}

	function scatter(matrix, divisor, dimension) {
	    if (typeof(dimension) === 'undefined') {
	        dimension = 0;
	    }
	    if (typeof(divisor) === 'undefined') {
	        if (dimension === 0) {
	            divisor = matrix.length - 1;
	        } else if (dimension === 1) {
	            divisor = matrix[0].length - 1;
	        }
	    }
	    var means = mean(matrix, dimension),
	        rows = matrix.length;
	    if (rows === 0) {
	        return [[]];
	    }
	    var cols = matrix[0].length,
	        cov, i, j, s, k;

	    if (dimension === 0) {
	        cov = new Array(cols);
	        for (i = 0; i < cols; i++) {
	            cov[i] = new Array(cols);
	        }
	        for (i = 0; i < cols; i++) {
	            for (j = i; j < cols; j++) {
	                s = 0;
	                for (k = 0; k < rows; k++) {
	                    s += (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
	                }
	                s /= divisor;
	                cov[i][j] = s;
	                cov[j][i] = s;
	            }
	        }
	    } else if (dimension === 1) {
	        cov = new Array(rows);
	        for (i = 0; i < rows; i++) {
	            cov[i] = new Array(rows);
	        }
	        for (i = 0; i < rows; i++) {
	            for (j = i; j < rows; j++) {
	                s = 0;
	                for (k = 0; k < cols; k++) {
	                    s += (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
	                }
	                s /= divisor;
	                cov[i][j] = s;
	                cov[j][i] = s;
	            }
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }

	    return cov;
	}

	function correlation(matrix) {
	    var means = mean(matrix),
	        standardDeviations = standardDeviation(matrix, true, means),
	        scores = zScores(matrix, means, standardDeviations),
	        rows = matrix.length,
	        cols = matrix[0].length,
	        i, j;

	    var cor = new Array(cols);
	    for (i = 0; i < cols; i++) {
	        cor[i] = new Array(cols);
	    }
	    for (i = 0; i < cols; i++) {
	        for (j = i; j < cols; j++) {
	            var c = 0;
	            for (var k = 0, l = scores.length; k < l; k++) {
	                c += scores[k][j] * scores[k][i];
	            }
	            c /= rows - 1;
	            cor[i][j] = c;
	            cor[j][i] = c;
	        }
	    }
	    return cor;
	}

	function zScores(matrix, means, standardDeviations) {
	    means = means || mean(matrix);
	    if (typeof(standardDeviations) === 'undefined') standardDeviations = standardDeviation(matrix, true, means);
	    return standardize(center(matrix, means, false), standardDeviations, true);
	}

	function center(matrix, means, inPlace) {
	    means = means || mean(matrix);
	    var result = matrix,
	        l = matrix.length,
	        i, j, jj;

	    if (!inPlace) {
	        result = new Array(l);
	        for (i = 0; i < l; i++) {
	            result[i] = new Array(matrix[i].length);
	        }
	    }

	    for (i = 0; i < l; i++) {
	        var row = result[i];
	        for (j = 0, jj = row.length; j < jj; j++) {
	            row[j] = matrix[i][j] - means[j];
	        }
	    }
	    return result;
	}

	function standardize(matrix, standardDeviations, inPlace) {
	    if (typeof(standardDeviations) === 'undefined') standardDeviations = standardDeviation(matrix);
	    var result = matrix,
	        l = matrix.length,
	        i, j, jj;

	    if (!inPlace) {
	        result = new Array(l);
	        for (i = 0; i < l; i++) {
	            result[i] = new Array(matrix[i].length);
	        }
	    }

	    for (i = 0; i < l; i++) {
	        var resultRow = result[i];
	        var sourceRow = matrix[i];
	        for (j = 0, jj = resultRow.length; j < jj; j++) {
	            if (standardDeviations[j] !== 0 && !isNaN(standardDeviations[j])) {
	                resultRow[j] = sourceRow[j] / standardDeviations[j];
	            }
	        }
	    }
	    return result;
	}

	function weightedVariance(matrix, weights) {
	    var means = mean(matrix);
	    var rows = matrix.length;
	    if (rows === 0) return [];
	    var cols = matrix[0].length;
	    var vari = new Array(cols);

	    for (var j = 0; j < cols; j++) {
	        var sum = 0;
	        var a = 0, b = 0;

	        for (var i = 0; i < rows; i++) {
	            var z = matrix[i][j] - means[j];
	            var w = weights[i];

	            sum += w * (z * z);
	            b += w;
	            a += w * w;
	        }

	        vari[j] = sum * (b / (b * b - a));
	    }

	    return vari;
	}

	function weightedMean(matrix, weights, dimension) {
	    if (typeof(dimension) === 'undefined') {
	        dimension = 0;
	    }
	    var rows = matrix.length;
	    if (rows === 0) return [];
	    var cols = matrix[0].length,
	        means, i, ii, j, w, row;

	    if (dimension === 0) {
	        means = new Array(cols);
	        for (i = 0; i < cols; i++) {
	            means[i] = 0;
	        }
	        for (i = 0; i < rows; i++) {
	            row = matrix[i];
	            w = weights[i];
	            for (j = 0; j < cols; j++) {
	                means[j] += row[j] * w;
	            }
	        }
	    } else if (dimension === 1) {
	        means = new Array(rows);
	        for (i = 0; i < rows; i++) {
	            means[i] = 0;
	        }
	        for (j = 0; j < rows; j++) {
	            row = matrix[j];
	            w = weights[j];
	            for (i = 0; i < cols; i++) {
	                means[j] += row[i] * w;
	            }
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }

	    var weightSum = arrayStat.sum(weights);
	    if (weightSum !== 0) {
	        for (i = 0, ii = means.length; i < ii; i++) {
	            means[i] /= weightSum;
	        }
	    }
	    return means;
	}

	function weightedCovariance(matrix, weights, means, dimension) {
	    dimension = dimension || 0;
	    means = means || weightedMean(matrix, weights, dimension);
	    var s1 = 0, s2 = 0;
	    for (var i = 0, ii = weights.length; i < ii; i++) {
	        s1 += weights[i];
	        s2 += weights[i] * weights[i];
	    }
	    var factor = s1 / (s1 * s1 - s2);
	    return weightedScatter(matrix, weights, means, factor, dimension);
	}

	function weightedScatter(matrix, weights, means, factor, dimension) {
	    dimension = dimension || 0;
	    means = means || weightedMean(matrix, weights, dimension);
	    if (typeof(factor) === 'undefined') {
	        factor = 1;
	    }
	    var rows = matrix.length;
	    if (rows === 0) {
	        return [[]];
	    }
	    var cols = matrix[0].length,
	        cov, i, j, k, s;

	    if (dimension === 0) {
	        cov = new Array(cols);
	        for (i = 0; i < cols; i++) {
	            cov[i] = new Array(cols);
	        }
	        for (i = 0; i < cols; i++) {
	            for (j = i; j < cols; j++) {
	                s = 0;
	                for (k = 0; k < rows; k++) {
	                    s += weights[k] * (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
	                }
	                cov[i][j] = s * factor;
	                cov[j][i] = s * factor;
	            }
	        }
	    } else if (dimension === 1) {
	        cov = new Array(rows);
	        for (i = 0; i < rows; i++) {
	            cov[i] = new Array(rows);
	        }
	        for (i = 0; i < rows; i++) {
	            for (j = i; j < rows; j++) {
	                s = 0;
	                for (k = 0; k < cols; k++) {
	                    s += weights[k] * (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
	                }
	                cov[i][j] = s * factor;
	                cov[j][i] = s * factor;
	            }
	        }
	    } else {
	        throw new Error('Invalid dimension');
	    }

	    return cov;
	}

	module.exports = {
	    entropy: entropy,
	    mean: mean,
	    standardDeviation: standardDeviation,
	    variance: variance,
	    median: median,
	    mode: mode,
	    skewness: skewness,
	    kurtosis: kurtosis,
	    standardError: standardError,
	    covariance: covariance,
	    scatter: scatter,
	    correlation: correlation,
	    zScores: zScores,
	    center: center,
	    standardize: standardize,
	    weightedVariance: weightedVariance,
	    weightedMean: weightedMean,
	    weightedCovariance: weightedCovariance,
	    weightedScatter: weightedScatter
	};


/***/ }
/******/ ])
});
;