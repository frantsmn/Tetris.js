export default class Ticker {

    constructor(block) {
        this.actualLevel = 0;
        this.delay = [800, 717, 633, 550, 467, 383, 300, 217, 133, 100, 83, 83, 83, 67, 67, 67, 50, 50, 50, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 17];
        this.setInterval = null;

        this.start = (level = this.actualLevel) => {
            // console.log('...>', level);
            this.setInterval = setInterval(() => {
                block.activeBlock.moveDown();
                console.log('.');
            }, this.delay[level]);
        }

        this.pause = (delay) => {
            setTimeout(clearInterval(this.setInterval), 0);
            setTimeout(this.start, delay);
        }

        this.stop = () => {
            setTimeout(clearInterval(this.setInterval), 0);
        }

        EMITTER.subscribe('block:gameOver', this.stop);

        //TODO:
        //Запускается пауза и таймер ТРИЖДЫ, если происходят все события одновременно
        // EMITTER.subscribe('block:blockFixed', () => this.pause(2000), 0); //this.delay[this.actualLevel]
        // EMITTER.subscribe('canvas:wipeAnimationStart', () => this.pause(2000), 0);
        // EMITTER.subscribe('stats:newLevel', (level) => {
        //     this.actualLevel = level;
        //     setTimeout(clearInterval(this.setInterval), 0);
        //     this.start(this.actualLevel);
        // });
        // EMITTER.subscribe('canvas:wipeAnimationEnd', this.start);
    }

    // constructor() {
    //     let timeoutID = 0;
    //     let tickerActive = false;
    //     let actualLevel = 0;
    //     const delay = [800, 717, 633, 550, 467, 383, 300, 217, 133, 100, 83, 83, 83, 67, 67, 67, 50, 50, 50, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 17];

    //     let del = delay[actualLevel];

    //     setInterval

    //     this.start = (startDelay = del * 2) => {

    //         //Только если активность не ожидается, можем запустить тикер (защита от повторного вызова)
    //         if (tickerActive === false) {

    //             //Start
    //             console.log('Start | Actual level:', actualLevel);
    //             tickerActive = true;
    //             timeoutID = setTimeout(function tick() {

    //                 //Tick
    //                 console.log('.');
    //                 timeoutID = setTimeout(() => {
    //                     if (tickerActive) {
    //                         block.activeBlock.moveDown();
    //                         tick();
    //                     } else {
    //                         console.log('ELSE');
    //                         clearTimeout(timeoutID);
    //                         tick();
    //                     }
    //                 }, del);


    //             }, startDelay);
    //         }
    //     }

    //     this.stop = () => {
    //         console.log('Stop');
    //         setTimeout(clearTimeout(timeoutID), 0);
    //         tickerActive = false;
    //     }

    //     EMITTER.subscribe('block:gameOver', () => {
    //         console.log('Ticker stopped by GameOver');
    //         this.stop();
    //     });
    //     EMITTER.subscribe('canvas:wipeAnimationStart', () => {
    //         console.log('Delay added to ticker by animation');
    //         del += 360;
    //     });
    //     EMITTER.subscribe('canvas:wipeAnimationEnd', () => {
    //         console.log('Ticker delay restored after animation');
    //         // this.start(delay[actualLevel]);
    //         del = delay[actualLevel];
    //     });
    //     EMITTER.subscribe('stats:newLevel', (level) => {
    //         del = delay[actualLevel];
    //     });
    // }

}