window.addEventListener("load", function () {
    $('#button-play').click(function () {
        
        // Remove previous canvas
        $('#canvas').remove();
        $('#canvas-container').append('<canvas id="canvas" width="640" height="420"></canvas>');

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

let main = function () {

    // Instantiate canvas and context
    let canvas = document.querySelector('#canvas');
    let ctx = canvas.getContext('2d');

    // Canvas properties
    let canvasLeft = getOffsetLeft(canvas);
    let canvasTop = canvas.offsetTop;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set Nodes...
    let nodeCnt = 1;
    let nodeArray = [];

    // Be aware of clicks
    canvas.addEventListener('click', function (e) {
        
        let clickX = e.pageX - canvasLeft;
        let clickY = e.pageY - canvasTop;
        
        let tmpNode = new Node(nodeCnt, clickX, clickY, ctx);
        
        tmpNode.draw();
        nodeArray.push(tmpNode);
        
        nodeCnt += 1;
    });

}

// Util functions
function getOffsetLeft(elem) {
    var offsetLeft = 0;
    do {
        if (!isNaN(elem.offsetLeft)) {
            offsetLeft += elem.offsetLeft;
        }
    } while (elem = elem.offsetParent);
    return offsetLeft;
}