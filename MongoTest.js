const spawn = require('child_process').spawn;
const ls = spawn('mongod', ['--dbpath','/data/db','--port', '27017']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

//mongod --dbpath /data/db --port 27017