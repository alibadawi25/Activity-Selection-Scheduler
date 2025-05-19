function defaultCompare(a, b) {
  if (a > b) return 1;
  else if (a < b) return -1;
  else return 0;
}

function merge(arr, left, mid, right, compareFunc) {
  const n1 = mid - left + 1;
  const n2 = right - mid;

  const arr1 = new Array(n1);
  const arr2 = new Array(n2);

  for (let i = 0; i < n1; i++) {
    arr1[i] = arr[left + i];
  }

  for (let i = 0; i < n2; i++) {
    arr2[i] = arr[mid + 1 + i];
  }

  let i = 0;
  let j = 0;
  let k = left;

  while (i < n1 && j < n2) {
    if (compareFunc(arr1[i], arr2[j])) {
      arr[k] = arr1[i];
      i++;
    } else {
      arr[k] = arr2[j];
      j++;
    }
    k++;
  }

  while (i < n1) {
    arr[k] = arr1[i];
    i++;
    k++;
  }

  while (j < n2) {
    arr[k] = arr2[j];
    j++;
    k++;
  }
}

function mergeSort(arr, left, right, compareFn = defaultCompare) {
  if (left >= right) return;

  const mid = Math.floor(right / 2);
  mergeSort(arr, left, mid, compareFn);
  mergeSort(arr, mid + 1, right, compareFn);
  merge(arr, left, mid, right, compareFn);
}

/**
 * Sorts an array in place using mergeSort.
 * @param {Array} arr - array to be sorted
 * @param {function} [compareFn=defaultCompare] - function used to compare two elements. It is expected to return
 * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
 * value otherwise. If omitted, the elements are sorted in ascending.
 *
 **/
function fastSort(arr, compareFn = defaultCompare) {
  if (arr.length <= 1) return;

  const left = 0;
  const right = arr.length - 1;

  const mid = Math.floor(arr.length / 2);
  mergeSort(arr, left, mid, compareFn);
  mergeSort(arr, mid + 1, right, compareFn);
  merge(arr, left, mid, right, compareFn);
}

export { fastSort };
