'use strict';

var Comparator = require('..');

var comparator=new Comparator({trapezoid:true});
comparator.setPeaks1([[1,2],[2,3]]);
comparator.setPeaks2([[1,1],[2,1]]);


var comparator6=new Comparator({trapezoid: true});
comparator6.setTrapezoid(0.2,0.2);
comparator6.setPeaks1([[1,2],[2,3]]);
comparator6.setPeaks2([[1,2],[2,3]]);
describe('We check similarity of identical spectra trapezoid', function () {
    it('getSimilarity', function () {
        var similarity=comparator6.getSimilarity();
        similarity.similarity.should.equal(1);
        similarity.extractInfo1.sum.should.equal(5);
        similarity.extractInfo1.min.should.equal(2);
        similarity.extractInfo1.max.should.equal(3);
    });
});

var comparator7=new Comparator({trapezoid: true});
comparator7.setTrapezoid(0.2,0.2);
describe('We check similarity without overlap trapezoid', function () {
    it('getSimilarity', function () {
        comparator7.getSimilarity([[1,2],[1,1]],[[1,2],[1,1]]).similarity.should.equal(1);
        comparator7.getSimilarity([[1,2],[1,1]],[[1,3],[1,1]]).similarity.should.equal(0.5);
        comparator7.getSimilarity([[1,2],[1,1]],[[3,4],[1,1]]).similarity.should.equal(0);
    });
});

var comparator8=new Comparator({trapezoid: true});
comparator8.setTrapezoid(2,2);
describe('We check similarity with overlap trapezoid', function () {
    it('getSimilarity', function () {
        comparator8.getSimilarity([[1,2],[1,1]],[[1,1]]).similarity.should.equal(0.75);
        comparator8.getSimilarity([[1,2],[1,1]],[[1,3],[1,1]]).similarity.should.equal(0.75);
        comparator8.getSimilarity([[1,2],[1,1]],[[3,4],[1,1]]).similarity.should.equal(0.25);
    });
});

var comparator9=new Comparator({trapezoid: true});
comparator9.setTrapezoid(4,2);
describe('We check similarity with overlap of trapezoid', function () {
    it('getSimilarity', function () {
        comparator9.getSimilarity([[1,1],[2,1]],[[1,1]]).similarity.should.equal(0.8333333333333333);
        comparator9.getSimilarity([[1,1]],[[1,1],[2,1]]).similarity.should.equal(0.8333333333333333);
        comparator9.getSimilarity([[1,1]],[[4,1]]).similarity.should.equal(0.08333333333333337);
        comparator9.getSimilarity([[1,1]],[[1,1],[4,1]]).similarity.should.equal(0.5416666666666667);

   //     comparator9.getSimilarity([[1,1],[2,1]],[[1,1],[3,1]]).similarity.should.equal(0.75);
   //     comparator9.getSimilarity([[1,1],[2,1]],[[3,1],[4,1]]).similarity.should.equal(0.25);
    });
});


