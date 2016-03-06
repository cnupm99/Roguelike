"use strict";

// конфигурация загрузчика
requirejs.config({
	baseUrl: "js/app",
	paths: {
		lib: "../lib"
	}
});

// загружаем основной модуль
requirejs(["main"]);