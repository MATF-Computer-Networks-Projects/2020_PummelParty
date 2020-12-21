
const classServer = require('./classes/server')
const Server = new classServer();
const server = Server.getServer();

const Socket = require('./classes/socket')
const socket = new Socket(server)
