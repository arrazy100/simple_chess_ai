var difficulty;

function resetBoard() {
    stopEngine();
    game.reset()
    startEngine(false);
    board.position(game.fen())
    updateStatus()
}

function detectMob() {
    return ((window.innerWidth <= 800));
}

function playGame(level) {
    difficulty = level;
    document.getElementById("menu").style.display = "none";
    document.getElementById("game_screen").style.display = "inline-block";
    if (detectMob()) $("#game_screen").width("100%");
    else $("#game_screen").width(500);
    board = Chessboard('myBoard', config);
    board.position(game.fen());
}