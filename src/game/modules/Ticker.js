export default class Ticker {
	constructor() {
		this._isRunning = false;
		this.sleepTimeout = null;
		this._startTime = Math.floor(performance.now());
		this._time = 0;
		this._delay = 1000;
		this._tickNumber = 0;

		this.onTick = (/* ticker */) => {/* console.log('Ticker time', ticker._time) */ };

		const run = () => {
			requestAnimationFrame(() => {

				this._time = Math.floor(performance.now()) - this._startTime;
				const requestTickNumber = Math.floor(this._time / this._delay);

				if (this._isRunning && requestTickNumber > this._tickNumber) {

					this._tickNumber = Math.floor(this._time / this._delay);
					this.onTick(this);

					// console.table({
					// 	'Ticker time': this._time,
					// 	'Ticker delay': this._delay,
					// 	'Tick number': this._tickNumber,
					// 	'Lag': this._time % this._delay
					// });
				}

				run();
			});
		}
		run();

	}

	set delay(value) {
		// console.log('Setting delay to:', value);
		this._startTime = Math.floor(performance.now());
		this._time = 0;
		this._delay = value;
		this._tickNumber = 0;
	}

	get running() {
		return this._isRunning;
	}

	stop() {
		this._isRunning = false;
	}

	start(delay) {
		this.delay = delay || this._delay;
		this._isRunning = true;
	}

	sleep(ms) {
		clearTimeout(this.sleepTimeout);
		this.stop();
		this.sleepTimeout = setTimeout(() => {
			this.start();
		}, ms);
	}

}