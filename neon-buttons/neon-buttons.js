'use strict';

document.querySelectorAll(".neon").forEach((element) => {
    neon(element);
});

function neon(element) {
    let skew;
    let interval;

    var x = new Audio('/neon-buttons/btn.wav');
    x.volume = 0.1;

    element.addEventListener('mouseover', start);
    element.addEventListener('touchstart', start);

    element.addEventListener('mousemove', checkCursor);

    function start() {
        x.play();

        element.style.transition = `.3s ease-out transform`
        let startDelay = setTimeout(() => {
            interval = setInterval(() => element.style.transform = `perspective(${skew.size}px) rotate3d(${skew.y},${skew.x},0,${skew.gipoten}deg)`, 30);
        }, 0);

        let resetStyle = () => {
            element.style.transition = `.5s ease-in transform`;
            element.style.transform = `perspective(0) rotate3d(0,0,0,0)`;
            element.blur();
            clearInterval(interval);
            clearTimeout(startDelay);
        }
        element.addEventListener('mouseout', resetStyle);
        element.addEventListener('touchend', resetStyle);
    }

    function checkCursor(e) {
        let pos = {
            x: -element.offsetWidth / 2 + e.offsetX,
            y: -element.offsetHeight / 2 + e.offsetY
        }

        skew = {
            size: this.offsetWidth + this.offsetHeight / 2,
            x: (pos.x / this.offsetWidth * 10) | 0,
            y: (-pos.y / this.offsetHeight * 10) | 0,
            gipoten: (Math.sqrt(pos.x * pos.x + pos.y * pos.y) / 4) | 0
        }
    }
}