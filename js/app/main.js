"use strict";

define(["d", "Level", "Hero"], function(d, Level, Hero) {

	document.body.add("div",{
		id: "info"
	});

	document.body.add("div",{
		id: "main"
	});

	var h = new Hero();

	var l = new Level();
	l.setHeroPosition(h.position);
	l.checkVisible(h.overview);
	l.outText(d("main"));

});