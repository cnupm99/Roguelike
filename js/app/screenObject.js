"use strict";

define(function() {

	function screenObject() {

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

		this._represent = "#";
		this._visibleColor = "#FFF";
		this._shadowColor = "#777";
		this._shadowMergeColor = "#888";
		this._inMindColor = "#222";
		this.passability = false;

	}

	/**
	 * Функция возвращает текстовое представление тайла с html оформление шрифта
	 * @return {string}
	 */
	screenObject.prototype.getText = function() {

		if (this.visible) return "<font color='" + this._visibleColor + "'>" + this._represent + "</font>";
		if (this.inShadow) return "<font color='" + this._shadowColor + "'>" + this._represent + "</font>";
		if (this.inMind) return "<font color='" + this._inMindColor + "'>" + this._represent + "</font>";
		return "&nbsp;";

	};

	return screenObject;

});