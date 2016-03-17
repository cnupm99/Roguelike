"use strict";

define(["screenObject"], function(screenObject) {

	/**
	 * Создание нового тайла
	 * @param {number} type тип тайла
	 * @constructor
	 */
	function Tile(type) {

		// конструктор родителя
		screenObject.apply(this, arguments);

		/**
		 * Тип тайла
		 * @type {number}
		 *  1 - простая кирпичная стена
		 *  2 - простой кирпичный пол
		 * @public
		 */
		this.type = type;

		/**
		 * содержит ли тайл что-то на себе
		 * @type {Boolean}
		 * @public
		 */
		this.contains = false;
		/**
		 * содержание тайла (дочерний объект)
		 * @type {Object|null}
		 * @public
		 */
		this.child = null;

		switch (this.type) {
			// каменная стена
			case 1:
				this._represent = "#";
				this._visibleColor = "#FFF";
				this._inMindColor = "#222";
				this.passability = false;
				break;
				// каменный пол
			case 2:
				this._represent = ".";
				this._visibleColor = "#FFF";
				this._inMindColor = "#222";
				this.passability = true;
				break;
				// каменная дверь
			case 3:
				this._represent = "+";
				this._visibleColor = "#AFA";
				this._inMindColor = "#222";
				this.passability = false;
				this.closed = true;
				break;
		}

	}

	// наследование
	Tile.prototype = Object.create(screenObject.prototype);
	Tile.prototype.constructor = Tile;

	Tile.prototype.setRepresent = function(represent) {

		this._represent = represent;

	};

	return Tile;

});