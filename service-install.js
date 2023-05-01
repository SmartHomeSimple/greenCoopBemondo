const { svc } = require("./service_variables");

svc.on('install',function(){
  console.log("Service installed!")
  svc.start();
});

svc.on('start',function(){
  console.log('Service started!');
});

svc.install();
