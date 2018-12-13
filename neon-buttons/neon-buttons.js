'use strict';

document.querySelectorAll(".neon").forEach((element) => {
    neon(element);
});

function neon(element) {
    let skew;
    let interval;
    let delay;
    let fx = new Audio('/neon-buttons/btn.wav');
    fx.volume = 0.1;

    element.addEventListener('mouseover', start);
    element.addEventListener('mousemove', checkCursor);
    element.addEventListener('mouseout', resetStyle);

    // element.addEventListener('touchend', resetStyle);

    function start() {
        element.classList.add('active');
        element.style.transition = `.3s ease-out transform`
        fx.play();

        interval = setInterval(() => element.style.transform = `perspective(${skew.size}px) rotate3d(${skew.y},${skew.x},0,${skew.gipoten}deg)`, 30);

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

    function resetStyle() {
        element.blur();
        element.classList.remove('active');
        element.style.transition = `.5s ease-in transform`;
        element.style.transform = `perspective(0) rotate3d(0,0,0,0)`;
        clearInterval(interval);
    }
}