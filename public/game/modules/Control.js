export default class Control {
    constructor(controller, block, ticker) {

        //Флаг для регирования на нажатия (true = реагировать | false = не реагировать )
        let controlAvailable = true;
        //ID таймаута для повторений движения влево/вправо блока, при зажатой кнопке
        let shiftRepeatTimeoutID = 0;
        //ID таймаута для повторений движения вниз блока, при зажатой кнопке
        let downRepeatTimeoutID = 0;
        //Объект с инф. о нажатых кнопках
        this.key = {};
        //Словарь соответствия нажатых клавиш действиям
        const voc = {
            68: 'B', //D
            70: 'A', //F
            39: 'Right',
            37: 'Left',
            40: 'Down',
            32: 'Pause',
            'button-b': 'B',
            'button-a': 'A',
            'button-right': 'Right',
            'button-left': 'Left',
            'button-down': 'Down',
            'button-pause': 'Pause',
        }

        this.keydown = (e) => {

            if(voc[e.keyCode || e.srcElement.id] === 'Pause') {
                ticker.togglePause();
                return;
            }

            if (controlAvailable) {

                //Если такая кнопка уже нажата, то избавляемся от системных повторов нажатия (система клацает сама, при зажатии клавиши)
                if (this.key[voc[e.keyCode || e.srcElement.id]]) return;
                //Сохранить в свойство объекта key, какая кнопка на калавиатуре нажата
                this.key[voc[e.keyCode || e.srcElement.id]] = true;
                //Применение стилей для нажатой тач-кнопки
                e.srcElement.classList.add('active');

                // console.log('keydown: this.key = ', this.key, ' code: ', e.keyCode);

                switch (voc[e.keyCode || e.srcElement.id]) {
                    case 'B':
                        block.activeBlock.rotateLeft();
                        return;
                    case 'A':
                        block.activeBlock.rotateRight();
                        return;
                    case 'Right':
                        clearTimeout(shiftRepeatTimeoutID); //Обнуляем повторы нажатия чтобы не возникал кнфликт при одновременном нажатии
                        block.activeBlock.moveRight();
                        shiftRepeatTimeoutID = setTimeout(function tick() {
                            block.activeBlock.moveRight();
                            //Рекурсивно вызываем таймаут
                            shiftRepeatTimeoutID = setTimeout(tick, 100);
                        }, 260);
                        break;
                    case 'Left':
                        clearTimeout(shiftRepeatTimeoutID); //Обнуляем повторы нажатия чтобы не возникал кнфликт при одновременном нажатии
                        block.activeBlock.moveLeft();
                        shiftRepeatTimeoutID = setTimeout(function tick() {
                            block.activeBlock.moveLeft();
                            //Рекурсивно вызываем таймаут
                            shiftRepeatTimeoutID = setTimeout(tick, 100);
                        }, 260);
                        break;
                    case 'Down':
                        // setTimeout(() => {
                        //     clearTimeout(shiftRepeatTimeoutID);
                        //     console.log('cleared before!')
                        // }, 0);
                        downRepeatTimeoutID = setTimeout(function tick() {
                            block.activeBlock.moveDown();
                            //Сообщаем о нажатой клавише вниз (необходимо для подсчета строк, которые пролетит блок)
                            EMITTER.emit('control:downPressed', true);
                            //Рекурсивно вызываем таймаут
                            downRepeatTimeoutID = setTimeout(tick, 37);
                        }, 0);
                        break;
                    default:
                        break;
                }
            } else {
                //Даже если контролллер заблокирован, необходимо отслеживать последние нажатые клавиши
                //чтобы после разблокировки контроллера, не срабатвыала заранее зажатая клавиша

                //Сохранить в свойство объекта key, какая кнопка на калавиатуре нажата
                this.key[voc[e.keyCode || e.srcElement.id]] = true;
            }
        }

        this.keyup = (e) => {

            delete this.key[voc[e.keyCode || e.srcElement.id]];

            switch (voc[e.keyCode || e.srcElement.id]) {
                case 'Down':
                    //Сообщаем об отпущенной клавише "down" (необходимо для подсчета строк, за которые дропнется блок)
                    EMITTER.emit('control:downPressed', false);
                    setTimeout(clearTimeout(downRepeatTimeoutID), 0);
                    break;
                case 'Left':
                case 'Right':
                    setTimeout(clearTimeout(shiftRepeatTimeoutID), 0);
                    break;
                default:
                    break;
            }

            //Применить стили для отпущенной тач-кнопки
            e.srcElement.classList.remove('active');

        }

        const controlLock = () => {
            controlAvailable = false;
            //Вне очереди очищаем рекурсивный таймаут на повтор движения в стороны
            // setTimeout(() => clearTimeout(shiftRepeatTimeoutID), 0);
            //Вне очереди очищаем рекурсивный таймаут на повтор движения вниз
            // setTimeout(() => clearTimeout(downRepeatTimeoutID), 0);

            window.requestAnimationFrame(() => {
                clearTimeout(downRepeatTimeoutID);
                // console.log('downRepeatTimeoutID cleared!');
            });

            window.requestAnimationFrame(() => {
                // clearTimeout(shiftRepeatTimeoutID);
                // console.log('downRepeatTimeoutID cleared!');
            });
            // console.log('control available: ', controlAvailable);
        }

        const controlUnlock = () => {
            controlAvailable = true;
            // console.log('control available: ', controlAvailable);
        }

        //Вешаем обработчики на кнопки
        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
        controller.querySelectorAll('button').forEach((button) => {
            button.addEventListener('touchstart', this.keydown);
            button.addEventListener('touchend', this.keyup);
        });

        EMITTER.subscribe('canvas:wipeAnimationStart', () => controlLock()); //Блокируем управление во время анимации
        EMITTER.subscribe('canvas:wipeAnimationEnd', () => controlUnlock()); //Разблокируем управление после анимации
        EMITTER.subscribe('block:gameOver', () => controlLock()); //Блокируем управление по gameover
        EMITTER.subscribe('block:blockFixed', () => {
            //Вне очереди очищаем рекурсивный таймаут на повтор движения вниз
            //Таким образом запрещаем блоку сразу падать после появления
            window.requestAnimationFrame(() => {
                clearTimeout(downRepeatTimeoutID);
                // console.log('downRepeatTimeoutID cleared!');
            });
        });

    }
}