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

		this._desc = 2;

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
	 * Функция возвращает текстовое представление тайла
	 * @return {string}
	 * @public
	 */
	screenObject.prototype.getText = function() {

		return this.visible ? this._represent : this.inMind ? this._represent : "&nbsp;";

	};

	/**
	 * Возвращаем цвет тайла в зависимости от видимости и эффектов
	 * @return {string} цвет тайла в формате css
	 */
	screenObject.prototype.getColor = function() {

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

			return color;

		} else {

			return "#000";

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

	screenObject.prototype.getDesc = function() {

		var desc = this.visible ? lang.tiles[0] : lang.tiles[1];
		desc += lang.tiles[this._desc];

		if (this.effects.length == 0) return desc;

		desc += "; " + lang.tiles[2] + ": ";
		this.effects.forEach(function(effect, i) {
			desc += effect.effectName;
			if (i < this.effects.length - 1) desc += ", ";
		}, this);

		return desc;

	};

	return screenObject;

});