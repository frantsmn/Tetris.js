import Keyboard from './Keyboard.js';
import Touch from './Touch.js';
import Gamepad from './Gamepad.js';

export default class Control {
	constructor(block) {

		let shiftRepeatTimeoutID = 0;		// ID таймаута повтора движения блока влево/вправо, при зажатой кнопке
		let downRepeatTimeoutID = 0;		// ID таймаута повтора движения блока вниз, при зажатой кнопке

		this._isPaused = false;					// Состояние паузы
		this._isAvailable = false;			// Состояние блокировки управления 

		const KEYDOWN_VOC = {
			'Pause': () => {
				this.isPaused = !this.isPaused;
				clearTimeout(shiftRepeatTimeoutID);
				clearTimeout(downRepeatTimeoutID);
			},
			'A': () => block.activeBlock.rotateLeft(),
			'B': () => block.activeBlock.rotateRight(),
			'Left': () => {
				clearTimeout(shiftRepeatTimeoutID);								// Обнулить повторы нажатия (устранение конфликта при одновременном нажатии 'left' и 'right')
				block.activeBlock.moveLeft();
				shiftRepeatTimeoutID = setTimeout(function tick() {
					block.activeBlock.moveLeft();
					shiftRepeatTimeoutID = setTimeout(tick, 100);		// Рекурсивно вызывать таймаут
				}, 260);
			},
			'Right': () => {
				clearTimeout(shiftRepeatTimeoutID);								// Обнулить повторы нажатия (устранение конфликта при одновременном нажатии 'left' и 'right')
				block.activeBlock.moveRight();
				shiftRepeatTimeoutID = setTimeout(function tick() {
					block.activeBlock.moveRight();
					shiftRepeatTimeoutID = setTimeout(tick, 100);		// Рекурсивно вызывать таймаут
				}, 260);
			},
			'Down': () => {
				downRepeatTimeoutID = setTimeout(function tick() {
					block.activeBlock.moveDown();
					EMITTER.emit('control:downPressed', true);			// Сообщить о нажатой клавише 'down' (необходимо для подсчета строк, которые пролетит блок)
					downRepeatTimeoutID = setTimeout(tick, 37);			// Рекурсивно вызывать таймаут
				}, 0);
			}
		}

		const KEYUP_VOC = {
			'Left': () => clearTimeout(shiftRepeatTimeoutID),
			'Right': () => clearTimeout(shiftRepeatTimeoutID),
			'Down': () => {
				//TODO заменить на :downReleased
				EMITTER.emit('control:downPressed', false);				//Сообщить об отпущенной клавише 'down' (необходимо для подсчета строк, которые пролетел блок)
				clearTimeout(downRepeatTimeoutID);
			},
		}

		const onKeyDown = (e) => {
			if (
				this.isAvailable ||														// Если управление не заблокировано или
				(e.button === 'Pause' && this.isPaused)				// была отжата 'Пауза'
			)
				if (KEYDOWN_VOC[e.button]) { 									// Проверить в словаре наличие такой кнопки
					KEYDOWN_VOC[e.button](); 										// Отработать функцию для этой кнопки
				}
		}

		const onKeyUp = (e) => {
			if (KEYUP_VOC[e.button]) {
				KEYUP_VOC[e.button]();
			}
		}

		// Keyboard
		const keyboard = new Keyboard();
		keyboard.onKeyDown = onKeyDown;
		keyboard.onKeyUp = onKeyUp;

		// Touch
		const touch = new Touch();
		touch.onKeyDown = onKeyDown;
		touch.onKeyUp = onKeyUp;

		// TODO: Gamepad
		const gamepad = new Gamepad();
		gamepad.onKeyDown = onKeyDown;
		gamepad.onKeyUp = onKeyUp;



		EMITTER.subscribe('canvas:wipeAnimationStart', () => this.isAvailable = false); 	// Блокировка управления на время анимации
		EMITTER.subscribe('canvas:wipeAnimationEnd', () => this.isAvailable = true); 			// Восстановление управления после анимации
		EMITTER.subscribe('block:gameOver', () => this.isAvailable = false); 							// Блокировка управление по gameover
		EMITTER.subscribe('block:blockFixed', () => {
			// Вне очереди очищаем рекурсивный таймаут на повтор движения вниз
			// Таким образом запрещаем блоку сразу падать после появления при зажатой кнопке "down"
			requestAnimationFrame(() => {
				//TODO заменить на :downReleased
				EMITTER.emit('control:downPressed', false); //Сообщаем об КАК БУДТО БЫ отпущенной клавише "down" (необходимо для подсчета строк, которые пролетел блок)
				clearTimeout(downRepeatTimeoutID);
				// console.log('downRepeatTimeoutID cleared!');
			});
		});
	}


	set isPaused(state) {
		this._isPaused = state;
		if (this._isPaused) {
			this.isAvailable = false;
			EMITTER.emit('control:pausePressed');
		} else {
			this.isAvailable = true;
			EMITTER.emit('control:pauseReleased');
		}
	}

	get isPaused() {
		return this._isPaused;
	}

	set isAvailable(state) {
		this._isAvailable = state;
	}

	get isAvailable() {
		return this._isAvailable;
	}
}