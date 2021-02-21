export default class Sound {
    constructor() {

        //Cписок ресурсов
        this.resources = ['land', 'move', 'rotate', 'clearline', 'tetris', 'gameover', 'levelup', 'pause', 'option'];

        this.play = (name) => {
            if (localStorage['SOUND'] === 'true') {
                this[name].currentTime = 0;
                this[name].play();
            }
        }

        //Предзагрузка звуков
        this.preloadSounds(this.resources, () => {
            console.log('All sounds has been preloaded!');
        });


        EMITTER.subscribe('control:pausePressed', () => {
            this.play('pause');
        });

        EMITTER.subscribe('control:pauseReleased', () => {
            this.play('pause');
        });

        EMITTER.subscribe('stats:newLevel', () => {
            this.play('levelup');
            window.navigator.vibrate([0, 200, 100, 100, 100]);
        });

        EMITTER.subscribe('stats:tetris', () => {
            this.play('tetris');
            window.navigator.vibrate([0, 100, 500]);
        });

        EMITTER.subscribe('stats:clearline', () => {
            this.play('clearline');
            window.navigator.vibrate([0, 200, 30, 30, 30, 30, 30, 30, 30]);
        });

        EMITTER.subscribe('block:blockFixed', () => {
            this.play('land');
            window.navigator.vibrate([0, 30]);
        });

        EMITTER.subscribe('block:gameOver', () => {
            this.play('gameover');
        });

        EMITTER.subscribe('block:rotateLeft', () => {
            this.play('rotate');
        });

        EMITTER.subscribe('block:rotateRight', () => {
            this.play('rotate');
        });

        EMITTER.subscribe('block:moveLeft', () => {
            this.play('move');
        });

        EMITTER.subscribe('block:moveRight', () => {
            this.play('move');
        });
    }

    preloadSounds(sources, callback) {
        let counter = 0;

        function onLoad() {
            counter++;
            if (counter === sources.length) {
                callback();
            }
        }

        for (let i = 0; i < sources.length; i++) {
            this[sources[i]] = new Audio();
            this[sources[i]].src = `./assets/game/sound/${sources[i]}.mp3`;
            this[sources[i]].onload = this[sources[i]].onerror = onLoad;
        }

        return callback();
    }
}