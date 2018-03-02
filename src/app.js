// Here is the starting point for your application code.

// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';

// All stuff below is just to show you how it works. You can delete all of it.
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import { greet } from './hello_world/hello_world';
import env from './env';

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());
const os = require('os');
// Holy crap! This is browser window with HTML and stuff, but I can read
// here files form disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read('package.json', 'json');

const osMap = {
  win32: 'Windows',
  darwin: 'macOS',
  linux: 'Linux',
};
console.log(os.cpus());

// console.log(os.networkInterfaces().eth0.address);

var cpus = os.cpus();
var cpusElement = '';
cpus.forEach(function (val) {
 cpusElement += '<p> CPU Model: '+val.model+'</p>';
 cpusElement += '<p> CPU Speed: '+val.speed+'</p>';
 cpusElement += '<h4> CPU Times:</h4>';
 cpusElement += '<p> Time-idle: '+val.times.idle+'</p>';
 cpusElement += '<p> Time-irq: '+val.times.irq+'</p>';
 cpusElement += '<p> Time-nice: '+val.times.nice+'</p>';
 cpusElement += '<p> Time-sys: '+val.times.sys+'</p>';
 cpusElement += '<p> Time-user: '+val.times.user+'</p>';
});

// document.querySelector('#greet').innerHTML = greet();
document.querySelector('#greet').innerHTML = '本機資訊顯示';
// document.querySelector('#ipaddress').innerHTML = os.networkInterfaces()['Ethernet']['1'].address;
// document.querySelector('#macaddress').innerHTML = os.networkInterfaces()['Ethernet']['1'].mac;
document.querySelector('#hostname').innerHTML = os.hostname();
console.log(cpusElement);
document.querySelector('#cpuloop').innerHTML = cpusElement;
