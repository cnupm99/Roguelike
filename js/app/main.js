"use strict";

define(["d", "Level", "Hero"], function(d, Level, Hero) {

	document.body.add("div", {
		id: "info"
	});

	document.body.add("div", {
		id: "main"
	});

	var h = new Hero();

	var l = new Level();
	l.setHeroPosition(h.position);
	l.checkVisible(h.overview, h.shadow, h.side);
	drawField();

	document.body.addEventListener("keypress", onKeyPress);

	function onKeyPress(e) {

		// console.log(e);
		var key = e.charCode;

		if (key < 58 && key > 48) {

			var x1 = h.position.x,
				y1 = h.position.y;

			switch (key) {
				case 49:
					x1--;
					y1++;
					break;
				case 50:
					y1++;
					break;
				case 51:
					x1++;
					y1++;
					break;
				case 52:
					x1--;
					break;
				case 53:
					break;
				case 54:
					x1++;
					break;
				case 55:
					x1--;
					y1--;
					break;
				case 56:
					y1--;
					break;
				case 57:
					x1++;
					y1--;
					break;
			}

			if (l.isPassability(x1, y1)) {
				h.position.x = x1;
				h.position.y = y1;
				l.setHeroPosition(h.position);
				console.time("visible");
				l.checkVisible(h.overview, h.shadow, h.side);
				console.timeEnd("visible");
			}

		}

	}

	function drawField() {
		l.outText(d("main"));
		requestAnimationFrame(drawField);
	}

});