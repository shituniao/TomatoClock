const workTime = 10;
const breakTime = 5;
let sts = 'work';
let currentTime = workTime;
let timeNum = document.querySelector("#timeNum");
const alarm = document.querySelector("#alarm");
const secondToMMSS = (time) => {
    let minute = parseInt(time / 60);
    let second = parseInt(time % 60);
    let MMSS = minute.toString().padStart(2, '0') + ':' + second.toString().padStart(2, '0');
    return MMSS;
}
timeNum.innerHTML = secondToMMSS(currentTime);

const clockOn = () => {
    setInterval(() => {
        currentTime -= 1;

        if (currentTime == 0) {
            switch (sts) {
                case 'work':
                    alarm.setAttribute("src", "2.mp3");
                    currentTime = breakTime;
                    sts = 'break';
                    break;
                case 'break':
                    alarm.setAttribute("src", "1.mp3");
                    currentTime = workTime;
                    sts = 'work';
                    break;
                default:
            }
            alarm.play();
        }
        timeNum.innerHTML = secondToMMSS(currentTime);
    }, 1000);
};

