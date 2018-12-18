'use strict';

var COMMON_NO = 0;
var COMMON_FIRST = 1;
var COMMON_SECOND = 2;
var COMMON_BOTH = 3; // should be a binary operation !

var Stat = require('ml-stat').array;

/**
 * Create a comparator class
 * {object} [options={}]
 * {string} [options.common=''] should we take only common peaks 'first', 'second', 'both', ''
 * {number} [options.widthBottom=2] bottom trapezoid width for similarity evaluation
 * {number} [options.widthTop=1] top trapezoid width for similarity evaluation
 * {number} [options.from] from region used for similarity calculation
 * {number} [options.to] to region used for similarity calculation
 */

module.exports = function Comparator(options = {}) {
  var widthTop, widthBottom, from, to;
  var array1Extract, array2Extract, widthSlope, array1ExtractInfo, array2ExtractInfo;
  var common, commonFactor;

  setOptions(options);

  var array1 = [];
  var array2 = [];

  /*
     2 formats are allowed:
     [[x1,x2,...],[y1,y2,...]] or [[x1,y1],[x2,y2], ...]
    */

  function setOptions(newOptions) {
    options = newOptions || {};
    if (typeof options.common === 'string') {
      if (options.common.toLowerCase() === 'first') {
        common = COMMON_FIRST;
      } else if (options.common.toLowerCase() === 'second') {
        common = COMMON_SECOND;
      } else if (options.common.toLowerCase() === 'both') {
        common = COMMON_BOTH;
      } else {
        common = COMMON_NO;
      }
    } else {
      if (options.common === true) {
        common = COMMON_BOTH;
      } else {
        common = COMMON_NO;
      }
    }
    commonFactor = options.commonFactor || commonFactor || 4;

    if (options.widthBottom === undefined) {
      options.widthBottom = widthBottom || 2;
    }
    if (options.widthTop === undefined) {
      options.widthTop = widthTop || 1;
    }
    setTrapezoid(options.widthBottom, options.widthTop);
    setFromTo(options.from || from, options.to || to);
  }

  function setPeaks1(anArray) {
    array1 = checkArray(anArray);

    if (common) {
      var extracts = commonExtractAndNormalize(array1, array2, widthBottom, from, to, common);
      array1Extract = extracts.data1;
      array1ExtractInfo = extracts.info1;
      array2Extract = extracts.data2;
      array2ExtractInfo = extracts.info2;
    } else {
      var extract = extractAndNormalize(array1, from, to);
      array1Extract = extract.data;
      array1ExtractInfo = extract.info;
    }
  }
  function setPeaks2(anArray) {
    array2 = checkArray(anArray);
    if (common) {
      var extracts = commonExtractAndNormalize(array1, array2, widthBottom, from, to, common);
      array1Extract = extracts.data1;
      array1ExtractInfo = extracts.info1;
      array2Extract = extracts.data2;
      array2ExtractInfo = extracts.info2;
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
    widthTop = newWidthTop;
    widthBottom = newWidthBottom;
    widthSlope = (widthBottom - widthTop) / 2;
    if (widthBottom < widthTop) throw new Error('widthBottom has to be larger than widthTop');
  }

  function setFromTo(newFrom, newTo) {
    if (newFrom === from && newTo === to) return;
    from = newFrom;
    to = newTo;
    if (common) {
      var extracts = commonExtractAndNormalize(array1, array2, widthBottom, from, to, common, commonFactor);
      array1Extract = extracts.data1;
      array1ExtractInfo = extracts.info1;
      array2Extract = extracts.data2;
      array2ExtractInfo = extracts.info2;
    } else {
      var extract = extractAndNormalize(array1, from, to);
      array1Extract = extract.data;
      array1ExtractInfo = extract.info;
      extract = extractAndNormalize(array2, from, to);
      array2Extract = extract.data;
      array2ExtractInfo = extract.info;
    }
  }


  function getOverlap(x1, y1, x2, y2) {
    if (y1 === 0 || y2 === 0) return 0;

    // TAKE CARE !!! We multiply the diff by 2 !!!
    var diff = Math.abs(x1 - x2) * 2;

    if (diff > widthBottom) return 0;
    if (diff <= widthTop) {
      return Math.min(y1, y2);
    }

    var maxValue = Math.max(y1, y2) * (widthBottom - diff) / (widthBottom - widthTop);
    return Math.min(y1, y2, maxValue);
  }

  // This is the old trapezoid similarity
  function getOverlapTrapezoid(x1, y1, x2, y2) {
    var factor = 2 / (widthTop + widthBottom); // correction for surface=1
    if (y1 === 0 || y2 === 0) return 0;
    if (x1 === x2) { // they have the same position
      return Math.min(y1, y2);
    }

    var diff = Math.abs(x1 - x2);
    if (diff >= widthBottom) return 0;
    if (y1 === y2) { // do they have the same height ???
      // we need to find the common length
      if (diff <= widthTop) {
        return (((widthTop + widthBottom) / 2 - diff) * y1) * factor;
      } else if (diff <= widthBottom) {
        return (widthBottom - diff) * y1 / 2 * (diff - widthTop) / (widthBottom - widthTop) * factor;
      }
      return 0;
    } else { // the height are different and not the same position ...
      // we need to consider only one segment to find its intersection

      var small = Math.min(y1, y2);
      var big = Math.max(y1, y2);

      var targets = [
        [[0, 0], [widthSlope, small]],
        [[widthSlope, small], [widthSlope + widthTop, small]],
        [[widthTop + widthSlope, small], [widthBottom, 0]]
      ];
      var segment;
      if ((x1 > x2 && y1 > y2) || (x1 < x2 && y1 < y2)) {
        segment = [[diff, 0], [diff + widthSlope, big]];
      } else {
        segment = [[diff + widthSlope, big], [diff, 0]];
      }


      for (var i = 0; i < 3; i++) {
        var intersection = getIntersection(targets[i], segment);
        if (intersection) {
          switch (i) {
            case 0:
              return small - ((diff * intersection.y / 2)) * factor;
            case 1: // to simplify ...
              //     console.log("           ",widthSlope,small,big,intersection.x)
              return ((widthSlope * small / (2 * big)) * small +
                                (widthTop + widthSlope - intersection.x) * small +
                                widthSlope * small / 2) * factor;
            case 2:
              return ((widthBottom - diff) * intersection.y / 2) * factor;
            default:
              throw new Error(`unexpected intersection value: ${i}`);
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
    var newFirst = [
      [].concat(array1Extract[0]),
      [].concat(array1Extract[1])
    ];
    var newSecond = [
      [].concat(array2Extract[0]),
      [].concat(array2Extract[1])
    ];
    var array1Length = array1Extract[0] ? array1Extract[0].length : 0;
    var array2Length = array2Extract[0] ? array2Extract[0].length : 0;

    var pos1 = 0;
    var pos2 = 0;
    var previous2 = 0;
    while (pos1 < array1Length) {
      var diff = newFirst[0][pos1] - array2Extract[0][pos2];
      if (Math.abs(diff) < widthBottom) { // there is some overlap
        var overlap;
        if (options.trapezoid) {
          overlap = getOverlapTrapezoid(newFirst[0][pos1], newFirst[1][pos1], newSecond[0][pos2], newSecond[1][pos2], widthTop, widthBottom);
        } else {
          overlap = getOverlap(newFirst[0][pos1], newFirst[1][pos1], newSecond[0][pos2], newSecond[1][pos2], widthTop, widthBottom);
        }
        newFirst[1][pos1] -= overlap;
        newSecond[1][pos2] -= overlap;
        if (pos2 < (array2Length - 1)) {
          pos2++;
        } else {
          pos1++;
          pos2 = previous2;
        }
      } else {
        if (diff > 0 && pos2 < (array2Length - 1)) {
          pos2++;
          previous2 = pos2;
        } else {
          pos1++;
          pos2 = previous2;
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
    if (Array.isArray(points) && Array.isArray(points[0]) && points.length === 2) return points;
    var x = new Array(points.length);
    var y = new Array(points.length);
    for (var i = 0; i < points.length; i++) {
      x[i] = points[i][0];
      y[i] = points[i][1];
    }
    return [x, y];
  }

  function getSimilarity(newPeaks1, newPeaks2) {
    if (newPeaks1) setPeaks1(newPeaks1);
    if (newPeaks2) setPeaks2(newPeaks2);
    var result = {};
    result.diff = calculateDiff();
    result.extract1 = getExtract1();
    result.extract2 = getExtract2();
    result.extractInfo1 = getExtractInfo1();
    result.extractInfo2 = getExtractInfo2();
    result.similarity = calculateOverlapFromDiff(result.diff);
    result.widthBottom = widthBottom;
    result.widthTop = widthTop;
    return result;
  }

  /*
        This works mainly when you have a array1 that is fixed
        newPeaks2 have to be normalized ! (sum to 1)
     */
  function fastSimilarity(newPeaks2, from, to) {
    array1Extract = extract(array1, from, to);
    array2Extract = newPeaks2;
    if (common & COMMON_SECOND) array1Extract = getCommonArray(array1Extract, array2Extract, widthBottom);
    normalize(array1Extract);
    var diff = calculateDiff();
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
  var newArray = [[], []];
  var pos2 = 0;
  width /= 2;
  var j = 0;
  var array1Length = array1[0] ? array1[0].length : 0;
  var array2Length = array2[0] ? array2[0].length : 0;

  for (var i = 0; i < array1Length; i++) {
    while (pos2 < array2Length && (array1[0][i] > (array2[0][pos2] + width))) {
      pos2++;
    }
    if ((pos2 < array2Length) && (array1[0][i] > array2[0][pos2] - width)) {
      newArray[0][j] = array1[0][i];
      newArray[1][j] = array1[1][i];
      j++;
    }
  }
  return newArray;
}


// Adapted from: http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
function getIntersection(segment1, segment2) {
  var p0X = segment1[0][0];
  var p0Y = segment1[0][1];
  var p1X = segment1[1][0];
  var p1Y = segment1[1][1];
  var p2X = segment2[0][0];
  var p2Y = segment2[0][1];
  var p3X = segment2[1][0];
  var p3Y = segment2[1][1];

  var s1X, s1Y, s2X, s2Y;
  s1X = p1X - p0X;
  s1Y = p1Y - p0Y;
  s2X = p3X - p2X;
  s2Y = p3Y - p2Y;
  var s, t;
  s = (-s1Y * (p0X - p2X) + s1X * (p0Y - p2Y)) / (-s2X * s1Y + s1X * s2Y);
  t = (s2X * (p0Y - p2Y) - s2Y * (p0X - p2X)) / (-s2X * s1Y + s1X * s2Y);
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    return {
      x: p0X + (t * s1X),
      y: p0Y + (t * s1Y)
    };
  }
  return null; // No collision
}

function normalize(array) {
  var min = Stat.min(array[1]);
  var max = Stat.max(array[1]);
  var sum = Stat.sum(array[1]);
  var length = array[1] ? array[1].length : 0;
  if (sum !== 0) {
    for (var i = 0; i < length; i++) {
      array[1][i] /= sum;
    }
  }
  return {
    sum: sum,
    min: min,
    max: max
  };
}

// this method will systematically take care of both array
function commonExtractAndNormalize(array1, array2, width, from, to, common) {
  if (!(Array.isArray(array1)) || !(Array.isArray(array2))) {
    return {
      info: undefined,
      data: undefined
    };
  }
  var extract1 = extract(array1, from, to);
  var extract2 = extract(array2, from, to);
  var common1, common2, info1, info2;
  if (common & COMMON_SECOND) {
    common1 = getCommonArray(extract1, extract2, width);
    info1 = normalize(common1);
  } else {
    common1 = extract1;
    info1 = normalize(common1);
  }
  if (common & COMMON_FIRST) {
    common2 = getCommonArray(extract2, extract1, width);
    info2 = normalize(common2);
  } else {
    common2 = extract2;
    info2 = normalize(common2);
  }

  return {
    info1: info1,
    info2: info2,
    data1: common1,
    data2: common2
  };
}

function extract(array, from, to) {
  var newArray = [[], []];
  var j = 0;
  var length = array[0] ? array[0].length : 0;
  for (var i = 0; i < length; i++) {
    if ((!from || array[0][i] >= from) && (!to || array[0][i] <= to)) {
      newArray[0][j] = array[0][i];
      newArray[1][j] = array[1][i];
      j++;
    }
  }
  return newArray;
}

function extractAndNormalize(array, from, to) {
  if (!(Array.isArray(array))) {
    return {
      info: undefined,
      data: undefined
    };
  }
  var newArray = extract(array, from, to);
  var info = normalize(newArray);
  return {
    info: info,
    data: newArray
  };
}

function calculateOverlapFromDiff(diffs) {
  if (diffs[1].length === 0) return 0;
  var sumPos = 0;
  for (var i = 0; i < diffs[1].length; i++) {
    sumPos += Math.abs(diffs[1][i]);
  }
  return 1 - sumPos;
}
