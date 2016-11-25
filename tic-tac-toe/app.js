// global variables
var boardElement = document.getElementById('board');
var dashboard = document.getElementById('dashboard');

// objects
var board = {
  board: [],
  init: function() {
    this.initializeBoard();
    this.render();
  },
  initializeBoard: function() {
    for(var i = 0; i < 9; i++) {
      this.board[i] = 'blank';
      var newDiv = document.createElement('div');
      newDiv.id = "box" + (i + 1);
      boardElement.appendChild(newDiv);
    }
  },
  render: function() {
    var children = boardElement.children;
    for(var i = 0; i < children.length; i++) {
      children[i].className = board.board[i];
    }
  },
  checkForGameOver: function() {
    if(this.full()) {
      this.renderGameOver(false);
    } else if(this.diagonalVictory() 
            || this.rowVictory() 
            || this.columnVictory()) {
      this.renderGameOver(game.currentPlayer);
    } else {
      return false;
    }
  },
  full: function() {
    var full = true;
    for(var box in this.board) {
      if(this.board[box] === 'blank') {
        full = false;
      } 
    }
    return full;
  },
  rowVictory: function() {
    let row1 = [this.board[0], this.board[1], this.board[2]];
    let row2 = [this.board[3], this.board[4], this.board[5]];
    let row3 = [this.board[6], this.board[7], this.board[8]];
    if (this.hasSameSymbol(row1, game.currentPlayer)) { return true; } 
    if (this.hasSameSymbol(row2, game.currentPlayer)) { return true; } 
    if (this.hasSameSymbol(row3, game.currentPlayer)) { return true; } 
    return false; 
  },
  columnVictory: function() {
    let col1 = [this.board[0], this.board[3], this.board[6]];
    let col2 = [this.board[1], this.board[4], this.board[7]];
    let col3 = [this.board[2], this.board[5], this.board[8]];
    if (this.hasSameSymbol(col1, game.currentPlayer)) { return true; } 
    if (this.hasSameSymbol(col2, game.currentPlayer)) { return true; }  
    if (this.hasSameSymbol(col3, game.currentPlayer)) { return true; } 
    return false;
  },
  diagonalVictory: function() {
    let a1C3 = [this.board[0], this.board[4], this.board[8]];
    let c1A3 = [this.board[6], this.board[4], this.board[2]];
    if (this.hasSameSymbol(a1C3, game.currentPlayer)) { return true; }  
    if (this.hasSameSymbol(c1A3, game.currentPlayer)) { return true; } 
    return false;
  },
  hasSameSymbol: function(tripletArray, player) {
    if(tripletArray[0] === player 
      && tripletArray[1] === player
      && tripletArray[2] === player) {
      return true;
    } else {
      return false;
    }
  },
  renderGameOver: function(winner) {
    dashboard.innerHTML = "";
    boardElement.innerHTML = "";
    boardElement.style.border = "none";
    var output = "Game Over! ";
    if(winner) {
      output += winner === game.player1 ? 
          "Player 1 (" + game.player1.toUpperCase() + ")": 
          "Player 2 (" + game.player2.toUpperCase() + ")";
      output += " wins!"
    } else {
      output += "It's a tie!";
    }
    var outputElement = document.createElement('p');
    var reload = document.createElement('a');
    outputElement.className = 'game-over';
    reload.className = 'reload';
    boardElement.appendChild(outputElement);
    outputElement.innerHTML = output;
    boardElement.appendChild(reload);
    reload.innerHTML = "Play Again";
    reload.setAttribute('href', 'index.html');
  }
} 

var game = {
  currentPlayer: null,
  player1: null,
  player2: null,
  run: function() {
    this.choosePlayers();
    board.init.call(board);
    this.renderUpdate();
    this.listen();
  },
  renderUpdate: function() {
    let output = 'Current Player: ' + this.currentPlayer.toUpperCase();
    dashboard.innerHTML = output;
  },
  choosePlayers: function() {
    let playerSymbols = ['x', 'o'];
    let randomNumber = Math.round(Math.random());
    this.player1 = playerSymbols.splice(randomNumber,1).toString();
    this.player2 = playerSymbols[0];
    this.currentPlayer = this.player1;  
  },
  switchPlayers: function() {
    let player1 = this.player1;
    let player2 = this.player2;
    this.currentPlayer = this.currentPlayer === this.player1 ? player2 : player1;
  },
  processTurn: function(boardIndex) {
    board.board[boardIndex] = this.currentPlayer;
    console.log(board.board);
    board.render.call(board);
    board.checkForGameOver.call(board);
    this.switchPlayers();
    this.renderUpdate();
    this.listen();
  },
  listen: function() {
    boardElement.addEventListener('click', function(event) {
      if(event.target.classList.contains('blank')) {
        let id = event.target.id;
        let index = (id.charAt(id.length - 1) - 1);
        console.log(index);
        game.processTurn(index);
      }
    }); 
  }
}

// run game
game.run.call(game);