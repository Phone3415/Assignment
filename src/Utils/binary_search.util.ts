/**
 * Binary search to find the index of an item in a sorted array,
 * or the index where it should be inserted to maintain sort order.
 *
 * @param array The sorted array
 * @param compareFn Function that returns:
 *                  - a negative number if the current element is less than the target
 *                  - a positive number if the current element is greater than the target
 *                  - zero if they are equal
 * @returns An object containing whether the exact item was found and the corresponding index (or insertion point).
 */
export function binarySearch<T>(
  array: T[],
  compareFn: (item: T) => number,
): { found: boolean; index: number } {
  let low = 0;
  let high = array.length - 1;

  while (low <= high) {
    const mid = (low + high) >>> 1;
    const cmp = compareFn(array[mid]);

    if (cmp < 0) {
      low = mid + 1;
    } else if (cmp > 0) {
      high = mid - 1;
    } else {
      return { found: true, index: mid };
    }
  }

  return { found: false, index: low };
}
