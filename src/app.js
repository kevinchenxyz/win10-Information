// Here is the starting point for your application code.

// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';

// All stuff below is just to show you how it works. You can delete all of it.
import { remote, screen} from 'electron';
import jetpack from 'fs-jetpack';
import { greet } from './hello_world/hello_world';
import { Language_zh_tw } from './language/zh_tw';
import { Language_en_us } from './language/en_us';
import env from './env';

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());
const os = require('os');
const process = require('process');

const electron = require('electron');
var screenElectron = electron.screen;
var mainScreen = screenElectron.getPrimaryDisplay();
var dimensions = mainScreen.size;

var versionString = require('child_process').execSync('ver').toString().trim();


const powerShell = require('node-powershell');

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files form disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read('package.json', 'json');

const osMap = {
  win32: 'Windows',
  darwin: 'macOS',
  linux: 'Linux',
};

const pressenv = process.env;
var language = pressenv.LANG || pressenv.LANGUAGE || pressenv.LC_ALL || pressenv.LC_MESSAGES;
var language_code = null;
console.log(process);
if(language){
  language = language.toLowerCase();
  language = language.split('.');
  language_code = language[0];
}

var itemName;
switch (language_code) {
  case 'zh_tw':
  itemName = Language_zh_tw;
    break;
  case 'en_us':
  itemName = Language_en_us;
    break;

  default:
  itemName = Language_en_us;
    break;
}
// console.log(os.networkInterfaces().eth0.address);

var cpus = os.cpus();
var cpusElement = '';
cpus.forEach(function (val, key) {
 cpusElement += '<div class="panel panel-info">';
    cpusElement += '<div class="panel-heading">' + itemName.cpu + '-' + (key+1) + '</div>';
    cpusElement += '<div class="panel-body">';
      cpusElement += '<p> CPU Model: '+val.model+'</p>';
      cpusElement += '<p> CPU Speed: '+val.speed+'</p>';
      cpusElement += '<label> CPU Times:</label>';
      cpusElement += '<p> Time-idle: '+val.times.idle+'</p>';
      cpusElement += '<p> Time-irq: '+val.times.irq+'</p>';
      cpusElement += '<p> Time-nice: '+val.times.nice+'</p>';
      cpusElement += '<p> Time-sys: '+val.times.sys+'</p>';
      cpusElement += '<p> Time-user: '+val.times.user+'</p>';
    cpusElement += '</div>';
 cpusElement += '</div>';
});

var getHotFix = function () {
  let ps = new powerShell({
    executionPolicy: 'Bypass',
    noProfile: true
  });
  
  // ps.addCommand('get-hotfix -Description "Hotfix*" > ./hotfix.log');
  ps.addCommand('get-hotfix > ./hotfix.log');
  ps.invoke()
  .then(output => {
    var gethotfix = output;
    var showhotfixlist = '';
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream('./hotfix.log')
    });
    lineReader.on('line', function (line) {
      showhotfixlist += line.toString().trim()+'<br>';
    });

    setTimeout( function() {
      document.querySelector('#hotfixlist').innerHTML =  '<pre>'+showhotfixlist+'</pre>';
      if(!showhotfixlist){
        document.querySelector('#nodata').style.display = 'block';
        document.querySelector('#hotfixlist').remove();
      }
      document.querySelector('#loading').remove();
    },500);
  })
  .catch(err => {
    console.log(err);
    ps.dispose();
  });
}
getHotFix();

//item title
document.querySelector('#greet').innerHTML = itemName.title;
document.querySelector('#ip_address').innerHTML = itemName.ip_address;
document.querySelector('#mac_address').innerHTML = itemName.mac_address;
document.querySelector('#computer_name').innerHTML = itemName.computer_name;
document.querySelector('#memory_info').innerHTML = itemName.memory;
document.querySelector('#screen_resolution').innerHTML = itemName.screen_resolution;
document.querySelector('#windows_version').innerHTML = itemName.windows_version;
document.querySelector('#hotfix_imformations').innerHTML = itemName.hotfix;

//content
var noconnectmsg = '<span style="color:orange;">Network is not connected</span>';
if(os.networkInterfaces()['Ethernet']){
  document.querySelector('#ipaddress').innerHTML = os.networkInterfaces()['Ethernet']['1'].address;
  document.querySelector('#macaddress').innerHTML = os.networkInterfaces()['Ethernet']['1'].mac;
} else {
  document.querySelector('#ipaddress').innerHTML = noconnectmsg;
  document.querySelector('#macaddress').innerHTML = noconnectmsg;
}

document.querySelector('#hostname').innerHTML = os.hostname();
document.querySelector('#cpuloop').innerHTML = cpusElement;
document.querySelector('#memory').innerHTML =  os.freemem() + '/' + os.totalmem() + '(bytes)';
document.querySelector('#screen').innerHTML =  dimensions.width + "x" + dimensions.height;
document.querySelector('#versionString').innerHTML =  versionString;

