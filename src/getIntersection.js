// Adapted from: http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
export function getIntersection(segment1, segment2) {
  const p0X = segment1[0][0];
  const p0Y = segment1[0][1];
  const p1X = segment1[1][0];
  const p1Y = segment1[1][1];
  const p2X = segment2[0][0];
  const p2Y = segment2[0][1];
  const p3X = segment2[1][0];
  const p3Y = segment2[1][1];

  const s1X = p1X - p0X;
  const s1Y = p1Y - p0Y;
  const s2X = p3X - p2X;
  const s2Y = p3Y - p2Y;
  const s = (-s1Y * (p0X - p2X) + s1X * (p0Y - p2Y)) / (-s2X * s1Y + s1X * s2Y);
  const t = (s2X * (p0Y - p2Y) - s2Y * (p0X - p2X)) / (-s2X * s1Y + s1X * s2Y);
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    return {
      x: p0X + t * s1X,
      y: p0Y + t * s1Y,
    };
  }
  return null; // No collision
}
