/**
 * peaks-similarity - Peaks similarity - calculate the similarity between 2 ordered array of peaks
 * @version v1.0.1
 * @link https://github.com/cheminfo-js/peaks-similarity
 * @license MIT
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.peaksSimilarity=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = function Comparator(options) {
    
    var widthTop, widthBottom, from, to, array1Extract, array2Extract, widthSlope;


    setOptions(options);

    var array1=[];
    var array2=[];
 
    /*
     2 formats are allowed:
     [[x1,x2,...],[y1,y2,...]] or [[x1,y1],[x2,y2], ...]
    */

    function setOptions(newOptions) {
        options=newOptions || {};
        setTrapezoid(
            options.widthBottom || widthBottom || 2,
            options.widthTop || widthTop || 1
        );
        setFromTo(options.from || from, options.to || to);
    }

    function setPeaks1(anArray) {
        array1=checkArray(anArray);
        array1Extract=extractAndNormalize(array1, from, to);
    }
    function setPeaks2(anArray) {
        array2=checkArray(anArray);
        array2Extract=extractAndNormalize(array2, from, to);
    }

    function getExtract1() {
        return array1Extract;
    }

    function getExtract2() {
        return array2Extract;
    }

    function setTrapezoid(newWidthBottom, newWidthTop) {
        widthTop=newWidthTop;
        widthBottom=newWidthBottom;
        widthSlope=(widthBottom-widthTop)/2;
        if (widthBottom<widthTop) throw "widthBottom has to be larger than widthTop";
    }

    function setFromTo(newFrom, newTo) {
        from=newFrom;
        to=newTo;
        array1Extract=extractAndNormalize(array1, from, to);
        array2Extract=extractAndNormalize(array2, from, to);
    }

    function getOverlap(x1, y1, x2, y2) {

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
        var newSecond=[];
        for (var i=0; i<array2Extract.length; i++) {
            newSecond.push([array2Extract[i][0],array2Extract[i][1]]);
        }
        var newFirst=[];
        for (var i=0; i<array1Extract.length; i++) {
            newFirst.push([array1Extract[i][0],array1Extract[i][1]]);
        }

        var pos1=0;
        var pos2=0;
        var previous2=0;
        while (pos1<newFirst.length) {
            var diff=newFirst[pos1][0]-array2Extract[pos2][0];
            if (Math.abs(diff)<widthBottom) { // there is some overlap
                var overlap=getOverlap(newFirst[pos1][0], newFirst[pos1][1], newSecond[pos2][0], newSecond[pos2][1], widthTop, widthBottom);
                newFirst[pos1][1]-=overlap;
                newSecond[pos2][1]-=overlap;
                if (pos2<(array2Extract.length-1)) {
                    pos2++;
                } else {
                    pos1++;
                    pos2=previous2;
                }
            } else {
                if (diff>0 && pos2<(array2Extract.length-1)) {
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
        if (Array.isArray(points) && Array.isArray(points[0]) && points[0].length===2) return points;
        var xs=points[0];
        var ys=points[1];
        var array=[];
        for (var i=0; i<xs.length; i++) {
            array.push([xs[i],ys[i]]);
        }
        return array;
    }

    function getSimilarity(newPeaks1, newPeaks2) {
        if (newPeaks1) setPeaks1(newPeaks1);
        if (newPeaks2) setPeaks2(newPeaks2);
        var result={};
        result.diff=calculateDiff();
        result.extract1=getExtract1();
        result.extract2=getExtract2();
        result.similarity=calculateOverlapFromDiff(result.diff);
        return result;
    }

    this.setPeaks1 = setPeaks1;
    this.setPeaks2 = setPeaks2;
    this.getExtract1 = getExtract1;
    this.getExtract2 = getExtract2;
    this.setFromTo = setFromTo;
    this.setOptions = setOptions;
    this.setTrapezoid = setTrapezoid;
    this.getSimilarity = getSimilarity;
};



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
    var sum=0;
    for (var i=0; i<array.length; i++) {
        sum+=array[i][1];
    }
    if (sum>0) {
        for (var i=0; i<array.length; i++) {
            array[i][1]/=sum;
        }
    }
}

function extractAndNormalize(array, from, to) {
    if (! (Array.isArray(array))) return;
    var newArray=[];
    var j=0;
    for (var i=0; i<array.length; i++) {
        if ( (! from || array[i][0]>=from)  && (! to || array[i][0]<=to)) {
            newArray[j++]=[array[i][0],array[i][1]];
        }
    }
    normalize(newArray);
    return newArray;
}

function calculateOverlapFromDiff(diffs) {
    var sumPos=0;
    for (var i=0; i<diffs.length; i++) {
        sumPos+=Math.abs(diffs[i][1]);
    }
    return 1-sumPos;
}
},{}]},{},[1])(1)
});