'use strict';

document.PLAY_SOUND = true;

document.getElementById('SoundToggler').addEventListener('click', function (e) {
    e.target.classList.toggle('on');
    document.PLAY_SOUND = !document.PLAY_SOUND;
});

document.getElementById('ControllerToggler').addEventListener('click', function (e) {
    e.target.classList.toggle('on');
    document.getElementById('controller').classList.toggle('hidden');
});

document.getElementById('FullScreenToggler').addEventListener('click', function (e) {
    toggleFullscreen();
    e.target.classList.toggle('on');
});

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