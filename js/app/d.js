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

	if (!window.rand) {

		/**
		 * Генерация рандомных чисел
		 * Если на входе два параметра, возвращает случайное число в промежутке [param1; param2]
		 * Если на входе один параметр, то генерирует случайное число от 0 до param1 и возвращает true,
		 * если это число рано 1, иначе возвращает false
		 * @param  {number} param1 нижняя или верхняя граница промежутка
		 * @param  {number} param2 верхняя граница промежутка
		 * @return {number|boolean}        значение в зависимости от параметров
		 */
		window.rand = function(param1, param2) {

			return param2 ? param1 + ~~(Math.random() * param2) : ~~(Math.random() * param1) == 1;

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