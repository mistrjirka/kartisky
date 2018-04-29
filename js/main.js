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


var newGame = new game();

var player1 = newGame.add.player(newGame.get.cardsByNation("people", "all", nations));
var player2 = newGame.add.player(newGame.get.cardsByNation("people", "all", nations));

function round(player) {
    function getCards() {
        newGame.get.playersCardMove(500, )
    };

    function getCardPlacement() {

    };

    function movement() {

    };

    function attack() {

    };

    getCards();
};

/*
var player;
player = newGame.add.player(newGame.get.cardsByNation("people", [0], nations));

/*
console.log(newGame.add.cardsTo(player, newGame.get.cardsByNation("people", "all", nations), document.getElementById("player1")))
console.log(newGame.get.playerCardMove(70, 50, {
    class: "cardsInHand",
    button: "butt"
}, function (a) {
    alert(a);
}, function () {
    alert("sda");
}));
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
battleField[0][0].owner = "pl1";
battleField[0][1].owner = "pl1";
battleField[0][3].owner = "pl1";
battleField[0][2].owner = "pl1";

battleField[1][0].owner = "pl2";
battleField[1][1].owner = "pl2";
battleField[1][3].owner = "pl2";
battleField[1][2].owner = "pl2";

newGame.do.createBattlefield([4, 5], document.getElementById("player2"), "is", "100px", "100px", "100px", "100px");

newGame.do.attack(battleField, document.getElementById("is"), "pl1", "pl2", 1000, function () {
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
