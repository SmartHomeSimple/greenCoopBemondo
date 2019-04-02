const express = require('express')
const player = require('node-wav-player')
const path = require("path")

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '.', 'index.html'));
})

let languages = {
  hu : true,
  sk : true,
  ro : true
}

let speakDelay = 2000;

app.get('/start', async (req, res) => {
  if(languages.hu){
    await player.play({path: "./sounds/hu/start.wav",sync: true})
    await timeout()
  }
  if(languages.sk){
    await player.play({path: "./sounds/sk/start.wav",sync: true})
    await timeout()
  }
  if(languages.ro){
    await player.play({path: "./sounds/ro/start.wav",sync: true})
    await timeout()
  }
})

app.get('/stop', (req, res) => {
  if(languages.hu){
    await player.play({path: "./sounds/hu/stop.wav",sync: true})
    await timeout()
  }
  if(languages.sk){
    await player.play({path: "./sounds/sk/stop.wav",sync: true})
    await timeout()
  }
  if(languages.ro){
    await player.play({path: "./sounds/ro/stop.wav",sync: true})
    await timeout()
  }
})

app.get('/trash', (req, res) => {
  if(languages.hu){
    await player.play({path: "./sounds/hu/trash.wav",sync: true})
    await timeout()
  }
  if(languages.sk){
    await player.play({path: "./sounds/sk/trash.wav",sync: true})
    await timeout()
  }
  if(languages.ro){
    await player.play({path: "./sounds/ro/trash.wav",sync: true})
    await timeout()
  }
})

app.get('/container', (req, res) => {
  if(languages.hu){
    await player.play({path: "./sounds/hu/cont.wav",sync: true})
    await timeout()
  }
  if(languages.sk){
    await player.play({path: "./sounds/sk/cont.wav",sync: true})
    await timeout()
  }
  if(languages.ro){
    await player.play({path: "./sounds/ro/cont.wav",sync: true})
    await timeout()
  }
})

app.get('/szunet', (req, res) => {
  if(languages.hu){
    await player.play({path: "./sounds/hu/pause.wav",sync: true})
    await timeout()
  }
  if(languages.sk){
    await player.play({path: "./sounds/sk/pause.wav",sync: true})
    await timeout()
  }
  if(languages.ro){
    await player.play({path: "./sounds/ro/pause.wav",sync: true})
    await timeout()
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function timeout() {
  return new Promise(resolve => setTimeout(resolve, speakDelay));
}