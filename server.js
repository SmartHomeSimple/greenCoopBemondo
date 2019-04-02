const express = require('express')
const player = require('node-wav-player')
const path = require("path")

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '.', 'index.html'));
})

app.get('/start', (req, res) => {
  player.play({
    path: './sounds/hu/start.wav',
  }).then((params) => {
    res.send("done")
  }).catch(() => {
    res.send("file did not play!")
  })
})

app.get('/stop', (req, res) => {
  player.play({
    path: './sounds/stop.wav',
  }).then((params) => {
    res.send("done")
  }).catch(() => {
    res.send("file did not play!")
  })
})

app.get('/trash', (req, res) => {
  player.play({
    path: './sounds/trash.wav',
  }).then((params) => {
    res.send("done")
  }).catch(() => {
    res.send("file did not play!")
  })
})

app.get('/container', (req, res) => {
  player.play({
    path: './sounds/cont.wav',
  }).then((params) => {
    res.send("done")
  }).catch(() => {
    res.send("file did not play!")
  })
})

app.get('/szunet', (req, res) => {
  player.play({
    path: './sounds/szunet.wav',
  }).then((params) => {
    res.send("done")
  }).catch(() => {
    res.send("file did not play!")
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
