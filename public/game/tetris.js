// Matrix   (М)
// Block    (M)
// Ticker   (M)

// Sound    (V)
// Textures (V)
// Canvas   (V)
// Stats    (V)
// Overlay  (V)

// Control  (C)

import Block from './modules/Block.js';
import Canvas from './modules/Canvas.js';
import Control from './modules/Control.js';
import Matrix from './modules/Matrix.js';
import Sound from './modules/Sound.js';
import Stats from './modules/Stats.js';
import Textures from './modules/Textures.js';
import Ticker from './modules/Ticker.js';
import Overlay from './modules/Overlay.js';

//=======================================================


class Game {
    constructor() {

        const textures = new Textures();
        const canvas = new Canvas(document.getElementsByTagName('canvas')[0], textures);

        const sound = new Sound();
        const stats = new Stats(document.getElementsByClassName('game')[0], sound);

        const matrixState = '[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[{"state":"fixed","color":2},{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},null],[{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},null,{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3}]]';
        const matrix = new Matrix();
        const block = new Block(matrix, canvas, stats, sound); //Принимает Matrix, Canvas, Stats, и queue (последовательность блоков) arr[1..7*1000]

        const ticker = new Ticker(block, sound);
        const control = new Control(document.getElementById('controller'), block, ticker);
        const overlay = new Overlay(this, stats);

        this.startGame = () => {

            //Определяем цвет у текстур
            textures.level = 0;

            matrix.clearMatrix();
            canvas.drawState(matrix.getFixedMatrix());
            stats.init();

            block.createNewQueue();
            block.activeBlock.drawBlock();

            control.controlAvailable = true;

            ticker.run(0);
        }

        this.pauseGame = () => {
            ticker.togglePause();
        }

        this.saveGame = () => {
            localStorage.setItem('state', JSON.stringify({
                matrix: matrix.getFixedMatrix(),
                stats: {
                    score: stats.score,
                    lines: stats.lines,
                    level: stats.level,
                    blockStatistics: stats.blockStatistics,
                },
                block: {
                    queue: block.queue,
                    activeBlockId: block.activeBlockId,
                }
            }));
        }

        this.loadGame = () => {
            const state = JSON.parse(localStorage.getItem('state'));
            console.log(state);

            //Сбросить статистику и присвоить значения из state
            stats.init();
            stats.score = state.stats.score;
            stats.lines = state.stats.lines;
            stats.level = state.stats.level;
            stats.blockStatistics = state.stats.blockStatistics;
            stats.refreshBlockImages();
            stats.refresh();

            //Определяем цвет у текстур
            textures.level = state.stats.level;

            //Восстановить и отрисовать матрицу
            matrix.setMatrix(state.matrix);
            canvas.drawState(matrix.getFixedMatrix());

            //Восстановление последовательности блоков
            block.setQueue(state.block.queue, --state.block.activeBlockId);
            block.activeBlock.drawBlock();

            //Сделать активными контролы
            control.controlAvailable = true;

            //Запуск тикера
            ticker.actualLevel = state.stats.level;
            //Даем задержку на подготовку игрока
            ticker.sleep(800);

            console.log('level: ');
        }
    }
}

    let game = new Game()