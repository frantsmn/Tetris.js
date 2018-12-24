export default class Sound {
    constructor() {

        //Cписок ресурсов
        this.resources = ['land', 'move', 'rotate', 'clearline', 'tetris', 'gameover', 'levelup', 'pause', 'option'];

        this.preloadSounds = (sources, func) => {
            let counter = 0;

            function onLoad() {
                counter++;
                if (counter === sources.length) {
                    func();
                }
            }

            for (let i = 0; i < sources.length; i++) {
                this[sources[i]] = new Audio();
                this[sources[i]].src = `./game/sound/${sources[i]}.mp3`;
                this[sources[i]].onload = this[sources[i]].onerror = onLoad;
            }

            return func();
        }

        this.play = (name) => {
            if (localStorage['SOUND'] === 'true') {
                this[name].currentTime = 0;
                this[name].play();
            }
        }

        //Предзагрузка звуков
        this.preloadSounds(this.resources, () => {
            // console.log('All sound has been preloaded!');
        });
    }
}