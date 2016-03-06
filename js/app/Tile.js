"use strict";

define(function() {

	/**
	 * Создание нового тайла
	 * @param {number} type тип тайла
	 * @constructor
	 */
	function Tile(type) {

		/**
		 * Тип тайла
		 * @type {number}
		 *  1 - простая кирпичная стена
		 *  2 - простой кирпичный пол
		 */
		this.type = type;
		/**
		 * Находится ли тайл в зоне видимости
		 * @type {Boolean}
		 */
		this.visible = false;
		/**
		 * Видели ли тайл хоть раз раньше
		 * @type {Boolean}
		 */
		this.inMind = false;
		/**
		 * Находится ли тайл в тени
		 * @type {Boolean}
		 */
		this.inShadow = false;
		/**
		 * Тут находится герой
		 * @type {Boolean}
		 */
		this.isHero = false;
		this._heroColor = "#0D0";

		this.tag = 0;

		switch (this.type) {
			case 1:
				this._represent = "#";
				this._visibleColor = "#FFF";
				this._shadowColor = "#AAA";
				this._shadowMergeColor = "#999";
				this._inMindColor = "#555";
				this.passability = false;
				break;
			case 2:
				this._represent = ".";
				this._visibleColor = "#FFF";
				this._shadowColor = "#AAA";
				this._shadowMergeColor = "#999";
				this._inMindColor = "#555";
				this.passability = true;
				break;
		}

	}

	/**
	 * Функция возвращает текстовое представление тайла с html оформление шрифта
	 * @return {string}
	 */
	Tile.prototype.getText = function() {

		if(this.isHero) return "<font color='" + this._heroColor + "'>@</font>";
		if(this.visible) return "<font color='" + this._visibleColor + "'>" + this._represent + "</font>";
		if(this.inShadow) return "<font color='" + this._shadowColor + "'>" + this._represent + "</font>";
		if(this.inMind) return "<font color='" + this._inMindColor + "'>" + this._represent + "</font>";
		return "&nbsp;";

	};

	return Tile;

});