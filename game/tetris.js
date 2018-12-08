'use strict';

class Matrix {
    constructor(json) {
        this.setEmptyMatrix = function () {
            let m = [];
            for (let i = 0; i < 20; i++) {
                m[i] = [];
                for (let j = 0; j < 10; j++) {
                    m[i][j] = null;
                }
            }
            return m;
        }
        this.matrix = json ? JSON.parse(json) : this.setEmptyMatrix();
    }

    setMatrix(array) { this.matrix = array; }

    getMatrix() { return this.matrix }

    getFixedMatrix() {
        let m = [];
        this.matrix.forEach((element, i) => {
            m[i] = element.map((el) => {
                if (el) {
                    return el.state === 'active' ? null : el;
                }
                return null;
            });
        });
        return m;
    }

    getMatrixJSON() { return JSON.stringify(this.matrix) }

    getFixedMatrixJSON() {
        let m = [];
        this.matrix.forEach((element, i) => {
            m[i] = element.map((el) => {
                if (el) {
                    return el.state === 'active' ? null : el;
                }
                return null;
            });
        });
        return JSON.stringify(m);
    }

    setMatrixJSON(json) { this.matrix = JSON.parse(json); }

    clearMatrix() { this.matrix = this.setEmptyMatrix(); }

    checkPointsIsEmpty(x, y, points) {
        for (let i = 0; i < points.length; i++) {

            //Игноровать точки, которые выше стакана
            if (y + points[i].y < 0) {
                continue;
            }

            //Точка внутри стакана
            if (y + points[i].y <= 19 && x + points[i].x >= 0 && x + points[i].x <= 9) {
                //Точка не накладывается на закрепленную точку
                if (this.matrix[y + points[i].y][x + points[i].x] !== null && this.matrix[y + points[i].y][x + points[i].x].state === 'fixed') {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }

    addPoints(x, y, points, color) {
        for (let i = 0; i < points.length; i++) {
            //Если не выше верхней границы стакана
            if (y + points[i].y >= 0) {
                this.matrix[y + points[i].y][x + points[i].x] = { state: 'active', color: color };
            }
        }
    }

    removePoints(x, y, points) {
        for (let i = 0; i < points.length; i++) {
            //Если не выше верхней границы стакана
            if (y + points[i].y >= 0) {
                this.matrix[y + points[i].y][x + points[i].x] = null;
            }
        }
    }

    fixPoints(x, y, points) {
        for (let i = 0; i < points.length; i++) {
            //Если не выше верхней границы стакана
            if (y + points[i].y >= 0) {
                this.matrix[y + points[i].y][x + points[i].x].state = 'fixed';
            }
        }
    }

    getFullLines() {
        let fullLines = [];
        this.matrix.forEach((line, i) => {
            if (line.every((point) => {
                return point && point.state === 'fixed';
            })) {
                fullLines.push(i);
            }
        });
        return fullLines;
    }

    removeFullLines() {
        this.getFullLines().forEach((fullLineNum) => {
            this.matrix.splice(fullLineNum, 1);
            this.matrix.unshift([null, null, null, null, null, null, null, null, null, null]);
        });
    }
}

class Textures {
    constructor() {

        this[1] = new Image();
        this[2] = new Image();
        this[3] = new Image();

        this.level = 0;

        emitter.subscribe('stats:newLevel', (level) => {
            this.level = level % 10;
        });
    }

    set level(value) {
        this._level = value;
        this[1].src = `/game/svg/textures/level_${value}/type_1.svg`;
        this[2].src = `/game/svg/textures/level_${value}/type_2.svg`;
        this[3].src = `/game/svg/textures/level_${value}/type_3.svg`;
    }

    get level() {
        return this._level;
    }
}

class Canvas {
    constructor(element) {
        this.context = element.getContext('2d');
    }

    drawState(matrix) {
        let context = this.context;
        matrix.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    //Color
                    // context.fillStyle = cell.color;
                    // context.fillRect(x * 20, y * 20, 20, 20);
                    //Texture
                    context.drawImage(textures[cell.color], x * 20, y * 20, 20, 20);
                }
                else {
                    context.clearRect(x * 20, y * 20, 20, 20);
                }
            });
        });
    }

    drawBlock(xPos, yPos, points, color) {
        let context = this.context;
        context.fillStyle = color;
        for (let i = 0; i < points.length; i++) {
            //Color
            context.fillRect((points[i].x + xPos) * 20, (points[i].y + yPos) * 20, 20, 20);
            //Texture
            context.drawImage(textures[color], (points[i].x + xPos) * 20, (points[i].y + yPos) * 20, 20, 20);
        }
    }

    eraseBlock(x, y, points) {
        let context = this.context;
        for (let i = 0; i < points.length; i++) {
            context.clearRect((points[i].x + x) * 20, (points[i].y + y) * 20, 20, 20);
        }
    }

    wipeLinesAnimation(lines, callback) {
        let context = this.context;

        //Трансляция события начала анимации
        emitter.emit('canvas:wipeAnimationStart');

        let i = 0;
        let interval = setInterval(() => {
            lines.forEach((line) => {
                context.clearRect((4 - i) * 20, line * 20, 20, 20);
                context.clearRect((5 + i) * 20, line * 20, 20, 20);
            });
            i++;
            if (i > 5) {
                clearInterval(interval);
                matrix.removeFullLines();
                canvas.drawState(matrix.getFixedMatrix());

                //Трансляция события окончания анимации
                emitter.emit('canvas:wipeAnimationEnd');

                return callback();
            }
        }, 60);
    }

    gameOverAnimation() {
        let context = this.context;
        context.fillStyle = "rgba(0, 0, 0, .25)";
        let n = 0
        let interval = setInterval(() => {
            for (let j = 0; j < 100; j++) {
                let i = j % 2 ? 1 : 0
                for (i; i < 500; i++) {
                    context.fillRect(i * 4, j * 4, 4, 4);
                    i++;
                }
            }
            if (n >= 6) {
                clearInterval(interval);
                return; //callback();
            }
            n++;
        }, 200);
    }
}

class Block {
    constructor(queue) {

        this.createBlock = {
            1: () => new I_block(),
            2: () => new J_block(),
            3: () => new L_block(),
            4: () => new O_block(),
            5: () => new S_block(),
            6: () => new Z_block(),
            7: () => new T_block(),
        };

        this.createRandomQueue = () => [...new Array(1000)].map(() => Math.floor(Math.random() * (7 - 1 + 1)) + 1);
        this.queue = queue ? queue : [...new Array(1000)].map(() => Math.floor(Math.random() * (7 - 1 + 1)) + 1);
        this.activeBlockId = 0;
        this.activeBlock = this.createBlock[this.queue[this.activeBlockId]]();
        this.nextBlock = this.createBlock[this.queue[this.activeBlockId + 1]]();

        function BlockMovements() {

            this.moveDown = function () {
                if (matrix.checkPointsIsEmpty(this.position.x, this.position.y + 1, this.pointsSet[this.rotation.state - 1])) {
                    eraseBlock();
                    this.position.y++;
                    drawBlock();
                } else {
                    //Если блок у верхней границы
                    if (this.position.y === 0) {
                        drawBlock();
                        //Сообщаем что gameover
                        emitter.emit('block:gameOver');
                        //Анимация gameOver
                        canvas.gameOverAnimation();
                    }
                    //Закрепить точки
                    matrix.fixPoints(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1]);

                    //Сообщаем что блок упал
                    emitter.emit('block:blockFixed');

                    //Если есть заполненные линии
                    if (matrix.getFullLines().length) {

                        //Считаем статистику
                        stats.addLines(matrix.getFullLines().length);
                        //Анимирование стирания линий
                        canvas.wipeLinesAnimation(matrix.getFullLines(), () => {
                            //Переходим к следующему блоку
                            block.goToNextBlock();
                            block.activeBlock.drawBlock();
                            stats.refresh();
                        });
                    } else {
                        //Переходим к следующему блоку
                        block.goToNextBlock();
                        block.activeBlock.drawBlock();
                        stats.refresh();
                    }
                }
            };
            this.moveLeft = function () {
                if (matrix.checkPointsIsEmpty(this.position.x - 1, this.position.y, this.pointsSet[this.rotation.state - 1])) {
                    eraseBlock();
                    this.position.x--;
                    drawBlock();
                }
            };
            this.moveRight = function () {
                if (matrix.checkPointsIsEmpty(this.position.x + 1, this.position.y, this.pointsSet[this.rotation.state - 1])) {
                    eraseBlock();
                    this.position.x++;
                    drawBlock();
                }
            };
            this.rotateRight = function () {
                const newState = this.rotation.state === this.rotation.amount ? 1 : this.rotation.state + 1;
                if (matrix.checkPointsIsEmpty(this.position.x, this.position.y, this.pointsSet[newState - 1])) {
                    eraseBlock();
                    this.rotation.state = newState;
                    drawBlock();
                }
            }
            this.rotateLeft = function () {
                const newState = this.rotation.state === 1 ? this.rotation.amount : this.rotation.state - 1;
                if (matrix.checkPointsIsEmpty(this.position.x, this.position.y, this.pointsSet[newState - 1])) {
                    eraseBlock();
                    this.rotation.state = newState;
                    drawBlock();
                }
            }
            let drawBlock = this.drawBlock = () => {
                matrix.addPoints(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1], this.color);
                canvas.drawBlock(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1], this.color);
            }
            let eraseBlock = () => {
                matrix.removePoints(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1]);
                canvas.eraseBlock(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1]);
            }
        }

        function I_block() {
            BlockMovements.call(this);
            this.name = 'i-block';
            this.color = 1;
            this.position = {
                x: 5,
                y: 0,
            }
            this.rotation = {
                amount: 2,
                state: 1,
            }
            this.pointsSet = [
                [{ x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }],
                [{ x: 0, y: -2 }, { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }]
            ];
        }
        function J_block() {
            BlockMovements.call(this);
            this.name = 'j-block';
            this.color = 2;
            this.position = {
                x: 5,
                y: 0,
            }
            this.rotation = {
                amount: 4,
                state: 1,
            }
            this.pointsSet = [
                [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
                [{ x: 0, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -1 }, { x: 0, y: 1 }],
                [{ x: 0, y: 0 }, { x: -1, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }],
                [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: -1 }],
            ];
        }
        function L_block() {
            BlockMovements.call(this);
            this.name = 'l-block';
            this.color = 3;
            this.position = {
                x: 5,
                y: 0,
            }
            this.rotation = {
                amount: 4,
                state: 1,
            }
            this.pointsSet = [
                [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 }],
                [{ x: 0, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 0, y: 1 }],
                [{ x: 0, y: 0 }, { x: 1, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }],
                [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
            ];
        }
        function O_block() {
            BlockMovements.call(this);
            this.name = 'o-block';
            this.color = 1;
            this.position = {
                x: 4,
                y: 0,
            }
            this.rotation = {
                amount: 1,
                state: 1,
            }
            this.pointsSet = [
                [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
            ];
        }
        function S_block() {
            BlockMovements.call(this);
            this.name = 's-block';
            this.color = 2;
            this.position = {
                x: 5,
                y: 0,
            }
            this.rotation = {
                amount: 2,
                state: 1,
            }
            this.pointsSet = [
                [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }],
                [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
            ];
        }
        function Z_block() {
            BlockMovements.call(this);
            this.name = 'z-block';
            this.color = 3;
            this.position = {
                x: 5,
                y: 0,
            }
            this.rotation = {
                amount: 2,
                state: 1,
            }
            this.pointsSet = [
                [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
                [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: -1 }, { x: 1, y: 0 }],
            ];
        }
        function T_block() {
            BlockMovements.call(this);
            this.name = 't-block';
            this.color = 1;
            this.position = {
                x: 5,
                y: 0,
            }
            this.rotation = {
                amount: 4,
                state: 1,
            }
            this.pointsSet = [
                [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }],
                [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }],
                [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }],
                [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }],
            ];
        }
    }

    goToNextBlock() {
        this.activeBlock = this.nextBlock;
        this.nextBlock = this.createBlock[this.queue[++this.activeBlockId]]();
    }
}

class Stats {
    constructor(element) {
        this.element = element;
        this.blockStatistics = {
            't-block': 0,
            'j-block': 0,
            'z-block': 0,
            'o-block': 0,
            's-block': 0,
            'l-block': 0,
            'i-block': 0,
        }
        this.topScore = 0;
        this.score = 0;
        this.lines = 0;
        this.level = 0;

        //Счетчик высоты падения блока
        let fallLinesCounter = 0;
        //Подсчет высоты падения блока с зажатой кнопкой вниз
        emitter.subscribe("control:downPressed", (downPressed) => {
            fallLinesCounter = downPressed ? fallLinesCounter + 1 : 0;
        });
        //Добавление к очкам высоты падения
        emitter.subscribe('block:blockFixed', () => {
            this.score += fallLinesCounter;
        });

        this.refresh();
    }

    addLines(n) {
        if (n === 4) {
            this.blinkAnimation();
        }

        this.lines += n;
        //При переходе на следующий уровень, уведомляем класс Текстур шо опра менять
        if (this.level < Math.floor(this.lines / 10)) {
            this.level = Math.floor(this.lines / 10);
            emitter.emit('stats:newLevel', this.level);
        }
        switch (n) {
            case 1:
                this.score += 40 * (this.level + 1);
                break;
            case 2:
                this.score += 100 * (this.level + 1);
                break;
            case 3:
                this.score += 300 * (this.level + 1);
                break;
            case 4:
                this.score += 1200 * (this.level + 1);
                break;
            default:
                break;
        }
    }

    refresh() {
        this.element.querySelectorAll('img[data-blockName]').forEach((item) => {
            item.src = `/game/svg/blocks/level_${this.level}/${item.dataset.blockname}.svg`;
        });
        //Подсчет появившихся в стакане блоков
        this.blockStatistics[block.activeBlock.name]++;
        for (var prop in this.blockStatistics) {
            if (Object.prototype.hasOwnProperty.call(this.blockStatistics, prop)) {
                this.element.querySelector(`#${prop}-stat`).textContent = this.blockStatistics[prop];
            }
        }
        //Рекорд очков
        this.element.querySelector(`#topScoreStat`).textContent = this.topScore;
        //Набранные очки
        this.element.querySelector(`#scoreStat`).textContent = this.score;
        //Следующий блок
        this.element.querySelector('img#nextBlock').src = `/game/svg/blocks/level_${this.level}/${block.nextBlock.name}.svg`;
        //Стертые линии
        this.element.querySelector(`#linesStat`).textContent = this.lines;
        //Текущий уровень
        this.element.querySelector(`#levelStat`).textContent = this.level;
    }

    blinkAnimation() {
        this.element.classList.add('blink-animation');
        setTimeout(() => {
            this.element.classList.remove('blink-animation');
        }, 400);
    }

    shakeAnimation() {
        this.element.classList.add('shake-animation');
        setTimeout(() => {
            this.element.classList.remove('shake-animation');
        }, 30);
    }
}

class Control {
    constructor() {
        this.key = {};
        this.keydown = (e) => {
            //Если такая кнопка уже нажата (избавляемся от системных повторов нажатия (система клацает сама, при зажатии клавиши))
            if (this.key[e.keyCode]) return;
            //Какая кнопка нажата
            this.key[e.keyCode] = true;
            switch (e.keyCode) {
                //D
                case 68:
                    e.preventDefault();
                    block.activeBlock.rotateLeft();
                    return;
                //F
                case 70:
                    e.preventDefault();
                    block.activeBlock.rotateRight();
                    return;
                default:
                    break;
            }
            clearInterval(this.shiftRepeatInterval);
            clearTimeout(this.autoShiftDelay);
            switch (e.keyCode) {
                //ArrowRight
                case 39:
                    e.preventDefault();
                    block.activeBlock.moveRight();
                    this.autoShiftDelay = setTimeout(() => {
                        this.shiftRepeatInterval = setInterval(() => {
                            block.activeBlock.moveRight();
                        }, 80);
                    }, 160);
                    break;
                //ArrowLeft
                case 37:
                    e.preventDefault();
                    block.activeBlock.moveLeft();
                    this.autoShiftDelay = setTimeout(() => {
                        this.shiftRepeatInterval = setInterval(() => {
                            block.activeBlock.moveLeft();
                        }, 80);
                    }, 160);
                    break;
                //ArrowDown
                case 40:
                    e.preventDefault();
                    this.shiftRepeatInterval = setInterval(() => {
                        block.activeBlock.moveDown()
                        //Сообщаем о натой клавише вниз (необходимо для подсчета строк, за которые дропнется блок)
                        emitter.emit('control:downPressed', true);
                    }, 50);
                    break;
                default:
                    break;
            }
        }
        this.keyup = (e) => {
            delete this.key[e.keyCode];
            //Если были нажаты кнопки поворота, то не стоит сбрасывать интервалы повтора перемещний,
            //иначе движение фигуры по зажатой кнопке (влево/вправо), прекратится
            switch (e.keyCode) {
                case 68:
                case 70:
                    return;
                case 40:
                    //Сообщаем об отпущенной клавише вниз (необходимо для подсчета строк, за которые дропнется блок)
                    emitter.emit('control:downPressed', false);
                    break;
                default:
                    break;
            }
            clearInterval(this.shiftRepeatInterval);
            clearTimeout(this.autoShiftDelay);
        }
        this.startListenKeyboard(); //?
        emitter.subscribe("canvas:wipeAnimationStart", () => this.stopListenKeyboard()); //Блокируем управление во время анимации
        emitter.subscribe("block:gameOver", () => this.stopListenKeyboard()); //Блокируем управление по gameover
        emitter.subscribe("canvas:wipeAnimationEnd", () => this.startListenKeyboard()); //Разблокируем управлениепосле анимации
    }

    stopListenKeyboard() {
        clearInterval(this.shiftRepeatInterval);
        clearTimeout(this.autoShiftDelay);
        document.removeEventListener('keydown', this.keydown);
        document.removeEventListener('keyup', this.keyup);
    }

    startListenKeyboard() {
        this.key = {};
        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
    }
}

class EventEmitter {
    constructor() {
        this.events = {};
    }

    subscribe(eventName, fn) {
        if (!this.events[eventName]) { //Если событие новое
            this.events[eventName] = []; //Создать массив (который будет хранить подписавшиеся на событие функции)
        }
        this.events[eventName].push(fn); //Сохраням тело функции в массив с соотв названием события
        //Возвращаем функцию, которая быстренько пробегается по массиву хранящихся функций, и оставляет только те, которые
        //не являются текущей Т.е. переданная выше функция будет исключена из EvenEmitter'а
        return () => {
            this.events[eventName] = this.events[eventName].filter((eventFn) => fn !== eventFn);
        }
    }

    //Более явный метод исключения функции из EvenEmitter'а
    unsubscribe(eventName, fn) {
        this.events[eventName] = this.events[eventName].filter((eventFn) => fn !== eventFn);
    }

    emit(eventName, data) {
        const event = this.events[eventName]; //Объект искомого события в event
        if (event) { //Если такое свойство (объект) есть
            event.forEach((fn) => { //Выполняем хранящиеся функции
                // fn.call(null, data); //Линтер ругался на null
                fn(data);
            });
        }
    }
}

//=======================================================

let emitter = new EventEmitter();
let canvas = new Canvas(document.getElementsByTagName('canvas')[0]);
let matrix = new Matrix('[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,{"state":"fixed","color":2},{"state":"fixed","color":2},null,null,null,null,null],[null,null,null,{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},null,null,null,null],[null,null,null,{"state":"fixed","color":2},{"state":"fixed","color":2},null,{"state":"fixed","color":1},null,null,null],[null,null,null,{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":1},{"state":"fixed","color":1},null,null,null],[{"state":"fixed","color":1},null,{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":1},null,{"state":"fixed","color":3},null],[{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":3},{"state":"fixed","color":3},null],[{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},null],[{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":2},{"state":"fixed","color":2},null],[{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":1},null],[{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":2},null],[{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":2},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},null],[{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},null]]');
// let matrix = new Matrix();
let block = new Block();
let stats = new Stats(document.getElementsByClassName('game')[0]);
let control = new Control();
let textures = new Textures();

/* ??? */
setTimeout(() => {
    canvas.drawState(matrix.getFixedMatrix());
    block.activeBlock.drawBlock();
}, 500);

/* ??? */


// function Game() {
//     this.saveGame = function () {
//     }
//     this.restoreGame = function () {
//     }
//     this.startNewGame = function () {
//     }
// }