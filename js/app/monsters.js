"use strict";

define(function() {

	return [

		////////////////////////////
		// монстры первого уровня //
		////////////////////////////
		[
			// крыса
			{
				represent: "r",
				color: "#FFF",
				params: {
					str: 3,
					dex: 4,
					con: 3,
					int: 1,
					wis: 3,
					cha: 1
				},
				size: 0,
				desc: 1,
				abilitys: {
					infection: 1,
					cowardice: 1
				},
				packSizes: {
					min: 2,
					max: 3
				}
			}
		]

	];

});