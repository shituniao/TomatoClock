# 番茄钟 我的第一个electron应用

这是我的第一个electron应用，我打算用它来尝试编写一个小的番茄钟计时器，同时学习electron、JS面向对象编程和Vue3。



>### 已经打包了windows平台的压缩包，可以直接下载使用
>#### 下载链接：[番茄钟](https://github.com/shituniao/TomatoClock/releases/download/1.0.0/tomatoclock-win32-x64-1.0.0.zip)
>- 默认工作时间25分钟，休息5分钟，可修改resources目录下的setting.json文件
>- Win+Esc：退出程序
>- win+F2:暂停/继续
>- win+F3：切换状态


## 日志
- **2022-2-18** 调整布局和动画效果
- **2022-2-17** clock功能模块化打包，增加自定义setting功能
- **2022-2-16** clock功能重构至render模块，通过content.send实现，引入Vue，加入状态标题和json配置文件
- **2022-2-15** 完成基本计时功能<br>
- **2022-2-14** 搭建基本页面框架和静态计时器测试<br>
- **2022-2-13** 项目初始化<br> 

## 需要

- LTS版本NodeJS
- yarn（最好更换国内源）
- git

## 安装

clone项目到本地后，在根目录运行命令<br>
`yarn add --dev @electron-forge/cli`<br>
`yarn electron-forge import`<br>

## 测试

`yarn start`

## 打包

`yarn make`
