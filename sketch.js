let values = [];
let canvasWidth = 600;
let canvasHeight = 600;
let rectWidth;
let sorting = false;
let sortingAlgorithm;
let animationDelay = 10; // Animation delay in milliseconds
let comparisons = 0; // Variable to keep track of comparisons
let swaps = 0; // Variable to keep track of swaps
let startTime = 0; // Variable to keep track of the start time
let s;
let windowScaleFac = 22;
function setup() {
  const canvasContainer = document.querySelector(".canvas-container");
  s = scl = min(
    floor(windowHeight / windowScaleFac),
    floor(windowWidth / windowScaleFac)
  );
  const canvas = createCanvas(s * 18, s * 12);
  canvas.parent(canvasContainer);
  initializeRectangles();
  initializeSortingAlgorithm();
}

function draw() {
  background(0);

  if (!sorting) {
    const numRectangles = getNumRectangles();
    if (values.length !== numRectangles) {
      initializeRectangles();
    }
  }
  drawRectangles();

  if (sorting) {
    let endTime = new Date().getTime(); // Current time in milliseconds
    let timeElapsed = endTime - startTime; // Time elapsed in milliseconds
    document.getElementById("timeElapsedValue").textContent =
      timeElapsed + " ms";
  }
}

function drawRectangles() {
  rectWidth = width / values.length;
  let w = map(rectWidth, width / 10, 1, 1, 0);
  strokeWeight(w);
  colorMode(mode = HSB);
  for (let i = 0; i < values.length; i++) {
    if (values[i].highlight) {
      //let g = map(values[i].value, 0, height, 360, 360);
      fill("white");
    } else if (values[i].sorted) {
      fill(0, 255, 0);
    } else {
      let f = map(values[i].value, 0, height, 0,  360);
      fill(f, 255, 255);
    }
    rect(i * rectWidth, height - values[i].value, rectWidth, values[i].value);
  }
}

function initializeRectangles() {
  values = [];
  const numRectangles = getNumRectangles();
  rectWidth = width / numRectangles;

  for (let i = 0; i < numRectangles; i++) {
    let f = (height/numRectangles)
    values.push({
      value: floor(f*(i+1)),//random(0, height),
      highlight: false,
      sorted: false,
    });
  }
  shuffle(values, true); // Shuffle the array
  updateNumRectanglesValue(numRectangles); // Update the text box value
  swaps = 0; // Reset the swaps counter
  comparisons = 0; // Reset the comparisons counter
  timeElapsed = 0; // Reset the time elapsed
  updateTimeValue(timeElapsed)
  updateSwapsValue(swaps)
  updateComparisonsValue(comparisons); // Update the HTML element with the current comparisons value
  
  if (sorting) {
    sorting = false; // Reset the sorting state if it was in progress
  }
}

function initializeSortingAlgorithm() {
  const algorithmSelect = document.getElementById("algorithm");
  const selectedAlgorithm = algorithmSelect.value;
  sortingAlgorithm = getSortingAlgorithm(selectedAlgorithm);
  comparisons = 0; // Reset the comparison count to 0
  updateComparisonsValue(comparisons); // Update the HTML element with the current comparisons value
}

async function startSorting() {
  if (sorting) {
    return; // Return if sorting is already in progress
  }

  sorting = true; // Set sorting flag to true
  initializeSortingAlgorithm();
  startTime = new Date().getTime(); // Start time in milliseconds
  swaps = 0; // Reset swaps counter

  await sortingAlgorithm.sort(values);

  sorting = false; // Set sorting flag to false after sorting is finished

  let endTime = new Date().getTime(); // End time in milliseconds
  let timeElapsed = endTime - startTime; // Time elapsed in milliseconds

  // Update the number of swaps and time elapsed in the UI
  document.getElementById("swapsValue").textContent = swaps;
  document.getElementById("timeElapsedValue").textContent = timeElapsed + " ms";
}

function randomizeValues() {
  if (sorting) {
    sorting = false; // Set sorting flag to false to interrupt the sorting process
    return;
  }
  initializeRectangles(); // Randomize the array
}


function getNumRectangles() {
  const slider = document.getElementById("numRectangles");
  return parseInt(slider.value);
}
function changeSliderValue(value) {
  let slider = document.getElementById("numRectangles");
  slider.value = value;
}
function changeNumRectangles() {
  updateNumRectanglesValue();
  const slider = document.getElementById("numRectangles");
  const value = slider.value;
  const numRectanglesValue = document.getElementById("numRectanglesValue");
  numRectanglesValue.textContent = value;

  initializeRectangles();
}

function updateNumRectanglesValue() {
  const numRectanglesInput = document.getElementById("numRectangles");
  const numRectanglesValue = document.getElementById("numRectanglesValue");
  numRectanglesValue.textContent = numRectanglesInput.value;
}
function updateComparisonsValue(value) {
  document.getElementById("comparisonsValue").textContent = value;
}
function updateSwapsValue(value) {
  document.getElementById("swapsValue").textContent = value;
}
function updateTimeValue(value) {
  document.getElementById("timeElapsedValue").textContent = value;
}

function getSortingAlgorithm(algorithm) {
  switch (algorithm) {
    case "bubble":
      return new BubbleSort();
    case "selection":
      return new SelectionSort();
    case "insertion":
      return new InsertionSort();
    case "shell":
      return new ShellSort();
    case "quick":
      return new QuickSort();
    case "merge":
      return new MergeSort();
    case "heap":
      return new HeapSort();
    case "radix":
      return new RadixSort();

    default:
      return null;
  }
}

// Sorting algorithms (example implementations)

class BubbleSort {
  async sort(arr) {
    const n = arr.length;
    let comparisons = 0;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        arr[j].highlight = true;
        arr[j + 1].highlight = true;
        comparisons++;
        if (arr[j].value > arr[j + 1].value) {
          await sleep(animationDelay); // Delay for visualization
          swap(arr, j, j + 1);
        }
        arr[j].highlight = false;
        arr[j + 1].highlight = false;
      }
    }
    updateComparisonsValue(comparisons);
  }
}

class SelectionSort {
  async sort(arr) {
    const n = arr.length;
    let comparisons = 0;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < n; j++) {
        comparisons++;
        arr[j].highlight = true;
        arr[minIndex].highlight = true;
        if (arr[j].value < arr[minIndex].value) {
          minIndex = j;
        }
        arr[j].highlight = false;
        arr[minIndex].highlight = false;
      }
      await sleep(animationDelay); // Delay for visualization
      swap(arr, i, minIndex);
    }
    this.unhighlightAll(arr);
    updateComparisonsValue(comparisons);
  }
  unhighlightAll(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].highlight = false;
    }
  }
}

class InsertionSort {
  async sort(arr) {
    const n = arr.length;
    let comparisons = 0;

    for (let i = 1; i < n; i++) {
      let j = i;

      while (j > 0 && arr[j].value < arr[j - 1].value) {
        comparisons++;
        arr[j].highlight = true;
        arr[j - 1].highlight = true;
        await sleep(animationDelay); // Delay for visualization
        swap(arr, j, j - 1);
        arr[j].highlight = false;
        arr[j - 1].highlight = false;

        j--;
      }
    }
    updateComparisonsValue(comparisons);
  }
}

class ShellSort {
  async sort(arr) {
    const n = arr.length;
    let comparisons = 0;
    let gap = Math.floor(n / 2);

    while (gap > 0) {
      for (let i = gap; i < n; i++) {
        let j = i;

        while (j >= gap && arr[j].value < arr[j - gap].value) {
          comparisons++;
          arr[j].highlight = true;
          arr[j - gap].highlight = true;
          await sleep(animationDelay); // Delay for visualization
          swap(arr, j, j - gap);
          arr[j].highlight = false;
          arr[j - gap].highlight = false;

          j -= gap;
        }
      }

      gap = Math.floor(gap / 2);
    }

    updateComparisonsValue(comparisons);
  }
}

class QuickSort {
  async sort(arr) {
    let comparisons = { count: 0 }; // Create an object to hold the count value
    await this.quickSort(arr, 0, arr.length - 1, comparisons); // Pass the object as an argument
    updateComparisonsValue(comparisons.count); // Update the comparisons value in the UI
    this.unhighlightAll(arr); // Unhighlight all rectangles after sorting
  }

  async quickSort(arr, low, high, comparisons) {
    // Add the 'comparisons' parameter
    if (low < high) {
      let pivotIndex = await this.partition(arr, low, high, comparisons); // Pass the 'comparisons' object
      await this.quickSort(arr, low, pivotIndex - 1, comparisons); // Pass the 'comparisons' object
      await this.quickSort(arr, pivotIndex + 1, high, comparisons); // Pass the 'comparisons' object
    }
  }

  async partition(arr, low, high, comparisons) {
    // Add the 'comparisons' parameter
    let pivot = arr[high].value;
    let i = low - 1;

    arr[high].highlight = true; // Highlight the pivot element

    for (let j = low; j < high; j++) {
      comparisons.count++; // Increment the comparisons count
      arr[j].highlight = true; // Highlight the element being checked with the pivot

      if (arr[j].value < pivot) {
        i++;
        await sleep(animationDelay); // Delay for visualization
        swap(arr, i, j);
      }

      arr[j].highlight = false; // Remove the highlight after the comparison
    }

    await sleep(animationDelay); // Delay for visualization
    swap(arr, i + 1, high);

    arr[high].highlight = false; // Unhighlight the pivot element

    return i + 1;
  }

  unhighlightAll(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].highlight = false;
    }
  }
}

class MergeSort {
  async sort(arr) {
    let comparisons = { count: 0 }; // Wrap comparisons in an object
    await this.mergeSort(arr, 0, arr.length - 1, comparisons);
    //this.unhighlightAll(arr); // Unhighlight all rectangles after sorting
    updateComparisonsValue(comparisons.count); // Update the HTML element with the current comparisons value
  }

  async mergeSort(arr, start, end, comparisons) {
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      await this.mergeSort(arr, start, mid, comparisons);
      await this.mergeSort(arr, mid + 1, end, comparisons);
      await this.merge(arr, start, mid, end, comparisons);
      this.unhighlightAll(arr); 
    }
  }

  async merge(arr, start, mid, end, comparisons) {
    const n1 = mid - start + 1;
    const n2 = end - mid;
    const leftArr = new Array(n1);
    const rightArr = new Array(n2);

    for (let i = 0; i < n1; i++) {
      leftArr[i] = { ...arr[start + i] };
    }
    for (let j = 0; j < n2; j++) {
      rightArr[j] = { ...arr[mid + 1 + j] };
    }

    let i = 0;
    let j = 0;
    let k = start;

    while (i < n1 && j < n2) {
      leftArr[i].highlight = true;
      rightArr[j].highlight = true;

      await sleep(animationDelay); // Delay for visualization

      comparisons.count++; // Increment the comparisons counter

      if (leftArr[i].value <= rightArr[j].value) {
        arr[k] = { ...leftArr[i] };
        i++;
      } else {
        arr[k] = { ...rightArr[j] };
        j++;
      }

      k++;
    }

    while (i < n1) {
      arr[k] = { ...leftArr[i] };
      i++;
      k++;
    }

    while (j < n2) {
      arr[k] = { ...rightArr[j] };
      j++;
      k++;
    }

    updateComparisonsValue(comparisons.count); // Update the HTML element with the current comparisons value
  }

  unhighlightAll(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].highlight = false;
    }
  }
}

class HeapSort {
  constructor() {
    this.comparisons = { count: 0 }; // Initialize the comparisons object
  }

  async sort(arr) {
    const n = arr.length;
    let swaps = 0;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await this.heapify(arr, n, i);
    }

    // Extract elements from the heap one by one
    for (let i = n - 1; i > 0; i--) {
      await sleep(animationDelay); // Delay for visualization
      swap(arr, 0, i);
      arr[i].highlight = true; // Highlight the sorted element

      await this.heapify(arr, i, 0);

      arr[i].highlight = false; // Unhighlight the sorted element
    }

    arr[0].highlight = true; // Highlight the last remaining element
    arr[0].sorted = true; // Mark the element as sorted
    arr[0].highlight = false; // Unhighlight the last remaining element

    updateComparisonsValue(this.comparisons.count); // Update the HTML element with the total comparisons value
  }

  async heapify(arr, n, root) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < n) {
      this.comparisons.count++;
      if (arr[left].value > arr[largest].value) {
        largest = left;
      }
    }

    if (right < n) {
      this.comparisons.count++;
      if (arr[right].value > arr[largest].value) {
        largest = right;
      }
    }

    if (largest !== root) {
      await sleep(animationDelay); // Delay for visualization
      swap(arr, root, largest);

      await this.heapify(arr, n, largest); // Pass the updated comparisons object in the recursive call
    }
  }
}
class RadixSort {
  async sort(arr) {
    const max = getMaxValue(arr);

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      await countSort(arr, exp);
    }
  }
}

async function countSort(arr, exp) {
  const n = arr.length;
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    count[Math.floor(arr[i].value / exp) % 10]++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i].value / exp) % 10;
    const index = count[digit] - 1;

    output[index] = arr[i];
    count[digit]--;

    arr[i].highlight = true;
    await sleep(animationDelay); // Delay for visualization
    arr[i].highlight = false;
  }

  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}

function getMaxValue(arr) {
  let max = arr[0].value;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i].value > max) {
      max = arr[i].value;
    }
  }

  return max;
}


function swap(arr, i, j) {
  const temp = arr[i].value;
  arr[i].value = arr[j].value;
  arr[j].value = temp;
  if (sorting) {
    swaps++;
  } // Increment the swaps counter
  updateSwapsValue(swaps); // Update the HTML element with the current swaps value
}

function updateSwapsValue(value) {
  document.getElementById("swapsValue").textContent = value;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function changeAnimationDelay() {
  animationDelay = document.getElementById("animationDelay").value;
  document.getElementById("animationDelayValue").textContent =
    animationDelay + " ms";
}
