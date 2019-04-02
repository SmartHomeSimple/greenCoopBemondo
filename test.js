const player = require("node-wav-player")

// player.play({
//     path: "./sounds/hu/start.wav",
//     sync: true
//   })
//   .then(() => new Promise((resolve) => setTimeout(resolve, 2000)))
//   .then(() => player.play({
//     path: "./sounds/sk/start.wav",
//     sync: true
//   }))
//   .then(() => new Promise((resolve) => setTimeout(resolve, 2000)))
//   .then(() => player.play({
//     path: "./sounds/ro/start.wav",
//     sync: true
//   }))


// then(() => delay(2000, )).then(() => console.log("hello"))


async function x(){
  if(true){
  await player.play({path: "./sounds/hu/start.wav",sync: true})
  await timeout(3000)
  }
  if(true){
  await player.play({path: "./sounds/sk/start.wav",sync: true})
  await timeout(3000)
  }
  if(true){
  await player.play({path: "./sounds/ro/start.wav",sync: true})
  await timeout(3000)
  }
}

x()
// setTimeout((params) => {
//   console.log("gg")
// }
// ,40000)


