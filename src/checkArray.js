/**
        This code requires the use of an array like  [[x1,y1],[x2,y2], ...]
        If it is not the right format, we will just convert it
        Otherwise we return the correct format
     */
export function checkArray(points) {
  // if it is already a 2D array of points, we just return them
  if (
    Array.isArray(points) &&
    Array.isArray(points[0]) &&
    points.length === 2
  ) {
    return points;
  }
  const x = new Array(points.length);
  const y = new Array(points.length);
  for (let i = 0; i < points.length; i++) {
    x[i] = points[i][0];
    y[i] = points[i][1];
  }
  return [x, y];
}
