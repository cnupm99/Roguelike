"use strict";

define(function() {

	function TileEffect(effectName) {

		this.effectName = effectName;
		this.moves = 0;
		this._stage = 0;

		switch (effectName) {
			case "shadow":
				this.duration = 1;
				this.color = "#777";
				this.render = this._shadowRender;
				this.z = 1;
				break;
		}

	}

	TileEffect.prototype._shadowRender = function() {

		this._stage++;
		if (this._stage % 2 == 1) {
			this.color = "#888" 
		} else this.color = "#777";

	};

	return TileEffect;

});