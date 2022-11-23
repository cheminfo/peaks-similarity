// returns an new array based on array1 where there is a peak of array2 at a distance under width/2

export function getCommonArray(array1, array2, width) {
  const newArray = [[], []];
  let pos2 = 0;
  width /= 2;
  let j = 0;
  const array1Length = array1[0] ? array1[0].length : 0;
  const array2Length = array2[0] ? array2[0].length : 0;

  for (let i = 0; i < array1Length; i++) {
    while (pos2 < array2Length && array1[0][i] > array2[0][pos2] + width) {
      pos2++;
    }
    if (pos2 < array2Length && array1[0][i] > array2[0][pos2] - width) {
      newArray[0][j] = array1[0][i];
      newArray[1][j] = array1[1][i];
      j++;
    }
  }
  return newArray;
}
