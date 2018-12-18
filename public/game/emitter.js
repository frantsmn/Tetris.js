'use strict';

const EMITTER = (function emitter () {

    class EventEmitter {
        constructor() {
            this.events = {};
        }

        subscribe(eventName, fn) {
            if (!this.events[eventName]) { //Если событие новое
                this.events[eventName] = []; //Создать массив (который будет хранить подписавшиеся на событие функции)
            }
            this.events[eventName].push(fn); //Сохраням тело функции в массив с соотв названием события
            //Возвращаем функцию, которая быстренько пробегается по массиву хранящихся функций, и оставляет только те, которые
            //не являются текущей Т.е. переданная выше функция будет исключена из EvenEmitter'а
            return () => {
                this.events[eventName] = this.events[eventName].filter((eventFn) => fn !== eventFn);
            }
        }

        //Более явный метод исключения функции из EvenEmitter'а
        unsubscribe(eventName, fn) {
            this.events[eventName] = this.events[eventName].filter((eventFn) => fn !== eventFn);
        }

        emit(eventName, data) {
            const event = this.events[eventName]; //Объект искомого события в event
            if (event) { //Если такое свойство (объект) есть
                event.forEach((fn) => { //Выполняем хранящиеся функции
                    // fn.call(null, data); //Линтер ругался на null
                    fn(data);
                });
            }
        }
    }

    return new EventEmitter();

})();