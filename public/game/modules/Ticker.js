export default class Ticker {

    constructor(block, sound) {

        this.actualLevel = 0;
        this.delay = [800, 717, 633, 550, 467, 383, 300, 217, 133, 100, 83, 83, 83, 67, 67, 67, 50, 50, 50, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 17];
        this.intervalId = null;
        let running = false;

        this.run = (level = this.actualLevel) => {
            if (!running) {
                running = true;
                console.log("running: ", running);
                // console.log('...>', level);
                this.intervalId = setInterval(() => {

                    if (running) {
                        block.activeBlock.moveDown();
                        console.log('.');
                    } else {
                        requestAnimationFrame(() => {
                            clearInterval(this.intervalId);
                        });
                    }

                }, this.delay[level]);
            }
        }

        //Остановка тикера
        this.stop = () => {
            clearInterval(this.intervalId);
            requestAnimationFrame(() => {
                running = false;
                //Важно! Сразу же обнуляем таймер, чтобы небыло срабатывания "moveDown" после GameOver
                clearInterval(this.intervalId);
                console.log("running: ", running);
            });
        }

        //Приостановка
        this.sleep = (delay) => {
            clearInterval(this.intervalId);
            requestAnimationFrame(() => {
                running = false;
                console.log("running: ", running);
                debounce(this.run, delay)();
            });
        }

        this.togglePause = () => {
            if (running) {
                running = !running;
                EMITTER.emit('ticker:pausePressed');
                sound.play('pause');
                return true;
            } else {
                EMITTER.emit('ticker:pauseReleased');
                this.sleep(0);
                sound.play('pause');
                return false;
            }
        }

        //ID Таймера отсчета текущей задержки
        let timerId = null;
        //По умолчанию (текущая) минимальная задержка 0ms
        let actualDelay = 0;

        //Функция возвращает обертку, которая выполнит вложенную функцию, через заданный промежуток времени,
        //если не будет запрошена еще одна обертка с бОльшей задержкой либо задержкой равной предыдущей
        function debounce(fn, delay) {

            console.log(`Запрошена задержка в ${delay}ms`);

            //Возвращаем обертку, которая выполнит функцию через заданную задержку
            return function debounced() {
                //Если запрошенная задержка больше либо равна предыдущей, то
                if (delay >= actualDelay) {
                    //Запомним наибольшую
                    actualDelay = delay;

                    console.log('Очистили предыдущий таймер. TimerID: ', timerId);

                    //очистим предыдущий таймер,
                    clearTimeout(timerId);

                    let args = arguments;
                    let that = this;
                    //и теперь ждать (дОльше) до выполнения функции
                    timerId = setTimeout(() => {
                        fn.apply(that, args);
                        console.log(`Функция выполнена после ${delay}ms`);
                        //После выполнения функции, обнулим величину задержки
                        actualDelay = 0;
                        console.log('Минимальная задержка теперь равна 0');
                    }, delay);
                } else {
                    console.log(`Запрошенная задержка была меньше предыдущей. Будет выполнена функция в обертке с наибольшей задержкой.`);
                }
                //Если же запрошенная задержка была меньше предыдущей,
                //то условие в возвращаемой обертке не выполняется
                //и заданная функция не поставится на таймер
            };
        }

        EMITTER.subscribe('block:gameOver', this.stop);
        EMITTER.subscribe('block:blockFixed', () => this.sleep(60));
        EMITTER.subscribe('canvas:wipeAnimationStart', () => this.sleep(360));

        EMITTER.subscribe('stats:newLevel', (level) => {
            this.actualLevel = level;
        });
    }
}