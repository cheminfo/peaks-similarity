/**
 * This code requires the use of an array like  [[x1,y1],[x2,y2], ...]
 * If it is not the right format, we will just convert it
 * Otherwise we return the correct format
 * @param {Peaks} peaks
 * @returns [number[], number[]]
 */
export function checkPeaks(peaks) {
  // if it is already a 2D array of points, we just return them
  if (Array.isArray(peaks) && Array.isArray(peaks[0]) && peaks.length === 2) {
    return peaks;
  }
  if (Array.isArray(peaks.x) && Array.isArray(peaks.y)) {
    return [peaks.x, peaks.y];
  }
  const x = new Array(peaks.length);
  const y = new Array(peaks.length);
  for (let i = 0; i < peaks.length; i++) {
    x[i] = peaks[i][0];
    y[i] = peaks[i][1];
  }
  return [x, y];
}
