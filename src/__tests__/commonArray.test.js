import { test, expect } from 'vitest';

import { getCommonArray } from '../getCommonArray.js';

test('Test 1', () => {
  const result = getCommonArray(
    [
      [2, 3],
      [2, 2],
    ],
    [
      [1, 2.05, 2.95],
      [2, 2, 2],
    ],
    0.2,
  );
  expect(result).toStrictEqual([
    [2, 3],
    [2, 2],
  ]);
});

test('Test 2', () => {
  const result = getCommonArray(
    [
      [0, 1, 2, 3],
      [2, 2, 2, 2],
    ],
    [
      [0, 1, 2, 3],
      [2, 2, 2, 2],
    ],
    0.2,
  );
  expect(result).toStrictEqual([
    [0, 1, 2, 3],
    [2, 2, 2, 2],
  ]);
});

test('Test 3', () => {
  const result = getCommonArray(
    [
      [0.95, 1, 1.05],
      [2, 2, 2],
    ],
    [
      [0, 1, 2],
      [2, 2, 2],
    ],
    0.2,
  );
  expect(result).toStrictEqual([
    [0.95, 1, 1.05],
    [2, 2, 2],
  ]);
});

test('Test 4', () => {
  const result = getCommonArray(
    [
      [0.85, 1, 1.15],
      [2, 2, 2],
    ],
    [
      [0, 1, 2],
      [2, 2, 2],
    ],
    0.2,
  );
  expect(result).toStrictEqual([[1], [2]]);
});

test('Test 5', () => {
  const result = getCommonArray(
    [
      [0, 0.95, 1, 1.05, 2],
      [2, 2, 2, 2, 2],
    ],
    [[1, 2]],
    0.2,
  );
  expect(result).toStrictEqual([
    [0.95, 1, 1.05, 2],
    [2, 2, 2, 2],
  ]);
});
