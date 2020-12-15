var board = null
var game = new Chess()
var $status = $('#status')

var Engine = new Worker('js/worker.js');
var start;
var end;

Engine.onmessage = function(e) {
    end = Date.now();
    game = new Chess(e.data[0]);
    board.position(e.data[0]);
    updateStatus();
    $('#execution').text(e.data[1]);
    $('#time').text((end - start) / 1000 + ' s');
}

function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up white pieces for the side to move
    //if ((game.turn() === 'w' && piece.search(/^b/) !== -1)) return false;
    if (piece.search(/^w/) === -1) return false;
}

function onDrop (source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'

    updateStatus();
    start = Date.now();
    Engine.postMessage([game.fen()]);
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
    board.position(game.fen())
}

function updateStatus () {
    var status = ''

    var moveColor = 'White'
    if (game.turn() === 'b') {
        moveColor = 'Black'
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position'
    }

    // game still on
    else {
        status = moveColor + ' to move'

        // check?
        if (game.in_check()) {
        status += ', ' + moveColor + ' is in check'
        }
    }

    $status.html(status)
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}

board = Chessboard('myBoard', config);
updateStatus();