import Matrix from './modules/Matrix.mjs';      //М
import Block from './modules/Block.mjs';        //M
import Ticker from './modules/Ticker.mjs';      //M

import Stats from './modules/Stats.mjs';        //MV

import Canvas from './modules/Canvas.mjs';      //V
import Textures from './modules/Textures.mjs';  //V
import Sound from './modules/Sound.mjs';        //V

import Control from './modules/Control.mjs';    //C

//=======================================================

let sound = new Sound();
let textures = new Textures();
let canvas = new Canvas(document.getElementsByTagName('canvas')[0], textures);
let stats = new Stats(document.getElementsByClassName('game')[0], sound);

let matrix = new Matrix('[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null,null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},null,{"state":"fixed","color":3},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[null,{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":1},{"state":"fixed","color":1},{"state":"fixed","color":3},null,null,null],[{"state":"fixed","color":2},{"state":"fixed","color":1},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},null],[{"state":"fixed","color":2},{"state":"fixed","color":2},{"state":"fixed","color":2},null,{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3},{"state":"fixed","color":3}]]');
//let matrix = new Matrix();
let block = new Block(matrix, canvas, stats, sound); //Принимает Matrix, Canvas, Stats, и queue (последовательность блоков) arr[1..7*1000]

let control = new Control(document.getElementById('controller'), block);
let ticker = new Ticker(block);

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