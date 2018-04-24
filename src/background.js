
import path from 'path';
import url from 'url';
import { app, Menu , Tray, BrowserWindow, ipcMain} from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate } from './menu/edit_menu_template';
import { aboutMenuTemplate } from './menu/about_menu_template.js';
import createWindow from './helpers/window';
// import zmq from 'zmq';

import env from './env';

const {exec} = require('child_process');

const setApplicationMenu = () => {
  const menus = [aboutMenuTemplate];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath} (${env.name})`);
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



app.on('ready', () => {

  // autoUpdater.checkForUpdates();
  setApplicationMenu();
  // runSetStartUp();
  //set taskbar
  const nativeImage = require('electron').nativeImage;
  var imageIcon = nativeImage.createFromPath(__dirname + "/images/icon.ico");
  appIcon = new Tray(imageIcon)
  appIcon.setToolTip('Computer Informations, V0.2.3');//右下方icon顯示版號

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

app.on('window-all-closed', () => {
  app.quit();
});
