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


export default class Overlay {

    constructor(game, stats) {
        const o = $('section.overlay');
        const show = () => {
            o.fadeIn('fast');
        }
        const hide = () => {
            o.fadeOut('fast');
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

        // swiper.slideTo(2);

        $('#StartBtn').click(function () {
            swiper.slideTo(0);
            show();
        });

        $('#NewGameBtn').click(function () {
            hide();
            game.startGame();
        });

        $('#LoadGameBtn').click(function () {

        });

        $('#SaveScoreBtn').click(function () {
            let topScores = [];

            let obj = {
                name: $('#nameInput').val() ? $('#nameInput').val() : 'player',
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
        });

        $('#ScoresBtn').click(function () {
            show();
            swiper.slideTo(3);
        });

        $('#AboutBtn').click(function () {
            show();
            swiper.slideTo(4);
        });

        $('#HelpBtn').click(function () {
            show();
            swiper.slideTo(6);
        });



        EMITTER.subscribe('ticker:pausePressed', () => {
            show();
            swiper.slideTo(1, 0);
        });

        EMITTER.subscribe('ticker:pauseReleased', () => {
            hide();
        });

        //Gameover screen
        EMITTER.subscribe('block:gameOver', () => {
            setTimeout(() => {
                $('#finalScore').html(stats.score);
                o.fadeIn('slow');
                swiper.slideTo(2, 0);

                setTimeout(() => {
                    $('#nameInput').focus();
                }, 1300);
            }, 1000);
        });
    }
}