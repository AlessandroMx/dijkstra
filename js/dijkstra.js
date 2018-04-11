window.addEventListener("load", function () {
    $('#button-play').click(function () {

        // Remove previous canvas
        $('#canvas').remove();
        $('#canvas-container').append('<canvas id="canvas" width="640" height="420"></canvas>');

        // Enable add node button
        $('#button-add-node').prop('disabled', false);

        // Start main logic
        main();

    });
});


class Node {

    constructor(id, x, y, ctx, neighbors) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.neighbors = neighbors || [];
    }

    draw() {

        // Draw the text (Node's ID)
        this.ctx.font = 'Open Sans';
        this.ctx.fillStyle = "#999999";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.id, this.x, this.y);

        // Draw the circle around the Node's ID
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y - 4, 15, 0, Math.PI * 2, false);
        this.ctx.strokeStyle = '#999999';
        this.ctx.stroke();

        // If neighbors, draw their relation
        for (let neighbor in this.neighbors) {
            // Draw the line between two nodes
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(this.neighbors[neighbor][0].x, this.neighbors[neighbor][0].y);
            this.ctx.strokeStyle = '#999999';
            this.ctx.stroke();
            // Draw the weight of this route if weight is defined
            if (this.neighbors[neighbor][1] >= 1) {
                this.ctx.font = 'Open Sans';
                this.ctx.fillStyle = "#000000";
                this.ctx.textAlign = 'center';
                let tmpPos = bestPosForText(this.x, this.y, this.neighbors[neighbor][0].x, this.neighbors[neighbor][0].y);
                this.ctx.fillText(this.neighbors[neighbor][1], tmpPos[0], tmpPos[1]);
            }
        }

    }

}

let modes = {
    addNodes: true,
    remNodes: false,
    addRoutes: false,
    remRoutes: false,
    dijkstra: false
};

let main = function () {

    // Disabled buttons
    disableButtons();

    // Set initial modes' values and button
    setMode('addNodes');
    setButtonsToSecondary();
    $('#button-add-node').removeClass('uk-button-secondary');
    $('#button-add-node').addClass('uk-button-danger');

    // Instantiate canvas and context
    let canvas = document.querySelector('#canvas');
    let ctx = canvas.getContext('2d');

    // Canvas width and height
    canvas.width = $('#canvas').parent().width();

    // Canvas properties
    let canvasLeft = getOffsetLeft(canvas);
    let canvasTop = canvas.offsetTop;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set Nodes, Routes and Others...
    let nodeCnt = 0;
    let nodeLetter = 'A';
    let nodeArray = [];
    let routeCnt = 0;
    let routeArray = [];
    let numClicks = 1;
    let node1 = -1;
    let node2 = -1;

    // Be aware of window resize
    window.addEventListener('resize', function (e) {
        canvasLeft = getOffsetLeft(canvas);
        canvasTop = canvas.offsetTop;
    });

    // Be aware of clicks
    canvas.addEventListener('click', function (e) {

        let clickX = e.pageX - canvasLeft;
        let clickY = e.pageY - canvasTop;

        if (modes.addNodes) {

            nodeCnt += 1;

            let tmpNode = new Node(nodeLetter, clickX, clickY, ctx);

            nodeLetter = nodeLetter.substring(0, nodeLetter.length - 1) + String.fromCharCode(nodeLetter.charCodeAt(nodeLetter.length - 1) + 1);

            nodeArray.push(tmpNode);

        } else if (modes.remNodes) {

            for (let node in nodeArray) {

                let tmpX = nodeArray[node].x;
                let tmpY = nodeArray[node].y;

                if (clickX <= tmpX + 15 && clickX >= tmpX - 15) {
                    if (clickY <= tmpY + 15 && clickY >= tmpY - 15) {
                        nodeArray.splice(node, 1);
                        nodeCnt -= 1;
                    }
                }

            }

        } else if (modes.addRoutes) {

            for (let node in nodeArray) {

                let tmpX = nodeArray[node].x;
                let tmpY = nodeArray[node].y;

                if (clickX <= tmpX + 15 && clickX >= tmpX - 15) {
                    if (clickY <= tmpY + 15 && clickY >= tmpY - 15) {
                        if (numClicks % 2 == 1) {
                            node1 = node;
                        } else {
                            node2 = node;
                            UIkit.modal.prompt('Peso de la ruta:', '1').then(function (w) {
                                nodeArray[node1].neighbors.push([nodeArray[node2], w]);
                                nodeArray[node2].neighbors.push([nodeArray[node1], w]);
                                routeCnt += 1;
                                // Update Canvas if weight has been set
                                updateCanvas(ctx, nodeArray);
                                // Enable required buttons
                                enableRequiredButtons(nodeCnt, routeCnt);
                                // Check current state of nodes' routes
                                // verifyNodeRoutes(nodeArray);
                            });
                        }
                        numClicks += 1;
                    }
                }

            }

        } else if (modes.dijkstra) {

            for (let node in nodeArray) {

                let tmpX = nodeArray[node].x;
                let tmpY = nodeArray[node].y;

                if (clickX <= tmpX + 15 && clickX >= tmpX - 15) {
                    if (clickY <= tmpY + 15 && clickY >= tmpY - 15) {
                        if (numClicks % 2 == 1) {
                            node1 = node;
                        } else {
                            node2 = node;
                            /* let route = dijkstra(node1, node2, nodeArray);
                            let msgRoute = '';
                            for (let r in route) {
                                msgRoute += route[r].id + ', ';
                            }
                            msgRoute = msgRoute.substring(0, msgRoute.length - 2);
                            let msg = 'La mejor ruta del nodo ' + nodeArray[node1].id + ' al nodo ' + nodeArray[node2].id + ' es : \n' + msgRoute;
                            UIkit.modal.alert(msg); */
                            
                            // executeDFT(node1, node2, nodeArray);



                        }
                        numClicks += 1;
                    }
                }

            }
        }

        // Enable required buttons
        enableRequiredButtons(nodeCnt, routeCnt);

        // Update Canvas if it has been clicked
        updateCanvas(ctx, nodeArray);

    });

    // Check if any button has been clicked
    checkClickedButton();

}

// TODO: Function to check and set the classes to all the buttons
let setToRequiredStyleButtons = function () {
    desiredMode = '';
    for (mode in modes) {
        if (modes[mode]) desiredMode = mode;
    }
}

// Enable all necessary buttons according to the number of nodes and their routes
let enableRequiredButtons = function (nodeCnt, routeCnt) {
    disableButtons();
    if (nodeCnt > 0) $('#button-rem-node').prop('disabled', false);
    if (nodeCnt > 1) $('#button-add-route').prop('disabled', false);
    if (routeCnt > 0) {
        $('#button-rem-route').prop('disabled', false);
        $('#button-dijkstra').prop('disabled', false);
    }
}

// Check which button has been clicked to set the mode
let checkClickedButton = function () {
    $('#container-buttons').find('button').click(function () {
        setButtonsToSecondary();
        $(this).toggleClass('uk-button-secondary');
        $(this).toggleClass('uk-button-danger');
        setMode($(this).val());
    });
}

// Set all buttons' classes to 'uk-button-secondary'
let setButtonsToSecondary = function () {
    $('#container-buttons').find('button').each(function () {
        $(this).removeClass('uk-button-danger');
        $(this).removeClass('uk-button-secondary');
        $(this).addClass('uk-button-secondary');
    });
}

// Set the mode of the click according to the option clicked
let setMode = function (inpMode) {
    for (let mode in modes) {
        modes[mode] = false;
    }
    modes[inpMode] = true;
}

// Update canvas
let updateCanvas = function (ctx, nodeArray) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let node in nodeArray) {
        nodeArray[node].draw();
    }
}

// Another approach and related functions
let findAllPaths = function(graph, start, end, path) {
    path = path != undefined ? path.push(start) : [];
    if (start == end) {
        return path;
    }
    if  (!(start in graph)) return []
    let paths = [];
    for (let node in graph[start]) {
        if (!path.includes(node)) {
            let newPaths = findAllPaths(graph, node, end, path);
            for (let newPath of newPaths) {
                paths.push(newPath);
            }
        }
    }
    return paths;
}

let searchInList = function(search, list) {
    for (let item of list) {
        if (item == search) return true;
    }
    return false;
}

paths = findAllPaths(graph, 'A', 'J');

// Depth First Traversal Algorithm and related functions
let executeDFT = function (startingNode, endingNode, nodeArray) {
    let stack = [nodeArray[startingNode]];
    let visited = [nodeArray[startingNode]];
    let paths = [];
    while (stack.length > 0) {
        let nextNeighbor = getNextNeighbor(stack[stack.length - 1], visited);
        if (nextNeighbor != null) {
            visited.push(nextNeighbor);
            stack.push(nextNeighbor);
            if (nextNeighbor == nodeArray[endingNode]) {
                let tmpList = [];
                for (let ind in stack) {
                    tmpList.push(stack[ind]);
                }
                paths.push(tmpList);
            }
        } else {
            stack.pop();
        }
    }
    console.log('Paths: ');
    console.log(paths);
    return paths;
}

let getNextNeighbor = function (node, visited) {
    let minLetter = "Z";
    let curNode = null;
    for (let n in node.neighbors) {
        if (!nodeHasBeenVisisted(node.neighbors[n][0], visited)) {
            if (node.neighbors[n][0].id < minLetter) {
                minLetter = node.neighbors[n][0].id;
                curNode = node.neighbors[n][0];
            }
        }
    }
    return curNode;
}

let nodeHasBeenVisisted = function(node, visited) {
    for (let v in visited) {
        if (visited[v] == node) return true;
    }
    return false;
}

// Dijkstra algorithm and related functions
let dijkstra = function (startingNode, endingNode, nodeArray) {
    let visited = [];
    let unvisited = createUnvisited(nodeArray);
    let table = createTable(nodeArray, startingNode);
    let currentNode = nodeArray[startingNode];
    while(unvisited.length > 0) {
        let nextNode = checkForSmallestCost(table, visited);
        visited.push(currentNode);
        unvisited.splice(currentNode, 1);
        updateTableCurrent(nextNode, table);
        currentNode = nextNode;
    }
    // Get road from table variable...
    let road = getRoad(table, startingNode, endingNode, nodeArray);
    return road.reverse();
}

let createUnvisited = function(nodeArray) {
    let tmpList = [];
    for (let node in nodeArray) {
        tmpList.push(nodeArray[node]);
    }
    return tmpList;
}

let createTable = function (nodeArray, startingNode) {
    let tmpList = [];
    for (let node in nodeArray) {
        let subTmpList = [nodeArray[node], startingNode[node] == startingNode ? 0 : Infinity, startingNode[node] == startingNode ? null : undefined, startingNode[node] == startingNode ? true : false];
        tmpList.push(subTmpList);
    }
    return tmpList;
}

let checkForSmallestCost = function (table, visited) {
    let minCost = Infinity;
    let minNode = null;
    let currentRow = getCurrent(table);
    let neighborsList = currentRow[0].neighbors;
    for (let n in neighborsList) {
        let currentCost = parseInt(neighborsList[n][1]) + parseInt(currentRow[1]);
        let curNode = neighborsList[n][0];
        if (currentCost < minCost && !visited.includes(curNode)) {
            minCost = currentCost;
            minNode = curNode;
        }
        updateTable(curNode, table, currentCost, currentRow[0]);
    }
    return minNode;
}

let getRowTable = function(node, table) {
    for (let row in table) {
        if (table[row][0] == node) {
            return table[row];
        }
    }
}

let getCurrent = function (table) {
    for (let row in table) {
        if (table[row][3] == true) {
            return table[row];
        }
    }
}

let markAsCurrent = function (node, table) {
    for (let row in table) {
        if (table[row][0] == node) {
            table[row][3] = true;
        }
    }
    return table
}

let updateUnvisited = function (node, unvisited) {
    unvisited.splice(node, 1);
    return unvisited;
}

let updateTable = function (node, table, minCost, prevNode) {
    for (let row in table) {
        if (table[row][0] == node) {
            if (table[row][1] > minCost) {
                table[row][1] = minCost;
                table[row][2] = prevNode;
            }
        }
    }
}

let updateTableCurrent = function (node, table) {
    for (let row in table) {
        table[row][3] = false;
        if (table[row][0] == node) {
            table[row][3] = true;
        }
    }
}

let getRoad = function (table, startingNode, endingNode, nodeArray) {
    let route = [];
    let curRow = getRowTable(nodeArray[endingNode], table);
    while (curRow[0] != nodeArray[startingNode]) {
        route.push(curRow[0]);
        curRow = getRowTable(curRow[2], table);
    }
    route.push(curRow[0]);
    return route;
}

// Util functions
let getOffsetLeft = function (elem) {
    var offsetLeft = 0;
    do {
        if (!isNaN(elem.offsetLeft)) {
            offsetLeft += elem.offsetLeft;
        }
    } while (elem = elem.offsetParent);
    return offsetLeft;
}

let disableButtons = function () {
    $('#button-rem-node').prop('disabled', true);
    $('#button-add-route').prop('disabled', true);
    $('#button-rem-route').prop('disabled', true);
    $('#button-dijkstra').prop('disabled', true);
}

let getMidPoint = function (x1, y1, x2, y2) {
    return [((x1 + x2) / 2), ((y1 + y2) / 2)];
}

let bestPosForText = function (x1, y1, x2, y2) {
    tmpRes = getMidPoint(x1, y1, x2, y2);
    let m = (y2 - y1) / (x2 - x1);
    let rad = Math.atan(m);
    tmpRes.push(rad);
    return tmpRes;
}

let toRadians = function (angle) {
    return angle * (Math.PI / 180);
}

let verifyNodeRoutes = function (nodeArray) {
    for (node in nodeArray) {
        console.log('---  ---  ---  ---  ---  ---  ---');
        console.log(nodeArray[node].id);
        console.log(nodeArray[node].neighbors);
    }
}