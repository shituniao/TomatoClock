const { ipcRenderer, process } = require('electron');
const path = require('path')
let tomato
ipcRenderer.on('tik', (evt, arg) => {
    console.log(arg);
    tomato.tiktok(false);
})
ipcRenderer.on('change', (evt, arg) => {
    console.log(arg);
    tomato.change();
})
ipcRenderer.invoke('ispack').then((ispack) => {
    let dir = './'
    tomato = new Clock(1, 1)
    if (ispack) {
        dir = path.join(window.process.resourcesPath, dir)
    } else {
        dir = './'
    }
    tomato.loadTime(dir)
    console.log(tomato)
    vm.ct = secondToMMSS(tomato.currentTime)
    vm.sts = tomato.sts
    vm.pause = tomato.pause
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
    this.alarm = new Audio(this.dir + this.sts + '.mp3')
    this.ppp = new Audio(this.dir + 'pause.mp3')
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
                            break;
                        case 'break':
                            this.currentTime = wt * 60;
                            this.sts = 'work';
                            break;
                        default:
                    }
                    this.alarm.src = this.dir + this.sts + '.mp3';
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
                break;
            case 'break':
                this.currentTime = wt * 60;
                this.sts = 'work';
                break;
            default:
        }
        this.alarm.src = this.dir + this.sts + '.mp3'
        this.alarm.play();
        vm.ct = secondToMMSS(this.currentTime)
        vm.sts = this.sts
        if (this.pause) {
            this.tiktok(true);
        }
    }
    this.loadTime = (dir) => {
        this.dir = dir
        const { workTime, breakTime } = require(dir + 'setting.json')
        wt = workTime;
        bt = breakTime;
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
const app = Vue.createApp({
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


