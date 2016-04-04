"use strict";

define(["d", "Tile", "TileEffect"], function(d, Tile, TileEffect) {

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
		 * @private
		 */
		this._type = options.type || 0;

		/**
		 * Уровень сложности
		 *  0 - легко
		 *  1 - норма
		 *  2 - сложно
		 *  3 - хардкор
		 * @type {number}
		 */
		this._difficult = options.difficult || 1;

		/**
		 * Максимальная сила поиска игрока
		 * @type {number}
		 */
		this._maxDiscover = options.maxDiscover || 100;

		/**
		 * Размер шрифта в vh
		 * @type {number}
		 * @private
		 */
		this._fontSize = options.fontSize || 3;

		/**
		 * Размеры уровня, экрана и символов
		 * @type {Object}
		 * @private
		 */
		this._sizes = {
			width: options.width || 100,
			height: options.height || 100
		}

		// вычисляем размеры экранных символов и уровня
		// а также устанавливаем размер шрифта
		this._setCharSizes();

		/**
		 * Позиция героя по умолчанию
		 * @type {Object}
		 * @private
		 */
		this._position = {
			x: 1,
			y: 1
		}

		/**
		 * Карта уровня составленная из тайлов
		 * @type {Array}
		 * @private
		 */
		this._map = [];
		for (var i = 0; i < this._sizes.height; i++) {
			this._map[i] = [];
		}

		/**
		 * Массив элементов span для отображения информации на экране
		 * @type {Array}
		 */
		this._screen = [];
		for (var i = 0; i < this._sizes.scrHeight; i++) {

			this._screen[i] = [];
			for (var g = 0; g < this._sizes.scrWidth; g++) {

				var s = d("main").add("span");
				s.setAttribute("data-x", g);
				s.setAttribute("data-y", i);
				this._screen[i][g] = s;

			}

			d("main").add("br");
		}

		// генерация уровня в зависимости от его типа
		switch (this._type) {
			case 0:
				/**
				 * Тип стен
				 * @type {Number}
				 * @private
				 */
				this._wallType = 1;
				/**
				 * Тип пола
				 * @type {Number}
				 * @private
				 */
				this._floorType = 2;
				/**
				 * Тайл дверей
				 * @type {Number}
				 */
				this._doorType = 3;
				this._generateRoomsMaze();
				break;
			case 1:
				this._wallType = 1;
				this._floorType = 2;
				this._doorType = 3;
				this._generateRoomsMaze();
				break;
		}

		/**
		 * Нужна ли анимация уровня
		 * @type {Boolean}
		 */
		this._needAnimation = true;
		/**
		 * Скорость анимации
		 * @type {Number}
		 */
		this._animationSpeed = 200;
		// Старт анимации
		if (this._needAnimation) this._animator = setInterval(this._animate.bind(this), this._animationSpeed);

		// Добавляем события мыши
		d("main").addEventListener("mouseover", this._mouseover.bind(this));
		d("main").addEventListener("mouseout", this._mouseout);

	}

	/**
	 * Мышь над тайлом
	 * @param  {event} e событие мыши
	 * @private
	 */
	Level.prototype._mouseover = function(e) {

		// меняем цвет фона
		e.target.style.backgroundColor = "#222";

		// выводим описание
		// если тайл в памяти

		var t = this._getTileOnCoord(e);
		if (t === null) return;

		if (!t.inMind) return;

		d("desc").innerHTML = t.contains ? t.child.getDesc() : t.getDesc();

	};

	/**
	 * Мышь ушла с тайла
	 * @param  {event} e событие мыши
	 * @private
	 */
	Level.prototype._mouseout = function(e) {

		e.target.style.backgroundColor = "#000";

		d("desc").innerHTML = "";

	}

	/**
	 * Анимация всех тайлов, которым это нужно
	 * @public
	 */
	Level.prototype._animate = function() {

		for (var i = 0; i < this._sizes.height; i++) {
			for (var g = 0; g < this._sizes.width; g++) {

				var t = this._map[i][g];
				if (t.needAnimation) t.animate();

			}
		}

	};

	/**
	 * Действия на начало хода игрока
	 * @public
	 */
	Level.prototype.startTurn = function() {

		// прибавляем время действия эффектов,
		// если нужно отменяем их действие
		for (var i = 0; i < this._sizes.height; i++) {
			for (var g = 0; g < this._sizes.width; g++) {

				var t = this._map[i][g];
				t.effects.forEach(function(effect, i) {

					effect.moves++;
					if (effect.moves == effect.duration) {

						t.effects.splice(i, 1);
						if (t.effects.length == 0) t.needAnimation = false;

					}

				});
			}
		}

	};

	/**
	 * Вычисляем размеры экранных символов и уровня
	 * @private
	 */
	Level.prototype._setCharSizes = function() {

		d("main").style.fontSize = this._fontSize + "vh";
		var div = document.body.add("div", {
			innerHTML: "&nbsp;"
		});
		div.style.fontSize = this._fontSize + "vh";
		div.style.width = "auto";
		div.style.height = "auto";
		div.style.position = "absolute";
		this._sizes.charWidth = div.clientWidth;
		this._sizes.charHeight = div.clientHeight;
		document.body.removeChild(div);
		// размеры уровня
		this._sizes.scrWidth = Math.ceil(d("main").clientWidth / this._sizes.charWidth);
		this._sizes.scrHeight = Math.ceil(d("main").clientHeight / this._sizes.charHeight);
		this._sizes.scrHalfWidth = Math.ceil(this._sizes.scrWidth / 2);
		this._sizes.scrHalfHeight = Math.ceil(this._sizes.scrHeight / 2);

	};

	/**
	 * Генерация уровня, состоящего из комнат без коридоров
	 * @private
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
			}],
			smallRooms = [];

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

				// вычисляем координаты новой стены
				// тут она может приходится на дверь
				// так что дверь может быть по диагонали
				do {
					newWallSize = halfMaxWall + ~~(halfMaxWall / 2 - Math.random() * halfMaxWall);
				} while (this.getTilePass(room.x + newWallSize, room.y - 1) || this.getTilePass(room.x + newWallSize, room.y + room.height));

				// создаем две новые комнаты
				newRoom1 = {
					x: room.x,
					y: room.y,
					width: newWallSize,
					height: room.height,
					doors: []
				};
				newRoom2 = {
					x: room.x + newWallSize + 1,
					y: room.y,
					width: room.width - newWallSize - 1,
					height: room.height,
					doors: []
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
				this._setTile(room.x + newWallSize, room.y + doorCoord, this._doorType);
				newRoom1.doors.push([room.x + newWallSize, room.y + doorCoord]);
				newRoom2.doors.push([room.x + newWallSize, room.y + doorCoord]);

			} else {

				do {
					newWallSize = halfMaxWall + ~~(halfMaxWall / 2 - Math.random() * halfMaxWall);
				} while (this.getTilePass(room.x - 1, room.y + newWallSize) || this.getTilePass(room.x + room.width, room.y + newWallSize));

				newRoom1 = {
					x: room.x,
					y: room.y,
					width: room.width,
					height: newWallSize,
					doors: []
				};
				newRoom2 = {
					x: room.x,
					y: room.y + newWallSize + 1,
					width: room.width,
					height: room.height - newWallSize - 1,
					doors: []
				};
				this._fillRect({
					x: room.x,
					y: room.y + newWallSize,
					width: room.width,
					height: 1
				}, this._wallType);
				doorCoord = ~~(Math.random() * room.width);
				this._setTile(room.x + doorCoord, room.y + newWallSize, this._doorType);
				newRoom1.doors.push([room.x + doorCoord, room.y + newWallSize]);
				newRoom2.doors.push([room.x + doorCoord, room.y + newWallSize]);

			}

			// размеры новых комнат
			var room1maxWall = Math.max(newRoom1.width, newRoom1.height),
				room2maxWall = Math.max(newRoom2.width, newRoom2.height);

			// если они слишком большие, то будем их делить
			// или добавим в массив готовых комнат
			if (room1maxWall > minRoomSize) {
				rooms.push(newRoom1);
			} else smallRooms.push(newRoom1);
			if (room2maxWall > minRoomSize) {
				rooms.push(newRoom2);
			} else smallRooms.push(newRoom2);

		}

		// генерация лестницы вниз
		do {
			var dx = ~~(Math.random() * this._sizes.width),
				dy = ~~(Math.random() * this._sizes.height);
		} while (this._map[dy][dx].type != this._floorType);

		this._map[dy][dx] = new Tile(4);

		// путь до выхода
		var way = this._findPath(this._position.x, this._position.y, dx, dy),
			maxHiddenPower;

		// определяем максимальную силу скрытия
		switch (this._difficult) {
			case 0:
				maxHiddenPower = this._maxDiscover + 5;
				break;
			case 1:
				maxHiddenPower = this._maxDiscover + 10;
				break;
			case 2:
				maxHiddenPower = this._maxDiscover + 20;
				break;
			case 3:
				maxHiddenPower = 100;
				break;
		}

		// добавляем скрытые двери
		smallRooms.forEach(function(room) {

			// в комнате одна комната
			if (room.doors.length == 1) {

				var rx = room.doors[0][0],
					ry = room.doors[0][1],
					// будем ее скрывать или нет
					hide = Math.random() * 100 < 20;

				if (hide) {

					var power = 1 + ~~(Math.random() * 99),
						// находится ли эта дверь на пути к выходу
						onWay = way.some(function(t) {
							return (t[0] == rx) && (t[1] == ry);
						});

					// корректируем сложность в зависимости от уровня сложности
					// и того, находится ли эта дверь на пути к выходу
					switch(this._difficult) {
						case 0:
							power = power > maxHiddenPower ? maxHiddenPower : power;
							break;
						case 1:
						case 2:
							power = onWay ? power > maxHiddenPower ? maxHiddenPower : power : power;
							break;
					}
					
					// скрываем дверь
					this._map[ry][rx].setHidden(power);

				}

			}

		}, this);

	};

	/**
	 * Установить тайл в нужных координатах
	 * @param {Object|number} arg1 координата х тайла либо объект с координатами
	 * @param {number} arg2 координата у тайла либо тип тайла
	 * @param {number|null} arg3 тип тайла тибо null
	 * @private
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
	 * Открыть дверь по заданным координатам
	 * @param  {Number} dx координата х двери
	 * @param  {Number} dy координата у двери
	 * @return {Boolean}    true, если дверь открыта, иначе false
	 */
	Level.prototype.openDoor = function(dx, dy) {

		var t = this._map[dy][dx];

		if (t.type != this._doorType) return false;

		return t.openDoor();

	};

	/**
	 * Закрываем двери вокруг героя
	 * @param  {Object} position позиция героя
	 * @return {Number}          количество закрытых дверей
	 */
	Level.prototype.closeDoor = function(position) {

		var minX = position.x - 1,
			maxX = position.x + 1,
			minY = position.y - 1,
			maxY = position.y + 1,
			flag = 0;

		if (minX < 0) minX = 0;
		if (minY < 0) minY = 0;
		if (maxX > this._sizes.width) maxX = this._sizes.width;
		if (maxY > this._sizes.height) maxY = this._sizes.height;

		for (var i = minY; i <= maxY; i++) {
			for (var g = minX; g <= maxX; g++) {

				var t = this._map[i][g];
				if (t.type == this._doorType) {
					if (t.closeDoor()) flag++;
				}

			}
		}

		return flag;

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
	 * @private
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
				this._setTile(g, i, type);
			}
		}

	};

	/**
	 * Рассчитываем координаты линии по двум точкам
	 * @param  {number} x0 координата х первой точки
	 * @param  {number} y0 координата у первой точки
	 * @param  {number} x1 координата х второй точки
	 * @param  {number} y1 координата у второй точки
	 * @return {Array}    массив точек линии
	 * @private
	 */
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

	/**
	 * Нахождение кратчайшего пути между двумя точками
	 * @param  {number} x0 координата х первой точки
	 * @param  {number} y0 координата у первой точки
	 * @param  {number} x1 координата х второй точки
	 * @param  {number} y1 координата у второй точки
	 * @return {Array}    массив с координатами точек пути
	 */
	Level.prototype._findPath = function(x0, y0, x1, y1) {

		/**
		 * Возвращает соседнее поле
		 * @param  {Boolean} type если true, то возвращает поле с путем 0,
		 *  если false, то возвращает поле с путем -1 от текущего
		 * @return {Array}      координаты следующего поля
		 */
		function getNextNeighbor(type) {

			var dx = place[0],
				dy = place[1];

			// смежные поля
			for (var i = dy - 1; i <= dy + 1; i++) {
				for (var g = dx - 1; g <= dx + 1; g++) {

					// контроль по размерам
					var flag = (i >= 0) && (g >= 0) && (i < this._sizes.height) && (g < this._sizes.width);

					if (!flag) continue;

					flag = type ? (pathes[i][g] == 0) && (this._map[i][g].type != this._wallType) : (pathes[i][g] + 1 == pathes[dy][dx]);

					if (flag) return [g, i];

				}
			}

			return false;

		}

		/**
		 * Массив с расстоянем до начальной точки
		 * @type {Array}
		 */
		var pathes = [],
			/**
			 * Координаты текущей точки
			 * @type {Array}
			 */
			place = [x0, y0],
			/**
			 * Массив незаконченных полей
			 * @type {Array}
			 */
			places = [],
			/**
			 * Массив результат
			 * @type {Array}
			 */
			result = [];

		// начальное нуление всех точек
		for (var i = 0; i < this._sizes.height; i++) {
			pathes[i] = [];
			for (var g = 0; g < this._sizes.width; g++) {
				pathes[i][g] = 0;
			}
		}

		/**
		 * Признак достижения второй точки
		 * @type {Boolean}
		 */
		var flag = true;
		// пока не достигли второй точки
		while (flag) {

			var t = getNextNeighbor.call(this, true);
			if (t) {

				// увличиваем путь на 1
				pathes[t[1]][t[0]] = pathes[place[1]][place[0]] + 1;
				// это конечная точка?
				if ((t[0] == x1) && (t[1] == y1)) {
					flag = false; // выход
				} else {
					places.push(t); // добавляем в массив незаконченных точек
				}

			} else {

				// достаем первую из незаконченных точек
				place = places.shift();

			}

		}

		// теперь начинаем с конца
		place = [x1, y1];
		// пока не достигнем начала
		flag = true;

		while (flag) {

			// текущая точка
			result.push(place);
			// следующая точка
			place = getNextNeighbor.call(this, false);
			// если дошли до начала
			if ((place[0] == x0) && (place[1] == y0)) flag = false;

		}

		return result;

	};

	/**
	 * Возвращает проходимость тайла по указанным координатам
	 * @param  {Object|number} arg1 координата х тайла либо объект с координатами
	 * @param  {number|null} arg2 координата у тайла либо null
	 * @return {boolean}      true если тайл проходим, иначе false
	 * @public
	 */
	Level.prototype.getTilePass = function(arg1, arg2) {

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
	 * Устанавливаем позицию героя
	 * @param {Object} hero объект героя
	 * @public
	 */
	Level.prototype.setHeroPosition = function(hero) {

		this._map[this._position.y][this._position.x].contains = false;
		this._map[this._position.y][this._position.x].child = null;
		this._map[hero.position.y][hero.position.x].contains = true;
		this._map[hero.position.y][hero.position.x].child = hero;
		this._position = {
			x: hero.position.x,
			y: hero.position.y
		};

	};

	/**
	 * Проверка видимости всех полей в радиусе видимости
	 * @param  {number} overview радиус четкой видимости
	 * @param  {number} shadow   радиус видимости в тени
	 * @param  {number} side     сторона в которую смотрим
	 * @public
	 */
	Level.prototype.checkVisible = function(overview, shadow, side, discover, logFunc) {

		var minY = this._position.y - shadow,
			maxY = this._position.y + shadow,
			minX = this._position.x - shadow,
			maxX = this._position.x + shadow,
			checkSide = side % 2 != 0,
			sign1 = (side == 1 || side == 5) ? 1 : -1,
			sign2 = (side == 5 || side == 7),
			sign3 = (side == 0 || side == 4) ? this._position.y : this._position.x,
			sign4 = (side == 4 || side == 2) ? 1 : -1;

		if (minX < 0) minX = 0;
		if (minY < 0) minY = 0;
		if (maxX > this._sizes.width) maxX = this._sizes.width;
		if (maxY > this._sizes.height) maxY = this._sizes.height;

		for (var i = minY; i < maxY; i++) {
			for (var g = minX; g < maxX; g++) {

				var x = g - this._position.x,
					y = i - this._position.y,
					quarter,
					shadow = false,
					t = this._map[i][g];

				t.visible = false;

				if (checkSide) {

					// проверка находится ли данный тайл в зоне видимости
					var a = g - this._position.x,
						b = sign1 * (i - this._position.y),
						sideVisible = sign2 ? a <= b : a >= b;

					if (!sideVisible) continue;

					// вычисляем к какой четверти относится тайл
					quarter = (side == 1 && x >= 0 && y <= 0) || (side == 3 && x >= 0 && y >= 0) || (side == 5 && x <= 0 && y >= 0) || (side == 7 && x <= 0 && y <= 0);

				} else {

					var a = (side == 2 || side == 6) ? g : i;
					sideVisible = sign4 * a >= sign4 * sign3;

					if (!sideVisible) continue;

					quarter = (side == 0 && y <= x && y <= -x) || (side == 2 && y <= x && y >= -x) || (side == 4 && y >= x && y >= -x) || (side == 6 && y >= x && y <= -x);

				}

				if ((Math.abs(i - this._position.y) < 2) && (Math.abs(g - this._position.x) < 2)) {

					// тайл в непосредственной близости
					t.visible = true;
					t.inMind = true;

				} else {

					// чертим линию до тайла и от тайла
					var line1 = this._drawLine(g, i, this._position.x, this._position.y),
						line2 = this._drawLine(this._position.x, this._position.y, g, i);

					// так надо, чтобы убрать сам тайл из рассмотрения
					line1.shift();

					// проверяем все тайлы на линии до данного тайла
					t.visible = line1.every(function(point) {
						return this._map[point[1]][point[0]].passability;
					}, this) || line2.every(function(point) {
						return this._map[point[1]][point[0]].passability;
					}, this);

					if (t.visible) {

						t.inMind = true;
						if (line2.length >= overview) {
							// тайл слишком далеко, убираем в тень
							shadow = true;
						}

					}
				}

				// тайл не в секторе прямой видимости,
				// убираем в тень
				if (t.visible) {
					if (!quarter) {
						shadow = true;
					}
				}

				// установить эффект тени
				if (shadow) {
					t.setEffect(new TileEffect("shadow"));
				}

				// может быть это скрытая дверь?
				if ((t.visible) && (!shadow)) {
					if ((t.type == this._doorType) && (t.hidden)) {
						// пробуем ее обнаружить
						if (t.checkHidden(discover)) {
							logFunc(lang.log[21], 2);
						}
					}
				}

			}
		}
	};

	/**
	 * Обновление информации на экране
	 * @public
	 */
	Level.prototype.outText = function() {

		var dy = this._position.y - this._sizes.scrHalfHeight,
			dx = this._position.x - this._sizes.scrHalfWidth;

		for (var i = 0; i < this._sizes.scrHeight; i++) {
			for (var g = 0; g < this._sizes.scrWidth; g++) {

				var ty = i + dy,
					tx = g + dx,
					t = this._map[ty] ? this._map[ty][tx] ? this._map[ty][tx] : null : null,
					s = this._screen[i][g];

				if (t === null) {
					s.innerHTML = "&nbsp;";
					continue;
				}

				if (t.contains) {
					s.innerHTML = t.child.getText();
					s.style.color = t.child.getColor();
				} else {
					s.innerHTML = t.getText();
					s.style.color = t.getColor();
				}

				// отображение кратчайшего пути до выхода на следующий уровень
				/*if (this.way.some(function(e) {
						return (e[0] == tx) && (e[1] == ty);
					})) {
					s.style.backgroundColor = "#F00";
				} else {
					s.style.backgroundColor = "#000";
				}*/

			}
		}

	};

	/**
	 * Возвращает тайл под мышью
	 * @param  {event} e событие мыши
	 * @return {Tile}   тайл под мышью
	 * @private
	 */
	Level.prototype._getTileOnCoord = function(e) {

		var ex = parseInt(e.target.getAttribute("data-x")) + this._position.x - this._sizes.scrHalfWidth,
			ey = parseInt(e.target.getAttribute("data-y")) + this._position.y - this._sizes.scrHalfHeight;

		return this._map[ey] ? this._map[ey][ex] ? this._map[ey][ex] : null : null;

	};

	return Level;

});