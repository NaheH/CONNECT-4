

export class connect4 {
  constructor(selector, options) {
    this.ROWS = options.ROWS;
    this.COLS = options.COLS;
    this.player = options.p1;
    this.player1 = options.p1;
    this.player2 = options.p2;
    this.color = options.c1;
    this.color1 = options.c1;
    this.color2 = options.c2;
    this.selector = selector;
    this.isGameOver = false;
    this.onPlayerMove = function() {};
    this.createGrid();
    this.setupEventListeners();
    this.reset();
  }

  // Création d'une grille vide // 
  createGrid() {
    const $board = $(this.selector);
    $board.empty();
    this.isGameOver = false;
    for (let row = 0; row < this.ROWS; row++) {
      const $row = $('<div>')
        .addClass('row');
      for (let col = 0; col < this.COLS; col++) {
        const $col = $('<div>')
          .addClass('col empty')
          .attr('data-col', col)
          .attr('data-row', row);
        $row.append($col);
      }
      $board.append($row);
    }
  }

  // Set up de l'ensemble des evenements possible //

  setupEventListeners() {
    const $board = $(this.selector);
    const that = this;

    function findLastEmptyCell(col) {
      const cells = $(`.col[data-col='${col}']`);
      for (let i = cells.length - 1; i >= 0; i--) {
        const $cell = $(cells[i]);
        if ($cell.hasClass('empty')) {
          return $cell;
        }
      }
      return null;
    }

    $board.on('mouseenter', '.col.empty', function() {
      if (that.isGameOver) return;
      const col = $(this).data('col');
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.addClass(`next-${that.player}`);
    });

    $board.on('mouseleave', '.col', function() {
      $('.col').removeClass(`next-${that.player}`);
    });

    $board.on('click', '.col.empty', function() {
      if (that.isGameOver) return;
      const col = $(this).data('col');
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.removeClass(`empty next-${that.player}`);
      $lastEmptyCell.addClass(that.player);
      $lastEmptyCell.css('background-color',that.color);
      $lastEmptyCell.data('player', that.player);
      console.log(that.color);

      const winner = that.checkForWinner(
        $lastEmptyCell.data('row'), 
        $lastEmptyCell.data('col')
      )
      if (winner) {
        that.isGameOver = true;
        alert(`Game Over! Player ${that.player} has won!`);
        $('.col.empty').removeClass('empty');
        return;
      }

      that.player = (that.player === that.player1) ? that.player2 : that.player1;
      that.color = (that.color === that.color1) ? that.color2 : that.color1;
      that.onPlayerMove();
      $(this).trigger('mouseenter');
    });
  }

// Vérification du gagnant //

  checkForWinner(row, col) {
    const that = this;

    function $getCell(i, j) {
      return $(`.col[data-row='${i}'][data-col='${j}']`);
    }

    function checkDirection(direction) {
      let total = 0;
      let i = row + direction.i;
      let j = col + direction.j;
      let $next = $getCell(i, j);
      while (i >= 0 &&
        i < that.ROWS &&
        j >= 0 &&
        j < that.COLS && 
        $next.data('player') === that.player
      ) {
        total++;
        i += direction.i;
        j += direction.j;
        $next = $getCell(i, j);
      }
      return total;
    }
    
    function checkWin(directionA, directionB) {
      const total = 1 +
        checkDirection(directionA) +
        checkDirection(directionB);
      if (total >= 4) {
        return that.player;
      } else {
        return null;
      }
    }

    function checkDiagonalBLtoTR() {
      return checkWin({i: 1, j: -1}, {i: 1, j: 1});
    }

    function checkDiagonalTLtoBR() {
      return checkWin({i: 1, j: 1}, {i: -1, j: -1});
    }

    function checkVerticals() {
      return checkWin({i: -1, j: 0}, {i: 1, j: 0});
    }

    function checkHorizontals() {
      return checkWin({i: 0, j: -1}, {i: 0, j: 1});
    }

    return checkVerticals() || 
      checkHorizontals() || 
      checkDiagonalBLtoTR() ||
      checkDiagonalTLtoBR();
  }

  reset(){
      document.querySelector("#restart").onclick =() =>{
      console.log(document.querySelectorAll('.'+this.player1+', .'+this.player2));
    
    }
  }

  restart () {
    this.createGrid();
    this.onPlayerMove();
  }

}