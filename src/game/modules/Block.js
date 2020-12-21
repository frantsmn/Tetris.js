export default class Block {
    constructor(matrix, canvas, stats, queue) {

        this.queue = queue ? queue : [...new Array(1000)].map(() => Math.floor(Math.random() * 7) + 1);
        this.createRandomQueue = () => [...new Array(1000)].map(() => Math.floor(Math.random() * 7) + 1);

        this.createBlock = {
            1: () => new I_block(),
            2: () => new J_block(),
            3: () => new L_block(),
            4: () => new O_block(),
            5: () => new S_block(),
            6: () => new Z_block(),
            7: () => new T_block(),
        };

        this.activeBlockId = 0;
        let activeBlock = this.activeBlock = this.createBlock[this.queue[this.activeBlockId]]();
        let nextBlock = this.nextBlock = this.createBlock[this.queue[this.activeBlockId + 1]]();

        //Обновить подсчет появившихся блоков в статистике
        stats.refreshAppearedBlocks(activeBlock.name);
        //Обновить в статистике следующий блок
        stats.refreshNextBlock(nextBlock.name);

        //Устанавливает заданную (сохраненую) очередь и позицию в ней
        this.setQueue = (queue, i) => {
            this.queue = queue;
            this.activeBlockId = i;
            activeBlock = this.activeBlock = this.createBlock[this.queue[this.activeBlockId]]();
            nextBlock = this.nextBlock = this.createBlock[this.queue[this.activeBlockId + 1]]();
            //Обновить подсчет появившихся блоков в статистике
            //(не добавляя текущий, т.к. он был учтен) при сохранении
            stats.refreshAppearedBlocks();
            //Обновить в статистике картинку следующего блока
            stats.refreshNextBlock(nextBlock.name);
        }

        //Создает новую очередь для новой игры
        this.createNewQueue = () => {
            this.queue = this.createRandomQueue();
            this.activeBlockId = 0;
            activeBlock = this.activeBlock = this.createBlock[this.queue[this.activeBlockId]]();
            nextBlock = this.nextBlock = this.createBlock[this.queue[this.activeBlockId + 1]]();
            //Обновить подсчет появившихся блоков в статистике
            stats.refreshAppearedBlocks(activeBlock.name);
            //Обновить в статистике следующий блок
            stats.refreshNextBlock(nextBlock.name);
        };

        let goToNextBlock = () => {
            activeBlock = this.activeBlock = this.nextBlock;
            nextBlock = this.nextBlock = this.createBlock[this.queue[++this.activeBlockId]]();

            activeBlock.drawBlock();

            //Обновить подсчет появившихся блоков в статистике
            stats.refreshAppearedBlocks(activeBlock.name);
            //Обновить в статистике следующий блок
            stats.refreshNextBlock(nextBlock.name);
        }

        function BlockMovements() {
            this.moveDown = function () {
                // console.log(matrix.getMatrix());
                //Если следующая линия свободна
                if (matrix.checkPointsIsEmpty(this.position.x, this.position.y + 1, this.pointsSet[this.rotation.state - 1])) {
                    eraseBlock();
                    this.position.y++;
                    drawBlock();
                } else if (this.position.y) { //Если следующая линия занята и он не на нулевой линии (this.position.y !== 0)
                    //Сообщить что блок упал
                    EMITTER.emit('block:blockFixed');
                    //Закрепить точки
                    matrix.fixPoints(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1]);

                    //Если поcле падения есть заполненные линии
                    if (matrix.getFullLines().length) {
                        //Добавить линии в статистику
                        stats.addLines(matrix.getFullLines().length);
                        //Анимировать стирание линий: Canvas.wipeLinesAnimation(array[], callback());
                        canvas.wipeLinesAnimation(matrix.getFullLines(), () => {
                            matrix.removeFullLines();
                            canvas.drawState(matrix.getFixedMatrix());
                            goToNextBlock();
                        });
                    } else {
                        goToNextBlock();
                    }
                } else {
                    drawBlock();
                    //Сообщить о gameover
                    EMITTER.emit('block:gameOver');
                    //Воспроизвести анимацию gameOver
                    canvas.gameOverAnimation();
                }
            }

            this.moveLeft = function () {
                if (matrix.checkPointsIsEmpty(this.position.x - 1, this.position.y, this.pointsSet[this.rotation.state - 1])) {
                    eraseBlock();
                    this.position.x--;
                    // console.timeEnd('gamepadDelay');
                    drawBlock();
                    EMITTER.emit('block:moveLeft');
                }
            };
            this.moveRight = function () {
                if (matrix.checkPointsIsEmpty(this.position.x + 1, this.position.y, this.pointsSet[this.rotation.state - 1])) {
                    eraseBlock();
                    this.position.x++;
                    // console.timeEnd('gamepadDelay');
                    drawBlock();
                    EMITTER.emit('block:moveRight');
                }
            };
            this.rotateRight = function () {
                const newState = this.rotation.state === this.rotation.amount ? 1 : this.rotation.state + 1;
                if (matrix.checkPointsIsEmpty(this.position.x, this.position.y, this.pointsSet[newState - 1])) {
                    eraseBlock();
                    this.rotation.state = newState;
                    // console.timeEnd('gamepadDelay');
                    drawBlock();
                    EMITTER.emit('block:rotateRight');
                }
            }
            this.rotateLeft = function () {
                const newState = this.rotation.state === 1 ? this.rotation.amount : this.rotation.state - 1;
                if (matrix.checkPointsIsEmpty(this.position.x, this.position.y, this.pointsSet[newState - 1])) {
                    eraseBlock();
                    this.rotation.state = newState;
                    // console.timeEnd('gamepadDelay');
                    drawBlock();
                    EMITTER.emit('block:rotateLeft');
                }
            }
            let drawBlock = this.drawBlock = () => {
                matrix.addPoints(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1], this.color);
                canvas.drawState(matrix.getMatrix());
                // canvas.drawBlock(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1], this.color);
            }
            let eraseBlock = () => {
                matrix.removePoints(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1]);
                // canvas.drawState(matrix.getMatrix());
                // canvas.eraseBlock(this.position.x, this.position.y, this.pointsSet[this.rotation.state - 1]);
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