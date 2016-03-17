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
	l.setHeroPosition(h);
	l.checkVisible(h.overview, h.shadow, h.side);
	drawField();

	document.body.addEventListener("keypress", onKeyPress);

	function onKeyPress(e) {

		l.startTurn();
		// console.log(e);
		var key = e.charCode;

		if (key < 58 && key > 48) {

			var x1 = h.position.x,
				y1 = h.position.y;

			switch (key) {
				case 49:
					if (h.side == 5) {
						x1--;
						y1++;
					} else h.side = 5;
					break;
				case 50:
					if (h.side == 4) {
						y1++;
					} else h.side = 4;
					break;
				case 51:
					if (h.side == 3) {
						x1++;
						y1++;
					} else h.side = 3;
					break;
				case 52:
					if (h.side == 6) {
						x1--;
					} else h.side = 6;
					break;
				case 53:
					break;
				case 54:
					if (h.side == 2) {
						x1++;
					} else h.side = 2;
					break;
				case 55:
					if (h.side == 7) {
						x1--;
						y1--;
					} else h.side = 7;
					break;
				case 56:
					if (h.side == 0) {
						y1--;
					} else h.side = 0;
					break;
				case 57:
					if (h.side == 1) {
						x1++;
						y1--;
					} else h.side = 1;
					break;
			}

			if (l.getTilePass(x1, y1)) {
				h.position.x = x1;
				h.position.y = y1;
				l.setHeroPosition(h);
			} else {
				l.openDoor(x1, y1);
			}

		}

		if (key == 99) {
			l.closeDoor(h.position);
		}

		console.time("visible");
		l.checkVisible(h.overview, h.shadow, h.side);
		console.timeEnd("visible");

	}

	function drawField() {
		l.outText(d("main"));
		requestAnimationFrame(drawField);
	}

});