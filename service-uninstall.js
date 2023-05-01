const { svc } = require("./service_variables");

svc.on('uninstall',function(){
  console.log('Uninstall complete.');
});

svc.uninstall();
