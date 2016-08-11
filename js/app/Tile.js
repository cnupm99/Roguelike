"use strict";

define(["screenObject", "TileEffect"], function(screenObject, TileEffect) {

	/**
	 * Создание нового тайла
	 * @param {number} type тип тайла
	 * @constructor
	 */
	function Tile(tileName) {

		// конструктор родителя
		screenObject.apply(this, arguments);

		// название тайла
		this.tileName = tileName;

		// задаем свойства тайла по его имени
		this._represent = Tiles[tileName][0];
		this._visibleColor = Tiles[tileName][1];
		this._inMindColor = Tiles[tileName][2];
		this._passability = Tiles[tileName][3];
		this._description = lang.tiles[Tiles[tileName][4]];

	}

	// наследование
	Tile.prototype = Object.create(screenObject.prototype);
	Tile.prototype.constructor = Tile;

	/**
	 * Установить текстовое отображение тайла
	 * @param {string} represent новое текстовое отображение
	 */
	Tile.prototype.setRepresent = function(represent) {

		this._represent = represent;

	};

	/**
	 * Пытается открыть дверь на тайле
	 * @return {Boolean} true, если открыть удалось, иначе false
	 */
	Tile.prototype.openDoor = function() {

		if (this.isEffect("hidden")) return false;

		return this.removeEffect("closed");

	};

	/**
	 * Пытается закрыть дверь
	 * @return {Boolean} true, если удалось закрыть, иначе false
	 */
	Tile.prototype.closeDoor = function() {

		if (this.isEffect("hidden")) return false;

		return this.setEffect(new TileEffect("closed"));

	};

	/**
	 * Список тайлов
	 * @type {Object}
	 */
	var Tiles = {
		"stone wall": ["#", "#FFF", "#222", false, 0],
		"stone floor": [".", "#FFF", "#222", true, 1],
		"door": ["`", "#0F0", "#222", true, 3],
		"stairs down": [">", "#FFF", "#222", true, 4],
	};

	return Tile;

});