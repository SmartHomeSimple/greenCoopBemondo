const express = require('express')
const player = require('node-wav-player')
const path = require("path")

const app = express()
const port = 80

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '.', 'res/index.html'));
})
app.use(express.static('res'));

let languages = {
  hu: true,
  sk: true,
  ro: true
}

let speakDelay = 2000;

app.get('/start', async (req, res) => {
  await player.play({
    path: "./sounds/debug.wav",
    sync: true
  })
  if (languages.hu) {
    await player.play({
      path: "./sounds/hu/start.wav",
      sync: true
    })
    await timeout()
  }
  if (languages.sk) {
    await player.play({
      path: "./sounds/sk/start.wav",
      sync: true
    })
    await timeout()
  }
  if (languages.ro) {
    await player.play({
      path: "./sounds/ro/start.wav",
      sync: true
    })
    await timeout()
  }
})

app.get('/stop', async (req, res) => {
  await player.play({
    path: "./sounds/debug.wav",
    sync: true
  })
  if (languages.hu) {
    await player.play({
      path: "./sounds/hu/stop.wav",
      sync: true
    })
    await timeout()
  }
  if (languages.sk) {
    await player.play({
      path: "./sounds/sk/stop.wav",
      sync: true
    })
    await timeout()
  }
  if (languages.ro) {
    await player.play({
      path: "./sounds/ro/stop.wav",
      sync: true
    })
    await timeout()
  }
})

app.get('/trash', async (req, res) => {
  await player.play({
    path: "./sounds/debug.wav",
    sync: true
  })

  if (languages.hu) {
    await player.play({
      path: "./sounds/hu/trash.wav",
      sync: true
    })
    await timeout()
  }
  if (languages.sk) {
    await player.play({
      path: "./sounds/sk/trash.wav",
      sync: true
    })
    await timeout()
  }
  if (languages.ro) {
    await player.play({
      path: "./sounds/ro/trash.wav",
      sync: true
    })
    await timeout()
  }
})

app.get('/container', async (req, res) => {
  await player.play({
    path: "./sounds/debug.wav",
    sync: true
  })

  if (languages.hu) {
    await player.play({
      path: "./sounds/hu/cont.wav",
      sync: true
    })
    await timeout()
  }
  if (languages.sk) {
    await player.play({
      path: "./sounds/sk/cont.wav",
      sync: true
    })
    await timeout()
  }
  if (languages.ro) {
    await player.play({
      path: "./sounds/ro/cont.wav",
      sync: true
    })
    await timeout()
  }
})

app.get('/pause', async (req, res) => {
  await player.play({
    path: "./sounds/debug.wav",
    sync: true
  })

  if (languages.hu) {
    await player.play({
      path: "./sounds/hu/pause.wav",
      sync: true
    })
    await timeout()
  }
  if (languages.sk) {
    await player.play({
      path: "./sounds/sk/pause.wav",
      sync: true
    })
    await timeout()
  }
  if (languages.ro) {
    await player.play({
      path: "./sounds/ro/pause.wav",
      sync: true
    })
    await timeout()
  }
})

app.get('/setLanguage', (req, res) => {
  //TODO: Implement feature
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function timeout() {
  return new Promise(resolve => setTimeout(resolve, speakDelay));
}