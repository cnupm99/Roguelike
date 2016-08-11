"use strict";

define(function() {

	/**
	 * Создание нового тайлового эффекта
	 * @param {string} effectName название эффекта
	 * @constructor
	 */
	function TileEffect(effectName, options) {

		if (!options) options = {};

		/**
		 * Название эффекта
		 * @type {string}
		 */
		this.effectName = effectName;
		/**
		 * Продолжительность действия в ходах
		 * @type {Number}
		 * @public
		 */
		this.moves = 0;
		/**
		 * Стадия действия в кадрах анимации
		 * @type {Number}
		 */
		this._stage = 0;

		switch (effectName) {
			// эффект тени
			case "shadow":
				/**
				 * Максимальная продолжительность в ходах
				 * @type {Number}
				 */
				this.duration = 1;
				/**
				 * Цвет эффекта
				 * @type {String}
				 */
				this.color = "#777";
				/**
				 * Функция для рендера эффекта
				 * @type {function}
				 */
				this.render = this._shadowRender;
				/**
				 * Индекс эффекта для отображения при наложении нескольких эффктов
				 * Будет показан эффект с наибольшим индексом
				 * @type {Number}
				 */
				this.z = 10;
				/**
				 * Видимый ли эффект
				 * @type {Boolean}
				 */
				this.visible = true;
				this.effectDesc = lang.effects[0];
				break;
			// эффект скрытности
			case "hidden":
				this.duration = -1;
				this.visible = false;
				this.color = "#FFF";
				/**
				 * Сила скрытия
				 * @type {number}
				 */
				this.hiddenPower = options.hiddenPower || 100;
				/**
				 * Вид скрытого объекта
				 * @type {string}
				 */
				this.represent = options.represent || "#";
				/**
				 * Описание скрытого объекта
				 * @type {number}
				 */
				this.desc = options.desc || 3;
				this.z = 9;
				this.effectDesc = lang.effects[1];
				break;
			case "closed":
				this.duration = -1;
				this.visible = true;
				this.passability = false;
				this.represent = "+";
				this.desc = lang.tiles[2];
				this.effectDesc = lang.effects[2];
				this.z = 9;
				break;
		}

	}

	/**
	 * Рендер эффекта тени
	 * @private
	 */
	TileEffect.prototype._shadowRender = function() {

		this._stage++;
		if (this._stage % 2 == 1) {
			this.color = "#808080";
		} else this.color = "#777";

	};

	return TileEffect;

});