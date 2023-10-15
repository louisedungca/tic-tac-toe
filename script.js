const board = document.querySelector("#board");
const mainText = document.querySelector("h1");
const message = document.querySelector(".message");
const playerSelect = document.querySelector(".player-select");
const playerButton = document.querySelectorAll(".player-button");
const historyButton = document.querySelector(".history-button");
const previousButton = document.querySelector(".previous-button");
const nextButton = document.querySelector(".next-button");
const resetButton = document.querySelector(".reset-button");
const playContainer = document.querySelector(".play-container");
const historyContainer = document.querySelector(".history-container");

const cells = [];
const moves = [];

const boardState = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

const winningMoves = [
  [[0, 0], [0, 1], [0, 2]], // First row win
  [[1, 0], [1, 1], [1, 2]], // Second row
  [[2, 0], [2, 1], [2, 2]], // Third row

  [[0, 0], [1, 0], [2, 0]], // First col win
  [[0, 1], [1, 1], [2, 1]], // Second col
  [[0, 2], [1, 2], [2, 2]], // Third col

  [[0, 0], [1, 1], [2, 2]], // Diagonal: top-left to bottom-right
  [[0, 2], [1, 1], [2, 0]], // Diagonal: top-right to bottom-left
];

const describeCell = [
  ["upper-left cell", "upper-center cell", "upper-right cell"],
  ["middle-left cell", "middle-center cell", "middle-right cell"],
  ["lower-left cell", "lower-center cell", "lower-right cell"]
];

let currentPlayer = "";
let currentMove = -1;
let gameActive = false;
let gameOver = false;

// Board creation
function createBoard() {
  for (row = 0; row < 3; row++) {
    for (col = 0; col < 3; col++) {
      const cell = document.createElement("input");
      // <input type="button" class="cell" data-row="0">
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;

      board.appendChild(cell);
      cells.push(cell);
      cell.addEventListener("click", clickedCell);
    };
  };
};

// Selection of players
playerButton.forEach(button => {
  button.addEventListener("click", () => {
    selectPlayer(button.value);
  });
});

function selectPlayer(player) {
  currentPlayer = player;
  playerSelect.style.display = "none";
  playContainer.style.display = "block";
  mainText.innerText = "Let's play!";
  gameActive = true;

  // console.log(`Player 1: "${currentPlayer}"`);
};

// Clicking each cell
function clickedCell(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  if (!gameActive) return;
  if (boardState[row][col] !== "") return;

  event.target.value = currentPlayer;
  event.target.id = "disable-cell"; // @css pointer-events: none;
  boardState[row][col] = currentPlayer;

  moves.push({ symbol: currentPlayer, row, col });
  currentMove = moves.length - 1; // index of moves array

  checkWin();
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updatePrevNextBtns();

  // console.log("Board State:", boardState);
  // console.log("Moves:", moves);
};

function checkWin() {
  const winningPattern = winningMoves.find(pattern => {
    const [a, b, c] = pattern;
    const [rowA, colA] = a;
    const [rowB, colB] = b;
    const [rowC, colC] = c;

    return (
      boardState[rowA][colA] !== "" &&
      boardState[rowA][colA] === boardState[rowB][colB] &&
      boardState[rowA][colA] === boardState[rowC][colC]
    );
  });

  // console.log("Winning Pattern:", winningPattern);

  if (winningPattern) {
    const [a, b, c] = winningPattern;
    const [rowA, colA] = a;
    const winner = boardState[rowA][colA];

    winningPattern.forEach(coordinates => {
      const [row, col] = coordinates;
      const cell = cells[row * 3 + col]; // to get cells array index
      cell.classList.add("winning-cell");
    });

    gameActive = false;
    gameOver = true;
    message.textContent = `${winner} has won!`;
    mainText.innerText = "Tic Tac Toe";
    showButtons();
  }

  else if (moves.length === 9 && !gameOver) {
    gameActive = false;
    gameOver = true;
    message.textContent = "It's a draw!";
    mainText.innerText = "Tic Tac Toe";
    showButtons();
  }

  // console.log("Last Player:", currentPlayer);
}

function showButtons() {
  historyButton.style.display = "flex";
  previousButton.style.display = "flex";
  nextButton.style.display = "flex";
  
  cells.forEach(cell => {
    cell.id = "disable-cell";
  });
};  

function showHistory() {
  historyContainer.classList.toggle("active");
  historyContainer.innerHTML = "";

  moves.forEach((move, index) => {
    const moveText = document.createElement("p");
    moveText.textContent = `${index + 1}: ${describeMove(move)}`;
    historyContainer.appendChild(moveText);

    // console.log(`(History Log) ${index + 1}: ${describeMove(move)}`);
  });
}

function describeMove(move) {
  // ref: moves.push({ symbol: currentPlayer, row, col});
  const symbol = move.symbol;
  const cellMove = describeCell[move.row][move.col];

  return `"${symbol}" was placed in the ${cellMove}.`;
};

// Previous and next move feature
function prevMove() {
  if (gameOver && currentMove > 0) {
    cells.forEach(cell => {
      cell.classList.remove("winning-cell");
    });
    currentMove--;
    updateBoardState();
  }
};

function nextMove() {
  if (gameOver && currentMove < moves.length - 1) {
    currentMove++;
    updateBoardState();
  }
};

function updateBoardState() {
  cells.forEach(cell => cell.value = "");

  for (i = 0; i <= currentMove; i++) {
    const move = moves[i];
    // ref: Moves[0]: { symbol: currentPlayer, row, col}
    const { symbol, row, col } = move;
    cells[row * 3 + col].value = symbol;
  }

  updatePrevNextBtns();
};

function updatePrevNextBtns() {
  if (currentMove <= 0) {
    previousButton.id = "disable-btn";
  }

  else {
    previousButton.id = "";
  }

  if (currentMove >= moves.length - 1) {
    nextButton.id = "disable-btn";
    checkWin();
  }

  else {
    nextButton.id = "";
  }
}

function resetGame() {
  boardState.forEach(row => row.fill(""));
  cells.forEach(cell => {
    cell.value = "";
    cell.classList.remove("winning-cell");
    cell.removeAttribute("id");
  });

  currentPlayer = "";
  currentMove = -1;
  moves.length = 0;
  gameActive = false;
  gameOver = false;

  message.textContent = "";
  historyContainer.innerHTML = "";
  mainText.innerText = "Tic Tac Toe";
  playerSelect.style.display = "flex";
  playContainer.style.display = "none";
  historyButton.style.display = "none";
  previousButton.style.display = "none";  
  nextButton.style.display = "none";
  historyContainer.classList.remove("active");

  // @console
  // console.log("Cells (reset):", cells);
  // console.log("Moves (reset):", moves);
  // console.log("Board State (reset):", boardState);
};


createBoard();
historyButton.addEventListener("click", showHistory);
previousButton.addEventListener("click", prevMove);
nextButton.addEventListener("click", nextMove);
resetButton.addEventListener("click", resetGame);


// @console 
// console.log("Cells:", cells);
// console.log("Board State (initial):", boardState);
// console.log("Moves (initial):", moves);
