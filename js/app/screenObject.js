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
		 * @private
		 */
		this._passability = false;
		/**
		 * Нужна ли анимация
		 * @type {Boolean}
		 * @public
		 */
		this.needAnimation = false;
		/**
		 * Действующие на тайл эффекты
		 * @type {Array}
		 * @public
		 */
		this.effects = [];
		/**
		 * Номер описания тайла
		 * @type {Number}
		 * public
		 */
		this.desc = 2;

	}

	/**
	 * Добавить эффект тайлу и возвращает true, если такого нет. Если такой
	 * эффект уже есть, возвращает false
	 * @param {TileEffect} effect эффект
	 * @return {Boolean} 
	 * @public
	 */
	screenObject.prototype.setEffect = function(effect) {

		if (!this.effects.some(function(e) {
				return e.effectName == effect.effectName;
			})) {
			this.effects.push(effect);
			this.needAnimation = true;
			return true;
		} else return false;

	};

	/**
	 * Удаляет эффект с тайла, если такой есть. Если эффект удален, возвращает true.
	 * Если такого эффекта нет, возвращает false
	 * @param  {String} effectName название эффекта
	 * @return {Boolean}
	 * @public
	 */
	screenObject.prototype.removeEffect = function(effectName) {

		var result = false;

		this.effects.forEach(function(effect, i) {

			if (effect.effectName == effectName) {
				result = true;
				this.effects.splice(i, 1);
				if (this.effects.length == 0) this.needAnimation = false;
			}

		}, this);

		return result;

	};

	/**
	 * Проверяет, есть ли на тайле данный эффект
	 * @param  {string}  effectName имя эффекта
	 * @return {Boolean}            true, если эффект есть, иначе false
	 * @public
	 */
	screenObject.prototype.isEffect = function(effectName) {

		return this.effects.some(function(effect) {

			return effect.effectName == effectName;

		});

	};

	/**
	 * Функция возвращает текстовое представление тайла
	 * @return {string}
	 * @public
	 */
	screenObject.prototype.getText = function() {

		var text = this.visible ? this._represent : this.inMind ? this._represent : "&nbsp;",
			z = 0;

		// если на тайл действуют эффекты, то изменяем представление
		this.effects.forEach(function(effect) {

			if ((effect.z >= z) && (effect.represent)) {

				z = effect.z;
				text = effect.represent;

			}

		});

		return text;

	};

	/**
	 * Возвращаем цвет тайла в зависимости от видимости и эффектов
	 * @return {string} цвет тайла в формате css
	 * @public
	 */
	screenObject.prototype.getColor = function() {

		if (this.inMind) {

			var color = this.visible ? this._visibleColor : this._inMindColor,
				z = 0;

			if (!this.visible) return color;

			// если на тайл действуют эффекты, то изменяем цвет
			this.effects.forEach(function(effect) {

				if ((effect.z >= z) && (effect.color)) {

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

			if (effect.render) effect.render();

		}, this);

	};

	/**
	 * Возвращает описание тайла
	 * @return {string} описание тайла
	 * @public
	 */
	screenObject.prototype.getDesc = function() {

		var desc = this.visible ? lang.tiles[0] : lang.tiles[1],
			d = this.desc,
			z = 0;

		// эффекты, меняющие описание
		this.effects.forEach(function(effect) {

			if ((effect.desc) && (effect.z >= z)) {

				z = effect.z;
				d = effect.desc;

			}

		});

		desc += lang.tiles[d];

		// вычисляем количество видимых эффектов
		var visibleEffects = 0;
		this.effects.forEach(function(effect) {
			if (effect.visible) visibleEffects++;
		});
		if (visibleEffects == 0) return desc;

		// добавляем описания видимых эффектов
		desc += "; " + lang.tiles[2] + ": ";
		this.effects.forEach(function(effect) {

			if (effect.visible) {
				desc += effect.effectName + "; ";
			}

		});

		return desc;

	};

	/**
	 * Возвращает проходимость тайла с учетом всех эффектов
	 * @return {Boolean} true, если тайл проходим, иначе false
	 */
	screenObject.prototype.getPass = function(){

		var pass = this._passability,
			z = 0;

		// эффекты, меняющие проходимость
		this.effects.forEach(function(effect) {

			if ((effect.passability != "undefined") && (effect.z >= z)) {

				z = effect.z;
				pass = effect.passability;

			}

		});

		return pass;

	};

	return screenObject;

});