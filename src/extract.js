export function extract(array, from, to) {
  const newArray = [[], []];
  let j = 0;
  const length = array[0] ? array[0].length : 0;
  for (let i = 0; i < length; i++) {
    if ((!from || array[0][i] >= from) && (!to || array[0][i] <= to)) {
      newArray[0][j] = array[0][i];
      newArray[1][j] = array[1][i];
      j++;
    }
  }
  return newArray;
}
