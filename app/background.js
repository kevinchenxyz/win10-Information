(function () {'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var url = _interopDefault(require('url'));
var electron = require('electron');
var jetpack = _interopDefault(require('fs-jetpack'));

const devMenuTemplate = {
  label: 'Development',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: () => {
      electron.BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
    },
  },
  {
    label: 'Toggle DevTools',
    accelerator: 'Alt+CmdOrCtrl+I',
    click: () => {
      electron.BrowserWindow.getFocusedWindow().toggleDevTools();
    },
  },
  {
    label: 'Quit',
    accelerator: 'CmdOrCtrl+Q',
    click: () => {
      electron.app.quit();
    },
  }],
};

const editMenuTemplate = {
  label: 'Edit',
  submenu: [
    { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
    { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
    { type: 'separator' },
    { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
    { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
    { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
    { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
  ],
};

// This helper remembers the size and position of your windows (and restores
// them in that place after app relaunch).
// Can be used for more than one window, just construct many
// instances of it and give each different name.

var createWindow = (name, options) => {
  const userDataDir = jetpack.cwd(electron.app.getPath('userData'));
  const stateStoreFile = `window-state-${name}.json`;
  const defaultSize = {
    width: options.width,
    height: options.height,
  };
  let state = {};
  let win;

  const restore = () => {
    let restoredState = {};
    try {
      restoredState = userDataDir.read(stateStoreFile, 'json');
    } catch (err) {
      // For some reason json can't be read (might be corrupted).
      // No worries, we have defaults.
    }
    return Object.assign({}, defaultSize, restoredState);
  };

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState, bounds) => {
    return windowState.x >= bounds.x
      && windowState.y >= bounds.y
      && windowState.x + windowState.width <= bounds.x + bounds.width
      && windowState.y + windowState.height <= bounds.y + bounds.height;
  };

  const resetToDefaults = () => {
    const bounds = electron.screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };

  const ensureVisibleOnSomeDisplay = (windowState) => {
    const visible = electron.screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    userDataDir.write(stateStoreFile, state, { atomic: true });
  };

  state = ensureVisibleOnSomeDisplay(restore());

  win = new electron.BrowserWindow(Object.assign({}, options, state));

  win.on('close', saveState);

  return win;
};

// Simple wrapper exposing environment variables to rest of the code.

// The variables have been written to `env.json` by the build process.
const env = jetpack.cwd(__dirname).read('env.json', 'json');

// import zmq from 'zmq';

const {exec} = require('child_process');

const setApplicationMenu = () => {
  const menus = [editMenuTemplate];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
  const userDataPath = electron.app.getPath('userData');
  electron.app.setPath('userData', `${userDataPath} (${env.name})`);
}


let appIcon = null;
// import my_image from '../build/icon.ico'; //relative path to image
// const image = require('./build/icon.ico')
// const image = clipboard.readImage();
// let win = new BrowserWindow({icon: 'icon.ico'})

// autoUpdater.on('update-downloaded', (ev, info) => {
//   // sendStatusToWindow('Update downloaded; will install in 5 seconds');
//   setTimeout(function() {
//     autoUpdater.quitAndInstall();
//   }, 5000)
// });



electron.app.on('ready', () => {

  // autoUpdater.checkForUpdates();
  setApplicationMenu();
  // runSetStartUp();
  //set taskbar
  const nativeImage = require('electron').nativeImage;
  var imageIcon = nativeImage.createFromPath(__dirname + "/images/icon.ico");
  appIcon = new electron.Tray(imageIcon);
  appIcon.setToolTip('設定自動登入,版本V0.1.2');//右下方icon顯示版號

  // var fs = require('fs');
  
  // var ipc = require('electron').ipcMain;

  // ipc.on('invokeAction', function(event, data) {
  //   var fs = require('fs');
  //   var reqCommand = 'Windows Registry Editor Version 5.00\r\n';
  //   reqCommand += '\r\n[HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon]\r\n';
  //   reqCommand += '\r\n"AutoAdminLogon"="1"\r\n';
  //   reqCommand += '"DefaultUserName"="'+data.account+'"\r\n';
  //   reqCommand += '"DefaultPassword"="'+data.pwd+'"\r\n';
  //   reqCommand += '"AutoAdminLogon"="1"\r\n';
  //   fs.writeFile("C:\\TRMConf\\AutoLogin.reg", reqCommand,function (err){
  //     if(err) {
  //       return console.log(err);
  //     }
  //     exec('C:\\TRMConf\\AutoLogin.reg',function(res){});
  //     // alert('svsae');
  //   });
  // });


  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true,
  }));
  //
  // // if (env.name === 'development') {
    // mainWindow.openDevTools();

  // // }
});

electron.app.on('window-all-closed', () => {
  electron.app.quit();
});

}());
//# sourceMappingURL=background.js.map