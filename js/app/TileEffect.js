"use strict";

define(function() {

	function TileEffect(effectName) {

		this.effectName = effectName;
		this.stage = 0;

		switch (effectName) {
			case "shadow":
				this.duration = 2;
				this.color = "#777";
				this.render = this._shadowRender;
				break;
		}

	}

	TileEffect.prototype._shadowRender = function() {

		this.color = "#888";

	};

	return TileEffect;

});