export default class Touch {
	constructor() {

		const controller = document.getElementById('controller');

		this.map = {
			'button-a': { button: 'A' },
			'button-b': { button: 'B' },
			'button-left': { button: 'Left' },
			'button-down': { button: 'Down' },
			'button-right': { button: 'Right' },
			'button-pause': { button: 'Pause' },
		}

		this.pressedKeys = {};

		this.onKeyDown = Function; /*(data) => { console.log(data); }*/
		this.onKeyUp = Function; /*(data) => { console.log(data); }*/

		controller.querySelectorAll('button').forEach(button => {
			button.addEventListener('touchstart', e => this.keydown(e));
			button.addEventListener('touchend', e => this.keyup(e));
		});
	}

	keydown(e) {
		if (this.map[e.target.id]) {
			this.onKeyDown(this.map[e.target.id]);
			this.pressedKeys[e.target.id] = this.map[e.target.id];
			e.srcElement.classList.add('active');
		}
	}

	keyup(e) {
		if (this.map[e.target.id]) {
			this.onKeyUp(this.map[e.target.id]);
			delete this.pressedKeys[e.target.id];
			e.srcElement.classList.remove('active');
		}
	}

}