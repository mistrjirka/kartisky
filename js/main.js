var nations = [{
	nation: "people",
	abilities: {

	},
	cards: [{
		name: "warior 1",
		price: 75,
		amount: 10,
		statistics: {
			class: "warior",
			attack: 100,
			life: 150,
			weakpoints: {
				archer: 10,
				warior: 0,
				balista: -5,
				lancer: 0,
				cavalry: -10
			}
		},
		upgrade: null
    }, {
		name: "archer 1",
		price: 55,
		amount: 15,
		statistics: {
			class: "archer",
			attack: 70,
			life: 50,
			weakpoints: {
				archer: 0,
				warior: -10,
				balista: -20,
				lancer: -10,
				cavalry: -20
			}

		}
    }, {
		name: "balista 1",
		price: 150,
		amount: 3,
		statistics: {
			class: "balista",
			attack: 200,
			life: 75,
			weakpoints: {
				archer: 100,
				warior: 100,
				balista: -100,
				lancer: 100,
				cavalry: 100
			}
		},
		upgrade: null
    }, {
		name: "lancer 1",
		price: 75,
		amount: 10,
		statistics: {
			class: "lancer",
			attack: 70,
			life: 200,
			weakpoints: {
				archer: 10,
				warior: 0,
				balista: -10,
				lancer: 0,
				cavalry: 50
			}
		},
		upgrade: null
    }, {
		name: "cavalry 1",
		price: 90,
		amount: 10,
		statistics: {
			class: "cavalry",
			attack: 100,
			life: 200,
			weakpoints: {
				archer: 20,
				warior: 20,
				balista: -10,
				lancer: -10,
				cavalry: 0
			}
		},
		upgrade: null
    }]
}]
var battleField = [
    [
        [

        ],
        [
        ],
        [

        ],
        [

        ],
        [

        ]
    ],
    [
        [

        ],
        [

        ],
        [

        ],
        [

        ],
        [

        ]
    ],
    [
        [

        ],
        [

        ],
        [

        ],
        [

        ],
        [

        ]
    ],
    [
        [

        ],
        [

        ],
        [

        ],
        [

        ],
        [

        ]
    ]
];

var config = {
	round: {
		amountOfCards: 4,
		money: 100,
		timeOutForAction: 500
	}
}

var newGame = new Kartisky();

var player1 = newGame.add.player(newGame.get.cardsByNation("people", "all", nations), "hrac1");
var player2 = newGame.add.player(newGame.get.cardsByNation("people", "all", nations), "hrac2");
player1.home = "top";
player2.home = "bottom";
battleField = newGame.do.formatVirtualBattlefield(battleField);

newGame.do.createBattlefield([4, 5], document.getElementById("player1"), "is", "200px", "100px", "200px", "100px");
player1.cardPack = newGame.do.makeCardPack(player1.cards);
player2.cardPack = newGame.do.makeCardPack(player2.cards);

function round(player, place, visualBattleField, confirmButton, cancelButton, cancelEverythingButton) {
	var cancelEverythingButton = document.getElementById(cancelEverythingButton);
	var cardPlace = document.getElementById(place);
	var acceptButton = document.getElementById(confirmButton);
	var cancelButton = document.getElementById(cancelButton);
	var visualBattleField = document.getElementById(visualBattleField)
	var cardsSelected = [];
	newGame.do.virtualToVisual(battleField, visualBattleField);

	function roundItems() {
		player.hand.money += config.round.money;
		for (var i = 1; config.round.amountOfCards >= i; i++) {
			player.hand.cards.push(player.cardPack[0]);
			player.cardPack.shift();
		}
		getCards();
	};

	function getCards() {
		console.log("getCards");
		newGame.get.playerCardMove(500, 5, cardPlace, acceptButton, cancelButton, player,
			function (a) {
				a.forEach(function (el) {

					cardsSelected.push({
						card: player.hand.cards[el],
						x: null,
						y: null
					});
				});
				getCardPlacement();

			}, movement, movement);
	};

	function getCardPlacement() {
		var done = {
			bool: true,
			completleDone: false,
			count: 0
		};
		if (cardsSelected.length != 0) {
			async (33, 1000, function () {
					alert("async timeout");
					movement();
				}, function () {
					if (cardsSelected.length > done.count && done.bool == true) {
						newGame.get.playerCardPlacement(1000, player.home, player, battleField, visualBattleField, acceptButton, cancelButton,
							function (a, b) {
								cardsSelected[done.count].x = a;
								cardsSelected[done.count].y = b;
								battleField = newGame.do.editVirtualBattleField(battleField, [{
									card: cardsSelected[done.count].card,
									location: {
										x: cardsSelected[done.count].x,
										y: cardsSelected[done.count].y
									}
                                }], player);
								newGame.do.virtualToVisual(battleField, document.getElementById("is"));
								done.bool = true;
								done.count += 1;
							},
							function () {
								done.bool = true;
								done.count += 1;
							},
							function (a) {
								alert(a + " ne");
							});
					}
				},
				function () {
					if (cardsSelected.length <= done.count && done.bool == true) {
						movement();
						return true;
					}
					done.bool = false;
				}
			);
		}
	}

	function movement() {
		console.log("movement");
		newGame.get.playersMinionMovement(500, battleField, document.getElementById("is"), player, acceptButton, cancelButton, cancelEverythingButton, function (a) {
			if (a.to != null) {
				var card = battleField[a.from[0]][a.from[1]].card;
				battleField = newGame.do.removeFromBattleField(battleField, {
					type: "coordinates",
					coordinates: [a.from[1], a.from[0]]
				});
				newGame.do.editVirtualBattleField(battleField, [{
					card: card,
					location: {
						x: a.to[1],
						y: a.to[0]
					}
        }], player);
				newGame.do.virtualToVisual(battleField, document.getElementById("is"));
			}
		}, function(){alert("akce1")}, function(){alert("akce2")}, function (actual) {
			console.log(actual);
		}, function (a) {
			alert("timeout movement");
			attack();
		});
	}

	function attack() {
		console.log("attack");
		/*var done = {
			bool: true,
			completleDone: false,
			count: 0
		};
		newGame.do.attack(500, battleField, document.getElementById("is"), player, player2, acceptButton, cancelButton, cancelEverythingButton, function (a) {
			alert(a);
		}, function () {
			alert("cancel");
		}, function () {
			alert("cancel everything");
		}, function(actual){
			console.log(actual);
		}, alert);*/
	}
	roundItems();

};

battleField[1][0].owner = player2.id;
battleField[1][0].card = nations[0].cards[0];
round(player1, "player1", "is", "accept", "cancel", "cancelaction");

/*
var player1;
player1 = newGame.add.player(newGame.get.cardsByNation("people", "all", nations));

player1.hand.cards = player1.cards;
//console.log(newGame.add.cardsTo(player1, newGame.get.cardsByNation("people", "all", nations), document.getElementById("player2")))
console.log(newGame.get.playerCardMove(500, {
    id: "player1",
    button: "butt"
}, player1, function (a) {
    alert(a);
}, function () {
    alert("sda");
}));
/*
console.log(newGame.do.editVirtualBattleField(battleField, [{
    location: {
        x: 2,
        y: 4
    },
    card: {
        owner: "player",
        card: newGame.get.cardsByNation("people", [0], nations)[0]
    }0
}]))

battleField = newGame.do.formatVirtualBattlefield(battleField);
var player1 = newGame.add.player(newGame.get.cardsByNation("people", "all", nations));
var player2 = newGame.add.player(newGame.get.cardsByNation("people", "all", nations));
battleField[0][0].owner = player1.id;
battleField[0][1].owner = player1.id;
battleField[0][3].owner = player1.id;
battleField[0][2].owner = player1.id;

battleField[1][0].owner = player2.id;
battleField[1][1].owner = player2.id;
battleField[1][3].owner = player2.id;
battleField[1][2].owner = player2.id;

newGame.do.createBattlefield([4, 5], document.getElementById("player2"), "is", "100px", "100px", "100px", "100px");

newGame.do.attack(500, battleField, document.getElementById("is"), player2, player1,document.getElementById("butt"), function () {
    alert("jo");
}, function () {
    alert("nope");
});

/*newGame.get.playerCardPlacement("top", battleField, document.getElementById("is"), "player", document.getElementById("butt"), 1000, function () {
    alert("haha")
}, function () {
    alert("ahoj")
})
/*newGame.get.playersMinionMovement(battleField, document.getElementById("is"), "player", document.getElementById("butt"), 500, function (a,b) {
    alert(a + " " + b);
}, function () {
    alert("hehe")
})

*/
