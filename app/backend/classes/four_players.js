const Game = require('./game');

class FourPlayers {
    constructor () {
        /**
         * A map of all the Players, where the PlayerID is the key
         * { [id: string]: [username: string] }
         */
        this.players = new Map();
        
        /**
         * A map of all the Players who are in room, where the PlayerID is the key
         * { [id: string]: [room: string] }
         */
        this.playersInRoom = new Map();
        

        /**
         * A map of all the Rooms where the room name is the key
         * { [room name: string]: [id players: array] }
         */
        this.rooms = new Map();

        /**
         * A map of all games between two players where room name is the key
         * { [room name: string]: [game: Game]} 
         */
        this.games = new Map();

        this.kurcina = new Map();
    }

    addPlayer(id, username, room, numUsers){
        this.kurcina.set(id, numUsers)
        this.players.set(id, username);
        this.playersInRoom.set(id, room);
        if (this.hasRoom(room)) this.rooms.get(room).add(id);
        else {
            this.rooms.set(room, new Set());
            this.rooms.get(room).add(id);
        }
        
        if (this.getNumberOfPlayersInRoom(room) === this.getSizeOfRoom(room)) {
            const players = this.rooms.get(room).values();
            this.games.set(room, new Game(players.next().value, players.next().value, players.next().value, players.next().value));
        }
    }

    deletePlayer(id, username, room) {
        this.kurcina.delete(id);
        this.players.delete(id);
        this.playersInRoom.delete(id);
        this.rooms.get(room).delete(id);

        if (this.rooms.get(room).size === 0) {
            this.rooms.delete(room);
        }

        //TOMOOOOOOO
        const game = this.games.get(room);
        if (game !== undefined) {
            const isPlayer = game.hasPlayer(id);
            if (isPlayer) {
                this.games.delete(room);
                return true;
            } 
            return false;
        }
        return false;
    }

    hasRoom(room){
        return this.rooms.get(room) !== undefined;
    }

    hasUsername(room, username) {
        const usernames = this.rooms.get(room);
        if (usernames === undefined) return false;

        return usernames.some(id => {this.players.get(id) === username});
    }

    getRoom(id) {
        return this.playersInRoom.get(id)
    }

    getNumberOfPlayersInRoom(room) {
        const num = this.rooms.get(room)
        if (num === undefined) return 0;
        else return num.size
    }

    getUsername(id) {
        return this.players.get(id);
    }

    getSizeOfRoom(room) {
        const char = room[room.length - 1];
        return parseInt(char);
    }

    getGameStateInRoom(room) {
        return {
            board: this.games.get(room).getBoard(),
            lastColumns: this.games.get(room).getLastColumns()
        }
    }

    setGameStateInRoom(room, playerTurn, column) {
        this.games.get(room).setBoard(playerTurn, column);
    }

    restartGame(room) {
        this.games.get(room).restartBoard();
    }
    getKurcic(id){
        return this.kurcina.get(id);
    }
}

module.exports = FourPlayers;