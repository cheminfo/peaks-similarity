'use strict';

var Comparator = require('..');


var comparator=new Comparator();
comparator.setTrapezoid(4,2);

var result=comparator.getSimilarity(
    [[0,1]],
    [[0,1],[3,1]]
);

console.log(result);
