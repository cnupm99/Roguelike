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
		 *  3 - простая каменная дверь
		 *  4 - лестница вниз
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
				this.desc = 3;
				break;
				// каменный пол
			case 2:
				this._represent = ".";
				this._visibleColor = "#FFF";
				this._inMindColor = "#222";
				this.passability = true;
				this.desc = 4;
				break;
				// каменная дверь
			case 3:
				this._represent = "+";
				this._visibleColor = "#0F0";
				this._inMindColor = "#222";
				this.passability = false;
				this.desc = 5;
				this._closed = true;
				break;
				// лестница вниз
			case 4:
				this._represent = ">";
				this._visibleColor = "#FFF";
				this._inMindColor = "#222";
				this.passability = true;
				this.desc = 8;
				break;
		}

	}

	// наследование
	Tile.prototype = Object.create(screenObject.prototype);
	Tile.prototype.constructor = Tile;

	Tile.prototype.setRepresent = function(represent) {

		this._represent = represent;

	};

	Tile.prototype.openDoor = function() {

		if (this.isEffect("hidden")) return false;

		if (!this._closed) return false;

		this._closed = false;
		this.passability = true;
		this._represent = "`";
		this.desc = 6;
		return true;

	};

	Tile.prototype.closeDoor = function() {

		if (this.isEffect("hidden")) return false;

		if (this._closed) return false;

		this._closed = true;
		this.passability = false;
		this._represent = "+";
		this.desc = 5;
		return true;

	};

	/**
	 * Проверяем, не откроется ли скрытый объект
	 * @param  {number} discover уровень поиска героя
	 * @return {boolean}          true, если поиск успешен, иначе false
	 */
	Tile.prototype.checkHidden = function(discover) {

		var bonus = 0,
			check = ~~(Math.random() * 1000),
			hiddenPower = 0;

		// рассчитываем случайный бонус к открытию
		if (check == 1) {
			bonus = 20;
		} else if (check < 10) {
			bonus = 10;
		} else if (check < 100) {
			bonus = 5;
		}

		// мощность скрытия
		this.effects.forEach(function(effect) {
			if (effect.effectName == "hidden") hiddenPower = effect.hiddenPower;
		});

		if (discover + bonus >= hiddenPower) {

			// убираем эффект скрытия
			this.removeEffect("hidden");
			return true;

		} else return false;

	};

	return Tile;

});