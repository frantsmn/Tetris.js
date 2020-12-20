//id="StartBtn"
//id="ScoresBtn"
//id="AboutBtn"
//id="HelpBtn"

// id="NewGameBtn"
// id="LoadGameBtn"
// id="ContiniueBtn"
// id="SaveGameBtn"
// id="SaveScoreBtn"
// id="LoadSaveBtn"

export default class UI {

    constructor(game, stats) {
        const overlay = document.querySelector('section.overlay');

        const startButton = document.querySelector('#StartBtn');
        const scoresButton = document.querySelector('#ScoresBtn');
        const aboutButton = document.querySelector('#AboutBtn');
        const helpButton = document.querySelector('#HelpBtn');

        const newGameButton = document.querySelector('#NewGameBtn');
        const loadGameButton = document.querySelector('#LoadGameBtn');
        const continiueButton = document.querySelector('#ContiniueBtn');
        const saveGameButton = document.querySelector('#SaveGameBtn');
        const saveScoreButton = document.querySelector('#SaveScoreBtn');
        const loadSaveButton = document.querySelector('#LoadSaveBtn');


        const show = () => {
            overlay.style.display = "block";
        }
        const hide = () => {
            overlay.style.display = "none";
        }

        var swiper = new Swiper('.swiper-container', {
            allowTouchMove: false,
            direction: 'vertical',
            speed: 300,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });

        //Предустановка стилй кнопке загрузки игры в зависимости от наличия сохранения (по умолчанию кнопка неактивна)
        if (localStorage['state']) {
            loadGameButton.classList.remove('blocked');
        }

        startButton.onclick = () => {
            show();
            swiper.slideTo(0);
        };

        newGameButton.onclick = () => {
            hide();
            game.startGame();
        };

        saveGameButton.onclick = function () {
            game.saveGame();
            this.innerText = 'Saved';
            setTimeout(() => {
                this.style.display = "none";
            }, 400);
            loadGameButton.classList.remove('blocked');
        };

        loadGameButton.onclick = () => {
            hide();
            game.loadGame();
        };

        saveScoreButton.onclick = () => {
            let topScores = [];
            let name = document.querySelector('#nameInput').value || 'noname';

            let obj = {
                name,
                score: stats.score,
            };

            if (stats.loadTopscores()) {
                topScores = stats.loadTopscores();
                topScores.push(obj);
                localStorage.setItem('topScores', JSON.stringify(topScores));
                stats.loadTopscores();
            } else {
                topScores.push(obj);
                localStorage.setItem('topScores', JSON.stringify(topScores));
                stats.loadTopscores();
            }

            swiper.slideTo(0);
        }

        scoresButton.onclick = () => {
            show();
            swiper.slideTo(3);
        };

        aboutButton.onclick = () => {
            show();
            swiper.slideTo(4);
        }

        helpButton.onclick = () => {
            show();
            swiper.slideTo(6);
        }

        //По готовности (загрузке) текстур, убрать класс .loading для overlay
        EMITTER.subscribe('textures:ready', () => {
            overlay.classList.remove('loading');
        });

        EMITTER.subscribe('control:pausePressed', () => {
            show();
            saveGameButton.style.display = "block";
            saveGameButton.innerText = 'Save game';
            swiper.slideTo(1, 0);
        });

        EMITTER.subscribe('control:pauseReleased', () => {
            hide();
        });

        //Gameover screen
        EMITTER.subscribe('block:gameOver', () => {
            setTimeout(() => {
                document.querySelector('#finalScore').innerHTML = stats.score;
                overlay.style.display = 'block';
                swiper.slideTo(2, 0);

                setTimeout(() => {
                    document.querySelector('#nameInput').focus();
                    document.querySelector('#nameInput').select();
                }, 800);
            }, 1000);
        });


        document.querySelector('#nameInput')
            .addEventListener('keypress', (event) => {
                const keyName = event.key;
                if (keyName == "Enter") {
                    saveScoreButton.click();
                }
            });
    }
}