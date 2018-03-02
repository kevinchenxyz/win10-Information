
import path from 'path';
import url from 'url';
import { app, Menu , Tray, BrowserWindow, ipcMain} from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';
// import zmq from 'zmq';
import macaddress from 'macaddress';

import env from './env';

const {exec} = require('child_process');



const setApplicationMenu = () => {
  const menus = [editMenuTemplate];
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
  appIcon.setToolTip('設定自動登入,版本V0.1.0');//右下方icon顯示版號

  // var fs = require('fs');

  // //確認捷徑
  // if(!fs.existsSync('C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\StartUp\\clientron_agent.lnk')){
  //   //將捷徑放入工作排程
  //   exec('cd %UserProfile% && cd ../Public && copy /Y Desktop\\clientron_agent.lnk "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\StartUp"',function(error, stdout, stderr){
  //   });
  // }
  
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
    mainWindow.openDevTools();

  // // }
});

app.on('window-all-closed', () => {
  // app.quit();
});
