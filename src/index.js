import { calculateOverlapFromDiff } from './calculateOverlapFromDiff';
import { checkPeaks } from './checkPeaks';
import { commonExtractAndNormalize } from './commonExtractAndNormalize';
import { extract } from './extract';
import { extractAndNormalize } from './extractAndNormalize';
import { getCommonArray } from './getCommonArray.js';
import { getIntersection } from './getIntersection';
import { normalize } from './normalize';

export const COMMON_NO = 0;
export const COMMON_FIRST = 1;
export const COMMON_SECOND = 2;
export const COMMON_BOTH = 3;

/**
 * A number, or a string containing a number.
 * @typedef {([number[],number[]]|[number,number][]|{x:number[],y:number[]})} Peaks
 */

/**
 * Create a comparator class
 * {object} [options={}]
 * {string} [options.common=''] should we take only common peaks 'first', 'second', 'both', ''
 * {number} [options.widthBottom=2] bottom trapezoid width for similarity evaluation
 * {number} [options.widthTop=1] top trapezoid width for similarity evaluation
 * {number} [options.from] from region used for similarity calculation
 * {number} [options.to] to region used for similarity calculation
 */
export class Comparator {
  constructor(options = {}) {
    this.array1 = [];
    this.array2 = [];

    this.setOptions(options);
  }

  /*
     2 formats are allowed:
     [[x1,x2,...],[y1,y2,...]] or [[x1,y1],[x2,y2], ...]
    */

  setOptions(options = {}) {
    if (typeof options.common === 'string') {
      if (options.common.toLowerCase() === 'first') {
        this.common = COMMON_FIRST;
      } else if (options.common.toLowerCase() === 'second') {
        this.common = COMMON_SECOND;
      } else if (options.common.toLowerCase() === 'both') {
        this.common = COMMON_BOTH;
      } else {
        this.common = COMMON_NO;
      }
    } else if (options.common === true) {
      this.common = COMMON_BOTH;
    } else {
      this.common = COMMON_NO;
    }
    this.trapezoid = options.trapezoid;
    this.commonFactor = options.commonFactor || this.commonFactor || 4;

    const {
      widthBottom = this.widthBottom || 2,
      widthTop = this.widthTop || 1,
      from = this.from,
      to = this.to,
    } = options;
    this.setTrapezoid(widthBottom, widthTop);
    this.setFromTo(from, to);
  }

  /**
   *
   * @param {Peaks} peaks
   */
  setPeaks1(peaks) {
    this.array1 = checkPeaks(peaks);

    if (this.common) {
      const extracts = commonExtractAndNormalize(
        this.array1,
        this.array2,
        this.widthBottom,
        this.from,
        this.to,
        this.common,
      );
      this.array1Extract = extracts.data1;
      this.array1ExtractInfo = extracts.info1;
      this.array2Extract = extracts.data2;
      this.array2ExtractInfo = extracts.info2;
    } else {
      const extract = extractAndNormalize(this.array1, this.from, this.to);
      this.array1Extract = extract.data;
      this.array1ExtractInfo = extract.info;
    }
  }

  /**
   *
   * @param {Peaks} peaks
   */
  setPeaks2(peaks) {
    this.array2 = checkPeaks(peaks);
    if (this.common) {
      const extracts = commonExtractAndNormalize(
        this.array1,
        this.array2,
        this.widthBottom,
        this.from,
        this.to,
        this.common,
      );
      this.array1Extract = extracts.data1;
      this.array1ExtractInfo = extracts.info1;
      this.array2Extract = extracts.data2;
      this.array2ExtractInfo = extracts.info2;
    } else {
      const extract = extractAndNormalize(this.array2, this.from, this.to);
      this.array2Extract = extract.data;
      this.array2ExtractInfo = extract.info;
    }
  }

  getExtract1() {
    return this.array1Extract;
  }

  getExtract2() {
    return this.array2Extract;
  }

  getExtractInfo1() {
    return this.array1ExtractInfo;
  }

  getExtractInfo2() {
    return this.array2ExtractInfo;
  }

  /**
   * Set the new bottom and top width of the trapezoid
   * @param {number} newWidthBottom
   * @param {number} newWidthTop
   */
  setTrapezoid(newWidthBottom, newWidthTop) {
    this.widthTop = newWidthTop;
    this.widthBottom = newWidthBottom;
    this.widthSlope = (this.widthBottom - this.widthTop) / 2;
    if (this.widthBottom < this.widthTop) {
      throw new Error('widthBottom has to be larger than widthTop');
    }
  }

  /**
   * Set the from / to for comparison
   * @param {number} newFrom - set the new from value
   * @param {number} newTo - set the new to value
   * @returns
   */
  setFromTo(newFrom, newTo) {
    if (newFrom === this.from && newTo === this.to) return;
    this.from = newFrom;
    this.to = newTo;
    if (this.common) {
      const extracts = commonExtractAndNormalize(
        this.array1,
        this.array2,
        this.widthBottom,
        this.from,
        this.to,
        this.common,
        this.commonFactor,
      );
      this.array1Extract = extracts.data1;
      this.array1ExtractInfo = extracts.info1;
      this.array2Extract = extracts.data2;
      this.array2ExtractInfo = extracts.info2;
    } else {
      let extract1 = extractAndNormalize(this.array1, this.from, this.to);
      this.array1Extract = extract1.data;
      this.array1ExtractInfo = extract1.info;
      let extract2 = extractAndNormalize(this.array2, this.from, this.to);
      this.array2Extract = extract2.data;
      this.array2ExtractInfo = extract2.info;
    }
  }

  /**
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @returns
   */
  getOverlap(x1, y1, x2, y2) {
    if (y1 === 0 || y2 === 0) return 0;

    // TAKE CARE !!! We multiply the diff by 2 !!!
    const diff = Math.abs(x1 - x2) * 2;

    if (diff > this.widthBottom) return 0;
    if (diff <= this.widthTop) {
      return Math.min(y1, y2);
    }

    const maxValue =
      (Math.max(y1, y2) * (this.widthBottom - diff)) /
      (this.widthBottom - this.widthTop);
    return Math.min(y1, y2, maxValue);
  }

  /**
   * This is the old trapezoid similarity
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {number} widthTop
   * @param {number} widthBottom
   * @returns
   */
  getOverlapTrapezoid(x1, y1, x2, y2, widthTop, widthBottom) {
    // eslint-disable-next-line no-console
    console.error('getOverlapTrapezoid should not be used anymore');
    const factor = 2 / (widthTop + widthBottom); // correction for surface=1
    if (y1 === 0 || y2 === 0) return 0;
    if (x1 === x2) {
      // they have the same position
      return Math.min(y1, y2);
    }

    const diff = Math.abs(x1 - x2);
    if (diff >= widthBottom) return 0;
    if (y1 === y2) {
      // do they have the same height ???
      // we need to find the common length
      if (diff <= widthTop) {
        return ((widthTop + widthBottom) / 2 - diff) * y1 * factor;
      } else if (diff <= widthBottom) {
        return (
          (((((widthBottom - diff) * y1) / 2) * (diff - widthTop)) /
            (widthBottom - widthTop)) *
          factor
        );
      }
      return 0;
    } else {
      // the height are different and not the same position ...
      // we need to consider only one segment to find its intersection

      const small = Math.min(y1, y2);
      const big = Math.max(y1, y2);

      const targets = [
        [
          [0, 0],
          [this.widthSlope, small],
        ],
        [
          [this.widthSlope, small],
          [this.widthSlope + widthTop, small],
        ],
        [
          [widthTop + this.widthSlope, small],
          [widthBottom, 0],
        ],
      ];
      let segment;
      if ((x1 > x2 && y1 > y2) || (x1 < x2 && y1 < y2)) {
        segment = [
          [diff, 0],
          [diff + this.widthSlope, big],
        ];
      } else {
        segment = [
          [diff + this.widthSlope, big],
          [diff, 0],
        ];
      }

      for (let i = 0; i < 3; i++) {
        const intersection = getIntersection(targets[i], segment);
        if (intersection) {
          switch (i) {
            case 0:
              return small - ((diff * intersection.y) / 2) * factor;
            case 1: // to simplify ...
              //     console.log("           ",widthSlope,small,big,intersection.x)
              return (
                (((this.widthSlope * small) / (2 * big)) * small +
                  (widthTop + this.widthSlope - intersection.x) * small +
                  (this.widthSlope * small) / 2) *
                factor
              );
            case 2:
              return (((widthBottom - diff) * intersection.y) / 2) * factor;
            default:
              throw new Error(`unexpected intersection value: ${i}`);
          }
        }
      }
    }
    return NaN;
  }

  /**
   * This method calculates the total diff. The sum of positive value will yield to overlap
   * @returns
   */
  calculateDiff() {
    // we need to take 2 pointers
    // and travel progressively between them ...
    const newFirst = [
      this.array1Extract[0].slice(),
      this.array1Extract[1].slice(),
    ];
    const newSecond = [
      this.array2Extract[0].slice(),
      this.array2Extract[1].slice(),
    ];
    const array1Length = this.array1Extract[0]
      ? this.array1Extract[0].length
      : 0;
    const array2Length = this.array2Extract[0]
      ? this.array2Extract[0].length
      : 0;

    let pos1 = 0;
    let pos2 = 0;
    let previous2 = 0;
    while (pos1 < array1Length) {
      const diff = newFirst[0][pos1] - this.array2Extract[0][pos2];
      if (Math.abs(diff) < this.widthBottom) {
        // there is some overlap
        let overlap;
        if (this.trapezoid) {
          // old trapezoid overlap similarity
          overlap = this.getOverlapTrapezoid(
            newFirst[0][pos1],
            newFirst[1][pos1],
            newSecond[0][pos2],
            newSecond[1][pos2],
            this.widthTop,
            this.widthBottom,
          );
        } else {
          overlap = this.getOverlap(
            newFirst[0][pos1],
            newFirst[1][pos1],
            newSecond[0][pos2],
            newSecond[1][pos2],
            this.widthTop,
            this.widthBottom,
          );
        }
        newFirst[1][pos1] -= overlap;
        newSecond[1][pos2] -= overlap;
        if (pos2 < array2Length - 1) {
          pos2++;
        } else {
          pos1++;
          pos2 = previous2;
        }
      } else if (diff > 0 && pos2 < array2Length - 1) {
        pos2++;
        previous2 = pos2;
      } else {
        pos1++;
        pos2 = previous2;
      }
    }
    return newSecond;
  }

  /**
   * Set the new peaks and return info
   * @param {Peaks} newPeaks1
   * @param {Peaks} newPeaks2
   * @returns
   */
  getSimilarity(newPeaks1, newPeaks2) {
    if (newPeaks1) this.setPeaks1(newPeaks1);
    if (newPeaks2) this.setPeaks2(newPeaks2);
    const diff = this.calculateDiff();
    return {
      diff,
      extract1: this.getExtract1(),
      extract2: this.getExtract2(),
      extractInfo1: this.getExtractInfo1(),
      extractInfo2: this.getExtractInfo2(),
      similarity: calculateOverlapFromDiff(diff),
      widthBottom: this.widthBottom,
      widthTop: this.widthTop,
    };
  }

  /**
   * This works mainly when you have a array1 that is fixed
   * newPeaks2 have to be normalized ! (sum to 1)
   * @param {Peaks} newPeaks2
   * @param {number} from
   * @param {number} to
   * @returns
   */
  fastSimilarity(newPeaks2, from, to) {
    this.array1Extract = extract(this.array1, from, to);
    this.array2Extract = newPeaks2;
    if (this.common & COMMON_SECOND) {
      this.array1Extract = getCommonArray(
        this.array1Extract,
        this.array2Extract,
        this.widthBottom,
      );
    }
    normalize(this.array1Extract);
    const diff = this.calculateDiff();
    return calculateOverlapFromDiff(diff);
  }
}
