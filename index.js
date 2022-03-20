const { app, BrowserWindow ,nativeTheme ,Menu,ipcMain } = require('electron');
const { MenuItem } = require('electron/main');

const createWindow = () => {
    const win = new BrowserWindow({
      // width: localStorage.getItem('width')??300,
      // height: localStorage.getItem('heihgt')??360
      width: 300,
      height: 360,
      webPreferences: {
        nodeIntegration: true,
        // 官网似乎说是默认false，但是这里必须设置contextIsolation
        contextIsolation: false
  
    }}
    )
  
    win.loadFile('index.html')
    //打开开发者工具
   //win.openDevTools();

   win.on('resized',(e) =>{

     let bounds = win.getContentBounds();
    win.webContents.send("save-content-bounds", {
      width:bounds.width,
      height:bounds.height
    });

  })

  ipcMain.on('content-bounds', (event, arg) => {
    console.log(arg) 
    win.setBounds(arg)
  })

   
  }


  //创建窗口
  app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })

      nativeTheme.themeSource = 'dark'

      Menu.setApplicationMenu(null)

    
      
  })


// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  