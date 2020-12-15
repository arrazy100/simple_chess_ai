function resetBoard() {
    stopEngine();
    game.reset()
    startEngine(false);
    board.position(game.fen())
    updateStatus()
}

function undoBoard() {
    if (oldgame === undefined) {
        stopEngine();
        game.undo();
        startEngine(false);
    }
    else {
        stopEngine();
        game = oldgame;
        if (game.turn() === 'b') {
            game.undo();
            startEngine(false);
        }
        else startEngine();
    }
    board.position(game.fen())
    updateStatus()
}