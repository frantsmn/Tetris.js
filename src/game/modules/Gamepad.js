

export default (function () {

	// Start polling
	Gamepads.start();

	// Add event listeners
	Gamepads.addEventListener('connect', e => {
		console.log('Gamepad connected');
		console.log(e.gamepad);

		e.gamepad.addEventListener('buttonpress', e => {
			if (e.type === "buttonpress") {
				console.log(e.index);
			}
		});

	});

	Gamepads.addEventListener('disconnect', e => {
		console.log('Gamepad disconnected');
		console.log(e.gamepad);
	});

})();





