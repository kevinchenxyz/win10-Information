(function () {'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var electron = require('electron');
var jetpack = _interopDefault(require('fs-jetpack'));

// This gives you default context menu (cut, copy, paste)
// in all input fields and textareas across your app.

const Menu = electron.remote.Menu;
const MenuItem = electron.remote.MenuItem;

const isAnyTextSelected = () => {
  return window.getSelection().toString() !== '';
};

const cut = new MenuItem({
  label: 'Cut',
  click: () => {
    document.execCommand('cut');
  },
});

const copy = new MenuItem({
  label: 'Copy',
  click: () => {
    document.execCommand('copy');
  },
});

const paste = new MenuItem({
  label: 'Paste',
  click: () => {
    document.execCommand('paste');
  },
});

const normalMenu = new Menu();
normalMenu.append(copy);

const textEditingMenu = new Menu();
textEditingMenu.append(cut);
textEditingMenu.append(copy);
textEditingMenu.append(paste);

document.addEventListener('contextmenu', (event) => {
  switch (event.target.nodeName) {
    case 'TEXTAREA':
    case 'INPUT':
      event.preventDefault();
      textEditingMenu.popup(electron.remote.getCurrentWindow());
      break;
    default:
      if (isAnyTextSelected()) {
        event.preventDefault();
        normalMenu.popup(electron.remote.getCurrentWindow());
      }
  }
}, false);

// Convenient way for opening links in external browser, not in the app.
// Useful especially if you have a lot of links to deal with.
//
// Usage:
//
// Every link with class ".js-external-link" will be opened in external browser.
// <a class="js-external-link" href="http://google.com">google</a>
//
// The same behaviour for many links can be achieved by adding
// this class to any parent tag of an anchor tag.
// <p class="js-external-link">
//    <a href="http://google.com">google</a>
//    <a href="http://bing.com">bing</a>
// </p>

const supportExternalLinks = (event) => {
  let href;
  let isExternal = false;

  const checkDomElement = (element) => {
    if (element.nodeName === 'A') {
      href = element.getAttribute('href');
    }
    if (element.classList.contains('js-external-link')) {
      isExternal = true;
    }
    if (href && isExternal) {
      electron.shell.openExternal(href);
      event.preventDefault();
    } else if (element.parentElement) {
      checkDomElement(element.parentElement);
    }
  };

  checkDomElement(event.target);
};

document.addEventListener('click', supportExternalLinks, false);

const Language_zh_tw = {
    'title': '顯示電腦資訊',
    'ip_address': 'IP 位置',
    'mac_address': 'MAC 位置',
    'computer_name': '電腦名稱',
    'memory': '記憶體使用狀況',
    'screen_resolution': '螢幕解析度',
    'windows_version': 'Windows 版本',
    'cpu': '中央處理器',
    'hotfix': 'Hotfix更新資訊',
  };

const Language_en_us = {
    'title': 'Information About Your Computer',
    'ip_address': 'IP Address',
    'mac_address': 'MAC Address',
    'computer_name': 'Computer Name',
    'memory': 'Memory',
    'screen_resolution': 'Screen Resolution',
    'windows_version': 'Windows Version',
    'cpu': 'CPU',
    'hotfix': 'HotFix Imformations',
  };

// Simple wrapper exposing environment variables to rest of the code.

// The variables have been written to `env.json` by the build process.
const env = jetpack.cwd(__dirname).read('env.json', 'json');

// Here is the starting point for your application code.

// Small helpers you might want to keep
// All stuff below is just to show you how it works. You can delete all of it.
const app = electron.remote.app;
const appDir = jetpack.cwd(app.getAppPath());
const os = require('os');
const process = require('process');

const electron$1 = require('electron');
var screenElectron = electron$1.screen;
var mainScreen = screenElectron.getPrimaryDisplay();
var dimensions = mainScreen.size;

var versionString = require('child_process').execSync('ver').toString().trim();


const powerShell = require('node-powershell');

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files form disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read('package.json', 'json');

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
  
  ps.addCommand('get-hotfix -Description "Hotfix*" > ./hotfix.log');
  // ps.addCommand('get-hotfix > ./hotfix.log');
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
};
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

}());
//# sourceMappingURL=app.js.map