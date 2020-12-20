export default class Textures {
    constructor() {
        this.images = [];

        //Формирование списка текстур и картинок
        this.resources = [];
        for (let level = 0; level <= 9; level++) {
            this.resources.push(`./assets/game/svg/textures/level_${level}/type_1.svg`);
            this.resources.push(`./assets/game/svg/textures/level_${level}/type_2.svg`);
            this.resources.push(`./assets/game/svg/textures/level_${level}/type_3.svg`);
            this.resources.push(`./assets/game/svg/blocks/level_${level}/i-block.svg`);
            this.resources.push(`./assets/game/svg/blocks/level_${level}/j-block.svg`);
            this.resources.push(`./assets/game/svg/blocks/level_${level}/l-block.svg`);
            this.resources.push(`./assets/game/svg/blocks/level_${level}/o-block.svg`);
            this.resources.push(`./assets/game/svg/blocks/level_${level}/s-block.svg`);
            this.resources.push(`./assets/game/svg/blocks/level_${level}/t-block.svg`);
            this.resources.push(`./assets/game/svg/blocks/level_${level}/z-block.svg`);
        }

        this.preloadImages = (sources, func) => {
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
                this.images.push(img);
            }
        }

        //Предзагрузка картинок
        this.preloadImages(this.resources, () => {
            this[1] = new Image();
            this[2] = new Image();
            this[3] = new Image();

            this.level = 0;

            console.log('All pictures has been preloaded!');
            EMITTER.emit('textures:ready');
        });

        EMITTER.subscribe('stats:newLevel', (level) => {
            this.level = level % 10; //Нужен только остаток, т.к. текстур 10, а уровней 20
        });
    }

    set level(value) {
        this._level = value;
        this[1].src = `./assets/game/svg/textures/level_${value}/type_1.svg`;
        this[2].src = `./assets/game/svg/textures/level_${value}/type_2.svg`;
        this[3].src = `./assets/game/svg/textures/level_${value}/type_3.svg`;
    }

    get level() {
        return this._level;
    }
}