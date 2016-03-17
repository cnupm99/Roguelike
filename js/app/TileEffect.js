"use strict";

define(function() {

	/**
	 * Создание нового тайлового эффекта
	 * @param {string} effectName название эффекта
	 * @constructor
	 */
	function TileEffect(effectName) {

		/**
		 * Название эффекта
		 * @type {string}
		 */
		this.effectName = effectName;
		/**
		 * Продолжительность действия в ходах
		 * @type {Number}
		 */
		this.moves = 0;
		/**
		 * Стадия действия в кадрах анимации
		 * @type {Number}
		 */
		this._stage = 0;

		switch (effectName) {
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
				this.z = 1;
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