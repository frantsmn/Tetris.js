export default class Stats {
    constructor(element) {

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

        //Инциализация (сброс) статистики, для старта новой игры
        this.init = () => {
            this.loadTopscores();
            this.score = 0;
            this.lines = 0;
            this.level = 0;
            this.refreshBlockImages();
            this.refresh()
            this.blockStatistics = {
                't-block': 0,
                'j-block': 0,
                'z-block': 0,
                'o-block': 0,
                's-block': 0,
                'l-block': 0,
                'i-block': 0,
            }
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
                item.src = `./assets/game/svg/blocks/level_${this.level % 10}/${item.dataset.blockname}.svg`;
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
                //Оповестить (класс Текстур для смены спрайтов, и класс Sound для воспроизведения звука)
                EMITTER.emit('stats:newLevel', this.level);
                //Если просто очищены линии, то
            } else {
                if (n === 4) {
                    // В случае тетриса
                    EMITTER.emit('stats:tetris', this.level);
                } else {
                    //В случае одиночной (двойной или тройной)
                    EMITTER.emit('stats:clearline', this.level);
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
            let sortedTopScores = [];
            if (this.topScores) {
                sortedTopScores = this.topScores.sort((a, b) => { return b.score - a.score })
                this.topScore = sortedTopScores[0].score;

                //Отрисовка в таблице рекордов
                let table = document.querySelector('#scoresTable');
                table.innerHTML = '';

                sortedTopScores.forEach((item, i) => {
                    if (i <= 9) {
                        table.innerHTML += `<div>${item.name}</div> <div>${item.score}</div>`
                    }
                });

            } else {
                console.log('Scores empty: ', this.topScores);
                this.topScore = 0;
            }
            this.refresh();



            return this.topScores;
        }

        this.loadTopscores();


        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //Обновить картинку следующего блока
        //Вызывается из Block.js
        this.refreshNextBlock = function (nextBlockName) {
            element.querySelector('img#nextBlock').src = `./assets/game/svg/blocks/level_${this.level % 10}/${nextBlockName}.svg`;
        }

        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //Подсчет появившихся в стакане блоков
        //Вызывается из Block.js
        this.refreshAppearedBlocks = function (activeBlockName) {
            if (activeBlockName) {
                this.blockStatistics[activeBlockName]++;
            }
            for (var prop in this.blockStatistics) {
                if (Object.prototype.hasOwnProperty.call(this.blockStatistics, prop)) {
                    element.querySelector(`#${prop}-stat`).textContent = this.blockStatistics[prop];
                }
            }
            this.refreshBlockImages();
        }
    }
}