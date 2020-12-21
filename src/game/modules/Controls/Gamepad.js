import { GamepadListener } from 'gamepad.js';


export default class Gamepad {
	constructor() {

		this.MAP = {
			0: { button: 'A' },
			1: { button: 'B' },
			14: { button: 'Left' },
			13: { button: 'Down' },
			15: { button: 'Right' },
			9: { button: 'Pause' },
		}

		const listener = new GamepadListener(/* options*/);
		listener.start();

		window.gamepads = this.gamepads = [];
		this.pressedKeys = {};
		this._mode = 'SINGLE';

		listener.on('gamepad:connected', function (event) {
			/**
			 * event:
			 *   detail: {
			 *       index: 0, // Gamepad index [0-3]
			 *       gamepad, // Native Gamepad object
			 *   }
			 */
			console.log(`connected >>`, event);
		});

		listener.on('gamepad:disconnected', function (event) {
			/**
			 * event:
			 *   detail: {
			 *       index: 0,
			 *       // Native Gamepad object is no longer available
			 *   }
			 */
			console.log(`disconnected >>`, event);
		});


		listener.on('gamepad:button', (event) => {
			/**
			 * event:
			 *   detail: {
			 *       index: 2, // Gamepad index [0-3]
			 *       button: 4, // Button index [0-N]
			 *       value: 0.56, // Value (float if analog, otherise integer)
			 *       pressed: true, // Boolean
			 *       gamepad, // Native Gamepad object
			 *   }
			 */
			// console.log(`button >>>`, event);
			if (event.detail.pressed) {
				// console.time('gamepadDelay');
				this.keydown(event.detail.button);
			} else {
				this.keyup(event.detail.button);
			}
		});


	}

	keydown(button) {
		if (
			this.MAP[button] && 					// Если такая кнопка в карте есть и
			!this.pressedKeys[button] 		// Если такая кнопка еще не нажата (защита от системных нажатий клавиши)
		) {
			this.onKeyDown(this.MAP[button]);
			this.pressedKeys[button] = this.MAP[button];
		}
	}

	keyup(button) {
		if (this.MAP[button]) {
			this.onKeyUp(this.MAP[button]);
			delete this.pressedKeys[button];
		}
	}

}

