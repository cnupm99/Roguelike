"use strict";

define(["d", "Level", "Hero", "ResLoader"], function(d, Level, Hero, ResLoader) {

	document.body.add("div", {
		id: "info",
		innerHTML: "Wellcome to Random Roguelike game. If you dont know what to do, press F1."
	});
	document.body.add("div", {
		id: "desc"
	});
	document.body.add("div", {
		id: "main"
	});

	var loader = new ResLoader();
	window.lang = {};

	var h,
		l,
		animation;

	/*var l = new Level({
		width: 30,
		height: 30,
		difficult: 0,
		maxDiscover: h.getMaxDiscover()
	});*/

	loader.loadLang("en", function(data) {

		window.lang = data;
		// console.log(lang);
		document.body.addEventListener("keypress", onKeyPress);
		// document.body.addEventListener("click", onMouseClick);
		d("main").addEventListener("click", onMouseClick);

		h = new Hero();

		newLevel();
		// l.setHeroPosition(h);
		// l.checkVisible(h.overview, h.shadow, h.side, h.getDiscover(), addText);
		// drawField();

	});

	function onMouseClick(e) {
		// console.log(e);
		// console.log(l.getTileOnCoord(e));
	}

	function onKeyPress(e) {

		l.startTurn();
		// console.log(e);
		var key = e.charCode;

		if (key < 58 && key > 48) {

			var x1 = h.position.x,
				y1 = h.position.y,
				side1 = h.side;

			switch (key) {
				case 49:
					if (h.side == 5) {
						x1--;
						y1++;
					} else {
						h.side = 5;
					}
					break;
				case 50:
					if (h.side == 4) {
						y1++;
					} else {
						h.side = 4;
					}
					break;
				case 51:
					if (h.side == 3) {
						x1++;
						y1++;
					} else {
						h.side = 3;
					}
					break;
				case 52:
					if (h.side == 6) {
						x1--;
					} else {
						h.side = 6;
					}
					break;
				case 53:
					break;
				case 54:
					if (h.side == 2) {
						x1++;
					} else {
						h.side = 2;
					}
					break;
				case 55:
					if (h.side == 7) {
						x1--;
						y1--;
					} else {
						h.side = 7;
					}
					break;
				case 56:
					if (h.side == 0) {
						y1--;
					} else {
						h.side = 0;
					}
					break;
				case 57:
					if (h.side == 1) {
						x1++;
						y1--;
					} else {
						h.side = 1;
					}
					break;
			}

			if ((h.position.x == x1) && (h.position.y == y1)) {
				if (h.side == side1) {
					addText(lang.log[20])
				} else {
					addText(lang.log[h.side + 8]);
				}
			} else {
				if (l.getTilePass(x1, y1)) {
					h.position.x = x1;
					h.position.y = y1;
					l.setHeroPosition(h);
					addText(lang.log[h.side]);
				} else {
					if (l.openDoor(x1, y1)) addText(lang.log[16]);
				}
			}

		}

		if (key == 99) {
			var cnt = l.closeDoor(h.position);
			if (cnt == 0) {
				addText(lang.log[19]);
			} else if (cnt == 1) {
				addText(lang.log[17]);
			} else if (cnt > 1) {
				addText(lang.log[18]);
			}
		}

		if (key == 62) {
			if (l.stepDown()) {
				addText(lang.log[22], 2);
				newLevel();
			}
		}

		// console.time("visible");
		l.checkVisible(h.overview, h.shadow, h.side, h.getDiscover(), addText);
		// console.timeEnd("visible");

	}

	function newLevel() {
		cancelAnimationFrame(animation);
		d("main").clr();
		l = new Level({
			width: 30,
			height: 30,
			difficult: 0,
			maxDiscover: h.getMaxDiscover()
		});
		h.position = {
			x: 1,
			y: 1
		}
		l.setHeroPosition(h);
		l.checkVisible(h.overview, h.shadow, h.side, h.getDiscover(), addText);
		drawField();
	}

	function drawField() {
		l.outText();
		animation = requestAnimationFrame(drawField);
	}

	function addText(text, type) {
		type = type || 1;
		switch (type) {
			case 1:
				text = "<font color='#555'>" + text + "</font>";
				break;
			case 2:
				text = "<font color='#0D0'>" + text + "</font>";
				break;
		}
		d("info").innerHTML = text + "<br>" + d("info").innerHTML;
	}

});