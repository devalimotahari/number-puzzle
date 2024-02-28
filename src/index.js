import { emptyCellChar, puzzleElement, puzzleRowCellSize, puzzleSize } from './constants';
import { randomBetween } from './utils';
import { shufflePuzzle } from './shuffle';

let targetPuzzle2D = [];
let puzzle_2D = [];

function generatePuzzleTemplateView(targetElement) {
  for (let i = 0; i < puzzleRowCellSize; i++) {
    targetPuzzle2D.push(Array.from(new Array(puzzleRowCellSize), () => emptyCellChar));
  }

  const container = document.createElement('div');
  container.setAttribute('id', 'container-template-table');

  let tbl = document.createElement('table');
  tbl.setAttribute('id', 'template-table');
  tbl.classList.add('table');
  tbl.setAttribute('border', '1');


  const title = document.createElement('p');
  title.textContent = `leave empty cell with: '${emptyCellChar}'`;
  container.appendChild(title);

  container.appendChild(tbl);
  for (let i = 0; i < puzzleRowCellSize; i++) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-index', i.toString());
    for (let j = 0; j < puzzleRowCellSize; j++) {
      const td = document.createElement('td');
      td.setAttribute('data-row-index', i.toString());
      td.setAttribute('data-index', j.toString());
      const inputEl = document.createElement('input');
      inputEl.setAttribute('type', 'number');
      if (i === 0 && j === 0) {
        inputEl.setAttribute('autofocus', 'true');
      }
      inputEl.addEventListener('change', handleTemplateInputChange);
      td.appendChild(inputEl);
      tr.appendChild(td);
    }
    tbl.appendChild(tr);
  }
  const submitBtn = document.createElement('button');
  submitBtn.setAttribute('id', 'template-submit-btn');
  submitBtn.textContent = 'ثبت';
  submitBtn.addEventListener('click', handleTemplateSubmitButtonClick);
  tbl.appendChild(submitBtn);
  targetElement.appendChild(container);
}

function handleTemplateSubmitButtonClick(e) {
  const submitBtnEl = document.querySelector('#template-submit-btn');
  const templateTableEl = document.querySelector('#container-template-table');

  submitBtnEl.removeEventListener('click', handleTemplateSubmitButtonClick);

  puzzle_2D = shufflePuzzle(targetPuzzle2D);
  console.log({ targetPuzzle2D, puzzle_2D });

  templateTableEl.remove();

  generatePuzzleView();

  generateTargetPuzzleView(puzzleElement);
}

function handleTemplateInputChange(e) {
  const td = e.target.parentElement;
  const val = isNaN(e.target.valueAsNumber) ? e.target.value : e.target.valueAsNumber;

  console.log({ val });

  const rowIndex = +td.dataset.rowIndex;
  const cellIndex = +td.dataset.index;

  targetPuzzle2D[rowIndex][cellIndex] = val;
}

function generatePuzzleArray() {
  let index = 1;

  targetPuzzle2D = new Array(puzzleRowCellSize);
  for (let i = 0; i < puzzleRowCellSize; i++) {
    targetPuzzle2D[i] = new Array(puzzleRowCellSize);
  }

  for (let i = 0; i < puzzleRowCellSize; i++) {
    for (let j = 0; j < puzzleRowCellSize; j++) {
      targetPuzzle2D[i][j] = index++;
    }
  }

  index = 0;

  const puzzle = [];

  while (puzzle.length < puzzleSize) {
    let isSameWithIndex = false;
    let random = randomBetween(1, puzzleSize);
    for (let i = 0; i < puzzle.length; i++) {
      if (puzzle[i] === random) {
        isSameWithIndex = true;
      }
    }
    if (isSameWithIndex === false) puzzle.push(random);
  }

  for (let i = 0; i < puzzleRowCellSize; i++) {
    const U = [];
    for (let j = index; j < index + puzzleRowCellSize; j++) {
      U.push(puzzle[j]);
    }
    puzzle_2D.push(U);
    index += puzzleRowCellSize;
  }
}

function generatePuzzleView() {
  let tbl = document.createElement('table');
  tbl.classList.add('table');
  tbl.setAttribute('id', 'table');
  tbl.setAttribute('border', '1');

  for (let i = 0; i < puzzleRowCellSize; i++) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-index', i.toString());
    for (let j = 0; j < puzzleRowCellSize; j++) {
      const td = document.createElement('td');
      td.setAttribute('data-row-index', i.toString());
      td.setAttribute('data-index', j.toString());
      if (puzzle_2D[i][j] === emptyCellChar)
        td.textContent = '';
      else td.textContent = puzzle_2D[i][j];
      td.addEventListener('click', handleItemClick);
      tr.appendChild(td);
    }
    tbl.appendChild(tr);
  }
  puzzleElement.appendChild(tbl);
}

function checkPuzzleSolved() {
  let isSolved = true;
  for (let i = 0; i < puzzleRowCellSize; i++) {
    for (let j = 0; j < puzzleRowCellSize; j++) {
      if (puzzle_2D[i][j] !== targetPuzzle2D[i][j]) {
        isSolved = false;
        break;
      }
    }
  }

  if (isSolved) {
    document.querySelectorAll('td').forEach(td => {
      td.removeEventListener('click', handleItemClick);
    });
    document.querySelector('#app').append('you win');
    alert('you win!');
  }
}

function moveButton(target, newRowIndex, newColIndex) {
  const clickedRowIndex = +target.dataset.rowIndex;
  const clickedColIndex = +target.dataset.index;

  const table = document.querySelector('#table');
  const row = table.rows[clickedRowIndex];
  const cell = row.cells[clickedColIndex];

  table.rows[newRowIndex].cells[newColIndex].textContent = cell.textContent;
  cell.textContent = '';
  puzzle_2D[newRowIndex][newColIndex] = puzzle_2D[clickedRowIndex][clickedColIndex];
  puzzle_2D[clickedRowIndex][clickedColIndex] = emptyCellChar;
}

function handleItemClick(e) {
  const rowIndex = +e.target.dataset.rowIndex;
  const cellIndex = +e.target.dataset.index;

  if (puzzle_2D[rowIndex][cellIndex] === emptyCellChar) return;

  if (puzzle_2D[rowIndex]?.[cellIndex + 1] === emptyCellChar) {
    moveButton(e.target, rowIndex, cellIndex + 1);
  }
  if (puzzle_2D[rowIndex]?.[cellIndex - 1] === emptyCellChar) {
    moveButton(e.target, rowIndex, cellIndex - 1);
  }
  if (puzzle_2D[rowIndex - 1]?.[cellIndex] === emptyCellChar) {
    moveButton(e.target, rowIndex - 1, cellIndex);
  }
  if (puzzle_2D[rowIndex + 1]?.[cellIndex] === emptyCellChar) {
    moveButton(e.target, rowIndex + 1, cellIndex);
  }
  checkPuzzleSolved();
}

function generateTargetPuzzleView(targetElement) {
  const container = document.createElement('div');
  const title = document.createElement('p');
  title.textContent = 'Target puzzle:';

  container.appendChild(title);

  let tbl = document.createElement('table');
  tbl.setAttribute('id', 'target-table');
  tbl.classList.add('table');
  tbl.setAttribute('border', '1');

  container.appendChild(tbl);

  for (let i = 0; i < puzzleRowCellSize; i++) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-index', i.toString());
    for (let j = 0; j < puzzleRowCellSize; j++) {
      const td = document.createElement('td');
      td.setAttribute('data-row-index', i.toString());
      td.setAttribute('data-index', j.toString());
      if (targetPuzzle2D[i][j] === emptyCellChar)
        td.textContent = '';
      else td.textContent = targetPuzzle2D[i][j];
      tr.appendChild(td);
    }
    tbl.appendChild(tr);
  }

  const brEl = document.createElement('br');
  targetElement.appendChild(brEl);
  targetElement.appendChild(brEl);
  targetElement.appendChild(brEl);

  targetElement.appendChild(container);
}

function init() {
  const isCustom = confirm('do you want to set target puzzle?');

  if (isCustom) {
    generatePuzzleTemplateView(puzzleElement);
  } else {
    generatePuzzleArray();
    generatePuzzleView();
  }
}

init();