export default class Control {
    constructor(controller, block) {

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
            'button-b': 'B',
            'button-a': 'A',
            'button-right': 'Right',
            'button-left': 'Left',
            'button-down': 'Down'
        }

        this.stopListenKeyboard = function stopListenKeyboard() {
            document.removeEventListener('keydown', this.keydown);
            document.removeEventListener('keyup', this.keyup);
            controller.querySelectorAll('button').forEach((button) => {
                button.removeEventListener('touchstart', this.keydown);
                button.removeEventListener('touchend', this.keyup);
            });
        }

        this.startListenKeyboard = function startListenKeyboard() {
            document.addEventListener('keydown', this.keydown);
            document.addEventListener('keyup', this.keyup);
            controller.querySelectorAll('button').forEach((button) => {
                button.addEventListener('touchstart', this.keydown);
                button.addEventListener('touchend', this.keyup);
            });
        }

        this.keydown = (e) => {

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
                    }, 267);
                    break;
                case 'Left':
                    clearTimeout(shiftRepeatTimeoutID); //Обнуляем повторы нажатия чтобы не возникал кнфликт при одновременном нажатии
                    block.activeBlock.moveLeft();
                    shiftRepeatTimeoutID = setTimeout(function tick() {
                        block.activeBlock.moveLeft();
                        //Рекурсивно вызываем таймаут
                        shiftRepeatTimeoutID = setTimeout(tick, 100);
                    }, 267);
                    break;
                case 'Down':
                    setTimeout(()=> {clearTimeout(shiftRepeatTimeoutID); console.log('cleared before!')},0);
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
        }

        
        this.keyup = (e) => {

            delete this.key[voc[e.keyCode || e.srcElement.id]];

            // setTimeout(, 0);
            //Если были нажаты кнопки поворота, то не стоит сбрасывать интервалы повтора перемещений,
            //иначе движение фигуры по зажатой кнопке (влево/вправо), прекратится
            switch (voc[e.keyCode || e.srcElement.id]) {
                // case 'B':
                // case 'A':
                //     return;
                case 'Down':
                    //Сообщаем об отпущенной клавише "down" (необходимо для подсчета строк, за которые дропнется блок)
                    EMITTER.emit('control:downPressed', false);
                    //Очищаем интервал
                    setTimeout(clearTimeout(downRepeatTimeoutID), 0);
                    break;
                case 'Left':
                case 'Right':
                    setTimeout(clearTimeout(shiftRepeatTimeoutID), 0);
                    
                    break;
                default:
                    break;
            }

            // console.log('keyup: this.key = ', this.key);

            //Стили для отпущенной тач-кнопки
            e.srcElement.classList.remove('active');
        }

        this.startListenKeyboard(); //?

        // EMITTER.subscribe('canvas:wipeAnimationStart', () => this.stopListenKeyboard()); //Блокируем управление во время анимации
        // EMITTER.subscribe('canvas:wipeAnimationEnd', () => this.startListenKeyboard()); //Разблокируем управление после анимации
        EMITTER.subscribe('block:gameOver', () => {
            //Блокируем управление по gameover
            this.stopListenKeyboard();
            //Вне очереди очищаем рекурсивный таймаут на повтор движения в стороны
            setTimeout(() => clearTimeout(shiftRepeatTimeoutID), 0);
            //Вне очереди очищаем рекурсивный таймаут на повтор движения вниз
            setTimeout(() => clearTimeout(downRepeatTimeoutID), 0);
        });
        EMITTER.subscribe('block:blockFixed', () => {
            //Вне очереди очищаем рекурсивный таймаут на повтор движения вниз
            //Таким образом запрещаем блоку сразу падать после появления
            window.requestAnimationFrame(() => {
                clearTimeout(downRepeatTimeoutID); console.log('downRepeatTimeoutID cleared!');
            });
            // setTimeout(() => clearTimeout(downRepeatTimeoutID), 0);
        });
    }
}