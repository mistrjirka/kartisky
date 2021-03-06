function copyObj(object) {
    return JSON.parse(JSON.stringify(object));
}

function findIndexOfObject(array, object) {
    for (var i = 0; i < array.length; i++) {
        if (JSON.stringify(object) == JSON.stringify(array[i]))
            return i;
    }
    return null;
}

function findIndex(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (item == array[i])
            return i;
    }
    return null;
}

String.prototype.hashCode = function () {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
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

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
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
        interval = setInterval(function () {
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
var Kartisky = function () {
    var socket;

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

    this.add = {
        player: function (cards, id) {
            if (typeof id == "undefined")
                id = makeid();
            if (typeof cards == "object") {
                return {
                    home: null,
                    id: id,
                    cards: cards,
                    cardPack: [],
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
                    val = val + "<input type='checkbox' class= 'cardsInHand' id = 'card" + i + "'> class: " + cards[i].statistics.class + " damage: " + cards[i].statistics.attack + " life: " + cards[i].statistics.life;
                }
                element.innerHTML = val;
            }
        }
    }

    this.get = {
        playerCardMove: function (time, numberOfCards, cardPlace, acceptButton, cancelButton, player, succesCallBackfun, cancelCallBackFun, timeOutCallBackFun, timeCallBackFun) {
            if (typeof time != "number" || typeof succesCallBackfun != "function" || player.hand.cards.length == 0) {
                return "Wrong value format: interval Time:" + typeof intervalTime + "and have to be number, time: " + typeof time + "and have to be number, element: " + typeof element + "and have to be object/element, Succes CallBack function: " + typeof succesCallBackfun + "and have to be object/function...";
            }
            //configuration
            var timeFun = false;
            if (typeof timeCallBackFun == "function") {
                timeOutFun = true;
            }



            //list part
            var idOfList = makeid().hashCode();
            var classOfCheckbox = makeid();
            var checkboxList = document.createElement("ul");
            var li = document.createElement("li");
            console.log(player.hand.cards);
            for (var i = 0; player.hand.cards.length > i; i++) {
                li.innerHTML = "<input type='checkbox' class= '" + classOfCheckbox + "'>" + player.hand.cards[i].name + " class: " + player.hand.cards[i].statistics.class + " damage: " + player.hand.cards[i].statistics.attack + " life " + player.hand.cards[i].statistics.life;
                checkboxList.appendChild(li);
                li = document.createElement("li");
            }
            cardPlace.appendChild(checkboxList);

            //buttons part
            var accept = false;
            var cancel = false;

            function acceptEvent() { //accept button event lisenter call function
                accept = true;
            }

            function cancelEvent() { //cancel button event lisenter call function
                cancel = true;
            }


            acceptButton.addEventListener("click", acceptEvent);
            cancelButton.addEventListener("click", cancelEvent);

            //initialization
            var wereActive = [];
            var list = document.getElementsByClassName(classOfCheckbox); //todo
            var active = [];

            function removeElement() {
                cardPlace.removeChild(checkboxList);
            }
            //async part
            async (33, time, function () {
                acceptButton.removeEventListener("click", acceptEvent);
                cancelButton.removeEventListener("click", cancelEvent);
                removeElement();
                timeOutCallBackFun();
            }, function (timeTicks) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].checked == true) {
                        active.push(list[i]);
                    }
                }

                function checkActive(ac) {
                    ac.forEach(function (el) {
                        if (el == null) {

                            return false;
                        }
                    });
                    return true;
                }

                if (accept == true && active.length <= numberOfCards && active.length != 0 && checkActive(active) == true) {
                    var toReturn = [];
                    active.forEach(function (el) {
                        toReturn.push(findIndex(list, el));
                    });
                    succesCallBackfun(toReturn);
                    acceptButton.removeEventListener("click", acceptEvent);
                    cancelButton.removeEventListener("click", cancelEvent);
                    removeElement();

                    return true;
                }

                if (cancel == true) {
                    cancelButton.removeEventListener("click", cancelEvent);
                    acceptButton.removeEventListener("click", acceptEvent);
                    removeElement();
                    cancelCallBackFun();
                    return true;
                }

                if (timeFun == true) {
                    timeCallBackFun(timeTicks);
                }

                wereActive = active;
                active = [];
                accept = false;
            });
        },
        playerCardPlacement: function (timeOut, mode, player, virtualBattleField, visualBattleField, acceptButton, cancelButton, succesCallBackFunction, cancelCallbackFunction, timeOutCallbackFunction, stopReturningFunction, notTaboo, timeCallBackFunction) {

            if (typeof mode == "string" && Array.isArray(virtualBattleField) && typeof visualBattleField == "object" && typeof acceptButton == "object" && typeof succesCallBackFunction == "function" && typeof timeOut == "number" && typeof timeOutCallbackFunction == "function") {
                notTaboo = [null];

                var stopTrigger = false;

                function stop() {
                    stopTrigger = true;
                }
                if (typeof stopReturningFunction == "function") {
                    stopReturningFunction(stop);
                }

                var modes = [
                    {
                        type: "top",
                        position: visualBattleField.rows[0],
                        row: 0
                    },
                    {
                        type: "bottom",
                        position: visualBattleField.rows[visualBattleField.rows.length - 1],
                        row: visualBattleField.rows.length - 1
                    }
                ];

                var cancel = false;


                function cancelToRemove() {
                    cancel = true;
                }


                cancelButton.addEventListener("click", cancelToRemove);

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
                                console.log("virtualbattlefield")
                                console.log(virtualBattleField);
                                console.log("modes");
                                console.log(modes);
                                console.log("index");
                                console.log(i + " " + j);
                                console.log("error")
                                console.log(virtualBattleField[modes[i].row][j])

                                if (virtualBattleField[modes[i].row][j].owner != player.id) {
                                    modes[i].position.cells[j].setAttribute("name", "unchecked");
                                    modes[i].position.cells[j].addEventListener("click", toRemove);
                                }

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

                function remove() {
                    for (var i = 0; i < tmp1.position.cells.length; i++) {
                        tmp1.position.cells[i].removeEventListener("click", toRemove);
                        tmp1.position.cells[i].style.backgroundColor = "";
                        tmp1.position.cells[i].setAttribute("name", "unchecked");

                    }
                    acceptButton.removeEventListener("click", toRemove2);
                    cancelButton.removeEventListener("click", cancelToRemove);
                }

                acceptButton.addEventListener("click", toRemove2)
                var position = null;
                var positionHistory = null;

                async (timeOut, 33, function () {
                        remove();
                        timeOutCallbackFunction("time out");
                    },
                    function () {
                        position = getPosition();
                        if (position != null && positionHistory != null) {
                            if (position.length > 1) {
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
                            if (virtualBattleField[row][position[0]].owner != player.id) {
                                for (var i = 0; i < notTaboo.length; i++) {
                                    if (virtualBattleField[row][position[0]].card == notTaboo[i]) {
                                        succesCallBackFunction(position[0], row);
                                        remove();
                                        return true;
                                    }
                                }
                            }
                        }
                        confirmed = false;
                    },
                    function () {
                        if (cancel == true) {
                            cancelCallbackFunction();
                            remove();
                        };
                        if (stopTrigger == true) {
                            remove();
                            return true;
                        }
                    }
                );
            } else {
                console.log(timeOutCallbackFunction)
            }
        },
        playersMinionMovement: function (timeOut, virtualBattleField, visualBattleField, player, acceptButton, cancelButton, everythingCancelButton, succesCallBackFunction, taskDoneCallBackFunction, cancelCallBack, actualCard, timeOutCallBackFunction) {
            if (Array.isArray(virtualBattleField) && typeof visualBattleField == "object" && typeof player == "object" && typeof acceptButton == "object" && typeof succesCallBackFunction == "function" && typeof timeOut == "number") {
                var config = {
                    timeOut: false
                }
                var wereSelectedInLocation = null;
                var locationToMove = null;
                var wereSelectedInLocationToMove = null;
                var timeOutTime = 0;

                if (typeof timeOutCallBackFunction == "function") {
                    config.timeOut = true;
                }
                var accept = false;

                function toRemoveAccept() {
                    accept = true;
                }

                var cancled = false;

                function toRemoveCancel() {
                    cancled = true;
                }

                var cancelEverything = false;

                function toRemoveCancelEverything() {
                    cancelEverything = true;
                }
                everythingCancelButton.addEventListener("click", toRemoveCancelEverything);


                function toRemove2() {
                    if (this.getAttribute("name") == "unchecked") {
                        this.setAttribute("name", "checkedID2");
                        this.style.backgroundColor = "powderblue";

                    } else {
                        this.setAttribute("name", "unchecked");
                        this.style.backgroundColor = "";

                    }
                }

                function remove() {
                    for (var i = 0; i < visualBattleField.rows.length; i++) {
                        for (var j = 0; j < visualBattleField.rows[i].cells.length; j++) {
                            visualBattleField.rows[i].cells[j].setAttribute("name", "unchecked");
                            visualBattleField.rows[i].cells[j].style.backgroundColor = "";
                            visualBattleField.rows[i].cells[j].removeEventListener("click", toRemove2);
                        }
                    }
                    acceptButton.removeEventListener("click", toRemoveAccept);
                    cancelButton.removeEventListener("click", toRemoveCancel);
                    everythingCancelButton.removeEventListener("click", toRemoveCancelEverything);
                    clearInterval(interval);
                }

                function getUserInput(place) {
                    cancled = false;
                    cancelEverything = false;
                    accept = false;
                    acceptButton.addEventListener("click", toRemoveAccept);
                    cancelButton.addEventListener("click", toRemoveCancel);
                    visualBattleField.rows[place[0]].cells[place[1]].setAttribute("style", "background-color: red;");
                    var lu, mu, ru, l, r, ld, md, rd, tmp;
                    if (place[0] != 0 && place[1] != 0) {
                        if (virtualBattleField[place[0] - 1][place[1] - 1].owner == null)
                            lu = [place[0] - 1, place[1] - 1];
                    }
                    if (place[0] != 0) {
                        if (virtualBattleField[place[0] - 1][place[1]].owner == null)
                            mu = [place[0] - 1, place[1]];
                    }
                    if (place[0] != 0 && place[1] != virtualBattleField[0].length - 1) {
                        if (virtualBattleField[place[0] - 1, place[1] + 1])
                            ru = [place[0] - 1, place[1] + 1];
                    }
                    if (place[1] != 0) {
                        if (virtualBattleField[place[0]][place[1] - 1].owner == null)
                            l = [place[0], place[1] - 1];
                    }
                    if (place[1] != virtualBattleField[0].length - 1) {
                        if (virtualBattleField[place[0]][place[1] + 1].owner == null)
                            r = [place[0], place[1] + 1];
                    }
                    if (place[0] != virtualBattleField.length - 1 && place[1] != 0) {
                        if (virtualBattleField[place[0] + 1][place[1] - 1].owner == null)
                            ld = [place[0] + 1, place[1] - 1];
                    }
                    if (place[0] != virtualBattleField.length - 1) {
                        if (virtualBattleField[place[0] + 1][place[1]].owner == null)
                            md = [place[0] + 1, place[1]];
                    }
                    if (place[0] != virtualBattleField.length - 1 && place[1] != virtualBattleField[0].length - 1) {
                        if (virtualBattleField[place[0] + 1][place[1] + 1].owner == null)
                            rd = [place[0] + 1, place[1] + 1];
                    }
                    tmp = [lu, mu, ru, r, l, ld, md, rd];
                    tmp.forEach(function (element, index, array) {
                        if (element != null)
                            visualBattleField.rows[element[0]].cells[element[1]].addEventListener("click", toRemove2);
                    });

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

                    function controlWatchdog(locationBefore) {
                        if (locationBefore != null) {
                            for (var i = 0; i < locationBefore.length; i++) {
                                visualBattleField.rows[locationBefore[i][0]].cells[locationBefore[i][1]].setAttribute("name", "unchecked")
                                visualBattleField.rows[locationBefore[i][0]].cells[locationBefore[i][1]].style.backgroundColor = "";
                            }
                        }
                    }
                    async (33, timeOut, function () {
                        remove();
                        if (config.timeOut == true) {
                            done.doneTask = true;
                            done.count += 1;
                            succesCallBackFunction({
                                from: place,
                                to: null
                            });
                            remove();
                        }
                    }, function () {
                        locationToMove = getLocation("checkedID2");
                        if (locationToMove != null) {
                            if (locationToMove.length > 1) {
                                controlWatchdog(wereSelectedInLocationToMove);
                            }
                        }
                        wereSelectedInLocationToMove = locationToMove;
                        if (locationToMove != null && accept == true) {
                            remove();
                            done.doneTask = true;
                            done.count += 1;
                            succesCallBackFunction({
                                from: place,
                                to: locationToMove[0]
                            });
                            return true;

                        }

                        if (cancled == true) {
                            remove();
                            done.doneTask = true;
                            done.count += 1;
                            succesCallBackFunction({
                                from: place,
                                to: null
                            });
                            return true;
                        }

                        accept = false;
                        timeOutTime += 1;
                    });
                }
                var interval;
                var cardPlaces = [];
                var done = {
                    count: 0,
                    doneTask: true,
                    completed: false
                };
                for (var i = 0; i < visualBattleField.rows.length; i++) {
                    for (var j = 0; j < visualBattleField.rows[i].cells.length; j++) {
                        if (virtualBattleField[i][j].owner == player.id) {
                            cardPlaces.push([i, j]);
                        }
                    }
                }
                if (cardPlaces.length != 0) {
                    async (33, timeOut, function () {
                            remove();
                            timeOutCallBackFunction();
                        },
                        function () {
                            if (done.count == cardPlaces.length) {
                                taskDoneCallBackFunction();
                                remove();
                                done.completed = true;
                                return true;
                            }
                        },
                        function () {
                            if (done.doneTask == true && done.completed == false) {
                                actualCard(cardPlaces[done.count]);
                                getUserInput(cardPlaces[done.count]);
                                done.doneTask = false;
                            }
                        },

                        function () {
                            if (cancelEverything == true) {
                                remove();
                                cancelCallBack();
                                return true;
                            };
                        });
                } else {
                    cancelCallBack("No units to move");
                }
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
                                    toBeReturned[j] = copyObj(nations[i].cards[cards[j]]);
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
                return "Nation or cards weren't found...";
            } else {
                return "Wrong value type!!! nations" + typeof nations;
            }
        },
        battleField: function (length, height) {
            var foo = [];
            for (var i = 0; i < height; i++) {
                foo.push([]);
                for (var j = 0; j < length; j++) {
                    foo[i].push([]);
                }
            }
            foo.forEach(function (subField, index) {
                for (var i = 0; subField.length > i; i++) {
                    subField[i] = {};
                    subField[i].card = null;
                    subField[i].owner = null;
                };
            });
            return foo;
        }
    }
    this.do = {
        removeFromBattleField: function (battleField, toRemove) {
            if (Array.isArray(battleField) && typeof toRemove == "object") {
                if (toRemove.type == "coordinates") {
                    battleField[toRemove.coordinates[1]][toRemove.coordinates[0]].card = null;
                    battleField[toRemove.coordinates[1]][toRemove.coordinates[0]].owner = null;
                    return battleField;

                } else if (toRemove.type == "byCard") {

                }


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
        editVirtualBattleField: function (battleField, arrayOfChanges, player) {
            if (typeof battleField == "object" && Array.isArray(arrayOfChanges) == true && typeof player == "object") {
                for (var i = 0; i < arrayOfChanges.length; i++) {
                    battleField[arrayOfChanges[i].location.y][arrayOfChanges[i].location.x].card = arrayOfChanges[i].card;
                    battleField[arrayOfChanges[i].location.y][arrayOfChanges[i].location.x].owner = player.id;
                }
                return battleField;
            } else {
                return "Wrong value Type... virtual BattleField have to be Array!!!";
            }
        },
        makeCardPack: function (cards) {
            var cardPack = [];
            cards.forEach(function (item, index, arry) {
                var tmp = Math.floor((Math.random() * cards.length) + 0);;
                while (findIndex(cardPack, arry[tmp]) != null) {
                    tmp = Math.floor((Math.random() * cards.length) + 0);
                    if (findIndex(cardPack, arry[tmp]) != null) {

                    }
                }
                cardPack.push(arry[tmp]);
            });
            return copyObj(cardPack);
        },
        virtualToVisual: function (virtualBattlefield, visualBattlefield) {
            virtualBattlefield.forEach(function (element, index, array) {
                element.forEach(function (subElement, subIndex, subArray) {
                    if (subElement.card != null && subElement.owner != null) {
                        visualBattlefield.rows[index].cells[subIndex].innerHTML = "owner: " + subElement.owner + " name: " + subElement.card.name + " class: " + subElement.card.statistics.class + " damage: " + subElement.card.statistics.attack + " health: " + subElement.card.statistics.life;
                    } else {
                        visualBattlefield.rows[index].cells[subIndex].innerHTML = "";
                    }
                });
            });
        },
        attack: function (timeOut, virtualBattleField, visualBattleField, player1, player2, acceptButton, cancelButton, everythingCancelButton, succesCallBackFunction, taskDoneCallBackFunction, cancelCallBack, actualCard, timeOutCallBackFunction) {
            if (Array.isArray(virtualBattleField) && typeof visualBattleField == "object" && typeof player1 == "object" && typeof player2 == "object" && typeof acceptButton == "object" && typeof succesCallBackFunction == "function" && typeof timeOut == "number") {
                var config = {
                    timeOut: false
                }
                var wereSelectedInLocation = null;
                var locationToMove = null;
                var wereSelectedInLocationToMove = null;
                var timeOutTime = 0;

                if (typeof timeOutCallBackFunction == "function") {
                    config.timeOut = true;
                }
                var accept = false;

                function toRemoveAccept() {
                    accept = true;
                }

                var cancled = false;

                function toRemoveCancel() {
                    cancled = true;
                }

                var cancelEverything = false;

                function toRemoveCancelEverything() {
                    cancelEverything = true;
                }
                everythingCancelButton.addEventListener("click", toRemoveCancelEverything);


                function toRemove2() {
                    if (this.getAttribute("name") == "unchecked") {
                        this.setAttribute("name", "checkedID2");
                        this.style.backgroundColor = "powderblue";

                    } else {
                        this.setAttribute("name", "unchecked");
                        this.style.backgroundColor = "";

                    }
                }

                function remove() {
                    for (var i = 0; i < visualBattleField.rows.length; i++) {
                        for (var j = 0; j < visualBattleField.rows[i].cells.length; j++) {
                            visualBattleField.rows[i].cells[j].setAttribute("name", "unchecked");
                            visualBattleField.rows[i].cells[j].style.backgroundColor = "";
                            visualBattleField.rows[i].cells[j].removeEventListener("click", toRemove2);
                        }
                    }
                    acceptButton.removeEventListener("click", toRemoveAccept);
                    cancelButton.removeEventListener("click", toRemoveCancel);
                    everythingCancelButton.removeEventListener("click", toRemoveCancelEverything);
                }

                function getUserInput(place) {
                    console.log("this is place");
                    console.log(place);
                    cancled = false;
                    accept = false;
                    acceptButton.addEventListener("click", toRemoveAccept);
                    cancelButton.addEventListener("click", toRemoveCancel);
                    visualBattleField.rows[place[0]].cells[place[1]].setAttribute("style", "background-color: red;");
                    var lu, mu, ru, l, r, ld, md, rd, tmp;
                    if (place[0] != 0 && place[1] != 0) {
                        if (virtualBattleField[place[0] - 1][place[1] - 1].owner == player2.id)
                            lu = [place[0] - 1, place[1] - 1];
                    }
                    if (place[0] != 0) {
                        if (virtualBattleField[place[0] - 1][place[1]].owner == player2.id)
                            mu = [place[0] - 1, place[1]];
                    }
                    if (place[0] != 0 && place[1] != virtualBattleField[0].length - 1) {
                        if (virtualBattleField[place[0] - 1][place[1] + 1].owner == player2.id)
                            ru = [place[0] - 1, place[1] + 1];
                    }
                    if (place[1] != 0) {
                        if (virtualBattleField[place[0]][place[1] - 1].owner == player2.id)
                            l = [place[0], place[1] - 1];
                    }
                    if (place[1] != virtualBattleField[0].length - 1) {
                        if (virtualBattleField[place[0]][place[1] + 1].owner == player2.id)
                            r = [place[0], place[1] + 1];
                    }
                    if (place[0] != virtualBattleField.length - 1 && place[1] != 0) {
                        if (virtualBattleField[place[0] + 1][place[1] - 1].owner == player2.id)
                            ld = [place[0] + 1, place[1] - 1];
                    }
                    if (place[0] != virtualBattleField.length - 1) {
                        if (virtualBattleField[place[0] + 1][place[1]].owner == player2.id)
                            md = [place[0] + 1, place[1]];
                    }
                    if (place[0] != virtualBattleField.length - 1 && place[1] != virtualBattleField[0].length - 1) {
                        if (virtualBattleField[place[0] + 1][place[1] + 1].owner == player2.id)
                            rd = [place[0] + 1, place[1] + 1];
                    }
                    tmp = [lu, mu, ru, r, l, ld, md, rd];
                    var nullCounter = 0;
                    tmp.forEach(function (element, index, array) {
                        if (element != null) {
                            visualBattleField.rows[element[0]].cells[element[1]].addEventListener("click", toRemove2);
                        } else {
                            nullCounter += 1;
                        };
                    });

                    function getLocation(id) {
                        var cache = [];
                        for (var i = 0; i < visualBattleField.rows.length; i++) {
                            for (var j = 0; j < visualBattleField.rows[i].cells.length; j++) {
                                if (visualBattleField.rows[i].cells[j].getAttribute("name") == id) {
                                    cache.push([i, j]);
                                }
                            }
                        }
                        if (typeof cache[0] == "undefined") {
                            return null;

                        } else {
                            return cache;
                        }
                    }

                    function controlWatchdog(locationBefore) {
                        if (locationBefore != null) {
                            for (var i = 0; i < locationBefore.length; i++) {
                                visualBattleField.rows[locationBefore[i][0]].cells[locationBefore[i][1]].setAttribute("name", "unchecked")
                                visualBattleField.rows[locationBefore[i][0]].cells[locationBefore[i][1]].style.backgroundColor = "";
                            }
                        }
                    }
                    async (33, timeOut, function () {
                        remove();
                        if (config.timeOut == true) {
                            done.doneTask = true;
                            done.count += 1;
                            succesCallBackFunction({
                                from: place,
                                to: null
                            });
                            remove();
                        }
                    }, function () {
                        locationToMove = getLocation("checkedID2");
                        if (locationToMove != null) {
                            if (locationToMove.length > 1) {
                                controlWatchdog(wereSelectedInLocationToMove);
                            }
                        }
                        wereSelectedInLocationToMove = locationToMove;
                        if (locationToMove != null && accept == true) {
                            remove();
                            done.doneTask = true;
                            done.count += 1;
                            succesCallBackFunction({
                                from: place,
                                to: locationToMove[0]
                            });
                            return true;

                        }

                        if (cancled == true) {
                            remove();
                            done.doneTask = true;
                            done.count += 1;
                            succesCallBackFunction({
                                from: place,
                                to: null
                            });
                            return true;
                        }

                        accept = false;
                        timeOutTime += 1;
                    });
                }
                var cardPlaces = [];
                var done = {
                    count: 0,
                    doneTask: true
                };
                for (var i = 0; i < visualBattleField.rows.length; i++) {
                    for (var j = 0; j < visualBattleField.rows[i].cells.length; j++) {
                        if (virtualBattleField[i][j].owner == player1.id) {
                            cardPlaces.push([i, j]);
                        }
                    }
                }
                if (cardPlaces.length != 0) {
                    async (33, timeOut, function () {
                            remove();
                            timeOutCallBackFunction();
                        },
                        function () {
                            if (done.count == cardPlaces.length) {
                                taskDoneCallBackFunction();
                                return true;
                            }
                        },
                        function () {
                            if (done.doneTask == true && done.count != cardPlaces.length) {
                                actualCard(cardPlaces[done.count]);
                                getUserInput(cardPlaces[done.count]);
                                done.doneTask = false;
                            }
                        },

                        function () {
                            if (cancelEverything == true) {
                                remove();
                                cancelCallBack();
                                return true;
                            };
                        });
                } else {
                    cancelCallBack("No units to move");
                }
            } else {
                console.log(
                    "Wrong value type"
                );
            }
        },
        checkForAction: function (battlefield, player) {
            var bar = 0;
            battlefield.forEach(function (element, index, array) {
                element.forEach(function (subElement, subIndex) {
                    if (subElement.owner == player.id) {
                        bar++;
                    }
                });
            });
            return bar;
        }
    }

    this.multiplayer = {
        init: function (adress, callback) {
            if (typeof adress == "string") {
                $.getScript(adress, function () {
                    socket = io();
                    callback();
                });
            } else if (typeof adress == "object") {
                socket = adress;
                callback();
            }
        },

        loginSetup: function () {
            socket.emit("authentification", {
                id: getCookie("id")
            });
        },

        start: function (callBack) {
            socket.on("init", function (data) {
                console.log(data);
                callBack(data);
            });
        },

        playerDataSync: function (player, callback) {
            socket.emit("info", player);
            socket.on("enemy", callback);
        },

        turn: function (callback) {
            socket.on("turn", callback);
        },

        endOfTurn: function (player, battleField) {
            socket.emit("end", {
                player: player,
                battlefield: battleField
            });
        }
    }
}
