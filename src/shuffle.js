import { puzzleSize, shuffleRate } from './constants';

export function shufflePuzzle(basePuzzle) {
  const puzzle = structuredClone(basePuzzle);

  let emptyCellRow, emptyCellCol;
  for (let i = 0; i < puzzle.length; i++) {
    for (let j = 0; j < puzzle[i].length; j++) {
      if (puzzle[i][j] === puzzleSize) {
        emptyCellRow = i;
        emptyCellCol = j;
        break;
      }
    }
  }

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // up, down, left, right

  for (let i = 0; i < shuffleRate; i++) {
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const newRow = emptyCellRow + randomDirection[0];
    const newCol = emptyCellCol + randomDirection[1];

    if (newRow >= 0 && newRow < puzzle.length && newCol >= 0 && newCol < puzzle[0].length) {
      puzzle[emptyCellRow][emptyCellCol] = puzzle[newRow][newCol];
      puzzle[newRow][newCol] = puzzleSize;
      emptyCellRow = newRow;
      emptyCellCol = newCol;
    }
  }

  return puzzle;
}