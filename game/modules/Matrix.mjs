'use strict';

class Matrix {
    constructor(json) {
        this.setEmptyMatrix = function () {
            let m = [];
            for (let i = 0; i < 20; i++) {
                m[i] = [];
                for (let j = 0; j < 10; j++) {
                    m[i][j] = null;
                }
            }
            return m;
        }
        this.matrix = json ? JSON.parse(json) : this.setEmptyMatrix();
    }

    setMatrix(array) {
        this.matrix = array;
    }

    getMatrix() {
        return this.matrix
    }

    getFixedMatrix() {
        let m = [];
        this.matrix.forEach((element, i) => {
            m[i] = element.map((el) => {
                if (el) {
                    return el.state === 'active' ? null : el;
                }
                return null;
            });
        });
        return m;
    }

    getMatrixJSON() {
        return JSON.stringify(this.matrix)
    }

    getFixedMatrixJSON() {
        let m = [];
        this.matrix.forEach((element, i) => {
            m[i] = element.map((el) => {
                if (el) {
                    return el.state === 'active' ? null : el;
                }
                return null;
            });
        });
        return JSON.stringify(m);
    }

    setMatrixJSON(json) {
        this.matrix = JSON.parse(json);
    }

    clearMatrix() {
        this.matrix = this.setEmptyMatrix();
    }

    checkPointsIsEmpty(x, y, points) {
        for (let i = 0; i < points.length; i++) {

            //Игноровать точки, которые выше стакана и внутри левой и правой границы
            if (y + points[i].y < 0 && x + points[i].x >= 0 && x + points[i].x <= 9) {
                continue;
                //Точка внутри стакана
            } else if (y + points[i].y <= 19 && x + points[i].x >= 0 && x + points[i].x <= 9) {
                //Точка не накладывается на закрепленную точку
                if (this.matrix[y + points[i].y][x + points[i].x] !== null && this.matrix[y + points[i].y][x + points[i].x].state === 'fixed') {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }

    addPoints(x, y, points, color) {
        for (let i = 0; i < points.length; i++) {
            //Если не выше верхней границы стакана
            if (y + points[i].y >= 0) {
                this.matrix[y + points[i].y][x + points[i].x] = {
                    state: 'active',
                    color: color
                };
            }
        }
    }

    removePoints(x, y, points) {
        for (let i = 0; i < points.length; i++) {
            //Если не выше верхней границы стакана
            if (y + points[i].y >= 0) {
                this.matrix[y + points[i].y][x + points[i].x] = null;
            }
        }
    }

    fixPoints(x, y, points) {
        for (let i = 0; i < points.length; i++) {
            //Если не выше верхней границы стакана
            if (y + points[i].y >= 0) {
                this.matrix[y + points[i].y][x + points[i].x].state = 'fixed';
            }
        }
    }

    getFullLines() {
        let fullLines = [];
        this.matrix.forEach((line, i) => {
            if (line.every((point) => {
                return point && point.state === 'fixed';
            })) {
                fullLines.push(i);
            }
        });
        return fullLines;
    }

    removeFullLines() {
        this.getFullLines().forEach((fullLineNum) => {
            this.matrix.splice(fullLineNum, 1);
            this.matrix.unshift([null, null, null, null, null, null, null, null, null, null]);
        });
    }
}

export default Matrix;