"use strict";

define(function() {

	/**
	 * Загрузчик ресурсов
	 * @param {Object} options список опций
	 * @constructor
	 */
	function ResLoader(options) {

		if (!options) options = {};

		/**
		 * папка на сервере с файлами языков
		 * @type {string}
		 */
		this._langsPath = options.jsonPath || "langs/";

	}

	/**
	 * Загрузка JSON файла с сервера
	 * @param  {string} JSONName имя файла, без расширения
	 * @param  {function} callBack функция для получения результата
	 * @return {string}          содержание JSON файла в текстовом виде
	 * @public
	 */
	ResLoader.prototype.loadJSON = function(JSONName, callBack) {

		var xhttp = new XMLHttpRequest();
		if (!xhttp) {
			console.error("Critical error: failed create XMLHttpRequest object");
			callBack(false);
		}

		xhttp.open('GET', JSONName + ".json" + "?r=" + Math.random(), true);

		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4) {
				if (xhttp.status == 200) {
					callBack(xhttp.responseText);
				} else {
					callBack(false);
				}
			}
		};

		xhttp.send();

	};

	/**
	 * Загрузка файла языка
	 * @param  {string} langName имя файла
	 * @param  {function} callBack функция для возврата результата
	 * @return {Object}          объект с языком
	 * @public
	 */
	ResLoader.prototype.loadLang = function(langName, callBack) {

		this.loadJSON(this._langsPath + langName, function(data) {

			try {

				callBack(JSON.parse(data));

			} catch (err) {

				callBack(false);

			}

		});

	};

	return ResLoader;

});