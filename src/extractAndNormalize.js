import { extract } from './extract';
import { normalize } from './normalize';

export function extractAndNormalize(array, from, to) {
  if (!Array.isArray(array)) {
    return {
      info: undefined,
      data: undefined,
    };
  }
  const newArray = extract(array, from, to);
  const info = normalize(newArray);
  return {
    info,
    data: newArray,
  };
}
