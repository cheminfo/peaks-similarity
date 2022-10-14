import Comparator from '../index.js';

describe('We check common array similarity with common first', () => {
  const comparator = new Comparator({
    common: 'first',
    widthBottom: 0.2,
    widthTop: 0.1,
  });
  comparator.setPeaks1([
    [1, 2, 3, 4],
    [1, 1, 1, 1],
  ]);
  comparator.setPeaks2([
    [1, 3],
    [1, 1],
  ]);
  const result = comparator.getSimilarity();
  it('getExtract1', () => {
    expect(result.extract1).toStrictEqual([
      [1, 2, 3, 4],
      [0.25, 0.25, 0.25, 0.25],
    ]);
  });
  it('getExtract2', () => {
    expect(result.extract2).toStrictEqual([
      [1, 3],
      [0.5, 0.5],
    ]);
  });
  it('similarity', () => {
    expect(result.similarity).toBe(0.5);
  });
});

describe('We check common array similarity with common second', () => {
  const comparator = new Comparator({
    common: 'second',
    widthBottom: 0.2,
    widthTop: 0.1,
  });
  comparator.setPeaks1([
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
  ]);
  comparator.setPeaks2([
    [1, 3],
    [1, 1],
  ]);

  const result = comparator.getSimilarity();
  it('getExtract1', () => {
    expect(result.extract1).toStrictEqual([
      [1, 3],
      [0.5, 0.5],
    ]);
  });
  it('getExtract2', () => {
    expect(result.extract2).toStrictEqual([
      [1, 3],
      [0.5, 0.5],
    ]);
  });
  it('similarity', () => {
    expect(result.similarity).toBe(1);
  });
});
