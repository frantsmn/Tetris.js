export default class Stats {
    constructor(element, sound) {

        this.blockStatistics = {
            't-block': 0,
            'j-block': 0,
            'z-block': 0,
            'o-block': 0,
            's-block': 0,
            'l-block': 0,
            'i-block': 0,
        }

        this.topScores = 0;
        this.topScore = 0;
        this.score = 0;
        this.lines = 0;
        this.level = 0;


        this.init = () => {
            this.loadTopscores();
            this.score = 0;
            this.lines = 0;
            this.level = 0;
            this.refreshBlockImages();
            this.refresh()
        }

        //=======================================================
        //Счетчик высоты падения блока
        let fallLinesCounter = 0;
        //Подсчет высоты падения блока с зажатой кнопкой вниз
        EMITTER.subscribe('control:downPressed', (downPressed) => {
            fallLinesCounter = downPressed ? fallLinesCounter + 1 : 0;
        });
        //Добавить к очкам высоту падения
        EMITTER.subscribe('block:blockFixed', () => {
            this.score += fallLinesCounter;
            this.refresh();
        });

        //=======================================================
        //Обновление изображений блоков (подсчет появившихся блоков)
        this.refreshBlockImages = function () {
            element.querySelectorAll('img[data-blockName]').forEach((item) => {
                item.src = `./game/svg/blocks/level_${this.level % 10}/${item.dataset.blockname}.svg`;
            });
        };

        //=======================================================
        //Добавить линии
        this.addLines = (n) => {

            this.lines += n;

            //Если переход на следующий уровень
            if (this.level < Math.floor(this.lines / 10)) {
                //Добавить уровень
                this.level = Math.floor(this.lines / 10);
                //Оповестить (класс Текстур для смены спрайтов)
                EMITTER.emit('stats:newLevel', this.level);
                //Вопроизвести звук
                sound.play('levelup');
                window.navigator.vibrate([0, 200, 100, 100, 100]);
                //Если просто очищены линии, то
            } else {
                if (n === 4) {
                    // В случае тетриса
                    this.blinkAnimation();
                    sound.play('tetris');
                    window.navigator.vibrate([0, 100, 500]);
                } else {
                    //В случае одиночной
                    sound.play('clearline');
                    window.navigator.vibrate([0, 200, 30, 30, 30, 30, 30, 30, 30]);
                }
            }

            switch (n) {
                case 1:
                    this.score += 40 * (this.level + 1);
                    break;
                case 2:
                    this.score += 100 * (this.level + 1);
                    break;
                case 3:
                    this.score += 300 * (this.level + 1);
                    break;
                case 4:
                    this.score += 1200 * (this.level + 1);
                    break;
                default:
                    break;
            }

            this.refresh();
        }

        //Подгрузка рекордов
        //=======================================================
        this.loadTopscores = function () {
            this.topScores = JSON.parse(localStorage.getItem('topScores'));
            if (this.topScores) {
                let sortedTopScores = this.topScores.sort((a, b) => { return b.score - a.score })
                this.topScore = sortedTopScores[0].score;
            } else {
                console.log('Scores empty: ', this.topScores);
                this.topScore = 0;
            }
            this.refresh();


            


            return this.topScores;
        }


        //Обновление статистики (правая панель)
        this.refresh = function () {
            //Рекорд очков
            element.querySelector(`#topScoreStat`).textContent = this.topScore;
            //Набранные очки
            element.querySelector(`#scoreStat`).textContent = this.score;
            //Стертые линии
            element.querySelector(`#linesStat`).textContent = this.lines;
            //Текущий уровень
            element.querySelector(`#levelStat`).textContent = this.level;
        }

        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //Обновить картинку следующего блока
        //Вызывается из Block.js
        this.refreshNextBlock = function (nextBlockName) {
            element.querySelector('img#nextBlock').src = `./game/svg/blocks/level_${this.level % 10}/${nextBlockName}.svg`;
        }

        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //Подсчет появившихся в стакане блоков
        //Вызывается из Block.js
        this.refreshAppearedBlocks = function (activeBlockName) {
            this.blockStatistics[activeBlockName]++;
            for (var prop in this.blockStatistics) {
                if (Object.prototype.hasOwnProperty.call(this.blockStatistics, prop)) {
                    element.querySelector(`#${prop}-stat`).textContent = this.blockStatistics[prop];
                }
            }
            this.refreshBlockImages();
        }

        //-------------------------------------------------------
        //Анимация стакана при "забивании тетриса"
        this.blinkAnimation = function () {
            element.classList.add('blink-animation');
            setTimeout(() => {
                element.classList.remove('blink-animation');
            }, 400);
        }
    }
}