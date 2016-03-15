"use strict";

define(function() {

	/**
	 * Экранный объект
	 * @constructor
	 */
	function screenObject() {

		/**
		 * Находится ли тайл в зоне видимости
		 * @type {Boolean}
		 * @public
		 */
		this.visible = false;
		/**
		 * Видели ли тайл хоть раз раньше
		 * @type {Boolean}
		 * @public
		 */
		this.inMind = false;
		/**
		 * Находится ли тайл в тени
		 * @type {Boolean}
		 * @public
		 */
		this.inShadow = false;
		/**
		 * Текстовое представление тайла
		 * @type {String}
		 * @private
		 */
		this._represent = "#";
		/**
		 * Цвет видимого тайла
		 * @type {String}
		 * @private
		 */
		this._visibleColor = "#FFF";
		/**
		 * Цвет тайла в тени
		 * @type {String}
		 * @private
		 */
		this._shadowColor = "#777";
		this._shadowMergeColor = "#888";
		/**
		 * Цвет тайла в памяти
		 * @type {String}
		 * @private
		 */
		this._inMindColor = "#222";
		/**
		 * Проходимость тайла
		 * @type {Boolean}
		 * @public
		 */
		this.passability = false;

	}

	/**
	 * Функция возвращает текстовое представление тайла с html оформление шрифта
	 * @return {string}
	 * @public
	 */
	screenObject.prototype.getText = function() {

		if (this.visible) return "<font color='" + this._visibleColor + "'>" + this._represent + "</font>";
		if (this.inShadow) return "<font color='" + this._shadowColor + "'>" + this._represent + "</font>";
		if (this.inMind) return "<font color='" + this._inMindColor + "'>" + this._represent + "</font>";
		return "&nbsp;";

	};

	return screenObject;

});