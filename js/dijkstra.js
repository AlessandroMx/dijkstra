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
        // $('#button-rem-node').prop('disabled', false);
        this.ctx = ctx;
        this.neighbors = neighbors || null;
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

    // Set Nodes and Routes...
    let nodeCnt = 0;
    let nodeArray = [];
    let routeCnt = 0;
    let routeArray = [];

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

            let tmpNode = new Node(nodeCnt, clickX, clickY, ctx);

            // tmpNode.draw();
            nodeArray.push(tmpNode);

        } else if (modes.remNodes) {
            // PENSARRRR MAAAXSSS
            for (let node in nodeArray) {
                
                let needToBeRemoved = false;

                let tmpX = nodeArray[node].x;
                let tmpY = nodeArray[node].y;

                if (clickX <= tmpX + 15 || clickX >= tmpX - 15) {
                    if (clickY <= tmpY + 15 || clickY >= tmpY - 15) {
                        needToBeRemoved = true;
                    }
                }

                if (needToBeRemoved) {
                    nodeArray = nodeArray.splice(node, 1);
                    nodeCnt -= 1;
                }

            }

        }

        // Enable required buttons
        enableRequiredButtons(nodeCnt, routeCnt);

        // Update Canvas
        updateCanvas(ctx, nodeArray);

    });

    // Check if any button has been clicked
    checkClickedButton();

}

// Enable all necessary buttons according to the number of nodes and their routes
let enableRequiredButtons = function (nodeCnt, routeCnt) {
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
let setMode = function(mode) {
    for (let mode in modes) {
        modes[mode] = false;
    }
    modes[mode] = true;
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
