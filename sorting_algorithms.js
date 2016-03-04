const BOX_COUNT = 29;
const BOXROW_COUNT = 4;
const DELAY_TIME = 100; //in millisecond

//Generate boxes for all rows
function generateBoxes() {
  for (var rowNum = 1; rowNum <= BOXROW_COUNT; rowNum++) {
    for (var i = 1; i <= BOX_COUNT; i++) {
      var div = document.createElement('div');
      var box_label = document.createTextNode(i);
      var element = document.getElementById("boxrow" + rowNum);
      //Push elements in place
      div.appendChild(box_label);
      div.setAttribute('id','row' + rowNum + 'box' + i);
      div.setAttribute('class','box');
      element.appendChild(div);
      //Debugging purpose
      //console.log(div);
    }
  }
  //Disable the button
  var buttonEle = document.getElementById('generate');
  buttonEle.disabled = true;
  buttonEle.className = null;
}

function invert(rowNum) {
  var i = BOX_COUNT;
  function frame() {
    if (i == 0) {
      clearInterval(interval)
    } else {
      document.getElementById('row' + rowNum + 'box' + i).innerHTML = BOX_COUNT - i + 1;
      i -= 1;
    }
  }
  var interval = setInterval(frame,100);
}

function shuffle(rowNum) {
  var numArr = []
  for(var i = 1; i <= BOX_COUNT; i++)
  {
    numArr.push(i);
  }
  var i = 1;
  function frame() {
    var random_idx = Math.floor(Math.random()*numArr.length);
    document.getElementById('row' + rowNum + 'box' + i).innerHTML = numArr[random_idx];
    numArr.splice(random_idx,1);
    if(numArr.length === 0){
      clearInterval(interval);
    } else {
      i++;
    }
  }
  var interval = setInterval(frame,100);
}

// Sorting algorithms ==========================================================

function bubbleSort(rowNum) {
  var startTime = new Date().getTime();
  var operationCount = 0;
  var sorted = false;
  var swapCount = 0;
  var i = 1;
  function frame() {
    //Check whether index has reached the end, reset i
    if (i == BOX_COUNT) {
      i = 1;
      //Check whether the list is sorted
      if (swapCount == 0) {
        sorted = true;
      } else {
        swapCount = 0
      }
    } else {
      //If index hasn't reached the end, sort two adjacent boxes and highlight them
      operationCount++;
      var j = i + 1;
      var leftBox = document.getElementById('row' + rowNum + 'box' + i);
      var rightBox = document.getElementById('row' + rowNum + 'box' + j);
      var left = Number(leftBox.innerHTML);
      var right = Number(rightBox.innerHTML);

      if (left > right) {
        leftBox.style.backgroundColor = '#FCD116';
        rightBox.style.backgroundColor = '#FCD116';
        leftBox.innerHTML = right;
        rightBox.innerHTML = left;
        swapCount++;
      } else {
        leftBox.style.backgroundColor = '#FAFAD2';
        rightBox.style.backgroundColor = '#FAFAD2';
      }
      //Make sure other boxes are white
      setBoxesWhite(i,j,rowNum)
      i++;
    }
    //The following is the end statement to setInterval
    if (sorted) {
      clearInterval(interval);
      var endTime = new Date().getTime();
      var time = (endTime - startTime)/1000;
      console.log("Bubble sort's computational complexity: operationCount = " + operationCount)
      console.log("Bubble sort has taken " + time + " seconds to complete execution.")
      setBoxesWhite(0,0,rowNum);
    }
  }
  var interval = setInterval(frame,DELAY_TIME);
}

function insertToArray(inputArr, from_idx, to_idx) {
  var holder = inputArr[from_idx];
  for (var i = from_idx; i > to_idx; i--) {
    inputArr[i] = inputArr[i - 1];
  }
  inputArr[to_idx] = holder;
  return inputArr;
}

function insertionSort(rowNum) {
  var startTime = new Date().getTime();
  var operationCount = 0;
  var i = 2;
  function frame() {
    setAllWhite(rowNum);
    if (i <= BOX_COUNT) {
      var currentBox = document.getElementById('row' + rowNum + 'box' + i);
      var value = Number(currentBox.innerHTML);
      currentBox.style.backgroundColor = '#FCD116';
      console.log("Insertion sort - currently at box" + i + " with value: " + value);
      for (var j = 1; j < i; j++) {
        var inspectBox = document.getElementById('row' + rowNum + 'box' + j);
        var inspectValue = Number(inspectBox.innerHTML);

        if (value <= inspectValue) {
          highlightBoxes(j,i,rowNum);
          inspectBox.style.backgroundColor = '#FCD116';
          var numArr = getArray(rowNum);
          var newArr = insertToArray(numArr,i-1,j-1)
          for (var k = 0; k < newArr.length; k++) {
            document.getElementById('row' + rowNum + 'box' + (k+1)).innerHTML = newArr[k];
          }
          console.log('insert box'+ i + ' at box' + j);
          break;
        } else { //continue to inspect
          console.log('Inspecting box'+ j + " with value: " + inspectValue);
        }
        operationCount++;
      }
      i++;
    } else {
      clearInterval(interval);
      var endTime = new Date().getTime();
      var time = (endTime - startTime)/1000;
      console.log("Insertion sort's computational complexity: operationCount = " + operationCount)
      console.log("Insertion sort has taken " + time + " seconds to complete execution.")
    }
  }
  var interval = setInterval(frame,6*DELAY_TIME);
}

// Recursive merge sort
function mergeSort(arr) {
  if (arr.length > 1) {
    var midpoint = Math.floor(arr.length/2);
    var lowHalf = mergeSort(arr.slice(0,midpoint));
    var highHalf = mergeSort(arr.slice(midpoint,arr.length));
    return merge(lowHalf,highHalf);
  } else {
    return arr;
  }
}

function merge(arr1, arr2) {
  var merged = [];
  var iterations = arr1.length + arr2.length;
  for (var i = 0; i < iterations; i++) {
    if (arr1.length === 0) {
      return merged.concat(arr2);
    } else if (arr2.length === 0) {
      return merged.concat(arr1);
    } else {
      if (arr1[0] < arr2[0]) {
        merged.push(arr1.shift());
      } else {
        merged.push(arr2.shift());
      }
    }
  }
  return merged;
}

function highLightGroup(groupSize,rowNum) {
  setAllWhite(rowNum);
  var yellow = '#FAFAD2';
  var orange = '#FCD116';
  // Divide elements into groups of 2,4,8,16,etc...
  // and give them alternating colors
  var setYellow = true;
  var setOrange = true;
  for (var i = 1; i <= BOX_COUNT; i += groupSize) {
    var iBox = document.getElementById('row' + rowNum + 'box' + i);
    if (setYellow) {
      iBox.style.backgroundColor = yellow;
      for (var j = 1; j < groupSize; j++) {
        if (i+j <= BOX_COUNT) {
          var adjBox = document.getElementById('row' + rowNum + 'box' + (i+j));
          adjBox.style.backgroundColor = yellow;
        }
      }
      setYellow = false;
      setOrange = true;
    } else if (setOrange) {
      iBox.style.backgroundColor = orange;
      for (var j = 1; j < groupSize; j++) {
        if (i+j <= BOX_COUNT) {
          var adjBox = document.getElementById('row' + rowNum + 'box' + (i+j));
          adjBox.style.backgroundColor = orange;
        }
      }
      setYellow = true;
      setOrange = false;
    }
  }
}

function iterativeMergeSort(rowNum) {
  // Setup: divide elements into groups of 1, give them alternating colors
  var groupSize = 1;
  // Animate the process of merging small groups into bigger groups
  // merge 1's into 2's, merge 2's into 4's, merge 4's into 8's so on...
  function mergeFrame() {
    highLightGroup(groupSize,rowNum);
    var numArr = getArray(rowNum);
    if (groupSize >= BOX_COUNT) {
      clearInterval(interval);
      setAllWhite(rowNum);
    } else {
      var merged = []
      for (var i = 0; i <= BOX_COUNT; i += 2*groupSize) {
        var subarr1 = numArr.slice(i,i+groupSize);
        var subarr2 = numArr.slice(i+groupSize, i+groupSize+groupSize);
        merged = merged.concat(merge(subarr1,subarr2));
      }
      showArray(merged,rowNum);
    }
    groupSize *= 2;
  }
  //setTimeout(mergeFrame,500);
  var interval = setInterval(mergeFrame,1000);
}

function quickSort(array) {
  if (array.length <= 1) {
    return array;
  } else {
    // take last element out for pivot
    var pivot = [array.pop()];
    var leftWall = [];
    var rightWall = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i] <= pivot[0]) {
        leftWall.push(array[i]);
      } else {
        rightWall.push(array[i]);
      }
    }
    leftWall = quickSort(leftWall);
    rightWall = quickSort(rightWall);
    return leftWall.concat(pivot,rightWall);
  }
}

function testMerge() {
  arr = [];
  for (var i = 0; i < 10; i++) {
    arr.push(Math.floor(Math.random()*100));
  }
  console.log(arr);
  console.log(mergeSort(arr));
}

function testQuick() {
  arr = [];
  for (var i = 0; i < 10; i++) {
    arr.push(Math.floor(Math.random()*100));
  }
  console.log(arr);
  console.log(quickSort(arr));
}

// Helper functions ============================================================

// Set boxes white except boxes with index i and j in a given row
function setBoxesWhite(i,j,rowNum) {
  for (var k = 1; k <= BOX_COUNT; k++) {
    if (k != i && k != j) {
      document.getElementById('row' + rowNum + 'box' + k).style.backgroundColor = '#FFFFFF';
    }
  }
}
// Set every box white in a given row
function setAllWhite(rowNum) {
  for (var k = 1; k <= BOX_COUNT; k++) {
    document.getElementById('row' + rowNum + 'box' + k).style.backgroundColor = '#FFFFFF';
  }
}
// Highlight a series of boxes from a starting number to an ending number
function highlightBoxes(boxNum_start,boxNum_end,rowNum) {
  for(var boxNum = boxNum_start; boxNum <= boxNum_end; boxNum ++) {
    document.getElementById('row' + rowNum + 'box' + boxNum).style.backgroundColor = '#FAFAD2';
  }
}
//Return an array of numbers from the box labels of a given row
function getArray(rowNum) {
  var numArr = [];
  for (var i = 1; i <= BOX_COUNT; i++) {
    numArr.push(Number(document.getElementById('row' + rowNum + 'box' + i).innerHTML));
  }
  return numArr;
}

function showArray(inputArr, rowNum) {
  for (var i = 1; i <= BOX_COUNT; i++) {
    document.getElementById('row' + rowNum + 'box' + i).innerHTML = String(inputArr[i-1]);
  }
}
