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
            matrix.clearMatrix();
            canvas.drawState(matrix.getFixedMatrix());
            stats.init();

            block.createNewQueue();
            block.activeBlock.drawBlock();
        
            control.controlAvailable = true;
            
            ticker.run();
        }

        this.pauseGame = () => {
            ticker.togglePause();
        }

        this.saveGame = () => {

        }

        this.loadGame = () => {

        }

        this.saveScore = () => {

        }

    }
   
}

const game = new Game();