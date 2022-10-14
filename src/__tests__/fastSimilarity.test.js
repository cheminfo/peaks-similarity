import Comparator from '../index.js';

describe('We check to test fast similarity common second', () => {
  const comparator = new Comparator({
    common: 'second',
    widthBottom: 0.2,
    widthTop: 0.1,
  });
  comparator.setPeaks1([
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 1, 1, 1, 1, 3, 3, 3, 3, 3],
  ]);

  it('should result', () => {
    expect(
      comparator.fastSimilarity(
        [
          [1, 1.5, 2.5, 4],
          [0.25, 0.25, 0.25, 0.25],
        ],
        0.5,
        4.5,
        true,
      ),
    ).toBe(0.5);
    expect(
      comparator.fastSimilarity(
        [
          [1, 3],
          [0.5, 0.5],
        ],
        0.5,
        4.5,
        true,
      ),
    ).toBe(1);
  });
});

describe('We check to test fast similarity', () => {
  const comparator = new Comparator({ widthBottom: 0.2, widthTop: 0.1 });
  comparator.setPeaks1([
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 1, 1, 1, 1, 3, 3, 3, 3, 3],
  ]);

  it('should result', () => {
    expect(
      comparator.fastSimilarity(
        [
          [1, 2],
          [0.5, 0.5],
        ],
        0.5,
        2.5,
      ),
    ).toBe(1);
    expect(
      comparator.fastSimilarity(
        [
          [0, 1, 2],
          [0.5, 0.25, 0.25],
        ],
        -0.5,
        2.5,
      ),
    ).toBe(0.5);
    expect(
      comparator.fastSimilarity(
        [
          [1, 4],
          [0.5, 0.5],
        ],
        0.5,
        4.5,
      ),
    ).toBe(0.5);
    expect(
      comparator.fastSimilarity(
        [
          [1, 1.5, 2.5, 3],
          [0.25, 0.25, 0.25, 0.25],
        ],
        0.5,
        4.5,
      ),
    ).toBe(0.5);
  });
});
