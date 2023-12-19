const cells = document.querySelectorAll('.cell');
const scores = document.querySelectorAll('.score');
const playersCreator = document.querySelector('form');
const overlay = document.querySelector('.create-player');
const slider = document.querySelector('.slider')

let player1 = {};
let player2 = {};

// Factory function for players
function createPlayer(name, mark) {
  let score = 0;
  return {name, mark, score};
}

// IIFE for the game options
const gameController = (function() {

  let turnCounter = 0;

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
        displayScore();
        newGame();
      }
    }

    // Else at turn 9 its a tie
    if(turnCounter === 9) {
      newGame();
      displayScore();
    }
  };

  const displayScore = function() {
    scores[0].textContent = player1.name + " score : " + player1.score;
    scores[1].textContent = player2.name + " score : " + player2.score;
  };

  return {newGame, playerMove, displayScore};
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

playersCreator.addEventListener('submit', (e)=> {
  e.preventDefault();
  const name1 = document.querySelector('#name1').value;
  const name2 = document.querySelector('#name2').value;
  player1 = createPlayer(name1, 'X');
  player2 = createPlayer(name2, 'O');
  gameController.displayScore();
  overlay.classList.add('transparent');
  setTimeout(function() {
    slider.classList.add('active');
  }, 1000);
  setTimeout(function() {
    overlay.style.display = 'none';
  }, 2000);
});

