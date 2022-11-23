import { extract } from './extract';
import { getCommonArray } from './getCommonArray';
import { normalize } from './normalize';

import { COMMON_SECOND, COMMON_FIRST } from './index';

// this method will systematically take care of both array
export function commonExtractAndNormalize(
  array1,
  array2,
  width,
  from,
  to,
  common,
) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return {
      info: undefined,
      data: undefined,
    };
  }
  const extract1 = extract(array1, from, to);
  const extract2 = extract(array2, from, to);
  let common1, common2, info1, info2;
  if (common & COMMON_SECOND) {
    common1 = getCommonArray(extract1, extract2, width);
    info1 = normalize(common1);
  } else {
    common1 = extract1;
    info1 = normalize(common1);
  }
  if (common & COMMON_FIRST) {
    common2 = getCommonArray(extract2, extract1, width);
    info2 = normalize(common2);
  } else {
    common2 = extract2;
    info2 = normalize(common2);
  }

  return {
    info1,
    info2,
    data1: common1,
    data2: common2,
  };
}
