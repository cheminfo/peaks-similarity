import Comparator from '../index.js';

describe('We check that array of points are not converted and are normalized', () => {
  const comparator = new Comparator({});
  comparator.setPeaks1([
    [1, 2],
    [2, 3],
  ]);
  comparator.setPeaks2([
    [1, 2],
    [1, 1],
  ]);

  it('getExtract1', () => {
    expect(comparator.getExtract1()).toStrictEqual([
      [1, 2],
      [0.4, 0.6],
    ]);
  });
  it('getExtract2', () => {
    expect(comparator.getExtract2()).toStrictEqual([
      [1, 2],
      [0.5, 0.5],
    ]);
  });
});

describe('We check that [[x1,x2,x3,...],[y1,y2,y3,...]] is converted and normalized', () => {
  const comparator2 = new Comparator({});
  comparator2.setPeaks1([
    [1, 2, 3],
    [1, 2, 5],
  ]);
  comparator2.setPeaks2([
    [2, 3, 4],
    [2, 4, 2],
  ]);

  it('getExtract1', () => {
    expect(comparator2.getExtract1()).toStrictEqual([
      [1, 2, 3],
      [0.125, 0.25, 0.625],
    ]);
  });
  it('getExtract2', () => {
    expect(comparator2.getExtract2()).toStrictEqual([
      [2, 3, 4],
      [0.25, 0.5, 0.25],
    ]);
  });
});

describe('We check that from / to options works', () => {
  const comparator3 = new Comparator({ from: 1, to: 2 });
  comparator3.setPeaks1([
    [1, 2, 3],
    [2, 2, 5],
  ]);
  comparator3.setPeaks2([
    [2, 3, 4],
    [2, 4, 2],
  ]);

  it('getExtract1', () => {
    expect(comparator3.getExtract1()).toStrictEqual([
      [1, 2],
      [0.5, 0.5],
    ]);
  });
  it('getExtract2', () => {
    expect(comparator3.getExtract2()).toStrictEqual([[2], [1]]);
  });
});

describe('We check that from / to options works and can be changed', () => {
  const comparator4 = new Comparator();
  comparator4.setPeaks1([
    [1, 2, 3],
    [2, 2, 5],
  ]);
  comparator4.setPeaks2([
    [2, 3, 4],
    [2, 4, 2],
  ]);
  comparator4.setFromTo(1, 2);

  it('getExtract1', () => {
    expect(comparator4.getExtract1()).toStrictEqual([
      [1, 2],
      [0.5, 0.5],
    ]);
  });
  it('getExtract2', () => {
    expect(comparator4.getExtract2()).toStrictEqual([[2], [1]]);
  });
});

describe('We check that we can change the peaks', () => {
  const comparator5 = new Comparator();
  comparator5.setPeaks1([[1], [2]]);
  comparator5.setPeaks2([
    [2, 3, 4],
    [2, 4, 2],
  ]);
  comparator5.setFromTo(1, 2);
  comparator5.setPeaks1([
    [1, 2, 3],
    [2, 2, 5],
  ]);

  it('getExtract1', () => {
    expect(comparator5.getExtract1()).toStrictEqual([
      [1, 2],
      [0.5, 0.5],
    ]);
  });
  it('getExtract2', () => {
    expect(comparator5.getExtract2()).toStrictEqual([[2], [1]]);
  });
});

describe('We check similarity of identical spectra', () => {
  const comparator6 = new Comparator();
  comparator6.setTrapezoid(0.2, 0.2);
  comparator6.setPeaks1([
    [1, 2],
    [2, 3],
  ]);
  comparator6.setPeaks2([
    [1, 2],
    [2, 3],
  ]);

  it('getSimilarity', () => {
    const similarity = comparator6.getSimilarity();
    expect(similarity.similarity).toBe(1);
    expect(similarity.extractInfo1.sum).toBe(5);
    expect(similarity.extractInfo1.min).toBe(2);
    expect(similarity.extractInfo1.max).toBe(3);
  });
});

describe('We check similarity without overlap', () => {
  const comparator7 = new Comparator();
  comparator7.setTrapezoid(0.2, 0.2);

  it('getSimilarity', () => {
    expect(
      comparator7.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [
          [1, 2],
          [1, 1],
        ],
      ).similarity,
    ).toBe(1);
    expect(
      comparator7.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [
          [1, 3],
          [1, 1],
        ],
      ).similarity,
    ).toBe(0.5);
    expect(
      comparator7.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [
          [3, 4],
          [1, 1],
        ],
      ).similarity,
    ).toBe(0);
  });
});

describe('We check similarity with overlap', () => {
  const comparator8 = new Comparator();
  comparator8.setTrapezoid(2, 2);

  it('getSimilarity', () => {
    expect(
      comparator8.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [[1, 1]],
      ).similarity,
    ).toBe(1);
    expect(
      comparator8.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [
          [1, 3],
          [1, 1],
        ],
      ).similarity,
    ).toBe(1);
    expect(
      comparator8.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [
          [3, 4],
          [1, 1],
        ],
      ).similarity,
    ).toBe(0.5);
  });
});

describe('We check similarity with overlap of trapezoid', () => {
  const comparator9 = new Comparator();
  comparator9.setTrapezoid(4, 2);

  it('getSimilarity', () => {
    expect(
      comparator9.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [[1, 1]],
      ).similarity,
    ).toBe(1);
    expect(
      comparator9.getSimilarity(
        [[1, 1]],
        [
          [1, 2],
          [1, 1],
        ],
      ).similarity,
    ).toBe(1);
    expect(comparator9.getSimilarity([[1, 1]], [[4, 1]]).similarity).toBe(0.0);
    expect(
      comparator9.getSimilarity(
        [[1, 1]],
        [
          [1, 4],
          [1, 1],
        ],
      ).similarity,
    ).toBe(0.5);

    expect(
      comparator9.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [
          [1, 3],
          [1, 1],
        ],
      ).similarity,
    ).toBe(1);
    expect(
      comparator9.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [
          [3, 4],
          [1, 1],
        ],
      ).similarity,
    ).toBe(0.5);

    expect(comparator9.getSimilarity([[1, 1]], [[2.5, 1]]).similarity).toBe(
      0.5,
    );
    expect(
      comparator9.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [[2.5, 1]],
      ).similarity,
    ).toBe(1);
    expect(
      comparator9.getSimilarity(
        [
          [1, 2],
          [3, 1],
        ],
        [[2.5, 1]],
      ).similarity,
    ).toBe(0.75);
    expect(
      comparator9.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [
          [2.5, 3.5],
          [1, 1],
        ],
      ).similarity,
    ).toBe(0.75);
    expect(
      comparator9.getSimilarity(
        [
          [1, 2],
          [3, 1],
        ],
        [
          [2.5, 3.5],
          [1, 1],
        ],
      ).similarity,
    ).toBe(0.625);
  });
});
