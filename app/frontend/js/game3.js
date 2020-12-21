const NUMBER_OF_ROWS = 6;
const NUMBER_OF_COLUMNS = 7;
const NUMBER_OF_CONNECTIONS_TO_WIN = 3;

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const table = document.getElementsByClassName('table-board')[0];

let board;
let numPlayer;
let playerTurn;
let gameStarted;
let gameFinished;
let winnerArray;
let lastFreeRowPerColumn;

let fresh;

//FIRST COLUMN
const cell00 = document.getElementById('cell00');
const cell10 = document.getElementById('cell10');
const cell20 = document.getElementById('cell20');
const cell30 = document.getElementById('cell30');
const cell40 = document.getElementById('cell40');
const cell50 = document.getElementById('cell50');
//SECOND COLUMN
const cell01 = document.getElementById('cell01');
const cell11 = document.getElementById('cell11');
const cell21 = document.getElementById('cell21');
const cell31 = document.getElementById('cell31');
const cell41 = document.getElementById('cell41');
const cell51 = document.getElementById('cell51');
//THIRD COLUMN
const cell02 = document.getElementById('cell02');
const cell12 = document.getElementById('cell12');
const cell22 = document.getElementById('cell22');
const cell32 = document.getElementById('cell32');
const cell42 = document.getElementById('cell42');
const cell52 = document.getElementById('cell52');
//FOURTH COLUMN
const cell03 = document.getElementById('cell03');
const cell13 = document.getElementById('cell13');
const cell23 = document.getElementById('cell23');
const cell33 = document.getElementById('cell33');
const cell43 = document.getElementById('cell43');
const cell53 = document.getElementById('cell53');
//FIFTH COLUMN
const cell04 = document.getElementById('cell04');
const cell14 = document.getElementById('cell14');
const cell24 = document.getElementById('cell24');
const cell34 = document.getElementById('cell34');
const cell44 = document.getElementById('cell44');
const cell54 = document.getElementById('cell54');
//SIXTH COLUMN
const cell05 = document.getElementById('cell05');
const cell15 = document.getElementById('cell15');
const cell25 = document.getElementById('cell25');
const cell35 = document.getElementById('cell35');
const cell45 = document.getElementById('cell45');
const cell55 = document.getElementById('cell55');
//SEVENTH COLUMN
const cell06 = document.getElementById('cell06');
const cell16 = document.getElementById('cell16');
const cell26 = document.getElementById('cell26');
const cell36 = document.getElementById('cell36');
const cell46 = document.getElementById('cell46');
const cell56 = document.getElementById('cell56');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username');
const room = urlParams.get('room');
const numUsers =  urlParams.get('num_users');

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room, numUsers });

socket.on('numPlayer', (num) => {
    numPlayer = num;
    console.log(num)
})

socket.on('startGame', (turn) => {
    initGame(turn);
    drawWhoPlays();
});

// Message from server
socket.on('message', message => {
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//One player has move
socket.on('move', (data) => {
    const playerNumber = data.playerTurn;
    const column = data.column;
    drawCheckerInBoard(playerNumber, column);
    playerTurn = (playerNumber + 1 === 4) ? 1 : playerNumber + 1;
    drawWhoPlays();
})

socket.on('loadingBoard', data => {
    console.log('loading board');
    loadGame(data);
    drawBoard()
})

socket.on('end', (msg) => {
    setWinnerHeader(msg);
    newGame();
})

socket.on('restartGame', (turn) => {
    restartGame();
    initGame(turn);
    drawWhoPlays();
})

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }
    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

cell00.addEventListener('click', (e) => {
    gameAction(e, 0)
})
cell10.addEventListener('click', (e) => {
    gameAction(e, 0)
})
cell20.addEventListener('click', (e) => {
    gameAction(e, 0)
})
cell30.addEventListener('click', (e) => {
    gameAction(e, 0)
})
cell40.addEventListener('click', (e) => {
    gameAction(e, 0)
})
cell50.addEventListener('click', (e) => {
    gameAction(e, 0)
})

cell01.addEventListener('click', (e) => {
    gameAction(e, 1)
})
cell11.addEventListener('click', (e) => {
    gameAction(e, 1)
})
cell21.addEventListener('click', (e) => {
    gameAction(e, 1)
})
cell31.addEventListener('click', (e) => {
    gameAction(e, 1)
})
cell41.addEventListener('click', (e) => {
    gameAction(e, 1)
})
cell51.addEventListener('click', (e) => {
    gameAction(e, 1)
})

cell02.addEventListener('click', (e) => {
    gameAction(e, 2)
})
cell12.addEventListener('click', (e) => {
    gameAction(e, 2)
})
cell22.addEventListener('click', (e) => {
    gameAction(e, 2)
})
cell32.addEventListener('click', (e) => {
    gameAction(e, 2)
})
cell42.addEventListener('click', (e) => {
    gameAction(e, 2)
})
cell52.addEventListener('click', (e) => {
    gameAction(e, 2)
})

cell03.addEventListener('click', (e) => {
    gameAction(e, 3)
})
cell13.addEventListener('click', (e) => {
    gameAction(e, 3)
})
cell23.addEventListener('click', (e) => {
    gameAction(e, 3)
})
cell33.addEventListener('click', (e) => {
    gameAction(e, 3)
})
cell43.addEventListener('click', (e) => {
    gameAction(e, 3)
})
cell53.addEventListener('click', (e) => {
    gameAction(e, 3)
})

cell04.addEventListener('click', (e) => {
    gameAction(e, 4)
})
cell14.addEventListener('click', (e) => {
    gameAction(e, 4)
})
cell24.addEventListener('click', (e) => {
    gameAction(e, 4)
})
cell34.addEventListener('click', (e) => {
    gameAction(e, 4)
})
cell44.addEventListener('click', (e) => {
    gameAction(e, 4)
})
cell54.addEventListener('click', (e) => {
    gameAction(e, 4)
})

cell05.addEventListener('click', (e) => {
    gameAction(e, 5)
})
cell15.addEventListener('click', (e) => {
    gameAction(e, 5)
})
cell25.addEventListener('click', (e) => {
    gameAction(e, 5)
})
cell35.addEventListener('click', (e) => {
    gameAction(e, 5)
})
cell45.addEventListener('click', (e) => {
    gameAction(e, 5)
})
cell55.addEventListener('click', (e) => {
    gameAction(e, 5)
})

cell06.addEventListener('click', (e) => {
    gameAction(e, 6)
})
cell16.addEventListener('click', (e) => {
    gameAction(e, 6)
})
cell26.addEventListener('click', (e) => {
    gameAction(e, 6)
})
cell36.addEventListener('click', (e) => {
    gameAction(e, 6)
})
cell46.addEventListener('click', (e) => {
    gameAction(e, 6)
})
cell56.addEventListener('click', (e) => {
    gameAction(e, 6)
})

function initGame(turn) {

    board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ];

    lastFreeRowPerColumn = [
        NUMBER_OF_ROWS - 1,
        NUMBER_OF_ROWS - 1,
        NUMBER_OF_ROWS - 1,
        NUMBER_OF_ROWS - 1,
        NUMBER_OF_ROWS - 1,
        NUMBER_OF_ROWS - 1,
        NUMBER_OF_ROWS - 1
    ];

    winner = -1;
    winnerArray = [];
    gameStarted = true;
    gameFinished = false;
    playerTurn = turn;
}

function loadGame(data) {
    board = data.board;
    lastFreeRowPerColumn = data.lastColumns;
    winner = -1;
    winnerArray = [];
    gameStarted = true;
    gameFinished = false;
}

function gameAction(e, column) {
    if (!canPlay() || !validMove(column)) e.preventDefault();
    else {
        socket.emit('move', { playerTurn, column });
    }
}

function drawCheckerInBoard(playerNumber, column) {
    if (!gameFinished) {
        const lastRow = lastFreeRowPerColumn[column];
        const cellToColor = document.getElementById("cell" + lastRow + "" + column);
        cellToColor.classList.add("player" + playerNumber); //zuto ili crveno

        playChecker(playerNumber, column);

        if (gameFinished) {
            flashWinnerArray();
            //svakome moze da se iscrta, pormeni ovo
            //npr if(playerNumber === nmPlayer)
            //socket.emit('end', playerTurn)
            socket.emit('end');
        }
    }
}

function playChecker(playerNumber, column) {
    if (!gameFinished && !isBoardFullyFilledIn()) {

        const row = lastFreeRowPerColumn[column];
        board[row][column] = playerNumber;

        if (playerCanWin(board, row, column, playerNumber)) {
            winner = playerNumber;
            gameFinished = true;
        }

        lastFreeRowPerColumn[column] -= 1;

        print_the_board();
    }
}

function playerCanWin(board, row, column, playerNumber) {

    if (columnHasAConnection(board, column, playerNumber)
        || rowHasAConnection(board, row, playerNumber)
        || diagonalHasAConnection(board, row, column, playerNumber)) {
        return true;
    }
    console.log('Konacno:' + winnerArray)
    return false;
}

function columnHasAConnection(board, column, playerNumber) {
    let consecutiveCells = 0;

    for (let row = 0; row < board.length; ++row) {
        if (board[row][column] == playerNumber) {
            winnerArray.push(row + "" + column);
            if (++consecutiveCells == NUMBER_OF_CONNECTIONS_TO_WIN) {
                return true;
            }
        } else {
            winnerArray.splice(0, winnerArray.length);
            consecutiveCells = 0;
        }
    }
    winnerArray.splice(0, winnerArray.length);

    return false;
}

function rowHasAConnection(board, row, playerNumber) {
    let consecutiveCells = 0;

    for (let column = 0; column < board[0].length; ++column) {
        if (board[row][column] == playerNumber) {
            winnerArray.push(row + "" + column);
            if (++consecutiveCells == NUMBER_OF_CONNECTIONS_TO_WIN) {
                return true;
            }
        } else {
            winnerArray.splice(0, winnerArray.length);
            consecutiveCells = 0;
        }
    }
    winnerArray.splice(0, winnerArray.length);
    return false;
}

function diagonalHasAConnection(board, row, column, playerNumber) {
    if (!positiveDiagonalHasAConnection(board, row, column, playerNumber)) {
        return negativeDiagonalHasAConnection(board, row, column, playerNumber);
    }
    return true;
}

function positiveDiagonalHasAConnection(board, row, column, playerNumber) {
    let initialRow = row;
    let initialColumn = column;

    while (initialRow > 0 && initialColumn > 0) {
        initialRow--;
        initialColumn--;
    }

    let consecutiveCells = 0;

    for (let i = initialRow, j = initialColumn; i < board.length && j < board[0].length; ++i, ++j) {
        if (board[i][j] == playerNumber) {
            winnerArray.push(i + "" + j);
            if (++consecutiveCells == NUMBER_OF_CONNECTIONS_TO_WIN) {
                return true;
            }
        } else {
            winnerArray.splice(0, winnerArray.length);
            consecutiveCells = 0;
        }
    }
    winnerArray.splice(0, winnerArray.length);
    return false;
}

function negativeDiagonalHasAConnection(board, row, column, playerNumber) {

    let initialRow = row;
    let initialColumn = column;

    while (initialRow > 0 && initialColumn < (board[0].length - 1)) {
        initialRow--;
        initialColumn++;
    }

    let consecutiveCells = 0;

    for (let i = initialRow, j = initialColumn; i < board.length && j >= 0; ++i, --j) {
        if (board[i][j] == playerNumber) {
            winnerArray.push(i + "" + j);
            if (++consecutiveCells == NUMBER_OF_CONNECTIONS_TO_WIN) {
                return true;
            }
        } else {
            winnerArray.splice(0, winnerArray.length);
            consecutiveCells = 0;
        }
    }
    winnerArray.splice(0, winnerArray.length);
    return false;
}

function isBoardFullyFilledIn() {
    return lastFreeRowPerColumn.every(num => num < 0);
}

function canPlay() {
    return gameStarted && (playerTurn === numPlayer);
}

function validMove(col) {
    return lastFreeRowPerColumn[col] >= 0;
}

function print_the_board() {
    let str = ""
    for (let i = 0; i < NUMBER_OF_ROWS; ++i) {
        for (let j = 0; j < NUMBER_OF_COLUMNS; ++j) {
            str += board[i][j] + " "
        }
        str += "\n";
    }
    console.log(str)
}

function drawWhoPlays() {
    if (playerTurn !== numPlayer) {
        table.classList.remove('turn-on-table');
        table.classList.add('turn-off-table');
    } else {
        table.classList.remove('turn-off-table');
        table.classList.add('turn-on-table');
    }
}

function drawBoard() {
    for (let i=0; i<NUMBER_OF_ROWS; i++){
        for(let j=0; j<NUMBER_OF_COLUMNS; j++){
            const cellToColor = document.getElementById("cell" + i + "" + j);
            cellToColor.className += " player" + board[i][j];
        }
    }
}

function flashWinnerArray() {
    one = "#cell" + winnerArray[0];
    two = "#cell" + winnerArray[1];
    three = "#cell" + winnerArray[2];
    
    fresh = setInterval(() => {
        $(one).fadeToggle("slow");
        $(two).fadeToggle("slow");
        $(three).fadeToggle("slow");
    }, 1000)
}

function setWinnerHeader(msg) {
    const div = document.querySelector('.container-fluid')
    div.innerHTML = "";
    
    const span = document.createElement("span");
    span.classList.add('header');
    span.innerText = msg;
    document.querySelector('.container-fluid').appendChild(span);

    if (numPlayer !== -1) {
        const button = document.createElement("button")
        button.innerHTML = "NEW GAME"
        button.classList.add("new-game");
        document.querySelector('.container-fluid').appendChild(button)
    }
    
}

function setHeader() {
    const div = document.querySelector('.container-fluid')
    div.innerHTML = "";
    
    const span = document.createElement("span");
    span.classList.add('header');
    span.innerText = "Pummel Party";
    document.querySelector('.container-fluid').appendChild(span);
}

function restartBoard() {
    for(let i=0; i<NUMBER_OF_ROWS; i++)
        for (let j=0; j<NUMBER_OF_COLUMNS; j++) 
            if (board[i][j] !== 0) {
                const cell = document.getElementById("cell" + i + "" + j);
                cell.classList.remove("player" + board[i][j]);
            }
}

function stopFresh() {
    if (fresh !== undefined) {
        clearInterval(fresh);
        fresh = undefined;
        one = "#cell" + winnerArray[0];
        two = "#cell" + winnerArray[1];
        three = "#cell" + winnerArray[2];
        $(one).fadeIn("fast");
        $(two).fadeIn("fast");
        $(three).fadeIn("fast");
    }
}

function restartGame() {
    setHeader();
    restartBoard();
    stopFresh()
    fresh = 0;
}

function newGame() {
    const button = document.querySelector('.new-game');
    button.addEventListener('click', (e) => {
        socket.emit('newGame');
    })
}

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    const p = document.createElement('p');
    const para = document.createElement('p');
    if (username !== message.username) {
        div.classList.add('message');
        para.classList.add('message-text');
    } else {
        div.classList.add('my-message');
        para.classList.add('my-message-text');
    }

    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);

    para.innerText = message.text;
    div.appendChild(para);

    document.querySelector('.chat-messages').appendChild(div);
}
