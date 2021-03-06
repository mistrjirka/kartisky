function findIndex(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (item == array[i]) {
            return i;
        }
    }
    return null;
}
if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {
    enumerable: false
});
var game = function (forPlayer1, forPlayer2) {

    this.add = {
        player: function (cards) {
            if (typeof cards == "object") {
                return {
                    cards: cards,
                    hand: {
                        money: 0,
                        cards: []
                    }
                }
            } else {
                return "Wrong value type!!! " + typeof cards;
            }
        },
        cardsTo: function (player, cards, element) {
            if ((typeof cards && typeof player) == "object") {
                player.hand.cards.push(cards);
            } else {
                return "Wrong value format";
            }
            if (typeof element == "object") {
                var val = "";
                for (var i = 0; cards.length > i; i++) {
                    val = val + "<br><input type='checkbox' class= 'cardsInHand' id = 'card" + i + "'> class: " + cards[i].statistics.class + " damage: " + cards[i].statistics.attack + " life: " + cards[i].statistics.life;
                }
                element.innerHTML = val;
            }
        }
    }

    this.get = {
        playersCardMove: function (intervalTime, time, element, succesCallBackfun, timeOutCallBackFun, timeCallBackFun) {
            if (typeof intervalTime != "number" && typeof time != "number" && typeof element != "object" && typeof succesCallBackfun == "function") {
                return "Wrong value format: interval Time:" + typeof intervalTime + "and have to be number, time: " + typeof time + "and have to be number, element: " + typeof element + "and have to be object/element, Succes CallBack function: " + typeof succesCallBackfun + "and have to be object/function...";
            }
            var clicked = false;
            document.getElementById(element.button).addEventListener("click", function () { //todo
                clicked = true;
            });
            var timeOutFun = false;
            if (typeof timeOutCallBackFun == "function") {
                timeOutFun = true;
            }
            var timeFun = false;
            if (typeof timeCallBackFun == "function") {
                timeOutFun = true;
            }
            var wereActive = [];
            var j = 0;
            var interval = setInterval(function () {
                var active = [];
                var list = document.getElementsByClassName(element.class); //todo
                for (var i = 0; i < list.length; i++) {
                    if (list[i].checked == true) {
                        active.push(list[i]);
                        //console.log(list[i]);
                    }
                }
                if (active.length != 1) {
                    for (var i = 0; i < wereActive.length; i++) {
                        wereActive[i].checked = false;
                    }
                }
                if (clicked == true) {
                    clearInterval(interval);
                    document.getElementById(element.button).removeEventListener("click", function () {});

                    succesCallBackfun(findIndex(list, active[0]));
                }
                wereActive = active;
                if (j > time) {
                    if (timeOutFun == true) {
                        document.getElementById(element.button).removeEventListener("click", function () {});

                        timeOutCallBackFun();
                    }
                    clearInterval(interval);
                }
                if (timeFun == true) {
                    document.getElementById(element.button).removeEventListener("click", function () {});
                    timeCallBackFun(j);
                }
                j++;
            }, intervalTime)
        },
        playersMinionMovement: function (virtualBattleField, visualBattleField, owner, acceptButton, timeOut, succesCallBackFunction, timeOutCallBackFunction) {
            if (Array.isArray(virtualBattleField) && typeof visualBattleField == "object" && typeof owner == "string" && typeof acceptButton == "object" && typeof succesCallBackFunction == "function" && typeof timeOut == "number") {

                var location = null;
                var wereSelectedInLocation = null;
                var locationToMove = null;
                var wereSelectedInLocationToMove = null;
                var config = {
                    timeOut: false
                }
                var timeOutTime = 0;

                if (typeof timeOutCallBackFunction == "function") {
                    config.timeOut = true;
                }
                var accept = false;
                acceptButton.addEventListener("click", function () {
                    accept = true;
                });

                function toRemove() {

                    if (this.getAttribute("name") == "unchecked") {
                        if (location == null) {
                            this.setAttribute("name", "checkedID1");
                            this.style.backgroundColor = "red";
                        } else {
                            this.setAttribute("name", "checkedID2");
                            this.style.backgroundColor = "powderblue";
                        }
                    } else {
                        this.setAttribute("name", "unchecked");
                        this.style.backgroundColor = "";
                    }
                }

                for (var i = 0; i < visualBattleField.rows.length; i++) {
                    for (var j = 0; j < visualBattleField.rows[i].cells.length; j++) {
                        visualBattleField.rows[i].cells[j].addEventListener("click", toRemove)
                    }
                }
                var getLocation = function (id) {
                    var cache = [];
                    for (var i = 0; i < visualBattleField.rows.length; i++) {
                        for (var j = 0; j < visualBattleField.rows[i].cells.length; j++) {
                            if (visualBattleField.rows[i].cells[j].getAttribute("name") == id) {
                                //console.log("found");
                                cache.push([i, j]);
                            } else {
                                //console.log(visualBattleField.rows[i].cells[j].name)
                            }
                        }
                    }
                    if (typeof cache[0] == "undefined") {
                        return null;

                    } else {
                        return cache;
                    }
                }
                var controlWatchdog = function (location, locationBefore) {
                    for (var i = 0; i < locationBefore.length; i++) {
                        //alert(locationBefore[i][0] + " " +locationBefore[i][1])
                        visualBattleField.rows[locationBefore[i][0]].cells[locationBefore[i][1]].setAttribute("name", "unchecked")
                        visualBattleField.rows[locationBefore[i][0]].cells[locationBefore[i][1]].style.backgroundColor = "";
                    }
                }
                var interval = setInterval(function () {

                        //console.log(visualBattleField.rows[0].cells[0].name)
                        location = getLocation("checkedID1");
                        locationToMove = getLocation("checkedID2");
                        if (location != null) {
                            if (location.length > 1) {
                                controlWatchdog(location, wereSelectedInLocation);
                            }
                        }
                        if (locationToMove != null) {
                            if (locationToMove.length > 1) {
                                controlWatchdog(locationToMove, wereSelectedInLocationToMove);
                            }
                        }
                        wereSelectedInLocation = location;
                        wereSelectedInLocationToMove = locationToMove;

                        if (accept == true && location != null && locationToMove != null && typeof virtualBattleField[0][location[0][0]][location[0][1]] != "undefined" && typeof virtualBattleField[0][locationToMove[0][0]][locationToMove[0][1]] == "undefined") {
                            for (var i = 0; i < visualBattleField.rows.length; i++) {
                                for (var j = 0; j < visualBattleField.rows[i].cells.length; j++) {
                                    visualBattleField.rows[i].cells[j].setAttribute("name", "unchecked");
                                    visualBattleField.rows[i].cells[j].style.backgroundColor = "";
                                    visualBattleField.rows[i].cells[j].removeEventListener("click", toRemove);
                                }
                            }
                            clearInterval(interval);
                            succesCallBackFunction(location[0], location[0]);
                        } else if (locationToMove != null && location != null) {

                            console.log(typeof virtualBattleField[0][locationToMove[0][0]][locationToMove[0][1]] + " " + typeof virtualBattleField[0][location[0][0]][location[0][1]])
                        }

                        timeOutTime += 1;
                        if (timeOutTime > timeOut) {
                            for (var i = 0; i < visualBattleField.rows.length; i++) {
                                for (var j = 0; j < visualBattleField.rows[i].cells.length; j++) {
                                    visualBattleField.rows[i].cells[j].setAttribute("name", "unchecked");
                                    visualBattleField.rows[i].cells[j].style.backgroundColor = "";
                                    visualBattleField.rows[i].cells[j].removeEventListener("click", toRemove);
                                }
                            }
                            clearInterval(interval);
                            if (config.timeOut == true) {
                                timeOutCallBackFunction();
                            }
                        }


                    },
                    33)
            } else {
                console.log(
                    "Wrong value type"
                );
            }
        },
        cardsByNation: function (nation, cards, nations) {
            if (typeof nations == "object") {
                for (var i = 0; i < nations.length; i++) {
                    if (nations[i].nation == nation) {
                        if (typeof cards == "string") {
                            if (cards == "all") {
                                return nations[i].cards;
                            }
                        } else if (typeof cards == "object") {
                            if (typeof cards[0] == "number") {
                                var toBeReturned = [];
                                for (var j = 0; j < cards.length; j++) {
                                    toBeReturned[j] = nations[i].cards[cards[j]];
                                }
                                return toBeReturned;
                            } else {
                                return "Wrong value type!!! cards[0] " + typeof cards[0];
                            }
                        } else {
                            return "Wrong value type!!! cards " + typeof cards;
                        }
                    }
                }
                return "Nation or cards weren't found..."
            } else {
                return "Wrong value type!!! nations" + typeof nations;
            }
        },
        roundItems: function (player) {

        }
    }
    this.do = {
        createBattlefield: function (dimensions, element, id, widthRow, heightRow, widthCell, heightCell) {
            if (Array.isArray(dimensions) == true && typeof widthRow == "string" && typeof heightRow == "string" && typeof widthCell == "string" && typeof heightCell == "string" && typeof element == "object" && typeof id == "string") {
                var table = document.createElement("table");
                table.setAttribute("id", id);
                for (var i = 0; i < dimensions[0]; i++) {
                    //alert("ahoj")
                    var row;
                    row = table.insertRow(i);
                    row.style.width = widthRow;
                    row.style.height = heightRow;
                    for (var j = 0; j < dimensions[1]; j++) {
                        var cell;
                        //alert("haha")
                        cell = row.insertCell(j);
                        cell.setAttribute("name", "unchecked");
                        cell.style.width = widthCell;
                        cell.style.height = heightCell;
                    }
                }
                element.appendChild(table);
            } else {
                return "Wrong value Type... dimensions have to be Array!!!";
            }
        },
        editVirtualBattleField: function (battleField, arrayOfChanges) {
            if (typeof battleField == "object" && Array.isArray(arrayOfChanges) == true) {
                for (var i = 0; i < arrayOfChanges.length; i++) {
                    battleField[arrayOfChanges[i].location.x][arrayOfChanges[i].location.y] = arrayOfChanges[i].card;
                }
                return battleField;
            } else {
                return "Wrong value Type... virtual BattleField have to be Array!!!";
            }
        }
    }
}

var nations = [{
    nation: "people",
    abilities: {

    },
    cards: [{
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
            "ahoj"
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
var player;
player = newGame.add.player(newGame.get.cardsByNation("people", [0], nations));
/*
console.log(newGame.add.cardsTo(player, newGame.get.cardsByNation("people", "all", nations), document.getElementById("player1")))
console.log(newGame.get.playersCardMove(70, 50, {
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
    }
}]))
*/
newGame.do.createBattlefield([4, 5], document.getElementById("player2"), "is", "100px", "100px", "100px", "100px");
newGame.get.playersMinionMovement(battleField, document.getElementById("is"), "player", document.getElementById("butt"), 500, function () {
    alert("haha")
}, function () {
    alert("hehe")
})
