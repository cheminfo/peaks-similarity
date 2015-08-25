'use strict';

var Comparator = require('..');

describe('We check common array similarity 1', function () {
    var comparator=new Comparator({common: true, widthBottom: 0.2, widthTop: 0.1});
    comparator.setPeaks1([[1,1],[2,3]]);
    comparator.setPeaks2([[1,1],[3,1]]);
    var result=comparator.getSimilarity();
    it('getExtract1', function () {
        result.extract1.should.eql([[1,1]]);
    });
    it('getExtract2', function () {
        result.extract2.should.eql([[1,1]]);
    });
    it('similarity', function () {
        result.similarity.should.eql(1);
    });
});

describe('We check common array similarity 2', function () {
    var comparator=new Comparator({common: true, widthBottom: 0.2, widthTop: 0.1});
    comparator.setPeaks1([[1,1],[2.05,1],[3,1]]);
    comparator.setPeaks2([[1,1],[2,1],[4,1]]);
    var result=comparator.getSimilarity();
    it('getExtract1', function () {
        result.extract1.should.eql([[1,0.5],[2.05,0.5]]);
    });
    it('getExtract2', function () {
        result.extract2.should.eql([[1,0.5],[2,0.5]]);
    });
    it('similarity', function () {
        result.similarity.should.eql(1);
    });
});

describe('We check common array similarity 3 (widthTop=0)', function () {
    var comparator=new Comparator({common: true, widthBottom: 0.2, widthTop: 0});
    comparator.setPeaks1([[1,1],[2.05,1],[3,1]]);
    comparator.setPeaks2([[1,1],[2,1],[4,1]]);
    var result=comparator.getSimilarity();
    it('getExtract1', function () {
        result.extract1.should.eql([[1,0.5],[2.05,0.5]]);
    });
    it('getExtract2', function () {
        result.extract2.should.eql([[1,0.5],[2,0.5]]);
    });
    it('similarity', function () {
        result.similarity.should.approximately(0.75,0.001);
    });
});

describe('We check common array similarity 4 (check the setFromTo)', function () {
    var comparator=new Comparator({common: true, widthBottom: 0.2, widthTop: 0});
    comparator.setPeaks1([[1,1],[2.05,1],[3,1]]);
    comparator.setPeaks2([[1,1],[2,1],[4,1]]);
    comparator.setFromTo(0.5, 1.5);
    var result=comparator.getSimilarity();
    it('getExtract1', function () {
        result.extract1.should.eql([[1,1]]);
    });
    it('getExtract2', function () {
        result.extract2.should.eql([[1,1]]);
    });
    it('similarity', function () {
        result.similarity.should.eql(1);
    });
});




