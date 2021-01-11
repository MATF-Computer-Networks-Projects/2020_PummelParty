const classTwoPlayers = require('./two_players');
const TwoPlayers = new classTwoPlayers();

const classThreePlayers = require('./three_players');
const ThreePlayers = new classThreePlayers();

const classFourPlayers = require('./four_players');
const FourPlayers = new classFourPlayers();

const formatMessage = require('../utils/messages');


class Socket {

    constructor(server) {
        this.io = require('socket.io')(server);

        this.io.on('connection', socket => {

            socket.on('joinRoom', (data) => {
                const id = socket.id;
                const username = data.username;
                const numUsers = parseInt(data.numUsers);
                const room = data.room + numUsers;
                
                prepareForJoin(socket, id, username, room, numUsers);
                joinRoom(socket, username, room);
                
                if (numUsers === 2) {
                    // getnumB daje sve ljude u sobi
                    const numPlayersInRoom = TwoPlayers.getNumberOfPlayersInRoom(room);
                    if (numPlayersInRoom === numUsers) this.io.in(room).emit('startGame', 1);
                    else if (numPlayersInRoom > numUsers) this.io.in(room).emit('loadingBoard', TwoPlayers.getGameStateInRoom(room));
                } else if(numUsers === 3) {
                    const numPlayersInRoom = ThreePlayers.getNumberOfPlayersInRoom(room);
                    if (numPlayersInRoom === numUsers) this.io.in(room).emit('startGame', 1);
                    else if (numPlayersInRoom > numUsers) this.io.in(room).emit('loadingBoard',ThreePlayers.getGameStateInRoom(room));
                }
                else {
                    console.log("joinRoom4");

                    const numPlayersInRoom = FourPlayers.getNumberOfPlayersInRoom(room);
                    if (numPlayersInRoom === numUsers) this.io.in(room).emit('startGame', 1);
                    else if (numPlayersInRoom > numUsers) this.io.in(room).emit('loadingBoard',FourPlayers.getGameStateInRoom(room));
                }
                            
            });

            socket.on('chatMessage', msg => {
                const id = socket.id;
                const numUsers = TwoPlayers.getNumberOfUsersInRoom(id);
                const numUsers2 = ThreePlayers.getNumberOfUsersInRoom(id);

                if(numUsers !== undefined){
                    const username = TwoPlayers.getUsername(id);
                    const room = TwoPlayers.getRoom(id);   
                    this.io.in(room).emit('message', formatMessage(username, msg));
                } 
                else if(numUsers2 !== undefined){
                    const username = ThreePlayers.getUsername(id);
                    const room = ThreePlayers.getRoom(id);
                    this.io.in(room).emit('message', formatMessage(username, msg));
                }
                else {
                    console.log("chatMsgRoom4");

                    const username = FourPlayers.getUsername(id);
                    const room = FourPlayers.getRoom(id);
                    this.io.in(room).emit('message', formatMessage(username, msg));
                }
                // const username = TwoPlayers.getUsername(id);
                // const room = TwoPlayers.getRoom(id);  

                // this.io.in(room).emit('message', formatMessage(username, msg));
            });

            socket.on('move', (data) => {
                const playerTurn = data.playerTurn;
                const column = data.column;
                const id = socket.id;
                const numUsers = TwoPlayers.getNumberOfUsersInRoom(id);
                const numUsers2 = ThreePlayers.getNumberOfUsersInRoom(id);

                if(numUsers !== undefined){
                    const room = TwoPlayers.getRoom(id);
                    TwoPlayers.setGameStateInRoom(room, playerTurn, column);
                    const dataSend = {playerTurn, column}
                    this.io.in(room).emit('move', dataSend);
                }
                else if (numUsers2 !== undefined){
                    const room = ThreePlayers.getRoom(id);
                    ThreePlayers.setGameStateInRoom(room, playerTurn, column);
                    const dataSend = {playerTurn, column}
                    this.io.in(room).emit('move', dataSend);
                }
                else {
                    console.log("move4");

                    const room = FourPlayers.getRoom(id);
                    FourPlayers.setGameStateInRoom(room, playerTurn, column);
                    const dataSend = {playerTurn, column}
                    this.io.in(room).emit('move', dataSend);

                }
                // const room = TwoPlayers.getRoom(id);
                // TwoPlayers.setGameStateInRoom(room, playerTurn, column);

                // const dataSend = {playerTurn, column}
                // this.io.in(room).emit('move', dataSend);
            })

            socket.on('end', () => {
                const id = socket.id;
                const numUsers = TwoPlayers.getNumberOfUsersInRoom(id);
                const numUsers2 = ThreePlayers.getNumberOfUsersInRoom(id);

                if(numUsers !== undefined){
                    const room = TwoPlayers.getRoom(id);
                    const username = TwoPlayers.getUsername(id);
                    this.io.in(room).emit('end', username + " IS THE WINNER!");

                }
                else if (numUsers2 !== undefined){
                    const room = ThreePlayers.getRoom(id);
                    const username = ThreePlayers.getUsername(id);
                    this.io.in(room).emit('end', username + " IS THE WINNER!");
                }
                else {
                    console.log("end");

                    const room = FourPlayers.getRoom(id);
                    const username = FourPlayers.getUsername(id);
                    this.io.in(room).emit('end', username + " IS THE WINNER!");

                }
                // const room = TwoPlayers.getRoom(id);
                // const username = TwoPlayers.getUsername(id);

                // this.io.in(room).emit('end', username + " IS THE WINNER!");
            })
            
            socket.on('newGame', () => {
                const id = socket.id;
                const numUsers = TwoPlayers.getNumberOfUsersInRoom(id);
                const numUsers2 = ThreePlayers.getNumberOfUsersInRoom(id);

                if(numUsers !== undefined){
                    const room = TwoPlayers.getRoom(id);
                    TwoPlayers.restartGame(room);
                    this.io.in(room).emit('restartGame', 1);

                }
                else if(numUsers2 !== undefined){
                    const room = ThreePlayers.getRoom(id);
                    ThreePlayers.restartGame(room);
                    this.io.in(room).emit('restartGame', 1);
                }
                else {
                    console.log("newGame4");

                    const room = FourPlayers.getRoom(id);
                    FourPlayers.restartGame(room);
                    this.io.in(room).emit('restartGame', 1);
                }

                // const room = TwoPlayers.getRoom(id);
                // TwoPlayers.restartGame(room);


                // this.io.in(room).emit('restartGame', 1);
            })

            socket.on('disconnect', () => {
                const id = socket.id;
                const numUsers = TwoPlayers.getNumberOfUsersInRoom(id);
                const numUsers2 = ThreePlayers.getNumberOfUsersInRoom(id);

                if(numUsers !== undefined){
                    const room = TwoPlayers.getRoom(id);
                    const username = TwoPlayers.getUsername(id);
                    const leavePlayer = leaveRoom(socket);
                    if (leavePlayer) this.io.in(room).emit('end', username + " HAS LEFT THE ROOM :(");
                }
                else if(numUsers2 !== undefined){
                    const room = ThreePlayers.getRoom(id);
                    const username = ThreePlayers.getUsername(id);
                    const leavePlayer = leaveRoom(socket);
                    if (leavePlayer) this.io.in(room).emit('end', username + " HAS LEFT THE ROOM :(");
                }
                else {
                    const room = FourPlayers.getRoom(id);
                    const username = FourPlayers.getUsername(id);
                    const leavePlayer = leaveRoom(socket);
                    if (leavePlayer) this.io.in(room).emit('end', username + " HAS LEFT THE ROOM :(");
                }
                // const room = TwoPlayers.getRoom(id);
                // const username = TwoPlayers.getUsername(id);

                // const leavePlayer = leaveRoom(socket);
                // if (leavePlayer) this.io.in(room).emit('end', username + " HAS LEFT THE ROOM :(");
            })

        });
        
    }
}
function createName() {
    let name             = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < 5; i++ ) {
        name += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return name;
}

function prepareForJoin (socket, id, username, room, numUsers) {
    //const existUsernameInRoom = TwoPlayers.hasUsername(room, username);
    //resiti problem kada imamo igraca sa usernamemom vec u sobi
    
    if (numUsers === 2) {
        const num = TwoPlayers.getNumberOfPlayersInRoom(room);
        if (num === 0) socket.emit('numPlayer', 1);
        else if (num === 1) socket.emit('numPlayer', 2);
        else socket.emit('numPlayer', -1); //igrac moze samo da chatuje jer dvojica igraju
        
        TwoPlayers.addPlayer(id, username, room, numUsers);
    } else if(numUsers === 3){
        const num = ThreePlayers.getNumberOfPlayersInRoom(room);
        if (num === 0) socket.emit('numPlayer', 1);
        else if (num === 1) socket.emit('numPlayer', 2);
        else if (num === 2) socket.emit('numPlayer', 3);
        else socket.emit('numPlayer', -1); //igrac moze samo da chatuje jer dvojica igraju
        ThreePlayers.addPlayer(id, username, room, numUsers);
    }
    else {
        const num = FourPlayers.getNumberOfPlayersInRoom(room);
        if (num === 0) socket.emit('numPlayer', 1);
        else if (num === 1) socket.emit('numPlayer', 2);
        else if (num === 2) socket.emit('numPlayer', 3);
        else if (num === 3) socket.emit('numPlayer', 4);
        else socket.emit('numPlayer', -1); //igrac moze samo da chatuje jer dvojica igraju
        FourPlayers.addPlayer(id, username, room, numUsers);
        
    }
}

function joinRoom(socket, username, room) {
    socket.join(room);
    socket.emit('message', formatMessage(`WELCOME ${username}`, `Are you ready?`));
    socket.broadcast.to(room).emit('message', formatMessage("NEW PLAYER", `Say hello to ${username} :)`));
}

function leaveRoom(socket) {
    const id = socket.id;
    const numUsers = TwoPlayers.getNumberOfUsersInRoom(id);
    const numUsers2 = ThreePlayers.getNumberOfUsersInRoom(id);

    if(numUsers !== undefined){
        const room = TwoPlayers.getRoom(id);
        const username = TwoPlayers.getUsername(id);
        const isPlayer = TwoPlayers.deletePlayer(id, username, room);
        socket.broadcast.to(room).emit('message', formatMessage("BYE", `Bye ${username} :)`));
        socket.leave(room);
    
        //sredjivanje sledeceg igraca
        if (isPlayer) return true;
        else return false;
    }
    else if(numUsers2 !== undefined){
        const room = ThreePlayers.getRoom(id);
        const username = ThreePlayers.getUsername(id);
        const isPlayer = ThreePlayers.deletePlayer(id, username, room);
        socket.broadcast.to(room).emit('message', formatMessage("BYE", `Bye ${username} :)`));
        socket.leave(room);
    
        //sredjivanje sledeceg igraca
        if (isPlayer) return true;
        else return false;
    }
    else {
        const room = FourPlayers.getRoom(id);
        const username = FourPlayers.getUsername(id);
        const isPlayer = FourPlayers.deletePlayer(id, username, room);
        socket.broadcast.to(room).emit('message', formatMessage("BYE", `Bye ${username} :)`));
        socket.leave(room);
    
        //sredjivanje sledeceg igraca
        if (isPlayer) return true;
        else return false;
    }
    // const room = TwoPlayers.getRoom(id);
    // const username = TwoPlayers.getUsername(id);
    // const isPlayer = TwoPlayers.deletePlayer(id, username, room);


    // socket.broadcast.to(room).emit('message', formatMessage("BYE", `Bye ${username} :)`));
    // socket.leave(room);
    
    // //sredjivanje sledeceg igraca
    // if (isPlayer) return true;
    // else return false;
}

module.exports = Socket;
