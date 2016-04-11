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
				abilitys: {
					infection: 1,
					cowardice: 1
				}
			}
		],
		////////////////////////////
		// монстры второго уровня //
		////////////////////////////
		[
			// огромная крыса
			{
				represent: "r",
				color: "#F88",
				params: {
					str: 5,
					dex: 4,
					con: 5,
					int: 1,
					wis: 3,
					cha: 1
				},
				size: 0,
				abilitys: {
					infection: 2,
					cowardice: 1
				}
			}
		],
		/////////////////////////////
		// монстры третьего уровня //
		/////////////////////////////
		[
			// крысиный вожак
			{
				represent: "r",
				color: "#F00",
				params: {
					str: 7,
					dex: 5,
					con: 7,
					int: 1,
					wis: 3,
					cha: 1
				},
				size: 0,
				abilitys: {
					infection: 3,
					rage: 1
				}
			}
		]

	];

});