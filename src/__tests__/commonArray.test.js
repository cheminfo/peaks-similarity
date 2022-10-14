import Comparator from '../index.js';

describe('We check the calculation of common array', () => {
  it('Test 1', () => {
    const comparator = new Comparator();
    const result = comparator.getCommonArray(
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

  it('Test 2', () => {
    const comparator = new Comparator();
    const result = comparator.getCommonArray(
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

  it('Test 3', () => {
    const comparator = new Comparator();
    const result = comparator.getCommonArray(
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

  it('Test 4', () => {
    const comparator = new Comparator();
    const result = comparator.getCommonArray(
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

  it('Test 5', () => {
    const comparator = new Comparator();
    const result = comparator.getCommonArray(
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
});
