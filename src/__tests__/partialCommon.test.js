import { test, expect } from 'vitest';

import { Comparator } from '..';

test('We check common array similarity 1', () => {
  const comparator = new Comparator({
    common: true,
    widthBottom: 0.2,
    widthTop: 0.1,
  });
  comparator.setPeaks1([
    [1, 2],
    [1, 3],
  ]);
  comparator.setPeaks2([
    [1, 3],
    [1, 1],
  ]);
  const result = comparator.getSimilarity();
  expect(result.extract1).toStrictEqual([[1], [1]]);
  expect(result.extract2).toStrictEqual([[1], [1]]);
  expect(result.similarity).toBe(1);
});

test('We check common array similarity 2', () => {
  const comparator = new Comparator({
    common: true,
    widthBottom: 0.2,
    widthTop: 0.1,
  });
  comparator.setPeaks1([
    [1, 1],
    [2.05, 1],
    [3, 1],
  ]);
  comparator.setPeaks2([
    [1, 1],
    [2, 1],
    [4, 1],
  ]);
  const result = comparator.getSimilarity();
  expect(result.extract1).toStrictEqual([
    [1, 2.05],
    [0.5, 0.5],
  ]);
  expect(result.extract2).toStrictEqual([
    [1, 2],
    [0.5, 0.5],
  ]);
  expect(result.similarity).toBe(1);
});

test('We check common array similarity 3 (widthTop=0)', () => {
  const comparator = new Comparator({
    common: true,
    widthBottom: 0.2,
    widthTop: 0,
  });
  comparator.setPeaks1([
    [1, 1],
    [2.05, 1],
    [3, 1],
  ]);
  comparator.setPeaks2([
    [1, 1],
    [2, 1],
    [4, 1],
  ]);
  const result = comparator.getSimilarity();
  expect(result.extract1).toStrictEqual([
    [1, 2.05],
    [0.5, 0.5],
  ]);
  expect(result.extract2).toStrictEqual([
    [1, 2],
    [0.5, 0.5],
  ]);
  expect(result.similarity).toBeCloseTo(0.75, 3);
});

test('We check common array similarity 4 (check the setFromTo)', () => {
  const comparator = new Comparator({
    common: true,
    widthBottom: 0.2,
    widthTop: 0,
  });
  comparator.setPeaks1([
    [1, 1],
    [2.05, 1],
    [3, 1],
  ]);
  comparator.setPeaks2([
    [1, 1],
    [2, 1],
    [4, 1],
  ]);
  comparator.setFromTo(0.5, 1.5);
  const result = comparator.getSimilarity();
  expect(result.extract1).toStrictEqual([[1], [1]]);
  expect(result.extract2).toStrictEqual([[1], [1]]);
  expect(result.similarity).toBe(1);
});

test('We check common array with nothing common based on first', () => {
  const comparator = new Comparator({
    common: 'first',
    widthBottom: 0.2,
    widthTop: 0,
  });
  comparator.setPeaks1([
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
  ]);
  comparator.setPeaks2([
    [5, 1],
    [6, 1],
    [7, 1],
    [8, 1],
  ]);

  const result = comparator.getSimilarity();
  expect(result.extract1).toStrictEqual([
    [1, 2, 3, 4],
    [0.25, 0.25, 0.25, 0.25],
  ]);
  expect(result.extract2).toStrictEqual([[], []]);
  expect(result.similarity).toBe(0);
});

test('We check common array with nothing common based on second', () => {
  const comparator = new Comparator({
    common: 'second',
    widthBottom: 0.2,
    widthTop: 0,
  });
  comparator.setPeaks1([
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
  ]);
  comparator.setPeaks2([
    [5, 1],
    [6, 1],
    [7, 1],
    [8, 1],
  ]);

  const result = comparator.getSimilarity();
  expect(result.extract1).toStrictEqual([[], []]);
  expect(result.extract2).toStrictEqual([
    [5, 6, 7, 8],
    [0.25, 0.25, 0.25, 0.25],
  ]);
  expect(result.similarity).toBe(0);
});

test('We check common array with nothing common based on both', () => {
  const comparator = new Comparator({
    common: 'both',
    widthBottom: 0.2,
    widthTop: 0,
  });
  comparator.setPeaks1([
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
  ]);
  comparator.setPeaks2([
    [5, 1],
    [6, 1],
    [7, 1],
    [8, 1],
  ]);

  const result = comparator.getSimilarity();
  expect(result.extract1).toStrictEqual([[], []]);
  expect(result.extract2).toStrictEqual([[], []]);
  expect(result.similarity).toBe(0);
});

test('We check common array with nothing common based on all', () => {
  const comparator = new Comparator({
    common: 'all',
    widthBottom: 0.2,
    widthTop: 0,
  });
  comparator.setPeaks1([
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
  ]);
  comparator.setPeaks2([
    [5, 1],
    [6, 1],
    [7, 1],
    [8, 1],
  ]);

  const result = comparator.getSimilarity();
  expect(result.extract1).toStrictEqual([
    [1, 2, 3, 4],
    [0.25, 0.25, 0.25, 0.25],
  ]);
  expect(result.extract2).toStrictEqual([
    [5, 6, 7, 8],
    [0.25, 0.25, 0.25, 0.25],
  ]);
  expect(result.similarity).toBe(0);
});
