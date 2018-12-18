// Matrix   (М)
// Block    (M)
// Ticker   (M)

// Sound    (V)
// Textures (V)
// Canvas   (V)
// Stats    (V)

// Control  (C)

import Block from './modules/Block.mjs';
import Canvas from './modules/Canvas.mjs';
import Control from './modules/Control.mjs';
import Matrix from './modules/Matrix.mjs';
import Sound from './modules/Sound.mjs';
import Stats from './modules/Stats.mjs';
import Textures from './modules/Textures.mjs';
import Ticker from './modules/Ticker.mjs';

//=======================================================

let textures = new Textures();
let canvas = new Canvas(document.getElementsByTagName('canvas')[0], textures);
let sound = new Sound();
let stats = new Stats(document.getElementsByClassName('game')[0], sound);

let matrixState = '[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[{"state":"fixed","color":2},{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},null],[{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},null,{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3}]]';

let matrix = new Matrix(matrixState);
let block = new Block(matrix, canvas, stats, sound); //Принимает Matrix, Canvas, Stats, и queue (последовательность блоков) arr[1..7*1000]
let ticker = new Ticker(block);

let control = new Control(document.getElementById('controller'), block);

EMITTER.subscribe('textures:ready', () => {
    initGame();
});

function initGame() {
    canvas.drawState(matrix.getFixedMatrix());
    block.activeBlock.drawBlock();
    ticker.run();
}

// function Game() {
//     this.saveGame = function () {
//     }
//     this.restoreGame = function () {
//     }
//     this.startNewGame = function () {
//     }
// }