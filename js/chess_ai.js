// fungsi untuk menghitung nilai material pada papan catur
function evaluateScore() {

    // nilai untuk semua jenis pion catur, diambil dari https://www.chessprogramming.org/Point_Value
    const pawn = 100;
    const knight = 350;
    const bishop = 350;
    const rook = 525;
    const queen = 1000;
    const king = 10000;

    const pawnPosition = [
        0,  0,  0,  0,  0,  0,  0,  0,
        50, 50, 50, 50, 50, 50, 50, 50,
        10, 10, 20, 30, 30, 20, 10, 10,
        5,  5, 10, 25, 25, 10,  5,  5,
        0,  0,  0, 20, 20,  0,  0,  0,
        5, -5,-10,  0,  0,-10, -5,  5,
        5, 10, 10,-20,-20, 10, 10,  5,
        0,  0,  0,  0,  0,  0,  0,  0
    ];

    const knightPosition = [
        -50,-40,-30,-30,-30,-30,-40,-50,
        -40,-20,  0,  0,  0,  0,-20,-40,
        -30,  0, 10, 15, 15, 10,  0,-30,
        -30,  5, 15, 20, 20, 15,  5,-30,
        -30,  0, 15, 20, 20, 15,  0,-30,
        -30,  5, 10, 15, 15, 10,  5,-30,
        -40,-20,  0,  5,  5,  0,-20,-40,
        -50,-40,-30,-30,-30,-30,-40,-50
    ];

    const bishopPosition = [
        -20,-10,-10,-10,-10,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5, 10, 10,  5,  0,-10,
        -10,  5,  5, 10, 10,  5,  5,-10,
        -10,  0, 10, 10, 10, 10,  0,-10,
        -10, 10, 10, 10, 10, 10, 10,-10,
        -10,  5,  0,  0,  0,  0,  5,-10,
        -20,-10,-10,-10,-10,-10,-10,-20
    ];

    const rookPosition = [
        0,  0,  0,  0,  0,  0,  0,  0,
        5, 10, 10, 10, 10, 10, 10,  5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        0,  0,  0,  5,  5,  0,  0,  0
    ];

    const queenPosition = [
        -20,-10,-10, -5, -5,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5,  5,  5,  5,  0,-10,
        -5,  0,  5,  5,  5,  5,  0, -5,
        0,  0,  5,  5,  5,  5,  0, -5,
        -10,  5,  5,  5,  5,  5,  0,-10,
        -10,  0,  5,  0,  0,  0,  0,-10,
        -20,-10,-10, -5, -5,-10,-10,-20
    ];

    const kingPosition = [
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -20,-30,-30,-40,-40,-30,-30,-20,
        -10,-20,-20,-20,-20,-20,-20,-10,
        20, 20,  0,  0,  0,  0, 20, 20,
        20, 30, 10,  0,  0, 10, 30, 20
    ];

    var n_pawn = 0;
    var n_knight = 0;
    var n_bishop = 0;
    var n_rook = 0;
    var n_queen = 0;
    var n_king = 0;
    var total_pieces = 0;

    const board = game.board();
    var score = 0; // membuat variabel baru untuk nilai material

    // baca board untuk menghitung nilai material
    // tambahkan nilai materai untuk warna putih dan kurangi nilai material untuk setiap warna hitam
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var piece = board[i][j];
            if (piece === null) continue;
            var w_index = (i * 8) + j;
            var b_index = 63 - w_index;
            switch(piece.type) {
                case 'p': // pawn
                    score += (piece.color === 'w') ? pawnPosition[w_index] : pawnPosition[b_index];
                    n_pawn++;
                    break;
                case 'n': // knight
                    score += (piece.color === 'w') ? knightPosition[w_index] : knightPosition[b_index];
                    n_knight++;
                    break;
                case 'b': // bishop
                    score += (piece.color === 'w') ? bishopPosition[w_index] : bishopPosition[b_index];
                    n_bishop++;
                    break;
                case 'r': // rook
                    score += (piece.color === 'w') ? rookPosition[w_index] : rookPosition[b_index];
                    n_rook++;
                    break;
                case 'q': // queen
                    score += (piece.color === 'w') ? queenPosition[w_index] : queenPosition[b_index];
                    n_queen++;
                    break;
                case 'k': // king
                    score += (piece.color === 'w') ? kingPosition[w_index] : kingPosition[b_index];
                    n_king++;
                    break;
            }
        }
    }
    total_pieces = n_pawn + n_knight + n_bishop + n_rook + n_queen + n_king;
    $("#total_pieces").text(total_pieces);

    return score;
}

function negamax(game, is_max_player, alpha, beta, depth) {
    count++;
    if (depth === 0) return evaluateScore() * is_max_player;

    var bestScore = -99999;
    const moves = game.moves();
    for (var i = 0; i < moves.length; i++) {
        var newGame = new Chess(game.fen());
        newGame.move(moves[i]);
        var score = -negamax(newGame, -is_max_player, -beta, -alpha, depth - 1);
        delete newGame;
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, bestScore);
        if (alpha >= beta) break;
    }
    return bestScore;
}

var count;
function negamaxRoot(is_max_player, depth) {
    count = 0;
    const moves = game.moves();
    var bestScore = -99999;
    var bestMove;

    for (var i = 0; i < moves.length; i++) {
        var newGame = new Chess(game.fen());
        newGame.move(moves[i]);
        var score = -negamax(newGame, -is_max_player, -99999, 99999, depth - 1);
        delete newGame;

        if (score >= bestScore) {
            bestScore = score;
            bestMove = moves[i];
        }
    }
    return bestMove;
}

// fungsi untuk menggerakkan AI
function moveAI() {
    var move = negamaxRoot(1, 3); // mendapatkan gerakan
    game.move(move); // menggerakkan AI
    board.position(game.fen()); // perbarui tampilan papan catur
    updateStatus(); // update status papan catur
    $("#execution").text(count);
}