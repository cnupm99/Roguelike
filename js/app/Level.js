"use strict";

define(["d", "Tile"], function(d, Tile) {

	/**
	 * Новый уровень
	 * @param {number} type тип уровня
	 * @constructor
	 */
	function Level(options) {

		if (!options) options = {};

		/**
		 * тип уровня
		 * @type {number}
		 * возможные значения:
		 *  0 - тестовый уровень
		 *  1 - уровень из комнат (кирпичные стены и пол)
		 */
		this._type = options.type || 0;

		/**
		 * Размеры уровня
		 * @type {Object}
		 */
		this._sizes = {
			width: options.width || 100,
			height: options.height || 100
		}

		/**
		 * Размер шрифта в vh
		 * @type {number}
		 */
		this._fontSize = options.fontSize || 3;

		// вычисляем размеры экранных символов
		this._setCharSizes();

		/**
		 * Карта уровня составленная из тайлов
		 * @type {Array}
		 */
		this._map = [];
		// создаем двумерный массив
		for (var i = 0; i < this._sizes.height; i++) {
			this._map[i] = [];
		}

		/**
		 * Позиция героя по умолчанию
		 * @type {Object}
		 */
		this._position = {
			x: 1,
			y: 1
		}

		// генерация уровня в зависимости от его типа
		switch (this._type) {
			case 0:
				this._wallType = 1;
				this._floorType = 2;
				this._generateRoomsMaze();
				break;
			case 1:
				this._wallType = 1;
				this._floorType = 2;
				this._generateRoomsMaze();
				break;
		}

	}

	/**
	 * Вычисляем размеры экранных символов
	 */
	Level.prototype._setCharSizes = function() {

		var div = document.body.add("div", {
			innerHTML: "&nbsp;"
		});
		div.style.fontSize = this._fontSize + "vh";
		div.style.width = "auto";
		div.style.height = "auto";
		div.style.position = "absolute";
		this._charWidth = div.clientWidth;
		this._charHeight = div.clientHeight;
		document.body.removeChild(div);

	};

	/**
	 * Генерация уровня, состоящего из комнат без коридоров
	 */
	Level.prototype._generateRoomsMaze = function() {

		// изначально все тайлы являются стеной
		this._fillRect(this._sizes, this._wallType);
		// создаем одну большую комнату
		this._fillRect({
			x: 1,
			y: 1,
			width: this._sizes.width - 2,
			height: this._sizes.height - 2
		}, this._floorType);

		// минимальный размер комнаты по одной из сторон
		var minRoomSize = 10,
			// массив больших комнат для деления
			rooms = [{
				x: 1,
				y: 1,
				width: this._sizes.width - 2,
				height: this._sizes.height - 2
			}];

		// цикл деления комнат на меньшие
		while (rooms.length > 0) {

			var room = rooms.pop(),
				maxWall = Math.max(room.width, room.height),
				halfMaxWall = ~~(maxWall / 2),
				wallOrientation = maxWall == room.width,
				newWallSize,
				doorCoord,
				newRoom1,
				newRoom2;

			if (wallOrientation) {

				// вычисляем координаты новой стены так, чтобы она не приходилась на дверь
				do {
					newWallSize = halfMaxWall + ~~(halfMaxWall / 2 - Math.random() * halfMaxWall);
				} while (this._getTilePass(room.x + newWallSize, room.y - 1) || this._getTilePass(room.x + newWallSize, room.y + room.height));

				// создаем две новые комнаты
				newRoom1 = {
					x: room.x,
					y: room.y,
					width: newWallSize,
					height: room.height
				};
				newRoom2 = {
					x: room.x + newWallSize + 1,
					y: room.y,
					width: room.width - newWallSize - 1,
					height: room.height
				};

				// рисуем стены
				this._fillRect({
					x: room.x + newWallSize,
					y: room.y,
					width: 1,
					height: room.height
				}, this._wallType);

				// рисуем дверь
				doorCoord = ~~(Math.random() * room.height);
				this._setTile(room.x + newWallSize, room.y + doorCoord, this._floorType);
			} else {

				do {
					newWallSize = halfMaxWall + ~~(halfMaxWall / 2 - Math.random() * halfMaxWall);
				} while (this._getTilePass(room.x - 1, room.y + newWallSize) || this._getTilePass(room.x + room.width, room.y + newWallSize));

				newRoom1 = {
					x: room.x,
					y: room.y,
					width: room.width,
					height: newWallSize
				};
				newRoom2 = {
					x: room.x,
					y: room.y + newWallSize + 1,
					width: room.width,
					height: room.height - newWallSize - 1,
				};
				this._fillRect({
					x: room.x,
					y: room.y + newWallSize,
					width: room.width,
					height: 1
				}, this._wallType);
				doorCoord = ~~(Math.random() * room.width);
				this._setTile(room.x + doorCoord, room.y + newWallSize, this._floorType);
			}

			// размеры новых комнат
			var room1maxWall = Math.max(newRoom1.width, newRoom1.height),
				room2maxWall = Math.max(newRoom2.width, newRoom2.height);

			// если они слишком большие, то будем их делить
			if (room1maxWall > minRoomSize) rooms.push(newRoom1);
			if (room2maxWall > minRoomSize) rooms.push(newRoom2);

		}

	};

	/**
	 * Установить тайл в нужных координатах
	 * @param {Object|number} arg1 координата х тайла либо объект с координатами
	 * @param {number} arg2 координата у тайла либо тип тайла
	 * @param {number|null} arg3 тип тайла тибо null
	 */
	Level.prototype._setTile = function(arg1, arg2, arg3) {

		var x, y, type;
		if (typeof(arg1) == "Object") {
			x = arg1.x || arg1.x0 || arg1.left || 0;
			y = arg1.y || arg1.y0 || arg1.top || 0;
			type = arg2;
		} else {
			x = arg1;
			y = arg2;
			type = arg3;
		}

		this._map[y][x] = new Tile(type);

	};

	/**
	 * Возвращает тип тайла по указанным координатам
	 * @param  {Object|number} arg1 координата х тайла либо объект с координатами
	 * @param  {number|null} arg2 координата у тайла либо null
	 * @return {number}      тип тайла
	 */
	Level.prototype._getTileType = function(arg1, arg2) {

		var x, y;
		if (typeof(arg1) == "Object") {
			x = arg1.x || arg1.x0 || arg1.left || 0;
			y = arg1.y || arg1.y0 || arg1.top || 0;
		} else {
			x = arg1;
			y = arg2;
		}

		return this._map[y][x].type;

	};

	/**
	 * Возвращает проходимость тайла по указанным координатам
	 * @param  {Object|number} arg1 координата х тайла либо объект с координатами
	 * @param  {number|null} arg2 координата у тайла либо null
	 * @return {boolean}      true если тайл проходим, иначе false
	 */
	Level.prototype._getTilePass = function(arg1, arg2) {

		var x, y;
		if (typeof(arg1) == "Object") {
			x = arg1.x || arg1.x0 || arg1.left || 0;
			y = arg1.y || arg1.y0 || arg1.top || 0;
		} else {
			x = arg1;
			y = arg2;
		}

		return this._map[y][x].passability;

	};

	/**
	 * Заливка прямоугольной области карты тайлами выбранного типа
	 * @param  {Object} rect описание области карты
	 * @param  {number} type тип тайлов
	 * rect = {
	 *   x0 либо x либо left,
	 *   y0 либо y либо top,
	 *   x1 либо right либо width,
	 *   y1 либо bottom либо height
	 * }
	 */
	Level.prototype._fillRect = function(rect, type) {

		// вычисляем параметры области
		var x0 = rect.x0 ? rect.x0 : rect.left ? rect.left : rect.x ? rect.x : 0,
			y0 = rect.y0 ? rect.y0 : rect.top ? rect.top : rect.y ? rect.y : 0,
			x1 = rect.x1 ? rect.x1 : rect.right ? rect.right : rect.width ? x0 + rect.width : 100,
			y1 = rect.y1 ? rect.y1 : rect.bottom ? rect.bottom : rect.height ? y0 + rect.height : 100;

		// заполнение тайлами
		for (var i = y0; i < y1; i++) {
			for (var g = x0; g < x1; g++) {
				this._map[i][g] = new Tile(type);
			}
		}

	};

	/**
	 * Устанавливаем позицию героя
	 * @param {Object} position позиция
	 */
	Level.prototype.setHeroPosition = function(position) {

		this._map[this._position.y][this._position.x].isHero = false;
		this._map[position.y][position.x].isHero = true;
		this._position = {
			x: position.x,
			y: position.y
		};

	};

	Level.prototype.checkVisible = function(overview, shadow, side) {

		var minY = this._position.y - overview,
			maxY = this._position.y + overview,
			minX = this._position.x - overview,
			maxX = this._position.x + overview,
			checkSide = side % 2 != 0,
			sign1 = (side == 1 || side == 5) ? 1 : -1,
			sign2 = (side == 5 || side == 7),
			sign3 = (side == 0 || side == 4) ? this._position.y : this._position.x,
			sign4 = (side == 4 || side == 2) ? 1 : -1;

		if (minX < 0) minX = 0;
		if (minY < 0) minY = 0;
		if (maxX > this._sizes.width) maxX = this._sizes.width;
		if (maxY > this._sizes.height) maxY = this._sizes.height;

		console.log(this._position, side);

		for (var i = minY; i < maxY; i++) {
			for (var g = minX; g < maxX; g++) {

				var t = this._map[i][g];
				t.visible = false;
				t.inShadow = false;

				if (checkSide) {

					var a = g - this._position.x,
						b = sign1 * (i - this._position.y),
						sideVisible = sign2 ? a <= b : a >= b;

					if (!sideVisible) continue;

				} else {

					var a = (side == 2 || side == 6) ? g : i;
					sideVisible = sign4 * a >= sign4 * sign3;

					if (!sideVisible) continue;

				}

				if ((Math.abs(i - this._position.y) < 2) && (Math.abs(g - this._position.x) < 2)) {
					
					t.visible = true;
					t.inMind = true;
					t.tag = 0;

				} else {

					var line1 = this._drawLine(g, i, this._position.x, this._position.y),
						line2 = this._drawLine(this._position.x, this._position.y, g, i);

					line1.shift();

					t.visible = line1.every(function(point) {
						return this._map[point[1]][point[0]].passability;
					}, this) || line2.every(function(point) {
						return this._map[point[1]][point[0]].passability;
					}, this);

					if (t.visible) {
						
						t.inMind = true;
						if (line2.length >= shadow) {
							t.visible = false;
							t.inShadow = true;
						}
						
					}
				}
			}
		}
	};

	Level.prototype._drawLine = function(x0, y0, x1, y1) {

		var dx = Math.abs(x1 - x0),
			sx = x0 < x1 ? 1 : -1,
			dy = Math.abs(y1 - y0),
			sy = y0 < y1 ? 1 : -1,
			err = dx > dy ? dx : -dy,
			result = [],
			e2;

		while (x0 != x1 || y0 != y1) {
			result.push([x0, y0]);
			e2 = err;
			if (e2 > -dx * 2) {
				err -= dy;
				x0 += sx;
			}
			if (e2 < dy * 2) {
				err += dx;
				y0 += sy;
			}
		}

		return result;

	};

	Level.prototype.isPassability = function(x0, y0) {

		return this._map[y0][x0].passability;

	};

	/**
	 * Вывод текста на элемент
	 * @param  {element} element
	 */
	Level.prototype.outText = function(element) {

		var scrWidth = Math.ceil(element.clientWidth / this._charWidth),
			scrHeight = Math.ceil(element.clientHeight / this._charHeight),
			scrHalfWidth = ~~(scrWidth / 2),
			scrHalfHeight = ~~(scrHeight / 2),
			minX = this._position.x - scrHalfWidth,
			maxX = this._position.x + scrHalfWidth,
			minY = this._position.y - scrHalfHeight,
			maxY = this._position.y + scrHalfHeight,
			text = "";

		for (var i = minY; i < maxY; i++) {
			for (var g = minX; g < maxX; g++) {
				if ((i < 0) || (i >= this._sizes.height) || (g < 0) || (g >= this._sizes.width)) {
					text += "&nbsp;";
				} else {
					text += this._map[i][g].getText();
				}
			}
			text += "<br>";
		}
		element.style.fontSize = this._fontSize + "vh";
		element.innerHTML = text;

	};

	return Level;

});