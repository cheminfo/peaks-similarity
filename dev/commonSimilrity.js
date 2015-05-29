/**
 * Created by lpatiny on 27/05/15.
 */

// We will try to make a script to take the  common part of an xy array based on a distance

var Comparator = require('..');

var comparator=new Comparator({common: true, widthBottom: 0.2, widthTop: 0});


comparator.setPeaks1([[1,1],[2,3]]);
comparator.setPeaks2([[1,1],[3,1]]);




console.log(comparator.getExtract1());
console.log(comparator.getExtract2());
