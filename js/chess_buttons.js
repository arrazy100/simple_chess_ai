function resetBoard() {
    stopEngine();
    game.reset()
    startEngine(false);
    board.position(game.fen())
    updateStatus()
}