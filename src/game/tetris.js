// Matrix   (М)
// Block    (M)
// Ticker   (M)

// Sound    (V)
// Textures (V)
// Canvas   (V)
// Stats    (V)

// Overlay  (V/С)

// Control  (C)

import Block from './modules/Block.js';
import Canvas from './modules/Canvas.js';
import Controls from './modules/Controls/Controls.js';
import Matrix from './modules/Matrix.js';
import Sound from './modules/Sound.js';
import Stats from './modules/Stats.js';
import Textures from './modules/Textures.js';
import Ticker from './modules/Ticker.js';
import UI from './modules/UI.js';
import './modules/Settings.js';

//=======================================================
// const matrixState = '[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[{"state":"fixed","color":2},{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},null],[{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},null,{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3}]]';

class Game {
    constructor() {
        const textures = new Textures();
        const ticker = new Ticker();
        const matrix = new Matrix();
        const canvas = new Canvas(document.getElementById('canvas'), textures);
        const stats = new Stats(document.getElementById('game'));
        const block = new Block(matrix, canvas, stats); //Принимает Matrix, Canvas, Stats, и queue (последовательность блоков) arr[1..7*1000]
        const controls = new Controls(block);

        new Sound();
        new UI(this, stats);

        const LEVEL_DELAYS = [800, 717, 633, 550, 467, 383, 300, 217, 133, 100, 83, 83, 83, 67, 67, 67, 50, 50, 50, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 17];

        EMITTER.subscribe('stats:newLevel', (level) => ticker.start(LEVEL_DELAYS[level]));
        EMITTER.subscribe('block:gameOver', () => ticker.stop());
        EMITTER.subscribe('block:blockFixed', () => ticker.sleep(60));
        EMITTER.subscribe('canvas:wipeAnimationStart', () => ticker.sleep(360));
        EMITTER.subscribe('control:pausePressed', () => ticker.stop());
        EMITTER.subscribe('control:pauseReleased', () => ticker.start());

        this.startGame = () => {
            //Определяем цвет у текстур
            textures.level = 0;

            matrix.clearMatrix();
            canvas.drawState(matrix.getFixedMatrix());
            stats.init();

            block.createNewQueue();
            block.activeBlock.drawBlock();

            controls.isAvailable = true;

            // Оживляем по тикеру
            ticker.onTick = () => block.activeBlock.moveDown();
            ticker.start(LEVEL_DELAYS[0]);
            ticker.sleep(400);
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
            if (state.block.activeBlockId - 1 > 0) {
                block.setQueue(state.block.queue, --state.block.activeBlockId);
            } else {
                block.setQueue(state.block.queue, state.block.activeBlockId);
            }
            block.activeBlock.drawBlock();

            //Сделать активными контролы
            controls.isAvailable = true;

            // Оживляем по тикеру
            ticker.onTick = () => block.activeBlock.moveDown();
            ticker.start(LEVEL_DELAYS[state.stats.level]);
            ticker.sleep(800);
        }
    }
}

new Game();