/* eslint-disable no-undef */

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

    setMatrix(array) {
        this.matrix = array;
    }

    getMatrix() {
        return this.matrix
    }

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

    getMatrixJSON() {
        return JSON.stringify(this.matrix)
    }

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

    setMatrixJSON(json) {
        this.matrix = JSON.parse(json);
    }

    clearMatrix() {
        this.matrix = this.setEmptyMatrix();
    }

    checkPointsIsEmpty(x, y, points) {
        for (let i = 0; i < points.length; i++) {

            //Игноровать точки, которые выше стакана и внутри левой и правой границы
            if (y + points[i].y < 0 && x + points[i].x >= 0 && x + points[i].x <= 9) {
                continue;
                //Точка внутри стакана
            } else if (y + points[i].y <= 19 && x + points[i].x >= 0 && x + points[i].x <= 9) {
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
                this.matrix[y + points[i].y][x + points[i].x] = {
                    state: 'active',
                    color: color
                };
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

        //Формирование списка текстур и картинок
        this.resources = [];
        for (let level = 0; level <= 9; level++) {
            this.resources.push(`/game/svg/textures/level_${level}/type_1.svg`);
            this.resources.push(`/game/svg/textures/level_${level}/type_2.svg`);
            this.resources.push(`/game/svg/textures/level_${level}/type_3.svg`);
            this.resources.push(`/game/svg/blocks/level_${level}/i-block.svg`);
            this.resources.push(`/game/svg/blocks/level_${level}/j-block.svg`);
            this.resources.push(`/game/svg/blocks/level_${level}/l-block.svg`);
            this.resources.push(`/game/svg/blocks/level_${level}/o-block.svg`);
            this.resources.push(`/game/svg/blocks/level_${level}/s-block.svg`);
            this.resources.push(`/game/svg/blocks/level_${level}/t-block.svg`);
            this.resources.push(`/game/svg/blocks/level_${level}/z-block.svg`);
        }

        //Предзагрузка картинок
        preloadImages(this.resources, () => {
            this[1] = new Image();
            this[2] = new Image();
            this[3] = new Image();

            this.level = 0;

            // console.log('All pictures has been preloaded!');

            EMITTER.emit('textures:ready');
        });

        function preloadImages(sources, func) {
            let counter = 0;

            function onLoad() {
                counter++;
                if (counter === sources.length) {


                    func();
                }
            }

            for (let i = 0; i < sources.length; i++) {
                let img = document.createElement('img');
                //Cначала onload/onerror, затем src - важно для IE8-
                img.onload = img.onerror = onLoad;
                img.src = sources[i];
            }
        }

        EMITTER.subscribe('stats:newLevel', (level) => {
            this.level = level % 10; //Нужен только остаток, т.к. текстур 10, а уровней 20
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
                } else {
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
            // context.fillRect((points[i].x + xPos) * 20, (points[i].y + yPos) * 20, 20, 20);
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
        EMITTER.emit('canvas:wipeAnimationStart');

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
                EMITTER.emit('canvas:wipeAnimationEnd');

                return callback();
            }
        }, 60);
    }

    gameOverAnimation() {
        let context = this.context;
        context.fillStyle = 'rgba(0, 0, 0, .25)';
        let n = 0
        let interval = setInterval(() => {
            for (let j = 0; j < 100; j++) {
                let i = j % 2 ? 1 : 0
                for (i; i < 50; i++) {
                    context.fillRect(i * 4, j * 4, 4, 4);
                    i++;
                    // console.log(i);
                }
            }
            // console.log('n ------------------> ', n);
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
        this.goToNextBlock = () => {
            this.activeBlock = this.nextBlock;
            this.nextBlock = this.createBlock[this.queue[++this.activeBlockId]]();
        }

        function BlockMovements() {

            this.moveDown = function () {
                if (matrix.checkPointsIsEmpty(this.position.x, this.position.y + 1, this.pointsSet[this.rotation.state - 1])) {
                    eraseBlock();
                    this.position.y++;
                    drawBlock();
                } else {
                    //Сообщаем что блок упал
                    EMITTER.emit('block:blockFixed');
                    //Закрепить точки
                    matrix.fixPoints(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1]);

                    //Если есть заполненные линии
                    if (matrix.getFullLines().length) {
                        //Добавить линии в статистику
                        stats.addLines(matrix.getFullLines().length);
                        //Анимировать стирание линий: Canvas.wipeLinesAnimation(array[], callback());
                        canvas.wipeLinesAnimation(matrix.getFullLines(), checkPlaceForNextBlock);
                    } else {
                        checkPlaceForNextBlock();
                    }
                }

                //  Функция проверяет возможность размещения на поле следующего блока.
                //  Если блок появляется над занятыми точками (координатами),
                //  то инициализируется событие GameOver, анимация и пр.

                function checkPlaceForNextBlock() {
                    //Если следующий блок будет над занятыми точками
                    if (matrix.checkPointsIsEmpty(block.nextBlock.position.x, block.nextBlock.position.y, block.nextBlock.pointsSet[block.nextBlock.rotation.state - 1]) === false) {
                        block.goToNextBlock();
                        block.activeBlock.drawBlock();
                        stats.refresh();
                        //Сообщить о gameover
                        EMITTER.emit('block:gameOver');
                        //Воспроизвести анимацию gameOver
                        canvas.gameOverAnimation();
                    } else {
                        block.goToNextBlock();
                        block.activeBlock.drawBlock();
                        stats.refresh();
                    }
                }
            }

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
                [{
                    x: -2,
                    y: 0
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 0,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }],
                [{
                    x: 0,
                    y: -2
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }]
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
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: 1,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: 1
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 0,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: -1
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 1,
                    y: -1
                }],
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
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: -1,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: -1
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 0,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 1,
                    y: -1
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 0,
                    y: 1
                }, {
                    x: 1,
                    y: 1
                }],
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
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }, {
                    x: 1,
                    y: 1
                }]
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
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: -1,
                    y: 1
                }, {
                    x: 0,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: 1,
                    y: 1
                }],
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
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }, {
                    x: 1,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }, {
                    x: 1,
                    y: -1
                }, {
                    x: 1,
                    y: 0
                }],
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
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 0,
                    y: 1
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: -1,
                    y: 0
                }, {
                    x: 1,
                    y: 0
                }],
                [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: 1
                }, {
                    x: 0,
                    y: -1
                }, {
                    x: 1,
                    y: 0
                }],
            ];
        }
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
        EMITTER.subscribe('control:downPressed', (downPressed) => {
            fallLinesCounter = downPressed ? fallLinesCounter + 1 : 0;
        });
        //Добавление к очкам высоты падения
        EMITTER.subscribe('block:blockFixed', () => {
            this.score += fallLinesCounter;
        });

        this.refresh();
    }

    addLines(n) {
        //Если 4 линии, то анимируем
        if (n === 4) {
            this.blinkAnimation();
        }

        this.lines += n;
        //При переходе на следующий уровень, уведомляем класс Текстур шо опра менять
        if (this.level < Math.floor(this.lines / 10)) {
            this.level = Math.floor(this.lines / 10);
            EMITTER.emit('stats:newLevel', this.level);
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
            item.src = `./game/svg/blocks/level_${this.level % 10}/${item.dataset.blockname}.svg`;
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
        this.element.querySelector('img#nextBlock').src = `./game/svg/blocks/level_${this.level % 10}/${block.nextBlock.name}.svg`;
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
    constructor(controller) {

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
            //Если тач-событие
            if (e.type === 'touchstart') {
                //Применение стилей для нажатой тач-кнопки
                e.srcElement.classList.add('active');
            } else { //Если событие клавиатуры
                //Если такая кнопка уже нажата, то избавляемся от системных повторов нажатия (система клацает сама, при зажатии клавиши)
                if (this.key[e.keyCode]) return;
                //Сохранить в свойство объекта key, какая кнопка на калавиатуре нажата
                this.key[e.keyCode] = true;
            }
            switch (voc[e.keyCode || e.srcElement.id]) {
                case 'B':
                    e.preventDefault();
                    block.activeBlock.rotateLeft();
                    return;
                case 'A':
                    e.preventDefault();
                    block.activeBlock.rotateRight();
                    return;
                case 'Right':
                    clearTimeout(shiftRepeatTimeoutID);
                    block.activeBlock.moveRight();
                    shiftRepeatTimeoutID = setTimeout(function tick() {
                        block.activeBlock.moveRight();
                        //Рекурсивно вызываем таймаут
                        shiftRepeatTimeoutID = setTimeout(tick, 100);
                    }, 267);
                    break;
                case 'Left':
                    clearTimeout(shiftRepeatTimeoutID);
                    block.activeBlock.moveLeft();
                    shiftRepeatTimeoutID = setTimeout(function tick() {
                        block.activeBlock.moveLeft();
                        //Рекурсивно вызываем таймаут
                        shiftRepeatTimeoutID = setTimeout(tick, 100);
                    }, 267);
                    break;
                case 'Down':
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
            //Стили для отпущенной тач-кнопки
            e.srcElement.classList.remove('active');

            delete this.key[e.keyCode];
            //Если были нажаты кнопки поворота, то не стоит сбрасывать интервалы повтора перемещний,
            //иначе движение фигуры по зажатой кнопке (влево/вправо), прекратится
            switch (voc[e.keyCode || e.srcElement.id]) {
                case 'B':
                case 'A':
                    return;
                case 'Down':
                    //Сообщаем об отпущенной клавише "down" (необходимо для подсчета строк, за которые дропнется блок)
                    EMITTER.emit('control:downPressed', false);
                    //Очищаем интервал
                    setTimeout(() => clearTimeout(downRepeatTimeoutID), 0);
                    break;
                case 'Left':
                case 'Right':
                    setTimeout(() => clearTimeout(shiftRepeatTimeoutID), 0);
                    break;
                default:
                    break;
            }
        }

        this.startListenKeyboard(); //?

        EMITTER.subscribe('canvas:wipeAnimationStart', () => this.stopListenKeyboard()); //Блокируем управление во время анимации
        EMITTER.subscribe('canvas:wipeAnimationEnd', () => this.startListenKeyboard()); //Разблокируем управление после анимации
        EMITTER.subscribe('block:gameOver', () => this.stopListenKeyboard()); //Блокируем управление по gameover
        EMITTER.subscribe('block:blockFixed', () => {
            this.button = {};
            //Вне очереди очищаем рекурсивный таймаут на повтор движения вниз
            setTimeout(() => clearTimeout(downRepeatTimeoutID), 0);
        });
    }
}

class Ticker {
    constructor() {
        this.actualLevel = 0;
        this.delay = [800, 717, 633, 550, 467, 383, 300, 217, 133, 100, 83, 83, 83, 67, 67, 67, 50, 50, 50, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 17];
        this.setInterval = null;

        EMITTER.subscribe('stats:newLevel', (level) => {
            this.actualLevel = level;
            this.stop();
            this.start(this.actualLevel);
        });

        this.start = (level = this.actualLevel) => {
            // console.log('...>', level);
            this.setInterval = setInterval(() => {
                block.activeBlock.moveDown();
            }, this.delay[level]);
        }

        this.stop = () => {
            clearInterval(this.setInterval);
        }

        EMITTER.subscribe('block:gameOver', this.stop);
        EMITTER.subscribe('canvas:wipeAnimationStart', this.stop);
        EMITTER.subscribe('canvas:wipeAnimationEnd', this.start);
    }
}

//=======================================================


let textures = new Textures();
let canvas = new Canvas(document.getElementsByTagName('canvas')[0]);
//let matrix = new Matrix('[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,{"state":"fixed","color":2},{"state":"fixed","color":2},null,null,null,null,null],[null,null,null,{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},null,null,null,null],[null,null,null,{"state":"fixed","color":2},{"state":"fixed","color":2},null,{"state":"fixed","color":1},null,null,null],[null,null,null,{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":1},{"state":"fixed","color":1},null,null,null],[{"state":"fixed","color":1},null,{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":1},null,{"state":"fixed","color":3},null],[{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":3},{"state":"fixed","color":3},null],[{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},null],[{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":2},{"state":"fixed","color":2},null],[{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":1},null],[{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":2},null],[{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":2},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},null],[{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":2},{"state":"fixed","color":2},null]]');
let matrix = new Matrix();
let block = new Block();
let stats = new Stats(document.getElementsByClassName('game')[0]);
let control = new Control(document.getElementById('controller'));
let ticker = new Ticker();

EMITTER.subscribe('textures:ready', () => {
    initGame();
});

function initGame() {
    canvas.drawState(matrix.getFixedMatrix());
    block.activeBlock.drawBlock();
    ticker.start();
}

// function Game() {
//     this.saveGame = function () {
//     }
//     this.restoreGame = function () {
//     }
//     this.startNewGame = function () {
//     }
// }