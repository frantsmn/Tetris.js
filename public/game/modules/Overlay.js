// id="NewGameBtn"
// id="LoadGameBtn"
// id="ContiniueBtn"
// id="SaveGameBtn"
// id="SaveScoreBtn"
// id="LoadSaveBtn"


export default class Overlay {
    constructor(game) {

        const o = $('section.overlay');

        $("#NewGameBtn").click(function () {
            o.fadeOut('fast');
            game.start();
        });


        this.show = () => {
            alert('Overlay shown');
        }

        this.hide = () => {
            alert('Overlay hidden');
        }


        EMITTER.subscribe('ticker:pausePressed', () => {

        });

        EMITTER.subscribe('ticker:pauseReleased', () => {

        });

    }



}