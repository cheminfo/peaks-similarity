'use strict';

var Comparator = require('..');

describe('We check that array of points are not converted and are not normalized', function () {
  var comparator = new Comparator({});
  comparator.setPeaks1([[0, 1, 2], [0, 0, 0]]);
  comparator.setPeaks2([[10, 11], [0, 0]]);

  it('getExtract1', function () {
    expect(comparator.getExtract1()).toStrictEqual([[0, 1, 2], [0, 0, 0]]);
  });
  it('getExtract2', function () {
    expect(comparator.getExtract2()).toStrictEqual([[10, 11], [0, 0]]);
  });
});
