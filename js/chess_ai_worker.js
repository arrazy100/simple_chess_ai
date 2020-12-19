importScripts("https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js");
importScripts("./chess_ai_eval.js");
importScripts("./chess_ai_transposition_table.js");
importScripts("./chess_ai_search.js");

var game;
var mobility;

// pengaturan saat menerima pesan dari front end
onmessage = function(e) {
    // membuat objek baru untuk engine catur
    game = new Chess(e.data[0]);

    // gerakkan AI
    moveAI(e.data[1]);

    // kirim pesan ke front end
    postMessage([game.fen(), count, mobility]);
}

function randomSelection(a, b) {
    return (Math.random() * b) + a;
}

// implementasi fungsi untuk menggerakkan AI berdasarkan pencarian
function moveAI(difficulty) {
    // dapatkan gerakan terbaik
    var move = null;
    mobility = game.moves().length;

    // atur AI sesuai dengan level permainan
    if (difficulty === 'easy') move = getBestMove(game, 2);
    else if (difficulty === 'medium') move = getBestMove(game, 3);
    else if (difficulty === 'hard') move = getBestMove(game, 4);

    // gerakkan AI
    game.move(move);
}