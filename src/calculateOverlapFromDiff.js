export function calculateOverlapFromDiff(diffs) {
  if (diffs[1].length === 0) return 0;
  let sumPos = 0;
  for (let i = 0; i < diffs[1].length; i++) {
    sumPos += Math.abs(diffs[1][i]);
  }
  return 1 - sumPos;
}
