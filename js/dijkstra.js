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
                this.ctx.fillStyle = "#999999";
                this.ctx.textAlign = 'center';
                let tmpPos = bestPosForText(this.x, this.y, this.neighbors[neighbor][0].x, this.neighbors[neighbor][0].y);
                this.ctx.rotate(tmpPos[2]);
                this.ctx.fillText(this.neighbors[neighbor][1], tmpPos[0], tmpPos[1]);
                this.ctx.restore();
            }
        }

    }

}

let modes = {
    addNodes: true,
    remNodes: false,
    addRoutes: false,
    remRoutes: false
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

            nodeLetter = nodeLetter.substring(0,nodeLetter.length-1) + String.fromCharCode(nodeLetter.charCodeAt(nodeLetter.length-1)+1);

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
                                // Update Canvas if weight has been set
                                updateCanvas(ctx, nodeArray);
                            });
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
let setToRequiredStyleButtons = function() {
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
    if (routeCnt > 0) $('#button-add-route').prop('disabled', false);
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
let setMode = function(inpMode) {
    for (let mode in modes) {
        modes[mode] = false;
    }
    modes[inpMode] = true;
}

// Update canvas
let updateCanvas = function(ctx, nodeArray) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let node in nodeArray) {
        nodeArray[node].draw();
    }
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
}

let getMidPoint = function(x1, y1, x2, y2) {
    return [((x1 + x2)/2), ((y1 + y2)/2)];
}

let bestPosForText = function(x1, y1, x2, y2) {
    tmpRes = getMidPoint(x1, y1, x2, y2);
    let m = (y2 - y1)/(x2 - x1);
    let rad = Math.atan(m);
    tmpRes.push(rad);
    return tmpRes;
}

let toRadians = function (angle) {
    return angle * (Math.PI / 180);
}
