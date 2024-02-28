const puzzleRowCellSize = 3;
const puzzleSize = puzzleRowCellSize * puzzleRowCellSize;
let puzzle = [];

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

while (puzzle.length < puzzleSize) {
    let isSameWithIndex = false;
    let random = randomBetween(1, puzzleSize);
    for (let i = 0; i < puzzle.length; i++) {
        if (puzzle[i] === random) {
            isSameWithIndex = true;
        }
    }
    if (isSameWithIndex === false)
        puzzle.push(random);
}


const puzzle_2D = [];
let index = 0;

for (let i = 0; i < puzzleRowCellSize; i++) {
    const U = [];
    for (let j = index; j < index + puzzleRowCellSize; j++) {
        U.push(puzzle[j]);
    }
    puzzle_2D.push(U);
    index += puzzleRowCellSize;
}

function generate_puzzle() {
    let tbl = document.createElement("table");
    tbl.setAttribute("id", "table");
    tbl.setAttribute("border", "1");

    for (let i = 0; i < puzzleRowCellSize; i++) {
        const tr = document.createElement('tr');
        tr.setAttribute('data-index', i.toString());
        for (let j = 0; j < puzzleRowCellSize; j++) {
            const td = document.createElement('td');
            td.setAttribute('data-row-index', i.toString());
            td.setAttribute('data-index', j.toString());
            if (puzzle_2D[i][j] !== puzzleSize)
                td.textContent = puzzle_2D[i][j];
            else
                td.textContent = '';
            td.addEventListener('click', handleItemClick);
            tr.appendChild(td);
        }
        tbl.appendChild(tr)
    }
    document.getElementById("puzzle").appendChild(tbl);
}

function checkPuzzleSolved() {
    let isSolved = true;
    let index = 0;
    for (let i = 0; i < puzzleRowCellSize; i++) {
        for (let j = 0; j < puzzleRowCellSize; j++) {
            if (puzzle_2D[i][j] !== index) {
                isSolved = false;
                break;
            }
        }
    }

    if (isSolved) {
        document.querySelector('#app').append('you win');
        document.querySelectorAll('td').forEach(td => {
            td.removeEventListener("click", handleItemClick);
        });
    }
}

function moveButton(target, newRowIndex, newColIndex) {
    const clickedRowIndex = +target.dataset.rowIndex;
    const clickedColIndex = +target.dataset.index;

    const table = document.querySelector("#table");
    const row = table.rows[clickedRowIndex]
    const cell = row.cells[clickedColIndex];
    
    table.rows[newRowIndex].cells[newColIndex].textContent = cell.textContent;
    cell.textContent = "";
    puzzle_2D[newRowIndex][newColIndex] = puzzle_2D[clickedRowIndex][clickedColIndex];
    puzzle_2D[clickedRowIndex][clickedColIndex] = puzzleSize;
}

function handleItemClick(e) {
    const rowIndex = +e.target.dataset.rowIndex;
    const cellIndex = +e.target.dataset.index;

    if (puzzle_2D[rowIndex][cellIndex] === puzzleSize) return;

    if (puzzle_2D[rowIndex]?.[cellIndex + 1] === puzzleSize) {
        moveButton(e.target, rowIndex, cellIndex + 1);
    }
    if (puzzle_2D[rowIndex]?.[cellIndex - 1] === puzzleSize) {
        moveButton(e.target, rowIndex, cellIndex - 1);
    }
    if (puzzle_2D[rowIndex - 1]?.[cellIndex] === puzzleSize) {
        moveButton(e.target, rowIndex - 1, cellIndex);
    }
    if (puzzle_2D[rowIndex + 1]?.[cellIndex] === puzzleSize) {
        moveButton(e.target, rowIndex + 1, cellIndex);
    }
    checkPuzzleSolved();
}

generate_puzzle();