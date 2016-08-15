const http = require("./server");
const io = require("socket.io")(http);
module.exports = io;
