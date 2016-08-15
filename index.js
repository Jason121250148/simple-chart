const app = require("./lib/app");
const express = require("express");
require("./lib/server");
require("./lib/namespaces");

app.use(express.static(__dirname + "/public"));
