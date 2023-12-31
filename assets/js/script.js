const GameBoard = () => {
  const board = [];

  const resetBoard = () => {
    for (let row = 0; row < 3; row++) {
      board[row] = [];
      for (let col = 0; col < 3; col++) {
        board[row].push(Cell());
      }
    }
  };

  resetBoard();

  const getBoard = () => board;

  const dropToken = (player, row, column) => {
    if (board[row][column].getValue() === "") {
      board[row][column].addToken(player);
    }
  };

  return { getBoard, dropToken, resetBoard };
};

const Cell = () => {
  let value = "";

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
};

const GameController = () => {
  const board = GameBoard();

  const players = [
    { name: "Player One", token: "X" },
    { name: "Player Two", token: "O" },
  ];

  let activePlayer = players[0];

  let winner = "";

  let isTie = false;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const setWinner = (player) => {
    winner = player;
  };

  const getWinner = () => winner;

  const setTie = (val) => {
    isTie = val;
  };

  const getTie = () => isTie;

  const getActivePlayer = () => activePlayer;

  const checkWinner = () => {
    const gridBoard = board.getBoard();

    const checkRow = (row) => {
      if (
        row[0].getValue() !== "" &&
        row[0].getValue() === row[1].getValue() &&
        row[0].getValue() === row[2].getValue()
      ) {
        return true;
      }
      return false;
    };

    const checkColumn = (col) => {
      if (
        gridBoard[0][col].getValue() !== "" &&
        gridBoard[0][col].getValue() === gridBoard[1][col].getValue() &&
        gridBoard[0][col].getValue() === gridBoard[2][col].getValue()
      ) {
        return true;
      }
      return false;
    };

    const checkDiagonalToRigth = () => {
      if (
        gridBoard[0][0].getValue() !== "" &&
        gridBoard[0][0].getValue() === gridBoard[1][1].getValue() &&
        gridBoard[0][0].getValue() === gridBoard[2][2].getValue()
      ) {
        return true;
      }
      return false;
    };

    const checkDiagonalToLeft = () => {
      if (
        gridBoard[0][2].getValue() !== "" &&
        gridBoard[0][2].getValue() === gridBoard[1][1].getValue() &&
        gridBoard[0][2].getValue() === gridBoard[2][0].getValue()
      ) {
        return true;
      }
      return false;
    };

    for (let row = 0; row < 3; row++) {
      if (checkRow(gridBoard[row])) return true;
    }

    for (let col = 0; col < 3; col++) {
      if (checkColumn(col)) return true;
    }

    if (checkDiagonalToRigth() || checkDiagonalToLeft()) {
      return true;
    }
  };

  const isComplete = () => {
    const gridBoard = board.getBoard();

    return gridBoard.every((row) => {
      return row.every((col) => {
        return col.getValue() !== "";
      });
    });
  };

  const resetGame = () => {
    board.resetBoard();
    activePlayer = players[0];
    setWinner("");
    setTie(false);
  };

  const setPlayerNames = (name1, name2) => {
    players[0].name = name1 || "Player One";
    players[1].name = name2 || "Plauer Two";
  };

  const playRound = (column, row) => {
    if (getWinner() === "") {
      board.dropToken(getActivePlayer().token, row, column);

      if (checkWinner()) {
        setWinner(getActivePlayer());
      } else if (isComplete()) {
        setTie(true);
      } else {
        switchPlayerTurn();
      }
    }
  };

  return {
    playRound,
    getActivePlayer,
    getWinner,
    setPlayerNames,
    getTie,
    resetGame,
    getBoard: board.getBoard,
  };
};

function ScreenController() {
  const game = GameController();
  const boardDiv = document.querySelector(".board");
  const resetBtn = document.querySelector(".resetBtn");
  const winText = document.querySelector(".winText");
  const startBtn = document.querySelector(".startBtn");
  const menuitem = document.querySelectorAll(".menuitem");
  const inputName1 = document.querySelector("#namep1");
  const inputName2 = document.querySelector("#namep2");

  const updateScreen = () => {
    printWin();

    boardDiv.textContent = "";
    const board = game.getBoard();

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("div");
        cellButton.classList.add("cell");

        cellButton.dataset.column = colIndex;
        cellButton.dataset.row = rowIndex;

        cellButton.textContent = cell.getValue();

        boardDiv.appendChild(cellButton);
      });
    });
  };

  const printWin = () => {
    if (game.getWinner() !== "") {
      resetBtn.className = "resetBtn active";
      winText.classList = "winText active";
      winText.textContent = `Congratulations! The Winner is ${
        game.getActivePlayer().name
      }`;
    } else if (game.getTie()) {
      resetBtn.className = "resetBtn active";
      winText.className = "winText active";
      winText.textContent = "It is a Tie!";
    }
  };

  const resetScreen = () => {
    resetBtn.className = "resetBtn inactive";
    winText.className = "winText inactive";
    game.resetGame();
    updateScreen();
  };

  const startGame = () => {
    game.setPlayerNames(inputName1.value, inputName2.value);

    menuitem.forEach((element) => {
      element.className = "menuitem inactive";
    });

    boardDiv.className = "board active";
  };

  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;

    if (!selectedColumn) return;

    game.playRound(selectedColumn, selectedRow);
    updateScreen();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);
  resetBtn.addEventListener("click", resetScreen);
  startBtn.addEventListener("click", startGame);

  updateScreen();
}

ScreenController();
