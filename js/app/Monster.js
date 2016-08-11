"use strict";

define(["screenObject", "monsters"], function(screenObject, monsters) {

	function Monster(monsterLevel, monsterType, mx, my) {

		screenObject.apply(this, arguments);

		var info = monsters[monsterLevel][monsterType];

		this._represent = info.represent;
		this._visibleColor = info.color;
		this._inMindColor = "#222";

		this.position = {
			x: mx,
			y: my
		};

		this._str = info.params.str;
		this._dex = info.params.dex;
		this._con = info.params.con;
		this._int = info.params.int;
		this._wis = info.params.wis;
		this._cha = info.params.cha;
		this.size = info.size;
		this._description = lang.monsters[info.desc];

	}

	Monster.prototype = Object.create(screenObject.prototype);
	Monster.prototype.constructor = Monster;

	return Monster;

});