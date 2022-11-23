import { describe, it, expect } from 'vitest';

import { Comparator } from '..';

describe('We check that array of points are not converted and are not normalized', () => {
  const comparator = new Comparator({});
  comparator.setPeaks1([
    [0, 1, 2],
    [0, 0, 0],
  ]);
  comparator.setPeaks2([
    [10, 11],
    [0, 0],
  ]);

  it('getExtract1', () => {
    expect(comparator.getExtract1()).toStrictEqual([
      [0, 1, 2],
      [0, 0, 0],
    ]);
  });
  it('getExtract2', () => {
    expect(comparator.getExtract2()).toStrictEqual([
      [10, 11],
      [0, 0],
    ]);
  });
});
