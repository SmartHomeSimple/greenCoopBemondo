var Service = require('node-windows').Service;
const path = require("path")

const svc = new Service({
  name:'SpeakerService',
  description: 'SHS Speaker Service',
  script: path.join(__dirname, "server.js")
});

module.exports = { svc }