import { test, expect } from 'vitest';

import { checkPeaks } from '../checkPeaks.js';

test('object', () => {
  const result = checkPeaks({ x: [1, 2, 3], y: [2, 3, 4] });
  expect(result).toStrictEqual([
    [1, 2, 3],
    [2, 3, 4],
  ]);
});

test('correct array', () => {
  const result = checkPeaks([
    [1, 2, 3],
    [2, 3, 4],
  ]);
  expect(result).toStrictEqual([
    [1, 2, 3],
    [2, 3, 4],
  ]);
});

test('array of [x,y]', () => {
  const result = checkPeaks([
    [1, 2],
    [2, 3],
    [3, 4],
  ]);
  expect(result).toStrictEqual([
    [1, 2, 3],
    [2, 3, 4],
  ]);
});
