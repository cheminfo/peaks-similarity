/**
 * Created by lpatiny on 27/05/15.
 */

// We will try to make a script to take the  common part of an xy array based on a distance

const array1 = [
  [2, 2],
  [3, 2],
];
const array2 = [
  [1, 2],
  [2.05, 2],
  [2.95, 2],
];

const array1 = [
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
];
const array2 = [
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
];

const array1 = [
  [0.95, 2],
  [1, 2],
  [1.05, 2],
];
const array2 = [
  [0, 2],
  [1, 2],
  [2, 2],
];

const array1 = [
  [0.85, 2],
  [1, 2],
  [1.15, 2],
];
const array2 = [
  [0, 2],
  [1, 2],
  [2, 2],
];

const array1 = [
  [0, 2],
  [0.95, 2],
  [1, 2],
  [1.05, 2],
  [2, 2],
];
const array2 = [[1, 2]];

const widthBottom = 0.2;

const newArray = getCommonArray(array1, array2, widthBottom);

console.log(newArray);

function getCommonArray(array1, array2, widthBottom) {
  const newArray1 = [];
  const newArray2 = [];
  const pos2 = 0;

  for (const i = 0; i < array1.length; i++) {
    while (
      pos2 < array2.length &&
      array1[i][0] > array2[pos2][0] + widthBottom / 2
    ) {
      console.log('---', array1[i][0], array2[pos2][0] - widthBottom / 2);
      pos2++;
    }
    console.log(i, pos2, array1[i]);
    if (
      pos2 < array2.length &&
      array1[i][0] > array2[pos2][0] - widthBottom / 2
    ) {
      console.log('add');
      newArray1.push(array1[i]);
    }
  }
  return newArray;
}
