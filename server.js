const express = require('express')
const path = require("path")
const sound = require("sound-play");
const { NodeAudioVolumeMixer } = require("node-audio-volume-mixer");

const app = express()
const port = 28001
let audioSessionStates = []
let audioQueue = []

// NOTE: This variable is needed to prevent multiple sounds from playing at once
let isPLaying = false;

app.get('/breakending', (req, res) => {
  addToQueueAndPlay("breakending.mp3", res);
})

app.get('/breakstarting', (req, res) => {
  addToQueueAndPlay("breakstarting.mp3", res);

})

app.get('/login', (req, res) => {
  addToQueueAndPlay("login.mp3", res);
})

app.get('/logout', (req, res) => {
  addToQueueAndPlay("logout.mp3",res);

})

app.get('/startmeasure', (req, res) => {
  addToQueueAndPlay("startmeasure.mp3", res);
})

app.get('/stopmeasure', (req, res) => {
  addToQueueAndPlay("stopmeasure.mp3", res);
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

let timeout = (delay) => {
  return new Promise(resolve => setTimeout(resolve, delay));
}

let addToQueueAndPlay = (fileToPlay, res) => {
  res.sendStatus(200)

  audioQueue.push(fileToPlay);

  if(isPLaying){
    return
  }
  playFromQueue()
}

let playFromQueue = async () => {
  if(audioQueue.length === 0){
    return
  }
  let fileToPlay = audioQueue.shift();
  await playFile(fileToPlay);
  await timeout(1000);
  await playFromQueue()
}

let playFile = async (fileToPlay) => {
  isPLaying = true;
  await lowerSessionVolumes()
  await sound.play(path.join(__dirname, "sounds", fileToPlay));
  await resetSessionVolumes()
  isPLaying = false;
}


let lowerSessionVolumes = async () => {
  const sessions = NodeAudioVolumeMixer.getAudioSessionProcesses();

  audioSessionStates= sessions.map((session) => ({...session, volume: NodeAudioVolumeMixer.getAudioSessionVolumeLevelScalar(session.pid)}))
  audioSessionStates.forEach((session) => {
    try {
      NodeAudioVolumeMixer.setAudioSessionVolumeLevelScalar(session.pid,0.1);
    } catch (error) {
      console.warn(error)
    }
  })
}

let resetSessionVolumes = async () => {
  audioSessionStates.forEach((session) => {
    try{
      NodeAudioVolumeMixer.setAudioSessionVolumeLevelScalar(session.pid,session.volume);
    }catch(e){
      console.warn(e)
    }
  })
}