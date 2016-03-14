"use strict";

define(["screenObject"], function(screenObject) {

	/**
	 * Создание нового тайла
	 * @param {number} type тип тайла
	 * @constructor
	 */
	function Tile(type) {

		screenObject.apply(this, arguments);

		/**
		 * Тип тайла
		 * @type {number}
		 *  1 - простая кирпичная стена
		 *  2 - простой кирпичный пол
		 */
		this.type = type;

		this.contains = false;
		this.child = null;

		switch (this.type) {
			case 1:
				this._represent = "#";
				this._visibleColor = "#FFF";
				this._shadowColor = "#777";
				this._shadowMergeColor = "#888";
				this._inMindColor = "#222";
				this.passability = false;
				break;
			case 2:
				this._represent = ".";
				this._visibleColor = "#FFF";
				this._shadowColor = "#777";
				this._shadowMergeColor = "#888";
				this._inMindColor = "#222";
				this.passability = true;
				break;
		}

	}

	Tile.prototype = Object.create(screenObject.prototype);
	Tile.prototype.constructor = Tile;

	return Tile;

});