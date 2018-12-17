export default class Canvas {
    constructor(element, textures) {
        this.context = element.getContext('2d');
        this.textures = textures;
    }

    drawState(matrix) {
        let context = this.context;
        matrix.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    //Color
                    // context.fillStyle = cell.color;
                    // context.fillRect(x * 20, y * 20, 20, 20);
                    //Texture
                    context.drawImage(this.textures[cell.color], x * 20, y * 20, 20, 20);
                } else {
                    context.clearRect(x * 20, y * 20, 20, 20);
                }
            });
        });
    }

    drawBlock(xPos, yPos, points, color) {
        let context = this.context;
        context.fillStyle = color;
        for (let i = 0; i < points.length; i++) {
            //Color
            // context.fillRect((points[i].x + xPos) * 20, (points[i].y + yPos) * 20, 20, 20);
            //Texture
            context.drawImage(this.textures[color], (points[i].x + xPos) * 20, (points[i].y + yPos) * 20, 20, 20);
        }
    }

    eraseBlock(x, y, points) {
        let context = this.context;
        for (let i = 0; i < points.length; i++) {
            context.clearRect((points[i].x + x) * 20, (points[i].y + y) * 20, 20, 20);
        }
    }

    wipeLinesAnimation(lines, callback) {
        let context = this.context;

        //Трансляция события начала анимации
        EMITTER.emit('canvas:wipeAnimationStart');

        let i = 0;
        let interval = setInterval(() => {
            lines.forEach((line) => {
                context.clearRect((4 - i) * 20, line * 20, 20, 20);
                context.clearRect((5 + i) * 20, line * 20, 20, 20);
            });
            i++;
            if (i > 5) {
                clearInterval(interval);
                
                //Трансляция события окончания анимации
                callback();
                EMITTER.emit('canvas:wipeAnimationEnd');
                return 
            }
        }, 60);

    }

    gameOverAnimation() {
        let context = this.context;
        context.fillStyle = 'rgba(0, 0, 0, .25)';
        let n = 0
        let interval = setInterval(() => {
            for (let j = 0; j < 100; j++) {
                let i = j % 2 ? 1 : 0
                for (i; i < 50; i++) {
                    context.fillRect(i * 4, j * 4, 4, 4);
                    i++;
                    // console.log(i);
                }
            }
            // console.log('n ------------------> ', n);
            if (n >= 6) {
                clearInterval(interval);
                return; //callback();
            }
            n++;
        }, 200);
    }
}