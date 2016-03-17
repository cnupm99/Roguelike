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
		this.effects = [];

	}

	/**
	 * Добавить эффект тайлу, если такого нет
	 * @param {TileEffect} effect эффект
	 * @public
	 */
	screenObject.prototype.setEffect = function(effect) {

		if (!this.effects.some(function(e) {
				return e.effectName == effect.effectName;
			})) {
			this.effects.push(effect);
			this.needAnimation = true;
		}

	};

	/**
	 * Удаляет эффект с тайла, если такой есть
	 * @param  {String} effectName название эффекта
	 * @public
	 */
	screenObject.prototype.removeEffect = function(effectName) {

		this.effects.forEach(function(effect, i) {

			if (effect.effectName == effectName) {
				this.effects.splice(i, 1);
				if (this.effects.length == 0) this.needAnimation = false;
			}

		}, this);

	};

	/**
	 * Функция возвращает текстовое представление тайла с html оформление шрифта
	 * @return {string}
	 * @public
	 */
	screenObject.prototype.getText = function() {

		if (this.inMind) {

			var color = this.visible ? this._visibleColor : this._inMindColor,
				z = 0;

			// если на тайл действуют эффекты, то изменяем цвет
			this.effects.forEach(function(effect) {

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

	/**
	 * Рендер всех эффектов
	 * @public
	 */
	screenObject.prototype.animate = function() {

		this.effects.forEach(function(effect, i) {

			effect.render();

		}, this);

	};

	return screenObject;

});