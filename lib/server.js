const app = require("./app");
const http = require("http").Server(app);
const port = 3000;
http.listen(port, () => {
    console.log(`The server is now running at http://localhost:${port}`);
});
module.exports = http;
