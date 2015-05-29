/**
 * Created by lpatiny on 27/05/15.
 */

// We will try to make a script to take the  common part of an xy array based on a distance


var array1=[[2,2],[3,2]];
var array2=[[1,2],[2.05,2],[2.95,2]];


var array1=[[0,2],[1,2],[2,2],[3,2]];
var array2=[[0,2],[1,2],[2,2],[3,2]];

var array1=[[0.95,2],[1,2],[1.05,2]];
var array2=[[0,2],[1,2],[2,2]];

var array1=[[0.85,2],[1,2],[1.15,2]];
var array2=[[0,2],[1,2],[2,2]];

var array1=[[0,2],[0.95,2],[1,2],[1.05,2],[2,2]];
var array2=[[1,2]];


var bottomWidth=0.2;

var newArray=getCommonArray(array1, array2, bottomWidth);

console.log(newArray);


function getCommonArray(array1, array2, bottomWidth) {
    var newArray1=[];
    var newArray2=[];
    var pos2=0;

    for (var i=0; i<array1.length; i++) {
        while (pos2<array2.length && (array1[i][0]>(array2[pos2][0]+bottomWidth/2))) {
            console.log("---",array1[i][0],(array2[pos2][0]-bottomWidth/2));
            pos2++;
        }
        console.log(i, pos2, array1[i]);
        if ((pos2<array2.length) && (array1[i][0]>array2[pos2][0]-bottomWidth/2)) {
            console.log("add");
            newArray1.push(array1[i]);
        }
    }
    return newArray;
}
