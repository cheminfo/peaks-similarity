/**
 * peaks-similarity - Peaks similarity - calculate the similarity between 2 ordered arrays of peaks
 * @version v2.3.1
 * @link https://github.com/cheminfo/peaks-similarity
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PeaksSimilarity = {}));
})(this, (function (exports) { 'use strict';

  function calculateOverlapFromDiff(diffs) {
    if (diffs[1].length === 0) return 0;
    let sumPos = 0;
    for (let i = 0; i < diffs[1].length; i++) {
      sumPos += Math.abs(diffs[1][i]);
    }
    return 1 - sumPos;
  }

  /**
          This code requires the use of an array like  [[x1,y1],[x2,y2], ...]
          If it is not the right format, we will just convert it
          Otherwise we return the correct format
       */
  function checkArray(points) {
    // if it is already a 2D array of points, we just return them
    if (Array.isArray(points) && Array.isArray(points[0]) && points.length === 2) {
      return points;
    }
    const x = new Array(points.length);
    const y = new Array(points.length);
    for (let i = 0; i < points.length; i++) {
      x[i] = points[i][0];
      y[i] = points[i][1];
    }
    return [x, y];
  }

  function extract(array, from, to) {
    const newArray = [[], []];
    let j = 0;
    const length = array[0] ? array[0].length : 0;
    for (let i = 0; i < length; i++) {
      if ((!from || array[0][i] >= from) && (!to || array[0][i] <= to)) {
        newArray[0][j] = array[0][i];
        newArray[1][j] = array[1][i];
        j++;
      }
    }
    return newArray;
  }

  // returns an new array based on array1 where there is a peak of array2 at a distance under width/2

  function getCommonArray(array1, array2, width) {
    const newArray = [[], []];
    let pos2 = 0;
    width /= 2;
    let j = 0;
    const array1Length = array1[0] ? array1[0].length : 0;
    const array2Length = array2[0] ? array2[0].length : 0;
    for (let i = 0; i < array1Length; i++) {
      while (pos2 < array2Length && array1[0][i] > array2[0][pos2] + width) {
        pos2++;
      }
      if (pos2 < array2Length && array1[0][i] > array2[0][pos2] - width) {
        newArray[0][j] = array1[0][i];
        newArray[1][j] = array1[1][i];
        j++;
      }
    }
    return newArray;
  }

  var mlStat = {};

  var array$1 = {};

  (function (exports) {

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
      var max = values[0];
      var l = values.length;
      for (var i = 1; i < l; i++) {
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
      var min = values[0];
      var l = values.length;
      for (var i = 1; i < l; i++) {
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
      var min = values[0];
      var max = values[0];
      var l = values.length;
      for (var i = 1; i < l; i++) {
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
        values = [].concat(values).sort(compareNumbers);
      }
      var l = values.length;
      var k = Math.floor(l * percent);
      var sum = 0;
      for (var i = k; i < l - k; i++) {
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
        values = [].concat(values).sort(compareNumbers);
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

    /**
     * IEEE Transactions on biomedical engineering, vol. 52, no. 1, january 2005, p. 76-
     * Calculate the standard deviation via the Median of the absolute deviation
     *  The formula for the standard deviation only holds for Gaussian random variables.
     * @returns {{mean: number, stdev: number}}
     */
    exports.robustMeanAndStdev = function robustMeanAndStdev(y) {
      var mean = 0,
        stdev = 0;
      var length = y.length,
        i = 0;
      for (i = 0; i < length; i++) {
        mean += y[i];
      }
      mean /= length;
      var averageDeviations = new Array(length);
      for (i = 0; i < length; i++) averageDeviations[i] = Math.abs(y[i] - mean);
      averageDeviations.sort(compareNumbers);
      if (length % 2 === 1) {
        stdev = averageDeviations[(length - 1) / 2] / 0.6745;
      } else {
        stdev = 0.5 * (averageDeviations[length / 2] + averageDeviations[length / 2 - 1]) / 0.6745;
      }
      return {
        mean: mean,
        stdev: stdev
      };
    };
    exports.quartiles = function quartiles(values, alreadySorted) {
      if (typeof alreadySorted === 'undefined') alreadySorted = false;
      if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
      }
      var quart = values.length / 4;
      var q1 = values[Math.ceil(quart) - 1];
      var q2 = exports.median(values, true);
      var q3 = values[Math.ceil(quart * 3) - 1];
      return {
        q1: q1,
        q2: q2,
        q3: q3
      };
    };
    exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
      return Math.sqrt(exports.pooledVariance(samples, unbiased));
    };
    exports.pooledVariance = function pooledVariance(samples, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var sum = 0;
      var length = 0,
        l = samples.length;
      for (var i = 0; i < l; i++) {
        var values = samples[i];
        var vari = exports.variance(values);
        sum += (values.length - 1) * vari;
        if (unbiased) length += values.length - 1;else length += values.length;
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
        if (index >= 0) itemCount[index]++;else {
          itemArray[count] = values[i];
          itemCount[count] = 1;
          count++;
        }
      }
      var maxValue = 0,
        maxIndex = 0;
      for (i = 0; i < count; i++) {
        if (itemCount[i] > maxValue) {
          maxValue = itemCount[i];
          maxIndex = i;
        }
      }
      return itemArray[maxIndex];
    };
    exports.covariance = function covariance(vector1, vector2, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var mean1 = exports.mean(vector1);
      var mean2 = exports.mean(vector2);
      if (vector1.length !== vector2.length) throw 'Vectors do not have the same dimensions';
      var cov = 0,
        l = vector1.length;
      for (var i = 0; i < l; i++) {
        var x = vector1[i] - mean1;
        var y = vector2[i] - mean2;
        cov += x * y;
      }
      if (unbiased) return cov / (l - 1);else return cov / l;
    };
    exports.skewness = function skewness(values, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var theMean = exports.mean(values);
      var s2 = 0,
        s3 = 0,
        l = values.length;
      for (var i = 0; i < l; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s3 += dev * dev * dev;
      }
      var m2 = s2 / l;
      var m3 = s3 / l;
      var g = m3 / Math.pow(m2, 3 / 2.0);
      if (unbiased) {
        var a = Math.sqrt(l * (l - 1));
        var b = l - 2;
        return a / b * g;
      } else {
        return g;
      }
    };
    exports.kurtosis = function kurtosis(values, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var theMean = exports.mean(values);
      var n = values.length,
        s2 = 0,
        s4 = 0;
      for (var i = 0; i < n; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s4 += dev * dev * dev * dev;
      }
      var m2 = s2 / n;
      var m4 = s4 / n;
      if (unbiased) {
        var v = s2 / (n - 1);
        var a = n * (n + 1) / ((n - 1) * (n - 2) * (n - 3));
        var b = s4 / (v * v);
        var c = (n - 1) * (n - 1) / ((n - 2) * (n - 3));
        return a * b - 3 * c;
      } else {
        return m4 / (m2 * m2) - 3;
      }
    };
    exports.entropy = function entropy(values, eps) {
      if (typeof eps === 'undefined') eps = 0;
      var sum = 0,
        l = values.length;
      for (var i = 0; i < l; i++) sum += values[i] * Math.log(values[i] + eps);
      return -sum;
    };
    exports.weightedMean = function weightedMean(values, weights) {
      var sum = 0,
        l = values.length;
      for (var i = 0; i < l; i++) sum += values[i] * weights[i];
      return sum;
    };
    exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
      return Math.sqrt(exports.weightedVariance(values, weights));
    };
    exports.weightedVariance = function weightedVariance(values, weights) {
      var theMean = exports.weightedMean(values, weights);
      var vari = 0,
        l = values.length;
      var a = 0,
        b = 0;
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
      if (typeof inPlace === 'undefined') inPlace = false;
      var result = values;
      if (!inPlace) result = [].concat(values);
      var theMean = exports.mean(result),
        l = result.length;
      for (var i = 0; i < l; i++) result[i] -= theMean;
    };
    exports.standardize = function standardize(values, standardDev, inPlace) {
      if (typeof standardDev === 'undefined') standardDev = exports.standardDeviation(values);
      if (typeof inPlace === 'undefined') inPlace = false;
      var l = values.length;
      var result = inPlace ? values : new Array(l);
      for (var i = 0; i < l; i++) result[i] = values[i] / standardDev;
      return result;
    };
    exports.cumulativeSum = function cumulativeSum(array) {
      var l = array.length;
      var result = new Array(l);
      result[0] = array[0];
      for (var i = 1; i < l; i++) result[i] = result[i - 1] + array[i];
      return result;
    };
  })(array$1);

  var matrix = {};

  (function (exports) {

    var arrayStat = array$1;
    function compareNumbers(a, b) {
      return a - b;
    }
    exports.max = function max(matrix) {
      var max = -Infinity;
      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j] > max) max = matrix[i][j];
        }
      }
      return max;
    };
    exports.min = function min(matrix) {
      var min = Infinity;
      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j] < min) min = matrix[i][j];
        }
      }
      return min;
    };
    exports.minMax = function minMax(matrix) {
      var min = Infinity;
      var max = -Infinity;
      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j] < min) min = matrix[i][j];
          if (matrix[i][j] > max) max = matrix[i][j];
        }
      }
      return {
        min: min,
        max: max
      };
    };
    exports.entropy = function entropy(matrix, eps) {
      if (typeof eps === 'undefined') {
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
    };
    exports.mean = function mean(matrix, dimension) {
      if (typeof dimension === 'undefined') {
        dimension = 0;
      }
      var rows = matrix.length,
        cols = matrix[0].length,
        theMean,
        N,
        i,
        j;
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
    };
    exports.sum = function sum(matrix, dimension) {
      if (typeof dimension === 'undefined') {
        dimension = 0;
      }
      var rows = matrix.length,
        cols = matrix[0].length,
        theSum,
        i,
        j;
      if (dimension === -1) {
        theSum = [0];
        for (i = 0; i < rows; i++) {
          for (j = 0; j < cols; j++) {
            theSum[0] += matrix[i][j];
          }
        }
      } else if (dimension === 0) {
        theSum = new Array(cols);
        for (j = 0; j < cols; j++) {
          theSum[j] = 0;
          for (i = 0; i < rows; i++) {
            theSum[j] += matrix[i][j];
          }
        }
      } else if (dimension === 1) {
        theSum = new Array(rows);
        for (j = 0; j < rows; j++) {
          theSum[j] = 0;
          for (i = 0; i < cols; i++) {
            theSum[j] += matrix[j][i];
          }
        }
      } else {
        throw new Error('Invalid dimension');
      }
      return theSum;
    };
    exports.product = function product(matrix, dimension) {
      if (typeof dimension === 'undefined') {
        dimension = 0;
      }
      var rows = matrix.length,
        cols = matrix[0].length,
        theProduct,
        i,
        j;
      if (dimension === -1) {
        theProduct = [1];
        for (i = 0; i < rows; i++) {
          for (j = 0; j < cols; j++) {
            theProduct[0] *= matrix[i][j];
          }
        }
      } else if (dimension === 0) {
        theProduct = new Array(cols);
        for (j = 0; j < cols; j++) {
          theProduct[j] = 1;
          for (i = 0; i < rows; i++) {
            theProduct[j] *= matrix[i][j];
          }
        }
      } else if (dimension === 1) {
        theProduct = new Array(rows);
        for (j = 0; j < rows; j++) {
          theProduct[j] = 1;
          for (i = 0; i < cols; i++) {
            theProduct[j] *= matrix[j][i];
          }
        }
      } else {
        throw new Error('Invalid dimension');
      }
      return theProduct;
    };
    exports.standardDeviation = function standardDeviation(matrix, means, unbiased) {
      var vari = exports.variance(matrix, means, unbiased),
        l = vari.length;
      for (var i = 0; i < l; i++) {
        vari[i] = Math.sqrt(vari[i]);
      }
      return vari;
    };
    exports.variance = function variance(matrix, means, unbiased) {
      if (typeof unbiased === 'undefined') {
        unbiased = true;
      }
      means = means || exports.mean(matrix);
      var rows = matrix.length;
      if (rows === 0) return [];
      var cols = matrix[0].length;
      var vari = new Array(cols);
      for (var j = 0; j < cols; j++) {
        var sum1 = 0,
          sum2 = 0,
          x = 0;
        for (var i = 0; i < rows; i++) {
          x = matrix[i][j] - means[j];
          sum1 += x;
          sum2 += x * x;
        }
        if (unbiased) {
          vari[j] = (sum2 - sum1 * sum1 / rows) / (rows - 1);
        } else {
          vari[j] = (sum2 - sum1 * sum1 / rows) / rows;
        }
      }
      return vari;
    };
    exports.median = function median(matrix) {
      var rows = matrix.length,
        cols = matrix[0].length;
      var medians = new Array(cols);
      for (var i = 0; i < cols; i++) {
        var data = new Array(rows);
        for (var j = 0; j < rows; j++) {
          data[j] = matrix[j][i];
        }
        data.sort(compareNumbers);
        var N = data.length;
        if (N % 2 === 0) {
          medians[i] = (data[N / 2] + data[N / 2 - 1]) * 0.5;
        } else {
          medians[i] = data[Math.floor(N / 2)];
        }
      }
      return medians;
    };
    exports.mode = function mode(matrix) {
      var rows = matrix.length,
        cols = matrix[0].length,
        modes = new Array(cols),
        i,
        j;
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
        var maxValue = 0,
          maxIndex = 0;
        for (j = 0; j < count; j++) {
          if (itemCount[j] > maxValue) {
            maxValue = itemCount[j];
            maxIndex = j;
          }
        }
        modes[i] = itemArray[maxIndex];
      }
      return modes;
    };
    exports.skewness = function skewness(matrix, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var means = exports.mean(matrix);
      var n = matrix.length,
        l = means.length;
      var skew = new Array(l);
      for (var j = 0; j < l; j++) {
        var s2 = 0,
          s3 = 0;
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
          skew[j] = a / b * g;
        } else {
          skew[j] = g;
        }
      }
      return skew;
    };
    exports.kurtosis = function kurtosis(matrix, unbiased) {
      if (typeof unbiased === 'undefined') unbiased = true;
      var means = exports.mean(matrix);
      var n = matrix.length,
        m = matrix[0].length;
      var kurt = new Array(m);
      for (var j = 0; j < m; j++) {
        var s2 = 0,
          s4 = 0;
        for (var i = 0; i < n; i++) {
          var dev = matrix[i][j] - means[j];
          s2 += dev * dev;
          s4 += dev * dev * dev * dev;
        }
        var m2 = s2 / n;
        var m4 = s4 / n;
        if (unbiased) {
          var v = s2 / (n - 1);
          var a = n * (n + 1) / ((n - 1) * (n - 2) * (n - 3));
          var b = s4 / (v * v);
          var c = (n - 1) * (n - 1) / ((n - 2) * (n - 3));
          kurt[j] = a * b - 3 * c;
        } else {
          kurt[j] = m4 / (m2 * m2) - 3;
        }
      }
      return kurt;
    };
    exports.standardError = function standardError(matrix) {
      var samples = matrix.length;
      var standardDeviations = exports.standardDeviation(matrix);
      var l = standardDeviations.length;
      var standardErrors = new Array(l);
      var sqrtN = Math.sqrt(samples);
      for (var i = 0; i < l; i++) {
        standardErrors[i] = standardDeviations[i] / sqrtN;
      }
      return standardErrors;
    };
    exports.covariance = function covariance(matrix, dimension) {
      return exports.scatter(matrix, undefined, dimension);
    };
    exports.scatter = function scatter(matrix, divisor, dimension) {
      if (typeof dimension === 'undefined') {
        dimension = 0;
      }
      if (typeof divisor === 'undefined') {
        if (dimension === 0) {
          divisor = matrix.length - 1;
        } else if (dimension === 1) {
          divisor = matrix[0].length - 1;
        }
      }
      var means = exports.mean(matrix, dimension);
      var rows = matrix.length;
      if (rows === 0) {
        return [[]];
      }
      var cols = matrix[0].length,
        cov,
        i,
        j,
        s,
        k;
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
    };
    exports.correlation = function correlation(matrix) {
      var means = exports.mean(matrix),
        standardDeviations = exports.standardDeviation(matrix, true, means),
        scores = exports.zScores(matrix, means, standardDeviations),
        rows = matrix.length,
        cols = matrix[0].length,
        i,
        j;
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
    };
    exports.zScores = function zScores(matrix, means, standardDeviations) {
      means = means || exports.mean(matrix);
      if (typeof standardDeviations === 'undefined') standardDeviations = exports.standardDeviation(matrix, true, means);
      return exports.standardize(exports.center(matrix, means, false), standardDeviations, true);
    };
    exports.center = function center(matrix, means, inPlace) {
      means = means || exports.mean(matrix);
      var result = matrix,
        l = matrix.length,
        i,
        j,
        jj;
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
    };
    exports.standardize = function standardize(matrix, standardDeviations, inPlace) {
      if (typeof standardDeviations === 'undefined') standardDeviations = exports.standardDeviation(matrix);
      var result = matrix,
        l = matrix.length,
        i,
        j,
        jj;
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
    };
    exports.weightedVariance = function weightedVariance(matrix, weights) {
      var means = exports.mean(matrix);
      var rows = matrix.length;
      if (rows === 0) return [];
      var cols = matrix[0].length;
      var vari = new Array(cols);
      for (var j = 0; j < cols; j++) {
        var sum = 0;
        var a = 0,
          b = 0;
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
    };
    exports.weightedMean = function weightedMean(matrix, weights, dimension) {
      if (typeof dimension === 'undefined') {
        dimension = 0;
      }
      var rows = matrix.length;
      if (rows === 0) return [];
      var cols = matrix[0].length,
        means,
        i,
        ii,
        j,
        w,
        row;
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
    };
    exports.weightedCovariance = function weightedCovariance(matrix, weights, means, dimension) {
      dimension = dimension || 0;
      means = means || exports.weightedMean(matrix, weights, dimension);
      var s1 = 0,
        s2 = 0;
      for (var i = 0, ii = weights.length; i < ii; i++) {
        s1 += weights[i];
        s2 += weights[i] * weights[i];
      }
      var factor = s1 / (s1 * s1 - s2);
      return exports.weightedScatter(matrix, weights, means, factor, dimension);
    };
    exports.weightedScatter = function weightedScatter(matrix, weights, means, factor, dimension) {
      dimension = dimension || 0;
      means = means || exports.weightedMean(matrix, weights, dimension);
      if (typeof factor === 'undefined') {
        factor = 1;
      }
      var rows = matrix.length;
      if (rows === 0) {
        return [[]];
      }
      var cols = matrix[0].length,
        cov,
        i,
        j,
        k,
        s;
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
    };
  })(matrix);

  var array = mlStat.array = array$1;
  mlStat.matrix = matrix;

  function normalize(array$1) {
    const min = array.min(array$1[1]);
    const max = array.max(array$1[1]);
    const sum = array.sum(array$1[1]);
    const length = array$1[1] ? array$1[1].length : 0;
    if (sum !== 0) {
      for (let i = 0; i < length; i++) {
        array$1[1][i] /= sum;
      }
    }
    return {
      sum,
      min,
      max
    };
  }

  // this method will systematically take care of both array
  function commonExtractAndNormalize(array1, array2, width, from, to, common) {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
      return {
        info: undefined,
        data: undefined
      };
    }
    const extract1 = extract(array1, from, to);
    const extract2 = extract(array2, from, to);
    let common1, common2, info1, info2;
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
      info1,
      info2,
      data1: common1,
      data2: common2
    };
  }

  function extractAndNormalize(array, from, to) {
    if (!Array.isArray(array)) {
      return {
        info: undefined,
        data: undefined
      };
    }
    const newArray = extract(array, from, to);
    const info = normalize(newArray);
    return {
      info,
      data: newArray
    };
  }

  // Adapted from: http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
  function getIntersection(segment1, segment2) {
    const p0X = segment1[0][0];
    const p0Y = segment1[0][1];
    const p1X = segment1[1][0];
    const p1Y = segment1[1][1];
    const p2X = segment2[0][0];
    const p2Y = segment2[0][1];
    const p3X = segment2[1][0];
    const p3Y = segment2[1][1];
    const s1X = p1X - p0X;
    const s1Y = p1Y - p0Y;
    const s2X = p3X - p2X;
    const s2Y = p3Y - p2Y;
    const s = (-s1Y * (p0X - p2X) + s1X * (p0Y - p2Y)) / (-s2X * s1Y + s1X * s2Y);
    const t = (s2X * (p0Y - p2Y) - s2Y * (p0X - p2X)) / (-s2X * s1Y + s1X * s2Y);
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return {
        x: p0X + t * s1X,
        y: p0Y + t * s1Y
      };
    }
    return null; // No collision
  }

  // should be a binary operation !
  const COMMON_NO = 0;
  const COMMON_FIRST = 1;
  const COMMON_SECOND = 2;
  const COMMON_BOTH = 3;

  /**
   * Create a comparator class
   * {object} [options={}]
   * {string} [options.common=''] should we take only common peaks 'first', 'second', 'both', ''
   * {number} [options.widthBottom=2] bottom trapezoid width for similarity evaluation
   * {number} [options.widthTop=1] top trapezoid width for similarity evaluation
   * {number} [options.from] from region used for similarity calculation
   * {number} [options.to] to region used for similarity calculation
   */

  class Comparator {
    constructor() {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.widthTop;
      this.widthBottom;
      this.from;
      this.to;
      this.array1Extract;
      this.array2Extract;
      this.widthSlope;
      this.array1ExtractInfo;
      this.array2ExtractInfo;
      this.common;
      this.commonFactor;
      this.array1 = [];
      this.array2 = [];
      this.setOptions(options);
    }

    /*
       2 formats are allowed:
       [[x1,x2,...],[y1,y2,...]] or [[x1,y1],[x2,y2], ...]
      */

    setOptions() {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (typeof options.common === 'string') {
        if (options.common.toLowerCase() === 'first') {
          this.common = COMMON_FIRST;
        } else if (options.common.toLowerCase() === 'second') {
          this.common = COMMON_SECOND;
        } else if (options.common.toLowerCase() === 'both') {
          this.common = COMMON_BOTH;
        } else {
          this.common = COMMON_NO;
        }
      } else if (options.common === true) {
        this.common = COMMON_BOTH;
      } else {
        this.common = COMMON_NO;
      }
      this.trapezoid = options.trapezoid;
      this.commonFactor = options.commonFactor || this.commonFactor || 4;
      const {
        widthBottom = this.widthBottom || 2,
        widthTop = this.widthTop || 1,
        from = this.from,
        to = this.to
      } = options;
      this.setTrapezoid(widthBottom, widthTop);
      this.setFromTo(from, to);
    }
    setPeaks1(anArray) {
      this.array1 = checkArray(anArray);
      if (this.common) {
        const extracts = commonExtractAndNormalize(this.array1, this.array2, this.widthBottom, this.from, this.to, this.common);
        this.array1Extract = extracts.data1;
        this.array1ExtractInfo = extracts.info1;
        this.array2Extract = extracts.data2;
        this.array2ExtractInfo = extracts.info2;
      } else {
        const extract = extractAndNormalize(this.array1, this.from, this.to);
        this.array1Extract = extract.data;
        this.array1ExtractInfo = extract.info;
      }
    }
    setPeaks2(anArray) {
      this.array2 = checkArray(anArray);
      if (this.common) {
        const extracts = commonExtractAndNormalize(this.array1, this.array2, this.widthBottom, this.from, this.to, this.common);
        this.array1Extract = extracts.data1;
        this.array1ExtractInfo = extracts.info1;
        this.array2Extract = extracts.data2;
        this.array2ExtractInfo = extracts.info2;
      } else {
        const extract = extractAndNormalize(this.array2, this.from, this.to);
        this.array2Extract = extract.data;
        this.array2ExtractInfo = extract.info;
      }
    }
    getExtract1() {
      return this.array1Extract;
    }
    getExtract2() {
      return this.array2Extract;
    }
    getExtractInfo1() {
      return this.array1ExtractInfo;
    }
    getExtractInfo2() {
      return this.array2ExtractInfo;
    }
    setTrapezoid(newWidthBottom, newWidthTop) {
      this.widthTop = newWidthTop;
      this.widthBottom = newWidthBottom;
      this.widthSlope = (this.widthBottom - this.widthTop) / 2;
      if (this.widthBottom < this.widthTop) {
        throw new Error('widthBottom has to be larger than widthTop');
      }
    }
    setFromTo(newFrom, newTo) {
      if (newFrom === this.from && newTo === this.to) return;
      this.from = newFrom;
      this.to = newTo;
      if (this.common) {
        const extracts = commonExtractAndNormalize(this.array1, this.array2, this.widthBottom, this.from, this.to, this.common, this.commonFactor);
        this.array1Extract = extracts.data1;
        this.array1ExtractInfo = extracts.info1;
        this.array2Extract = extracts.data2;
        this.array2ExtractInfo = extracts.info2;
      } else {
        let extract1 = extractAndNormalize(this.array1, this.from, this.to);
        this.array1Extract = extract1.data;
        this.array1ExtractInfo = extract1.info;
        let extract2 = extractAndNormalize(this.array2, this.from, this.to);
        this.array2Extract = extract2.data;
        this.array2ExtractInfo = extract2.info;
      }
    }
    getOverlap(x1, y1, x2, y2) {
      if (y1 === 0 || y2 === 0) return 0;

      // TAKE CARE !!! We multiply the diff by 2 !!!
      const diff = Math.abs(x1 - x2) * 2;
      if (diff > this.widthBottom) return 0;
      if (diff <= this.widthTop) {
        return Math.min(y1, y2);
      }
      const maxValue = Math.max(y1, y2) * (this.widthBottom - diff) / (this.widthBottom - this.widthTop);
      return Math.min(y1, y2, maxValue);
    }

    // This is the old trapezoid similarity
    getOverlapTrapezoid(x1, y1, x2, y2, widthTop, widthBottom) {
      const factor = 2 / (widthTop + widthBottom); // correction for surface=1
      if (y1 === 0 || y2 === 0) return 0;
      if (x1 === x2) {
        // they have the same position
        return Math.min(y1, y2);
      }
      const diff = Math.abs(x1 - x2);
      if (diff >= widthBottom) return 0;
      if (y1 === y2) {
        // do they have the same height ???
        // we need to find the common length
        if (diff <= widthTop) {
          return ((widthTop + widthBottom) / 2 - diff) * y1 * factor;
        } else if (diff <= widthBottom) {
          return (widthBottom - diff) * y1 / 2 * (diff - widthTop) / (widthBottom - widthTop) * factor;
        }
        return 0;
      } else {
        // the height are different and not the same position ...
        // we need to consider only one segment to find its intersection

        const small = Math.min(y1, y2);
        const big = Math.max(y1, y2);
        const targets = [[[0, 0], [widthSlope, small]], [[widthSlope, small], [widthSlope + widthTop, small]], [[widthTop + widthSlope, small], [widthBottom, 0]]];
        let segment;
        if (x1 > x2 && y1 > y2 || x1 < x2 && y1 < y2) {
          segment = [[diff, 0], [diff + widthSlope, big]];
        } else {
          segment = [[diff + widthSlope, big], [diff, 0]];
        }
        for (let i = 0; i < 3; i++) {
          const intersection = getIntersection(targets[i], segment);
          if (intersection) {
            switch (i) {
              case 0:
                return small - diff * intersection.y / 2 * factor;
              case 1:
                // to simplify ...
                //     console.log("           ",widthSlope,small,big,intersection.x)
                return (widthSlope * small / (2 * big) * small + (widthTop + widthSlope - intersection.x) * small + widthSlope * small / 2) * factor;
              case 2:
                return (widthBottom - diff) * intersection.y / 2 * factor;
              default:
                throw new Error(`unexpected intersection value: ${i}`);
            }
          }
        }
      }
      return NaN;
    }

    // this method calculates the total diff. The sum of positive value will yield to overlap
    calculateDiff() {
      // we need to take 2 pointers
      // and travel progressively between them ...
      const newFirst = [[].concat(this.array1Extract[0]), [].concat(this.array1Extract[1])];
      const newSecond = [[].concat(this.array2Extract[0]), [].concat(this.array2Extract[1])];
      const array1Length = this.array1Extract[0] ? this.array1Extract[0].length : 0;
      const array2Length = this.array2Extract[0] ? this.array2Extract[0].length : 0;
      let pos1 = 0;
      let pos2 = 0;
      let previous2 = 0;
      while (pos1 < array1Length) {
        const diff = newFirst[0][pos1] - this.array2Extract[0][pos2];
        if (Math.abs(diff) < this.widthBottom) {
          // there is some overlap
          let overlap;
          if (this.trapezoid) {
            overlap = this.getOverlapTrapezoid(newFirst[0][pos1], newFirst[1][pos1], newSecond[0][pos2], newSecond[1][pos2], this.widthTop, this.widthBottom);
          } else {
            overlap = this.getOverlap(newFirst[0][pos1], newFirst[1][pos1], newSecond[0][pos2], newSecond[1][pos2], this.widthTop, this.widthBottom);
          }
          newFirst[1][pos1] -= overlap;
          newSecond[1][pos2] -= overlap;
          if (pos2 < array2Length - 1) {
            pos2++;
          } else {
            pos1++;
            pos2 = previous2;
          }
        } else if (diff > 0 && pos2 < array2Length - 1) {
          pos2++;
          previous2 = pos2;
        } else {
          pos1++;
          pos2 = previous2;
        }
      }
      return newSecond;
    }
    getSimilarity(newPeaks1, newPeaks2) {
      if (newPeaks1) this.setPeaks1(newPeaks1);
      if (newPeaks2) this.setPeaks2(newPeaks2);
      const diff = this.calculateDiff();
      return {
        diff,
        extract1: this.getExtract1(),
        extract2: this.getExtract2(),
        extractInfo1: this.getExtractInfo1(),
        extractInfo2: this.getExtractInfo2(),
        similarity: calculateOverlapFromDiff(diff),
        widthBottom: this.widthBottom,
        widthTop: this.widthTop
      };
    }

    /*
      This works mainly when you have a array1 that is fixed
      newPeaks2 have to be normalized ! (sum to 1)
    */
    fastSimilarity(newPeaks2, from, to) {
      this.array1Extract = extract(this.array1, from, to);
      this.array2Extract = newPeaks2;
      if (this.common & COMMON_SECOND) {
        this.array1Extract = getCommonArray(this.array1Extract, this.array2Extract, this.widthBottom);
      }
      normalize(this.array1Extract);
      const diff = this.calculateDiff();
      return calculateOverlapFromDiff(diff);
    }
  }

  exports.COMMON_FIRST = COMMON_FIRST;
  exports.COMMON_SECOND = COMMON_SECOND;
  exports["default"] = Comparator;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=peaks-similarity.js.map
