const cells = document.querySelectorAll('.cell');

// Factory function for players
function createPlayer(name, mark) {
  let score = 0;
  return {name, mark, score};
}

// IIFE for the game options
const gameController = (function() {

  let turnCounter = 0;
  player1 = createPlayer('Bob', 'X');
  player2 = createPlayer('Dany', 'O');

  const newGame = function() {
    turnCounter = 0;
    gameBoard.emptyBoard();
  };

  const playerMove = function(index) {
    // Player play one after another
    if (turnCounter % 2) {
      player = player2;
    } else {
      player = player1;
    }
    // If this cell is empty
    if (!gameBoard.gameBoard[index]) {
      const boardState = gameBoard.addMark(player, index);
      turnCounter += 1;
      checkWinner(boardState, player);
    }
  };

  const checkWinner = function(boardState, player) {
    // Creating an array with all the winning possibility
    const winning = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    let marksMap = [];
    // Map all the marks of the player
    for(let i = 0; i < 9; i++) {
      if(boardState[i] === player.mark) {
        marksMap.push(i);
      }
    }

    // Check for victory
    for(let i = 0; i < winning.length; i++) {
      const [index1, index2, index3] = winning[i];
      if(marksMap.includes(index1) &&
      marksMap.includes(index2) &&
      marksMap.includes(index3)) {
        player.score += 1;
        newGame();
      }
    }

    // Else at turn 9 its a tie
    if(turnCounter === 9) {
      newGame();
    }

  };
  
  return {newGame, playerMove};
})();

// IIFE for gameBoard
const gameBoard = (function() {

  let gameBoard = new Array(9);

  const emptyBoard = function() {
    for(let i = 0; i < 9; i++) {
      gameBoard[i] = '';
      cells[i].textContent = '';
    }
  }

  const addMark = function(player, index) {
    gameBoard[index] = player.mark;
    const mark = document.createElement('img');
      if(player.mark === 'X') {
        mark.setAttribute('src', 'svg/X-mark.svg');
      } else {
        mark.setAttribute('src', 'svg/O-mark.svg');
      }
    cells[index].appendChild(mark);
    return gameBoard;
  }

  return {emptyBoard, addMark, gameBoard};
})();

for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener('click', (e) => {
    gameController.playerMove(i);
  });
}