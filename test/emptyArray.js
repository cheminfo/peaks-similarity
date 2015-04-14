'use strict';

var Comparator = require('..');

var comparator=new Comparator({});
comparator.setPeaks1([[0,0],[1,0]]);
comparator.setPeaks2([[10,0],[11,0]]);

describe('We check that array of points are not converted and are not normalized', function () {
    it('getExtract1', function () {
        comparator.getExtract1().should.eql([[0,0],[1,0]]);
    });
    it('getExtract2', function () {
        comparator.getExtract2().should.eql([[10,0],[11,0]]);
    });
});


