document.querySelectorAll(".neon").forEach((element) => {
    neon(element);
});

function neon(element) {
    let skew = {
        size: 0, x: 0, y: 0, gipoten: 0
    };
    let interval = 0;
    let fx = new Audio('./neon-buttons/btn.wav');

    element.addEventListener('mouseenter', start);
    element.addEventListener('mousemove', checkCursor);
    element.addEventListener('mouseleave', resetStyle);
    element.addEventListener('blur', resetStyle);

    element.addEventListener('touchend', resetStyle);

    function start() {
        document.querySelectorAll(".neon").forEach((element) => {
            element.classList.remove('active');
            element.blur();
        });

        element.classList.add('active');
        element.style.transition = `.3s ease-out transform`;

        if (localStorage['SOUND'] === 'true') {
            fx.play();
        }

        interval = setInterval(() => {
            element.style.transform = `perspective(${skew.size}px) rotate3d(${skew.y},${skew.x},0,${skew.gipoten}deg)`;
        }, 30);
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
            gipoten: (Math.sqrt(pos.x * pos.x + pos.y * pos.y) / 6.8) | 0
        }
    }

    function resetStyle() {
        document.querySelectorAll(".neon").forEach((element) => {
            element.classList.remove('active');
            element.blur();
        });

        element.style.transition = `.5s ease-in transform`;
        element.style.transform = `perspective(0) rotate3d(0,0,0,0)`;
        clearInterval(interval);
    }
}