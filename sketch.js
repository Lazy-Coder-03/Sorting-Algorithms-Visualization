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
