'use strict';

var Comparator = require('..');

var comparator=new Comparator({});


describe('We check the calculation of common array', function () {
    it('Test 1', function () {
        var result=comparator.getCommonArray(
            [[2,3],[2,2]],
            [[1,2.05,2.95],[2,2,2]],
            0.2
        )
        result.should.eql([ [ 2, 3 ], [ 2, 2 ] ]);
    });

    it('Test 2', function () {
        var result=comparator.getCommonArray(
            [[0,1,2,3],[2,2,2,2]],
            [[0,1,2,3],[2,2,2,2]],
            0.2
        )
        result.should.eql( [[0,1,2,3],[2,2,2,2]] );
    });

    it('Test 3', function () {
        var result=comparator.getCommonArray(
            [[0.95,1,1.05],[2,2,2]],
            [[0,1,2],[2,2,2]],
            0.2
        )
        result.should.eql( [[0.95,1,1.05],[2,2,2]]);
    });

    it('Test 4', function () {
        var result=comparator.getCommonArray(
            [[0.85,1,1.15],[2,2,2]],
            [[0,1,2],[2,2,2]],
            0.2
        )
        result.should.eql([[1],[2]]);
    });

    it('Test 5', function () {
        var result=comparator.getCommonArray(
            [[0,0.95,1,1.05,2],[2,2,2,2,2]],
            [[1,2]],
            0.2
        )
        result.should.eql([[0.95,1,1.05,2],[2,2,2,2]]);
    });
});


