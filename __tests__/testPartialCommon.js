'use strict';

require('should');
var Comparator = require('..');

describe('We check common array similarity 1', function () {
  var comparator = new Comparator({ common: true, widthBottom: 0.2, widthTop: 0.1 });
  comparator.setPeaks1([[1, 2], [1, 3]]);
  comparator.setPeaks2([[1, 3], [1, 1]]);
  var result = comparator.getSimilarity();
  it('getExtract1', function () {
    result.extract1.should.eql([[1], [1]]);
  });
  it('getExtract2', function () {
    result.extract2.should.eql([[1], [1]]);
  });
  it('similarity', function () {
    result.similarity.should.eql(1);
  });
});

describe('We check common array similarity 2', function () {
  var comparator = new Comparator({ common: true, widthBottom: 0.2, widthTop: 0.1 });
  comparator.setPeaks1([[1, 1], [2.05, 1], [3, 1]]);
  comparator.setPeaks2([[1, 1], [2, 1], [4, 1]]);
  var result = comparator.getSimilarity();
  it('getExtract1', function () {
    result.extract1.should.eql([[1, 2.05], [0.5, 0.5]]);
  });
  it('getExtract2', function () {
    result.extract2.should.eql([[1, 2], [0.5, 0.5]]);
  });
  it('similarity', function () {
    result.similarity.should.eql(1);
  });
});

describe('We check common array similarity 3 (widthTop=0)', function () {
  var comparator = new Comparator({ common: true, widthBottom: 0.2, widthTop: 0 });
  comparator.setPeaks1([[1, 1], [2.05, 1], [3, 1]]);
  comparator.setPeaks2([[1, 1], [2, 1], [4, 1]]);
  var result = comparator.getSimilarity();
  it('getExtract1', function () {
    result.extract1.should.eql([[1, 2.05], [0.5, 0.5]]);
  });
  it('getExtract2', function () {
    result.extract2.should.eql([[1, 2], [0.5, 0.5]]);
  });
  it('similarity', function () {
    result.similarity.should.approximately(0.75, 0.001);
  });
});

describe('We check common array similarity 4 (check the setFromTo)', function () {
  var comparator = new Comparator({ common: true, widthBottom: 0.2, widthTop: 0 });
  comparator.setPeaks1([[1, 1], [2.05, 1], [3, 1]]);
  comparator.setPeaks2([[1, 1], [2, 1], [4, 1]]);
  comparator.setFromTo(0.5, 1.5);
  var result = comparator.getSimilarity();
  it('getExtract1', function () {
    result.extract1.should.eql([[1], [1]]);
  });
  it('getExtract2', function () {
    result.extract2.should.eql([[1], [1]]);
  });
  it('similarity', function () {
    result.similarity.should.eql(1);
  });
});

describe('We check common array with nothing common based on first', function () {
  var comparator = new Comparator({ common: 'first', widthBottom: 0.2, widthTop: 0 });
  comparator.setPeaks1([[1, 1], [2, 1], [3, 1], [4, 1]]);
  comparator.setPeaks2([[5, 1], [6, 1], [7, 1], [8, 1]]);

  var result = comparator.getSimilarity();
  it('getExtract1', function () {
    result.extract1.should.eql([[1, 2, 3, 4], [0.25, 0.25, 0.25, 0.25]]);
  });
  it('getExtract2', function () {
    result.extract2.should.eql([[], []]);
  });
  it('similarity', function () {
    result.similarity.should.eql(0);
  });
});

describe('We check common array with nothing common based on second', function () {
  var comparator = new Comparator({ common: 'second', widthBottom: 0.2, widthTop: 0 });
  comparator.setPeaks1([[1, 1], [2, 1], [3, 1], [4, 1]]);
  comparator.setPeaks2([[5, 1], [6, 1], [7, 1], [8, 1]]);

  var result = comparator.getSimilarity();
  it('getExtract1', function () {
    result.extract1.should.eql([[], []]);
  });
  it('getExtract2', function () {
    result.extract2.should.eql([[5, 6, 7, 8], [0.25, 0.25, 0.25, 0.25]]);
  });
  it('similarity', function () {
    result.similarity.should.eql(0);
  });
});

describe('We check common array with nothing common based on both', function () {
  var comparator = new Comparator({ common: 'both', widthBottom: 0.2, widthTop: 0 });
  comparator.setPeaks1([[1, 1], [2, 1], [3, 1], [4, 1]]);
  comparator.setPeaks2([[5, 1], [6, 1], [7, 1], [8, 1]]);

  var result = comparator.getSimilarity();
  it('getExtract1', function () {
    result.extract1.should.eql([[], []]);
  });
  it('getExtract2', function () {
    result.extract2.should.eql([[], []]);
  });
  it('similarity', function () {
    result.similarity.should.eql(0);
  });
});

describe('We check common array with nothing common based on all', function () {
  var comparator = new Comparator({ common: 'all', widthBottom: 0.2, widthTop: 0 });
  comparator.setPeaks1([[1, 1], [2, 1], [3, 1], [4, 1]]);
  comparator.setPeaks2([[5, 1], [6, 1], [7, 1], [8, 1]]);

  var result = comparator.getSimilarity();
  it('getExtract1', function () {
    result.extract1.should.eql([[1, 2, 3, 4], [0.25, 0.25, 0.25, 0.25]]);
  });
  it('getExtract2', function () {
    result.extract2.should.eql([[5, 6, 7, 8], [0.25, 0.25, 0.25, 0.25]]);
  });
  it('similarity', function () {
    result.similarity.should.eql(0);
  });
});
