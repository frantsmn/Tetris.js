'use strict';

document.querySelectorAll("button").forEach((element) => {
    neon(element);
});

function neon(element) {
    let skew;
    let interval;
    let rect = element.getBoundingClientRect();

    // var x = document.getElementById("myAudio");
    var x = new Audio('/neon-buttons/btn.wav');
    x.volume = 0.1;

    function playAudio() {
        x.play();
    }

    element.addEventListener('mouseover', start);
    element.addEventListener('mousemove', checkCursor);

    function start() {
        playAudio();

        element.style.transition = `.3s ease-out transform`
        let startDelay = setTimeout(() => {
            interval = setInterval(() => element.style.transform = `perspective(${skew.size}px) rotate3d(${skew.y},${skew.x},0,${skew.gipoten}deg)`, 30);
        }, 0);
        element.addEventListener('mouseout', () => {
            element.style.transition = `.5s ease-in transform`;
            element.style.transform = `perspective(0) rotate3d(0,0,0,0deg)`;
            clearInterval(interval);
            clearTimeout(startDelay);
        });
    }

    function checkCursor(e) {
        let pos = {
            x: (e.clientX - rect.left) - element.offsetWidth / 2,
            y: (e.clientY - rect.top) - element.offsetHeight / 2
        }

        console.log(rect.left);

        skew = {
            size: this.offsetWidth + this.offsetHeight,
            x: (pos.x / this.offsetWidth * 10) | 0,
            y: (-pos.y / this.offsetHeight * 10) | 0,
            gipoten: (Math.sqrt(pos.x * pos.x + pos.y * pos.y) / 3.5) | 0
        }
    }
}