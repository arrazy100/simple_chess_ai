function resetBoard() {
    game.reset()
    board.position(game.fen())
    updateStatus()
}

function undoBoard() {
    game.undo()
    board.position(game.fen())
    updateStatus()
}