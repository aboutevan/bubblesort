(function() {
'use strict';

var data = [7, 4, 5, 2, 9, 1];
var arrayNode = document.createElement('div');
var arrayTextNode = document.createTextNode(data);
var current;
var state = {
  preSorted: false,
  postSorted: false
}


function randomArray(length, min, max) {
  var integers = [];

  for (var i = 0; i < length; i++) {
    integers[i] = Math.round((max - min) * Math.random() + min);
  }

  // prevent repeats
  function shuffle(array) {
    var tmp, current, top = array.length;
    if(top) while(--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
    return array;
  }

  var shuffled = shuffle(integers);
  return shuffled;
}


function renderData(data) {
  var table = document.querySelector('.data-table');
  var dataEntry;
  var dataEntryText;
  var highlighted = false;
  var tableEls = [];

  // clear children
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  // render rows
  data.forEach(function (val, i) {
    dataEntry = document.createElement('div');
    dataEntry.classList.add('data-entry');

    dataEntry.style.width = val + '%';
    dataEntry.dataset.value = val;

    dataEntryText = document.createTextNode(val);
    dataEntry.appendChild(dataEntryText);
    table.appendChild(dataEntry);
    tableEls.push(dataEntry);
  });

  // highlight rows
    tableEls.forEach(function(el, i) {
      if (+el.dataset.value === current && (state.preSorted || state.postSorted)) {
        el.classList.add('highlight');
        if (state.preSorted) {
          if (el.nextSibling) el.nextSibling.classList.add('highlight');
        } else {
          if (el.previousSibling) el.previousSibling.classList.add('highlight');
        }
      }
    });
}

function bubbleSort(arr) {
  for (var i = 0, length = arr.length - 1; i < length; i++) {
    current = arr[i];
    if (arr[i] > arr[i + 1]) {
      if (!state.preSorted && !state.postSorted) {
        state.preSorted = true;
      } else if (state.preSorted && !state.postSorted) {
        var temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        state.preSorted = false;
        state.postSorted = true;
      } else {
        state.postSorted = false;
      }
      return;
    }
  }
  // var swapped;
  // do {
  //   swapped = false;
  //   for (var i = 0, length = arr.length - 1; i < length; i++) {
  //     if (arr[i] > arr[i + 1]) {
  //       var temp = arr[i];
  //       arr[i] = arr[i + 1];
  //       arr[i + 1] = temp;
  //       swapped = true;
  //     }
  //   }
  // }
  // while (swapped);
}

var step = document.querySelector('.step');
step.addEventListener('click', function () {
  bubbleSort(data);
  renderData(data);
});

var shuffle = document.querySelector('.shuffle');
shuffle.addEventListener('click', function () {
  data = randomArray(10, 0, 100);
  renderData(data);
})


})();
