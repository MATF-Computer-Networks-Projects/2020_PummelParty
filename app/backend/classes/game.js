const NUMBER_OF_ROWS = 6;

class Game {

    constructor(player1, player2, player3, player4) {
        this.player1 = player1;
        this.player2 = player2;
        if(player3 !== undefined && player4 === undefined){
            this.player3 = player3;
            this.player4 = undefined;
        }
        else if(player3 !== undefined && player4 !== undefined){
            this.player3 = player3;
            this.player4 = player4;
        }
            
        this.initGame()
    }

    initGame(){
        this.board = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ];
    
        this.lastFreeRowPerColumn = [
            NUMBER_OF_ROWS - 1,
            NUMBER_OF_ROWS - 1,
            NUMBER_OF_ROWS - 1,
            NUMBER_OF_ROWS - 1,
            NUMBER_OF_ROWS - 1,
            NUMBER_OF_ROWS - 1,
            NUMBER_OF_ROWS - 1
        ];
    }

    getBoard() {
        return this.board;
    }

    getLastColumns() {
        return this.lastFreeRowPerColumn;
    }
    
    setBoard(player, column) {
        this.board[this.lastFreeRowPerColumn[column]][column] = player;
        this.lastFreeRowPerColumn[column]--;
    }

    hasPlayer(player) {
        if(this.player4 !== undefined){
            return player === this.player1 || player === this.player2 || player === this.player3 || player === this.player4;
        }
        else if(this.player3 !== undefined && this.player4 === undefined){
            return player === this.player1 || player === this.player2 || player === this.player3;
        }
        else {
            return player === this.player1 || player === this.player2;            
        }
    }
    
    restartBoard() {
        this.board = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ];
        this.lastFreeRowPerColumn = [
            NUMBER_OF_ROWS - 1,
            NUMBER_OF_ROWS - 1,
            NUMBER_OF_ROWS - 1,
            NUMBER_OF_ROWS - 1,
            NUMBER_OF_ROWS - 1,
            NUMBER_OF_ROWS - 1,
            NUMBER_OF_ROWS - 1
        ];
    }
}

module.exports = Game;