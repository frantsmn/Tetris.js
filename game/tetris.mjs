import Matrix from './modules/Matrix.mjs';      //М
import Block from './modules/Block.mjs';        //M
import Ticker from './modules/Ticker.mjs';      //M

import Sound from './modules/Sound.mjs';        //V
import Textures from './modules/Textures.mjs';  //V
import Canvas from './modules/Canvas.mjs';      //V
import Stats from './modules/Stats.mjs';        //V

import Control from './modules/Control.mjs';    //C

//=======================================================

let textures = new Textures();
let canvas = new Canvas(document.getElementsByTagName('canvas')[0], textures);
let sound = new Sound();
let stats = new Stats(document.getElementsByClassName('game')[0], sound);

//let matrix = new Matrix();
let matrix = new Matrix('[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[{"state":"fixed","color":2},{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},null],[{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},null,{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3}]]');
let block = new Block(matrix, canvas, stats, sound); //Принимает Matrix, Canvas, Stats, и queue (последовательность блоков) arr[1..7*1000]
let ticker = new Ticker(block);

let control = new Control(document.getElementById('controller'), block);

EMITTER.subscribe('textures:ready', () => {
    initGame();
});

function initGame() {
    canvas.drawState(matrix.getFixedMatrix());
    block.activeBlock.drawBlock();
    // ticker.start();
}

// function Game() {
//     this.saveGame = function () {
//     }
//     this.restoreGame = function () {
//     }
//     this.startNewGame = function () {
//     }
// }