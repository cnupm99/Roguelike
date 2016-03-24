"use strict";

define(["screenObject"], function(screenObject) {

	function Hero() {

		screenObject.apply(this, arguments);

		this.visible = true;
		this.inMind = true;
		this._represent = "@";
		this._visibleColor = "#0F0";

		this.position = {
			x: 1,
			y: 1
		};

		this.overview = 10;
		this.shadow = 20;
		this.side = 3;
		this._desc = 7;

	}

	Hero.prototype = Object.create(screenObject.prototype);
	Hero.prototype.constructor = Hero;

	return Hero;

});