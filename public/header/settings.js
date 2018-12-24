'use strict';

//Показать контроллер, если экран меньше 600px
if (window.innerWidth < 600) {
    document.getElementById('ControllerToggler').classList.toggle('on');
    toggleController();
}

//Предустановка настройки звука в localStorage
if (localStorage['SOUND'] === undefined) {
    localStorage.setItem('SOUND', 'true');
}

//Предустановка стилй кнопке звука в зависимости от настроек (по умолчанию кнопка не светится)
if (localStorage['SOUND'] === 'true') {
    document.getElementById('SoundToggler').classList.add('on');
}

//Выключение/включение звука
document.getElementById('SoundToggler').addEventListener('click', function (e) {

    if (localStorage['SOUND'] === 'true') {
        localStorage.setItem('SOUND', 'false');
        e.target.classList.remove('on');
    } else {
        localStorage.setItem('SOUND', 'true');
        e.target.classList.add('on');
    }
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