'use strict';

var Comparator = require('..');

var comparator=new Comparator();
comparator.setTrapezoid(4,2);

var result=comparator.getSimilarity(
    [[1,1],[2,1]],
    [[2.5,3],[3.5,1]]
);

console.log(result);
