import { it, expect, test } from 'vitest';

import { Comparator } from '..';

test('We check that array of points are not converted and are normalized', () => {
  const comparator = new Comparator();
  comparator.setPeaks1([
    [1, 2],
    [2, 3],
  ]);
  comparator.setPeaks2([
    [1, 2],
    [1, 1],
  ]);

  expect(comparator.getExtract1()).toStrictEqual([
    [1, 2],
    [0.4, 0.6],
  ]);
  expect(comparator.getExtract2()).toStrictEqual([
    [1, 2],
    [0.5, 0.5],
  ]);
});

test('We check that [[x1,x2,x3,...],[y1,y2,y3,...]] is converted and normalized', () => {
  const comparator = new Comparator({});
  comparator.setPeaks1([
    [1, 2, 3],
    [1, 2, 5],
  ]);
  comparator.setPeaks2([
    [2, 3, 4],
    [2, 4, 2],
  ]);

  expect(comparator.getExtract1()).toStrictEqual([
    [1, 2, 3],
    [0.125, 0.25, 0.625],
  ]);
  expect(comparator.getExtract2()).toStrictEqual([
    [2, 3, 4],
    [0.25, 0.5, 0.25],
  ]);
});

test('We check that from / to options works', () => {
  const comparator = new Comparator({ from: 1, to: 2 });
  comparator.setPeaks1([
    [1, 2, 3],
    [2, 2, 5],
  ]);
  comparator.setPeaks2([
    [2, 3, 4],
    [2, 4, 2],
  ]);

  expect(comparator.getExtract1()).toStrictEqual([
    [1, 2],
    [0.5, 0.5],
  ]);
  expect(comparator.getExtract2()).toStrictEqual([[2], [1]]);
});

test('We check that from / to options works and can be changed', () => {
  const comparator = new Comparator();
  comparator.setPeaks1([
    [1, 2, 3],
    [2, 2, 5],
  ]);
  comparator.setPeaks2([
    [2, 3, 4],
    [2, 4, 2],
  ]);
  comparator.setFromTo(1, 2);

  expect(comparator.getExtract1()).toStrictEqual([
    [1, 2],
    [0.5, 0.5],
  ]);
  expect(comparator.getExtract2()).toStrictEqual([[2], [1]]);
});

test('We check that we can change the peaks', () => {
  const comparator = new Comparator();
  comparator.setPeaks1([[1], [2]]);
  comparator.setPeaks2([
    [2, 3, 4],
    [2, 4, 2],
  ]);
  comparator.setFromTo(1, 2);
  comparator.setPeaks1([
    [1, 2, 3],
    [2, 2, 5],
  ]);

  expect(comparator.getExtract1()).toStrictEqual([
    [1, 2],
    [0.5, 0.5],
  ]);
  expect(comparator.getExtract2()).toStrictEqual([[2], [1]]);
});

test('We check similarity of identical spectra', () => {
  const comparator = new Comparator();
  comparator.setTrapezoid(0.2, 0.2);
  comparator.setPeaks1([
    [1, 2],
    [2, 3],
  ]);
  comparator.setPeaks2([
    [1, 2],
    [2, 3],
  ]);

  const similarity = comparator.getSimilarity();
  expect(similarity.similarity).toBe(1);
  expect(similarity.extractInfo1.sum).toBe(5);
  expect(similarity.extractInfo1.min).toBe(2);
  expect(similarity.extractInfo1.max).toBe(3);
});

test('We check similarity without overlap', () => {
  const comparator = new Comparator();
  comparator.setTrapezoid(0.2, 0.2);

  it('getSimilarity', () => {
    expect(
      comparator.getSimilarity(
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
      comparator.getSimilarity(
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
      comparator.getSimilarity(
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

test('We check similarity with overlap', () => {
  const comparator = new Comparator();
  comparator.setTrapezoid(2, 2);

  it('getSimilarity', () => {
    expect(
      comparator.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [[1, 1]],
      ).similarity,
    ).toBe(1);
    expect(
      comparator.getSimilarity(
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
      comparator.getSimilarity(
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

test('We check similarity with overlap of trapezoid', () => {
  const comparator = new Comparator();
  comparator.setTrapezoid(4, 2);

  it('getSimilarity', () => {
    expect(
      comparator.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [[1, 1]],
      ).similarity,
    ).toBe(1);
    expect(
      comparator.getSimilarity(
        [[1, 1]],
        [
          [1, 2],
          [1, 1],
        ],
      ).similarity,
    ).toBe(1);
    expect(comparator.getSimilarity([[1, 1]], [[4, 1]]).similarity).toBe(0);
    expect(
      comparator.getSimilarity(
        [[1, 1]],
        [
          [1, 4],
          [1, 1],
        ],
      ).similarity,
    ).toBe(0.5);

    expect(
      comparator.getSimilarity(
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
      comparator.getSimilarity(
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

    expect(comparator.getSimilarity([[1, 1]], [[2.5, 1]]).similarity).toBe(0.5);
    expect(
      comparator.getSimilarity(
        [
          [1, 2],
          [1, 1],
        ],
        [[2.5, 1]],
      ).similarity,
    ).toBe(1);
    expect(
      comparator.getSimilarity(
        [
          [1, 2],
          [3, 1],
        ],
        [[2.5, 1]],
      ).similarity,
    ).toBe(0.75);
    expect(
      comparator.getSimilarity(
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
      comparator.getSimilarity(
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
