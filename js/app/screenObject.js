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
		/**
		 * Нужна ли анимация
		 * @type {Boolean}
		 * @public
		 */
		this.needAnimation = false;
		/**
		 * Действующие на тайл эффекты
		 * @type {Array}
		 */
		this._effects = [];

	}

	screenObject.prototype.setEffect = function(effect) {

		if (this._effects.indexOf(effect) < 0) {
			this._effects.push(effect);
			this.needAnimation = true;
		}

	};

	/**
	 * Функция возвращает текстовое представление тайла с html оформление шрифта
	 * @return {string}
	 * @public
	 */
	screenObject.prototype.getText = function() {

		if (this.inMind) {

			// var color = this.visible ? this._visibleColor : this.inShadow ? this._shadowColor : this._inMindColor;
			var color = this.visible ? this._visibleColor : this._inMindColor,
				z = 0;

			this._effects.forEach(function(effect) {

				if (effect.z >= z) {

					z = effect.z;
					color = effect.color;

				}

			});

			return "<font color='" + color + "'>" + this._represent + "</font>";

		} else {

			return "&nbsp;";

		}

	};

	screenObject.prototype.animate = function() {

		this._effects.forEach(function(effect, i) {

			effect.render();
			effect.moves++;
			if (effect.moves == effect.duration) {
				this._effects.splice(i, 1);
				if (this._effects.length == 0) this.needAnimation = false;
			}

		}, this);

	};

	return screenObject;

});