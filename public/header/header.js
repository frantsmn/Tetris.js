'use strict';

//Переменная состояния звука
document.PLAY_SOUND = true;

//Показать контроллер, если экран меньше 600px
if (window.innerWidth < 600) {
    document.getElementById('ControllerToggler').classList.toggle('on');
    toggleController();
}

//Выключение/включение звука
document.getElementById('SoundToggler').addEventListener('click', function (e) {
    e.target.classList.toggle('on');
    document.PLAY_SOUND = !document.PLAY_SOUND;
});

//Показать/спрятать контроллер
document.getElementById('ControllerToggler').addEventListener('click', function (e) {
    toggleController();
    e.target.classList.toggle('on');
});

//Полноэкранный/обычный режим
document.getElementById('FullScreenToggler').addEventListener('click', function (e) {
    toggleFullscreen();
    e.target.classList.toggle('on');
});

// Functions //

//Функция включения/выключения полноэкранного режима
function toggleFullscreen(elem) {
    elem = elem || document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}
//Функция показать/спрятать контроллер
function toggleController() {
    document.getElementById('controller').classList.toggle('hidden');
}