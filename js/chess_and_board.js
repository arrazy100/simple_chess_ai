var board = null
var game = new Chess('3r2kr/pppN2q1/4QR2/4P1N1/3p3p/8/PP4PP/R1B3K1 b - - 0 1')
var $status = $('#status')

var Engine = undefined;
var start;
var end;
var total_time = 0;
var index = 0;

startEngine(true, 'medium');

function startEngine(push = true, difficulty = 'easy') {
    if (typeof(Worker) !== 'undefined') {
        if (typeof(Engine) == 'undefined') {
            Engine = new Worker('js/chess_ai_worker.js');
        }
        Engine.onmessage = function(e) {
            end = Date.now();
            game = new Chess(e.data[0]);
            board.position(e.data[0]);
            $('#execution').text(e.data[1]);
            total_time += Math.round((end - start) / 10) / 100;
            $('#time').text(Math.round((end - start) / 10) / 100 + ' s');
            index++;
            $('#mean').text(Math.round(total_time / index * 100) / 100 + ' s');
            console.log(e.data[2]);
            updateStatus();
        };
    }
    start = Date.now();
    if (push) Engine.postMessage([game.fen(), difficulty]);
}

function stopEngine() {
    Engine.terminate();
    Engine = undefined;
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
    startEngine(true, difficulty);
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
        status = 'Game over, ' + moveColor + ' checkmate.'
    }

    // draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn'
    }

    // game still on
    else {
        status = moveColor + ' to move'

        // check?
        if (game.in_check()) {
        status += ', ' + moveColor + ' check'
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