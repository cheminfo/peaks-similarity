import { test, expect } from 'vitest';

import { Comparator } from '..';

test('similarity with itself should be 1', () => {
  const comparator = new Comparator();
  const data = [
    [6.7534, 4.2791],
    [7.1462, 3.9918],
    [8.8428, 19.4627],
    [18.7214, 91.3757],
    [31.1682, 25.4961],
    [41.5126, 61.4518],
    [46.8707, 41.0293],
    [49.2704, 43.3557],
    [52.0211, 49.68],
    [58.0323, 66.8031],
    [60.6562, 76.4796],
    [64.2633, 95.6982],
    [67.6646, 63.2956],
    [67.8162, 3.1211],
    [69.1406, 98.1633],
    [70.8231, 31.5687],
    [75.1465, 29.4686],
    [75.5508, 54.7101],
    [78.4101, 40.5057],
    [80.7433, 87.8072],
    [81.9243, 54.6432],
    [83.7495, 48.1136],
    [85.3857, 93.9969],
    [88.9137, 14.9177],
    [88.9623, 63.885],
  ];

  const result = comparator.getSimilarity(data, data);
  expect(result.similarity).toBe(1);
});
