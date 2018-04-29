function findIndex(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (item == array[i]) {
            return i;
        }
    }
    return null;
}

function async ( /**/ ) {
    var interval;
    var time;
    var timeOutCallBack;
    var args = arguments;
    if (typeof args[0] == "number" && typeof args[1] == "number" && typeof args[2] == "function") {
        time = args[0];
        interval = args[1]
        timeOutCallBack = args[2]
        var timeWatchdog = 0;
        var interval = setInterval(function () {
            for (var i = 0; i < args.length; i++) {
                if (i != 0 && i != 1 && i != 2) {
                    if (typeof args[i] == "function") {
                        if (args[i](timeWatchdog) == true) {
                            clearInterval(interval);
                        }
                    }
                }
            }

            if (time <= timeWatchdog) {
                clearInterval(interval);
                timeOutCallBack();
            } else {
                timeWatchdog = timeWatchdog + 1;
            }
        }, interval)
    } else {
        console.error("wrong arguments")
    }

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
        playerDisplayCards: function () {

        },
        playerCardMove: function (time, element, succesCallBackfun, timeOutCallBackFun, timeCallBackFun) {
            if (typeof intervalTime != "number" && typeof time != "number" && typeof element != "object" && typeof succesCallBackfun == "function") {
                return "Wrong value format: interval Time:" + typeof intervalTime + "and have to be number, time: " + typeof time + "and have to be number, element: " + typeof element + "and have to be object/element, Succes CallBack function: " + typeof succesCallBackfun + "and have to be object/function...";
            }

            function toRemove() { //todo
                clicked = true;
            }
            var clicked = false;
            document.getElementById(element.button).addEventListener("click", toRemove);
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
            var list = document.getElementsByClassName(element.class); //todo
            var active = [];
            var interval = setInterval(function () {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].checked == true) {
                        active.push(list[i]);
                    }
                }
                if (active.length != 1) {
                    for (var i = 0; i < wereActive.length; i++) {
                        wereActive[i].checked = false;
                    }
                }
                if (clicked == true) {
                    clearInterval(interval);
                    document.getElementById(element.button).removeEventListener("click", toRemove);
                    succesCallBackfun(findIndex(list, active[0]));
                }
                wereActive = active;
                if (j > time) {
                    if (timeOutFun == true) {
                        document.getElementById(element.button).removeEventListener("click", toRemove);
                        timeOutCallBackFun();
                    }
                    clearInterval(interval);
                }
                if (timeFun == true) {
                    document.getElementById(element.button).removeEventListener("click", toRemove);
                    timeCallBackFun(j);
                }
                j++;
            }, 33)
        },
        playerCardPlacement: function (mode, virtualBattleField, visualBattleField, owner, acceptButton, timeOut, succesCallBackFunction, timeOutCallBackFunction, notTaboo = [null], timeCallBackFunction) {
            if (typeof mode == "string" && Array.isArray(virtualBattleField) && typeof visualBattleField == "object" && typeof owner == "string" && typeof acceptButton == "object" && typeof succesCallBackFunction == "function" && typeof timeOut == "number" && typeof timeOutCallBackFunction == "function") {
                var modes = [
                    {
                        type: "top",
                        position: visualBattleField.rows[0],
                        row: 0
                    },
                    {
                        type: "bottom",
                        position: visualBattleField.rows[visualBattleField.rows.length - 1],
                        row: visualBattleField.rows[visualBattleField.rows.length - 1]
                    }
                ];

                function toRemove() {
                    if (this.getAttribute("name") == "unchecked") {
                        this.setAttribute("name", "checked");
                        this.style.backgroundColor = "red";
                    } else {
                        this.setAttribute("name", "unchecked");
                        this.style.backgroundColor = "";
                    }
                }

                function doByMode(modes, mode) {
                    for (var i = 0; modes.length > i; i++) {
                        if (modes[i].type == mode) {
                            for (var j = 0; modes[i].position.cells.length > j; j++) {
                                modes[i].position.cells[j].setAttribute("name", "unchecked")
                                modes[i].position.cells[j].addEventListener("click", toRemove)

                            }
                            return modes[i];
                        }
                    }
                }
                var tmp1 = doByMode(modes, mode);

                function getPosition() {
                    var tmp2 = [];

                    for (var i = 0; i < tmp1.position.cells.length; i++) {
                        if (tmp1.position.cells[i].getAttribute("name") == "checked") {
                            tmp2.push(i);
                        }
                    }
                    return tmp2;
                }

                var confirmed = false;

                function toRemove2() {
                    confirmed = true;
                }
                acceptButton.addEventListener("click", toRemove2)
                var position = null;
                var positionHistory = null;
                async (timeOut, 33, function () {
                        for (var i = 0; i < tmp1.position.cells.length; i++) {
                            tmp1.position.cells[i].removeEventListener("click", toRemove);
                            acceptButton.removeEventListener("click", toRemove2);
                            tmp1.position.cells[i].style.backgroundColor = "";
                            tmp1.position.cells[i].setAttribute("name", "unchecked");

                        }
                        timeOutCallBackFunction();
                    },
                    function () {
                        position = getPosition();
                        if (position != null && positionHistory != null) {
                            if (position.length > 1) {
                                console.log(positionHistory[0])
                                tmp1.position.cells[positionHistory[0]].setAttribute("name", "unchecked");
                                tmp1.position.cells[positionHistory[0]].style.backgroundColor = "";
                            }
                        }
                        positionHistory = position;
                    },
                    function (a) {
                        if (typeof timeCallBackFunction == "function") {
                            timeCallBackFunction(a);
                        }
                    },
                    function () {
                        if (position.length == 1 && confirmed == true) {
                            var row = 0;
                            for (var i = 0; modes.length > i; i++) {
                                if (modes[i].type == mode) {
                                    row = modes[i].row;
                                }
                            }
                            for (var i = 0; i < notTaboo.length; i++) {
                                if (virtualBattleField[row][position[0]].card == notTaboo[i]) {
                                    succesCallBackFunction(position[0]);
                                    for (var j = 0; j < tmp1.position.cells.length; j++) {
                                        tmp1.position.cells[j].removeEventListener("click", toRemove);
                                        acceptButton.removeEventListener("click", toRemove2);
                                        tmp1.position.cells[j].style.backgroundColor = "";
                                        tmp1.position.cells[j].setAttribute("name", "unchecked");

                                    }
                                    return true;
                                }
                            }
                        }
                    }
                )
            }
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
                                cache.push([i, j]);
                            } else {}
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
                        visualBattleField.rows[locationBefore[i][0]].cells[locationBefore[i][1]].setAttribute("name", "unchecked")
                        visualBattleField.rows[locationBefore[i][0]].cells[locationBefore[i][1]].style.backgroundColor = "";
                    }
                }
                var interval = setInterval(function () {
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
                        if (accept == true && location != null && locationToMove != null && virtualBattleField[location[0][0]][location[0][1]].card != null && virtualBattleField[locationToMove[0][0]][locationToMove[0][1]].cards == null) {
                            for (var i = 0; i < visualBattleField.rows.length; i++) {
                                for (var j = 0; j < visualBattleField.rows[i].cells.length; j++) {
                                    visualBattleField.rows[i].cells[j].setAttribute("name", "unchecked");
                                    visualBattleField.rows[i].cells[j].style.backgroundColor = "";
                                    visualBattleField.rows[i].cells[j].removeEventListener("click", toRemove);
                                }
                            }
                            clearInterval(interval);
                            succesCallBackFunction(location[0], locationToMove[0]);
                        } else if (locationToMove != null && location != null) {
                            console.log(virtualBattleField[location[0][0]][location[0][1]].card)
                        }
                        accept = false;
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
        removeFromBattleField: function (battleField, toRemove) {
            if (Array.isArray(battleField) && typeof toRemove == "object") {
                if (toRemove.type == "coordinates") {
                    battleField[toRemove.coordinates[0]][toRemove.coordinates[1]].card = null;
                    battleField[toRemove.coordinates[0]][toRemove.coordinates[1]].owner = null;
                    return battleField;
                } else if (toRemove.type == "byCard") {

                }


            } else {
                return battleField;
            }
        },
        addToBattleField: function (battleField, toAdd) {
            if (Array.isArray(battleField) && typeof toAdd == "object") {
                battleField[toAdd.coordinates[0]][toAdd.coordinates[1]].card = toAdd.card;
                battleField[toAdd.coordinates[0]][toAdd.coordinates[1]].owner = toAdd.owner;
            } else {
                return battleField;
            }
        },
        formatVirtualBattlefield: function (battleField) {
            battleField.forEach(function (subField, index) {
                for (var i = 0; subField.length > i; i++) {
                    subField[i] = {};
                    subField[i].card = null;
                    subField[i].owner = null;
                };
            });
            return battleField;
        },
        createBattlefield: function (dimensions, element, id, widthRow, heightRow, widthCell, heightCell) {
            if (Array.isArray(dimensions) == true && typeof widthRow == "string" && typeof heightRow == "string" && typeof widthCell == "string" && typeof heightCell == "string" && typeof element == "object" && typeof id == "string") {
                var table = document.createElement("table");
                table.setAttribute("id", id);
                for (var i = 0; i < dimensions[0]; i++) {
                    var row;
                    row = table.insertRow(i);
                    row.style.width = widthRow;
                    row.style.height = heightRow;
                    for (var j = 0; j < dimensions[1]; j++) {
                        var cell;
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
        },
        attack: function (virtualBattlefield, visualBattleField, playerAttacker, playerSacrifice, timeOutTime, succesFunction, timeOutFunction, timeFunction) {
            if (typeof playerAttacker == "string" && typeof playerSacrifice == "string" && Array.isArray(virtualBattlefield) == true && typeof visualBattleField == "object" && typeof timeOutTime == "number" && typeof succesFunction == "function" && typeof timeOutFunction == "function") {
                function toRemove1() {
                    if (this.getAttribute("name") == "checkedID1") {
                        this.setAttribute("name", "unchecked");
                        this.style.backgroundColor = "";
                    } else {
                        this.style.backgroundColor = "red";
                        this.setAttribute("name", "checkedID1");
                    }
                }

                function toRemove2() {
                    if (this.getAttribute("name") == "checkedID2") {
                        this.setAttribute("name", "unchecked");
                        this.style.backgroundColor = "";
                    } else {
                        this.style.backgroundColor = "powderblue";
                        this.setAttribute("name", "checkedID2");
                    }
                }
                for (var i = 0; i < virtualBattlefield.length; i++) {
                    for (var j = 0; j < virtualBattlefield[i].length; j++) {
                        visualBattleField.rows[i].cells[j].setAttribute("name", "unchecked");
                        if (virtualBattlefield[i][j].owner == playerAttacker) {
                            visualBattleField.rows[i].cells[j].addEventListener("click", toRemove1);
                        }
                        if (virtualBattlefield[i][j].owner == playerSacrifice) {
                            visualBattleField.rows[i].cells[j].addEventListener("click", toRemove2);
                        }
                    }
                }

                function getLocation(id) {
                    var cache = [];
                    for (var i = 0; i < visualBattleField.rows.length; i++) {
                        for (var j = 0; j < visualBattleField.rows[i].cells.length; j++) {
                            if (visualBattleField.rows[i].cells[j].getAttribute("name") == id) {
                                cache.push([i, j]);
                            } else {}
                        }
                    }
                    if (typeof cache[0] == "undefined") {
                        return null;

                    } else {
                        return cache;
                    }
                }
                var positionAttacker = null;
                var positionSacrifice = null;
                var positionAttackerHistory = null;
                var positionSacrificeHistory = null;
                async (1000, 33, function () {
                    for (var i = 0; i < virtualBattlefield.length; i++) {
                        for (var j = 0; j < virtualBattlefield[i].length; j++) {
                            if (virtualBattlefield[i][j].owner == playerAttacker) {
                                visualBattleField.rows[i].cells[j].removeEventListener("click", toRemove1);
                                visualBattleField.rows[i].cells[j].setAttribute("name", "unchecked");
                                visualBattleField.rows[i].cells[j].style.backgroundColor = "";
                            }
                            if (virtualBattlefield[i][j].owner == playerSacrifice) {
                                visualBattleField.rows[i].cells[j].removeEventListener("click", toRemove2);
                                visualBattleField.rows[i].cells[j].setAttribute("name", "unchecked");
                                visualBattleField.rows[i].cells[j].style.backgroundColor = "";
                            }
                        }
                    }
                    timeOutFunction();
                }, function () {
                    positionAttacker = getLocation("checkedID1");
                    positionSacrifice = getLocation("checkedID2");

                    if (positionAttacker != null) {
                        if (positionAttacker.length > 1) {
                            for (var i = 0; i < positionAttackerHistory.length; i++) {
                                console.log(positionAttackerHistory[0][0], positionAttackerHistory[0][1]);
                                visualBattleField.rows[positionAttackerHistory[0][0]].cells[positionAttackerHistory[0][1]].setAttribute("name", "unchecked");
                                visualBattleField.rows[positionAttackerHistory[0][0]].cells[positionAttackerHistory[0][1]].style.backgroundColor = "";
                            }
                        }
                    }
                    if (positionSacrifice != null) {
                        if (positionSacrifice.length > 1) {
                            for (var i = 0; i < positionSacrificeHistory.length; i++) {
                                console.log(positionSacrificeHistory[0][0], positionSacrificeHistory[0][1])
                                visualBattleField.rows[positionSacrificeHistory[0][0]].cells[positionSacrificeHistory[0][1]].setAttribute("name", "unchecked");
                                visualBattleField.rows[positionSacrificeHistory[0][0]].cells[positionSacrificeHistory[0][1]].style.backgroundColor = "";
                            }
                        }
                    }

                    positionAttackerHistory = positionAttacker;
                    positionSacrificeHistory = positionSacrifice;
                });
            }
        }
    }
}
