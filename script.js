const puzzelRowCellSize = 3;
const puzzelSize = puzzelRowCellSize * puzzelRowCellSize;
let puzzel = [];

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

while (puzzel.length < puzzelSize) {
    let isSameWithIndex = false;
    let random = randomBetween(1, puzzelSize);
    for (let i = 0; i < puzzel.length; i++) {
        if (puzzel[i] == random) {
            isSameWithIndex = true
        }
    }
    if (isSameWithIndex == false)
        puzzel.push(random);
}

console.log({puzzel});


const puzzle_2D = [];
let index = 0;

for (let i = 0; i < puzzelRowCellSize; i++) {
    const U = [];
    for (let j = index; j < index + puzzelRowCellSize; j++) {
        U.push(puzzel[j]);
    }
    puzzle_2D.push(U);
    index += puzzelRowCellSize;
}

console.log({puzzle_2D});


function generate_puzzle() {
    let tbl = document.createElement("table");
    tbl.setAttribute("id", "table");
    tbl.setAttribute("border", "1");

    for (let i = 0; i < puzzelRowCellSize; i++) {
        const tr = document.createElement("tr");
        tr.setAttribute("data-index",i);
        for (let j = 0; j < puzzelRowCellSize; j++) {
            const td = document.createElement("td");
            td.setAttribute("data-row-index",i);
            td.setAttribute("data-index",j);
            if (puzzle_2D[i][j] != puzzelSize)
                td.textContent = puzzle_2D[i][j];
            else
                td.textContent = "";
            td.addEventListener("click", handleItemClick);
            tr.appendChild(td);
        }
        tbl.appendChild(tr)
    }
    document.getElementById("puzzle").appendChild(tbl);
}

function checkPuzzleSolved() {
    let isSolved = true;
    let index = 0;
    for (let i = 0; i < puzzelRowCellSize; i++) {
        for (let j = 0; j < puzzelRowCellSize; j++){
             if (puzzle_2D[i][j] !== index) {
                isSolved = false;
                break;
             }
        }
    }
    
    if (isSolved) {
        document.querySelector("#app").append("you win");
        document.querySelectorAll('td').forEach(td=> {
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
    puzzle_2D[clickedRowIndex][clickedColIndex] = puzzelSize;
}

function handleItemClick(e) {
    const rowIndex = +e.target.dataset.rowIndex;
    const cellIndex = +e.target.dataset.index;
    
    if (puzzle_2D[rowIndex][cellIndex] === puzzelSize) return;

    if (puzzle_2D[rowIndex]?.[cellIndex + 1] === puzzelSize) {
        moveButton(e.target, rowIndex, cellIndex + 1);
    }
    if (puzzle_2D[rowIndex]?.[cellIndex - 1] == puzzelSize) {
        moveButton(e.target, rowIndex, cellIndex - 1);
    }
    if (puzzle_2D[rowIndex - 1]?.[cellIndex] == puzzelSize) {
        moveButton(e.target, rowIndex - 1, cellIndex);
    }
    if (puzzle_2D[rowIndex + 1]?.[cellIndex] == puzzelSize) {
        moveButton(e.target, rowIndex + 1, cellIndex);
    }
    checkPuzzleSolved();
}

generate_puzzle();