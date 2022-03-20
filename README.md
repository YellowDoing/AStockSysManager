#### 一款模拟资源管理器的桌面看股软件

![](https://note.youdao.com/yws/api/personal/file/WEB11b7aa8700761caf6ec8cbc09adf14cf?method=download&shareKey=22fe9113d8696adc8a0efbbc05bc84ca)

- 进程 (自定义的名称)
- CPU (涨跌幅)
- 磁盘 (价格)
- 网络 (涨跌数)

#### 代码运行
需要node.js环境变量

clone项目代码

```
npm install
npm start
```


### 添加自选股
快捷键 'alt' 打开命令输入框

`add 进程名称 股票代码`

> 比如添加贵州茅台，`add MT SH600519`

进程名称 是自定义的，可中文可英文

股票代码要带上SH或SZ

### 删除自选股

`remove 进程名称`

### 清空自选股

`clear`