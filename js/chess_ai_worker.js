importScripts("https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js");
importScripts("./chess_ai_eval.js");
importScripts("./chess_ai_transposition_table.js");
importScripts("./chess_ai_search.js");

var game;

// pengaturan saat menerima pesan dari front end
onmessage = function(e) {
    // membuat objek baru untuk engine catur
    game = new Chess(e.data[0]);

    // gerakkan AI
    moveAI();

    // kirim pesan ke front end
    postMessage([game.fen(), count]);
}

// implementasi fungsi untuk menggerakkan AI berdasarkan pencarian
function moveAI() {
    // dapatkan gerakan terbaik
    var move = getBestMove(game, 4);

    // gerakkan AI
    game.move(move);
}