import { array as StatArray } from 'ml-stat';

export function normalize(array) {
  const min = StatArray.min(array[1]);
  const max = StatArray.max(array[1]);
  const sum = StatArray.sum(array[1]);
  const length = array[1] ? array[1].length : 0;
  if (sum !== 0) {
    for (let i = 0; i < length; i++) {
      array[1][i] /= sum;
    }
  }
  return {
    sum,
    min,
    max,
  };
}
