/**
 * Created by lpatiny on 27/05/15.
 */

// We will try to make a script to take the  common part of an xy array based on a distance

var Comparator = require('..');


var comparator=new Comparator({common: 'first', widthBottom: 0.2, widthTop: 0.1});
comparator.setPeaks1([[1,2,3,4],[1,1,1,1]]);
comparator.setPeaks2([[1,3],[1,1]]);



var result=comparator.getSimilarity();

console.log(result);