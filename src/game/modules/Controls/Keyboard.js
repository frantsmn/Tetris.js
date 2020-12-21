export default class Keyboard {
	constructor() {

		this.SINGLE_MAP = {
			90: { button: 'A' },			// Z
			88: { button: 'B' },			// X
			37: { button: 'Left' },		// Left
			40: { button: 'Down' },		// Down
			39: { button: 'Right' },	// Right
			32: { button: 'Pause' },	// Pause
		}

		this.MULTI_MAP = {
			90: { button: 'A', player: 1 },			// Z				(player 1)
			88: { button: 'B', player: 1 },			// X				(player 1)
			86: { button: 'Left', player: 1 },	// V				(player 1)
			66: { button: 'Down', player: 1 },	// B				(player 1)
			78: { button: 'Right', player: 1 },	// N				(player 1)
			32: { button: 'Pause' },						// Space
			190: { button: 'B', player: 2 },		// .				(player 2)
			191: { button: 'A', player: 2 },		// /				(player 2)
			37: { button: 'Left', player: 2 },	// Left			(player 2)
			40: { button: 'Down', player: 2 },	// Down			(player 2)
			39: { button: 'Right', player: 2 },	// Right		(player 2)
		}

		this._mode = 'SINGLE';
		this.map = this.SINGLE_MAP;
		this.pressedKeys = {};

		this.onKeyDown = Function; /*(data) => { console.log(data); }*/
		this.onKeyUp = Function; /*(data) => { console.log(data); }*/

		document.addEventListener('keydown', e => this.keydown(e));
		document.addEventListener('keyup', e => this.keyup(e));
	}

	keydown(e) {
		if (
			this.map[e.keyCode] && 					// Если такая кнопка в карте есть и
			!this.pressedKeys[e.keyCode] 		// Если такая кнопка еще не нажата (защита от системных нажатий клавиши)
		) {
			this.onKeyDown(this.map[e.keyCode]);
			this.pressedKeys[e.keyCode] = this.map[e.keyCode];
			e.preventDefault();
			e.stopPropagation();
		}
	}

	keyup(e) {
		if (this.map[e.keyCode]) {
			this.onKeyUp(this.map[e.keyCode]);
			delete this.pressedKeys[e.keyCode];
		}
	}

	set mode(mode) {
		if (mode === 'SINGLE') {
			this.map = this.SINGLE_MAP;
			this._mode = mode;
		}
		if (mode === 'MULTI') {
			this.map = this.MULTI_MAP;
			this._mode = mode;
		}
	}

	get mode() {
		return this._mode;
	}
}