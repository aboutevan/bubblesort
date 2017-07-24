(function() {
  'use strict';
  var step = document.querySelector('.step');
  var instructions = document.querySelector('.instructions');
  var shuffle = document.querySelector('.shuffle');
  var play = document.querySelector('.play');

  var data;
  var current;
  var state = {
    preSorted: false,
    postSorted: false,
    complete: false,
  }


  function randomArray(length, min, max) {
    var integers = [];
    for (var i = 0; i < length; i++) {
      integers[i] = Math.round((max - min) * Math.random() + min);
    }
    return integers;
  }

  function renderData(data) {
    var table = document.querySelector('.data-table');
    var dataEntry;
    var dataEntryText;
    var dataEntrySpan;
    var tableElements = [];

    // clear children
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }

    // render rows
    data.forEach(function (val, i) {
      dataEntry = document.createElement('div');
      dataEntrySpan = document.createElement('span');
      dataEntryText = document.createTextNode(val);

      dataEntry.classList.add('data-entry');
      dataEntry.style.width = val + '%';
      dataEntry.dataset.value = val;

      dataEntry.appendChild(dataEntrySpan);
      dataEntrySpan.appendChild(dataEntryText);
      table.appendChild(dataEntry);

      tableElements.push(dataEntry);
    });

    // highlight rows
    tableElements.forEach(function(el, i) {
      if (state.complete) return;
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

  function steppedBubbleSort (arr) {
    for (var i = 0; i < arr.length; i++) {
      current = arr[i];
      // should swap
      if (arr[i] > arr[i + 1]) {
        if (!state.preSorted && !state.postSorted) {
          // pre swap
          state.preSorted = true;
          break;
        } else if (state.preSorted && !state.postSorted) {
          // swap
          var temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          state.preSorted = false;
          state.postSorted = true;
          break;
        } else {
          // post swap
          state.postSorted = false;
          break;
        }
      } else {
        // matched with last item
        if (i + 1 === arr.length) {
          state.complete = true;
          current = null;
        }
      }
    }
  }

  step.addEventListener('click', function () {
    steppedBubbleSort(data);
    renderData(data);
    if (state.complete) {
      this.classList.add('hide');
      play.classList.add('hide');
    }
  });

  shuffle.addEventListener('click', function () {
    instructions.innerHTML = 'Press the step button to step through the sort, or press the play button to animate the sort in one go.  If you want new data, press the shuffle button.';

    //reset state if called mid sort
    Object.keys(state).forEach(val => state[val] = false);
    if (step.classList.contains('hide')) step.classList.remove('hide');
    if (play.classList.contains('hide')) play.classList.remove('hide');

    // generate array
    data = randomArray(10, 0, 100);
    renderData(data);
  })

  play.addEventListener('click', function () {
    step.classList.add('hide');
    this.classList.add('hide');
    shuffle.disabled = true;

    var stepInterval = setInterval((function() {
      steppedBubbleSort(data);
      renderData(data);

      if (state.complete) {
        clearInterval(stepInterval);
        shuffle.disabled = false;
      }
    }).bind(this), 200);
  })
})();
