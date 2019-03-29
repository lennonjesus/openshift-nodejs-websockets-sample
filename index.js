#!/bin/env node

const WebSocketServer = require("ws").Server
const http = require("http")
const express = require("express")
const app = express()

const port        = process.env.OPENSHIFT_NODEJS_PORT || 5000;
const isOpenShift = process.env.OPENSHIFT_NODEJS_PORT ? true : false;

app.use(express.static(__dirname + "/"))

console.log(`Port: ${port} ${isOpenShift ? "OepnShift mode" : "Standalone mode"}`);

const server = http.createServer(app)
server.listen(port)

console.log(`http server listening on ${port}`)

const wss = new WebSocketServer({server: server})

console.log("WebSocket Server Created")

wss.on("connection", function(ws) {
  
    const id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)

  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})