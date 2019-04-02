const player = require("node-wav-player")

setInterval(() => {
  player.play({path:"./sounds/start.wav"}).catch((e) => {
    console.log(e);
    
  }
  )
}, 2000); 