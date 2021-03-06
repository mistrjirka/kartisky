const nations = [{
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
                cavalry: -10,
                mapID: "default"
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
                cavalry: -20,
                mapID: "default"
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
                cavalry: 100,
                mapID: "default"
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
                cavalry: 50,
                mapID: "default"
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
                cavalry: 0,
                mapID: "default"
            }
        },
        upgrade: null
    }]
}];

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var Game = new Kartisky();

var battleField = []; // = Game.get.battleField(5, 5);
//console.log(battleField);

var config = {
    round: {
        amountOfCards: 4,
        money: 100,
        timeOutForAction: 500
    }
}

var weakpoints = [{
    array: [1, 0.9, 0.8, 0.65, 0.5, 0.65, 0.8, 0.9],
    id: "default"
}];

function attackAngle(attacker, sacriface) { //stupid name for stupid function
    var lu, mu, ru, l, r, ld, md, rd, tmp;
    console.log(attacker);
    console.log(sacriface);
    if (attacker[0] - 1 == sacriface[0] && attacker[1] - 1 == sacriface[1])
        lu = [attacker[0] - 1, attacker[1] - 1];

    if (attacker[0] - 1 == sacriface[0] && attacker[1] == sacriface[1])
        mu = [attacker[0] - 1, attacker[1]];

    if (attacker[0] - 1 == sacriface[0] && attacker[1] + 1 == sacriface[1])
        ru = [attacker[0] - 1, attacker[1] + 1];

    if (attacker[0] == sacriface[0] && attacker[1] - 1 == sacriface[1])
        l = [attacker[0], attacker[1] - 1];

    if (attacker[0] == sacriface[0] && attacker[1] + 1 == sacriface[1])
        r = [attacker[0], attacker[1] + 1];

    if (attacker[0] + 1 == sacriface[0] && attacker[1] - 1 == sacriface[1])
        ld = [attacker[0] + 1, attacker[1] - 1];

    if (attacker[0] + 1 == sacriface[0] && attacker[1] == sacriface[1])
        md = [attacker[0] + 1, attacker[1]];

    if (attacker[0] + 1 == sacriface[0] && attacker[1] + 1 == sacriface[1])
        rd = [attacker[0] + 1, attacker[1] + 1];

    tmp = [lu, mu, ru, r, l, ld, md, rd];
    var tmp2 = [7, 0, 1, 2, 6, 5, 4, 3];
    var tmp3;
    tmp.forEach(function (element, index, array) {
        if (element != null) {
            tmp3 = tmp2[index];
        }
    });

    return tmp3;
}

var player1 = Game.add.player(Game.get.cardsByNation("people", "all", nations), getCookie("username"));
//var player2 = Game.add.player(Game.get.cardsByNation("people", "all", nations), "hrac2");

//player2.home = "bottom";
var playerPlaing = null;
Game.do.createBattlefield([5, 5], document.getElementById("player1"), "is", "200px", "100px", "200px", "100px");
//Game.do.createBattlefield([5, 5], document.getElementById("player2"), "battle2", "200px", "100px", "200px", "100px");

player1.cardPack = Game.do.makeCardPack(player1.cards);
//player2.cardPack = Game.do.makeCardPack(player2.cards);

function round(player, enemyPlayer, place, visualBattleField, confirmButton, cancelButton, cancelEverythingButton, battleField, whoPlay) {
    var whoPlay = document.getElementById(whoPlay);
    var cancelEverythingButton = document.getElementById(cancelEverythingButton);
    var cardPlace = document.getElementById(place);
    var acceptButton = document.getElementById(confirmButton);
    var cancelButton = document.getElementById(cancelButton);
    var visualBattleField = document.getElementById(visualBattleField);
    var cardsSelected = [];
    console.log(battleField);
    Game.do.virtualToVisual(battleField, visualBattleField);

    whoPlay.innerHTML = player.id;

    function roundItems() {
        player.hand.money += config.round.money;
        if (config.round.amountOfCards > player.cardPack.length) {
            player.cardPack.forEach(function () {
                player.hand.cards.push(player.cardPack[0]);
                player.cardPack.shift();
            });
        } else {
            for (var i = 1; config.round.amountOfCards >= i; i++) {
                player.hand.cards.push(player.cardPack[0]);
                player.cardPack.shift();
            }
        }
        getCards();
    };

    function getCards() {
        console.log("getCards");
        Game.get.playerCardMove(500, 5, cardPlace, acceptButton, cancelButton, player,
            function (a) {
                a.forEach(function (el) {

                    cardsSelected.push({
                        card: copyObj(player.hand.cards[el]),
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
            var cancelEverything = false;
            var stop;

            function cancelEverythingToRemove() {
                cancelEverything = true;
            }
            cancelEverythingButton.addEventListener("click", cancelEverythingToRemove);
            async (33, 1000, function () {
                    alert("async timeout");
                    movement();
                    cancelEverythingButton.removeEventListener("click", cancelEverythingToRemove);
                }, function () {
                    if (cardsSelected.length > done.count && done.bool == true) {
                        Game.get.playerCardPlacement(1000, player.home, player, battleField, visualBattleField, acceptButton, cancelButton,
                            function (a, b) {
                                cardsSelected[done.count].x = a;
                                cardsSelected[done.count].y = b;
                                battleField = Game.do.editVirtualBattleField(battleField, [{
                                    card: copyObj(cardsSelected[done.count].card),
                                    location: {
                                        x: copyObj(cardsSelected[done.count].x),
                                        y: copyObj(cardsSelected[done.count].y)
                                    }
                                }], player);

                                player.hand.cards.splice(findIndexOfObject(player.hand.cards, cardsSelected[done.count].card), 1);

                                Game.do.virtualToVisual(battleField, visualBattleField);
                                done.bool = true;
                                done.count += 1;
                            },
                            function () {
                                done.bool = true;
                                done.count += 1;
                            },
                            function (a) {
                                alert(a + " ne");
                            },
                            function (s) {
                                stop = s;
                            }
                        );
                    }
                },
                function () {
                    if (cardsSelected.length <= done.count && done.bool == true) {
                        cancelEverythingButton.removeEventListener("click", cancelEverythingToRemove);
                        movement();
                        return true;

                    }
                    done.bool = false;
                },
                function () {
                    if (cancelEverything == true) {
                        cancelEverythingButton.removeEventListener("click", cancelEverythingToRemove);
                        stop();
                        movement();

                        return true;
                    }
                }
            );
        }
    }

    function movement() {
        console.log("movement");
        Game.get.playersMinionMovement(400 * Game.do.checkForAction(battleField, player), battleField, visualBattleField, player, acceptButton, cancelButton, cancelEverythingButton, function (a) {
            if (a.to != null) {
                var card = battleField[a.from[0]][a.from[1]].card;
                battleField = Game.do.removeFromBattleField(battleField, {
                    type: "coordinates",
                    coordinates: [a.from[1], a.from[0]]
                });
                Game.do.editVirtualBattleField(battleField, [{
                    card: card,
                    location: {
                        x: a.to[1],
                        y: a.to[0]
                    }
        }], player);
                Game.do.virtualToVisual(battleField, visualBattleField);
            }
        }, function () {
            attack();
        }, function () {
            attack();
        }, function (actual) {
            console.log(actual);
        }, function (a) {
            alert("timeout movement");
            attack();
        });
    }

    function attack() {
        console.log("attack");
        var done = {
            bool: true,
            completleDone: false,
            count: 0
        };
        Game.do.attack(400 * Game.do.checkForAction(battleField, player), battleField, visualBattleField, player, enemyPlayer, acceptButton, cancelButton, cancelEverythingButton, function (a) {
                if (a.to != null) {
                    console.log("attacking");
                    var attacker = battleField[a.from[0]][a.from[1]];
                    var sacrifice = battleField[a.to[0]][a.to[1]];
                    console.log(attacker);
                    console.log(sacrifice);

                    var angle = attackAngle(a.from, a.to);
                    var weakpointMultiplier;
                    weakpoints.forEach(function (element, index, array) {
                        if (sacrifice.card.statistics.weakpoints.mapID == element.id) {
                            weakpointMultiplier = element.array[angle];
                        }
                    });

                    sacrifice.card.statistics.life -= attacker.card.statistics.attack;
                    attacker.card.statistics.life -= sacrifice.card.statistics.attack * weakpointMultiplier;

                    if (attacker.card.statistics.life <= 0) {
                        battleField = Game.do.removeFromBattleField(battleField, {
                            type: "coordinates",
                            coordinates: [a.from[1], a.from[0]]
                        });
                    } else {
                        console.log(attacker.card.statistics.life + " lives");
                        Game.do.editVirtualBattleField(battleField, [{
                            card: attacker.card,
                            location: {
                                x: a.from[1],
                                y: a.from[0]
                            }
                            }], player);
                    }
                    if (sacrifice.card.statistics.life <= 0) {
                        console.log(sacrifice.card.statistics.life + " lives");
                        battleField = Game.do.removeFromBattleField(battleField, {
                            type: "coordinates",
                            coordinates: [a.to[1], a.to[0]]
                        });
                    } else {
                        console.log(sacrifice.card.statistics.life + " lives");
                        Game.do.editVirtualBattleField(battleField, [{
                            card: sacrifice.card,
                            location: {
                                x: a.to[1],
                                y: a.to[0]
                            }
                        }], enemyPlayer);
                    }
                    Game.do.virtualToVisual(battleField, visualBattleField);
                }
            },
            function () {
                endOfRound(battleField);
            },
            function () {
                endOfRound(battleField);
                alert("cancel everything");
            },
            function (actual) {
                console.log(actual);
            }, alert);
    }
    roundItems();

};

function endOfRound(battleField) {
    console.log("end of round");

    Game.multiplayer.endOfTurn(player1, battleField)
    //round(playerSet[playerPlaing].player, playerSet[playerPlaing].enemyPlayer, playerSet[playerPlaing].place, playerSet[playerPlaing].visualBattleField, playerSet[playerPlaing].accept, playerSet[playerPlaing].cancel, playerSet[playerPlaing].cancelEverethinig, "whoPlay");
}



function multiplayer(callback) {
    var player2;
    Game.multiplayer.init("/socket.io/socket.io.js", function () {
        Game.multiplayer.loginSetup();
        Game.multiplayer.start(function (side) {
            player1.home = side;
            console.log(side);
            Game.multiplayer.playerDataSync(player1, function () {
                Game.multiplayer.turn(function (data) {
                    console.log(data);
                    player2 = data.enemy;
                    callback(player2, data.battlefield);
                });

            });
        });


    });

}

window.onload = function () {
    var firstPlayer = Math.floor((Math.random() * 2) + 1);

    multiplayer(function (enemy, battleField) {
        console.log("start");
        round(player1, enemy, "player1", "is", "accept1", "cancel1", "cancelaction1", battleField, "whoPlay")
        /*round(playerSet[firstPlayer - 1].player, playerSet[firstPlayer - 1].enemyPlayer, playerSet[firstPlayer - 1].place, playerSet[firstPlayer - 1].visualBattleField, playerSet[firstPlayer - 1].accept, playerSet[firstPlayer - 1].cancel, playerSet[firstPlayer - 1].cancelEverethinig, "whoPlay");
        playerPlaing = firstPlayer - 1;*/
    });
}
