import { window, globalShortcut, process } from '@tauri-apps/api'
import { createApp } from 'vue'
import data from '/src/setting.json'
import breakUrl from '/src/break.mp3'
import workUrl from '/src/work.mp3'
import pauseUrl from '/src/pause.mp3'


const screen = await window.primaryMonitor();
const windowSize = await window.appWindow.innerSize();
const windowPos = new window.LogicalPosition(screen.size.width - windowSize.width + 16 - 140, 0)
window.appWindow.setPosition(windowPos)


globalShortcut.register('Super+Esc', () => {
    process.exit();
})

globalShortcut.register('Super+F2', () => {
    tomato.tiktok();
})

globalShortcut.register('Super+F3', () => {
    tomato.change();
})

function Clock(wt, bt) {
    this.dir = ''
    this.currentTime = wt * 60;
    this.loadbar = 100;
    this.sts = 'work';
    this.notice = false;
    let noticeID;
    this.pause = true;
    this.tikID
    this.alarm = new Audio(workUrl)
    this.ppp = new Audio(pauseUrl)
    this.tiktok = (change) => {
        this.notition();
        if (!change) {
            this.ppp.play();
        }
        if (this.pause) {
            this.tikID = setInterval(() => {
                if (this.currentTime == 0) {
                    switch (this.sts) {
                        case 'work':
                            this.currentTime = bt * 60;
                            this.sts = 'break';
                            this.alarm.src = breakUrl;
                            break;
                        case 'break':
                            this.currentTime = wt * 60;
                            this.sts = 'work';
                            this.alarm.src = workUrl;
                            break;
                        default:
                    }
                    this.alarm.play();
                    this.notition();
                } else {
                    this.currentTime--
                }
                switch (this.sts) {
                    case 'work':
                        this.loadbar = Math.floor(this.currentTime / (wt * 60) * 100)
                        break;
                    case 'break':
                        this.loadbar = Math.floor(this.currentTime / (bt * 60) * 100)
                        break;
                    default:
                }
                if (!this.notice) {
                    vm.loadbar = this.loadbar;
                }
                vm.ct = secondToMMSS(this.currentTime)
                vm.sts = this.sts
            }, 1000);
        } else {
            clearInterval(this.tikID)
        }
        this.pause = !this.pause;
        vm.pause = this.pause;
    }
    this.change = () => {
        this.notition();
        switch (this.sts) {
            case 'work':
                this.currentTime = bt * 60;
                this.sts = 'break';
                this.alarm.src = breakUrl
                break;
            case 'break':
                this.currentTime = wt * 60;
                this.sts = 'work';
                this.alarm.src = workUrl
                break;
            default:
        }
        this.alarm.play();
        vm.ct = secondToMMSS(this.currentTime)
        vm.sts = this.sts
        if (this.pause) {
            this.tiktok(true);
        }
    }
    this.loadTime = (dir) => {
        this.dir = dir
        wt = data.workTime;
        bt = data.breakTime;
        this.currentTime = wt * 60
    }
    this.notition = () => {
        if (!this.notice) {
            this.notice = true;
            vm.notice = this.notice;
            vm.loadbar = 50;
            noticeID = setTimeout(() => {
                this.notice = false;
                vm.notice = this.notice;
                if (!this.pause) {
                    vm.loadbar = this.loadbar;
                } else {
                    vm.loadbar = 100
                }
            }, 2000)
        } else {
            clearTimeout(noticeID);
            noticeID = setTimeout(() => {
                this.notice = false;
                vm.notice = this.notice;
                if (!this.pause) {
                    vm.loadbar = this.loadbar;
                } else {
                    vm.loadbar = 100
                }
            }, 2000)
        }

    }
}
//时间格式转换
const secondToMMSS = (t) => {
    let minute = parseInt(t / 60);
    let second = parseInt(t % 60);
    let MMSS = minute.toString().padStart(2, '0') + ':' + second.toString().padStart(2, '0');
    return MMSS;
}

//Vue模块
const app = createApp({
    data() {
        return {
            ct: 0,
            sts: 'work',
            pause: true,
            notice: true,
            loadbar: 100
        }
    }
})
const vm = app.mount('#root')

const tomato = new Clock(1, 1)
tomato.loadTime('/src/')
console.log(tomato)
vm.ct = secondToMMSS(tomato.currentTime)
vm.sts = tomato.sts
vm.pause = tomato.pause