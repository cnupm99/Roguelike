"use strict";

define(function() {

	if (!Element.prototype.add) {

		/**
		 * Добавляет дочерний элемент с заданными параметрами
		 * @param {string} type   тип элемента
		 * @param {Object} params объект со свойствами элемента,
		 *  например:
		 *   {
		 *     id: "MyId",
		 *     className: "MyClass"
		 *   }
		 * @return {Object} добавленный элемент
		 */
		Element.prototype.add = function(type, params) {

			type = type || "div";

			var r = document.createElement(type);
			this.appendChild(r);

			if (params) {
				for (var key in params) {
					if (key in r) {
						r[key] = params[key];
					}
				}
			}

			return r;
		};

	}

	if (!Element.prototype.clr) {

		/**
		 * Удаляет все дочерние элементы, возвращает текущий элемент
		 * @return {Object} текущий элемент
		 */
		Element.prototype.clr = function() {

			while (this.lastChild) {
				this.removeChild(this.lastChild);
			}

			return this;
		};

	}

	if (!Array.prototype.fill) {

		/**
		 * Добавляем полифил для метода Array.fill
		 * @param  {*} value значение для заливки массива
		 * @return {Array}       массив залитый значениями
		 */
		Array.prototype.fill = function(value) {

			if (this == null) {
				throw new TypeError('this is null or not defined');
			}

			var O = Object(this),
				len = O.length >>> 0,
				start = arguments[1],
				relativeStart = start >> 0,
				k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len),
				end = arguments[2],
				relativeEnd = end === undefined ? len : end >> 0,
				final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);

			while (k < final) {

				O[k] = value;
				k++;

			}

			return O;

		};

	}

	/**
	 * Псевдоним для document.getElementById
	 * @param  {string} id айди элемента
	 * @return {Object}    элемент
	 */
	return function(id) {
		return document.getElementById(id);
	}

});