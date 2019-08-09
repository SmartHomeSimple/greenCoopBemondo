const express = require('express')
const player = require('node-wav-player')
const path = require("path")
const Gpio = require('orange-pi-gpio');

const app = express()
const port = 80


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '.', 'res/index.html'));
})
app.use(express.static('res'));

let block = false;
let blockTimeout;
let switchTalk = new Gpio({pin:8});

let languages = {
  hu: true,
  sk: true,
  ro: true
}

app.get('/start', (req, res) => {
  blockAndPlay("start.wav", res);
})

app.get('/stop', (req, res) => {
  blockAndPlay("stop.wav", res);

})

app.get('/trash', (req, res) => {
  blockAndPlay("login.wav", res);
})

app.get('/container', (req, res) => {
  blockAndPlay("logout.wav", res);

})

app.get('/pause', (req, res) => {
  blockAndPlay("pause.wav", res);
})

app.get('/setLanguage', (req, res) => {
  //TODO: Implement setLanguage feature 
})

app.get('/getLanguage', (req,res) =>{ 
  res.send(languages)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

let timeout = (delay) => {
  return new Promise(resolve => setTimeout(resolve, delay));
}

let blockAndPlay = (file, res) => {
  if (!block) {
    res.sendStatus(200);
    block = true;
    blockTimeout = setTimeout((params) => {
      block = false;
    }, 8000)
    playSounds(file, languages)
  } else {
    res.sendStatus(403)
  }
}

let playSounds = async (fileEnding, lang) => {
  switchTalk.write(1); 
  await player.play({
    path: "./sounds/debug.wav",
    sync: true
  })
  if (lang.hu) {
    await player.play({
      path: "./sounds/hu/" + fileEnding,
      sync: true
    })
    await timeout(2000)
  }
  if (lang.sk) {
    await player.play({
      path: "./sounds/sk/" + fileEnding,
      sync: true
    })
    await timeout(2000)
  }
  if (lang.ro) {
    await player.play({
      path: "./sounds/ro/" + fileEnding,
      sync: true
    })
    await timeout(2000)
  }

  switchTalk.write(0); 

  clearTimeout(blockTimeout)
  block = false;
}
