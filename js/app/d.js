"use strict";

define(function() {

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

	/**
	 * Псевдоним для document.getElementById
	 * @param  {string} id айди элемента
	 * @return {Object}    элемент
	 */
	return function(id) {
		return document.getElementById(id);
	}

});