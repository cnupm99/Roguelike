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

		this.wisdom = 18;

		this.abilitys = {
			"observation": 3
		};

		this.skills = {
			"search": 0
		}

	}

	Hero.prototype = Object.create(screenObject.prototype);
	Hero.prototype.constructor = Hero;

	Hero.prototype.getDiscover = function() {

		return this.wisdom * 2 + this.abilitys["observation"] * 10;

	};

	Hero.prototype.getMaxDiscover = function() {

		return this.wisdom * 2 + this.abilitys["observation"] * 10 + this.skills["search"] * 10;

	};

	return Hero;

});