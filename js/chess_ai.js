// fungsi untuk menghitung nilai material pada papan catur
function evaluateScore(board) {

    // nilai untuk semua jenis pion catur, diambil dari https://www.chessprogramming.org/Point_Value
    const pawn = 100;
    const knight = 350;
    const bishop = 350;
    const rook = 525;
    const queen = 1000;
    const king = 10000;

    const pawnPosition = [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ];

    const knightPosition = [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
    ];

    const bishopPosition = [
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20]
    ];

    const rookPosition = [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [5, 10, 10, 10, 10, 10, 10,  5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [0,  0,  0,  5,  5,  0,  0,  0]
    ];

    const queenPosition = [
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [-5,  0,  5,  5,  5,  5,  0, -5],
        [0,  0,  5,  5,  5,  5,  0, -5],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ];

    const kingPosition = [
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [20, 20,  0,  0,  0,  0, 20, 20],
        [20, 30, 10,  0,  0, 10, 30, 20]
    ];

    var white = 0;
    var black = 0;

    // baca board untuk menghitung nilai material
    // tambahkan nilai materai untuk warna putih dan kurangi nilai material untuk setiap warna hitam
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var piece = board[i][j];
            if (piece === null) continue;
            switch(piece.type) {
                case 'p': // pawn
                    piece.color === 'w' ? white += pawnPosition[i][j] + pawn : black += pawnPosition[7 - i][j] + pawn;
                    break;
                case 'n': // knight
                    piece.color === 'w' ? white += knightPosition[i][j] + knight : black += knightPosition[7 - i][j] + knight;
                    break;
                case 'b': // bishop
                    piece.color === 'w' ? white += bishopPosition[i][j] + bishop : black += bishopPosition[7 - i][j] + bishop;
                    break;
                case 'r': // rook
                    piece.color === 'w' ? white += rookPosition[i][j] + rook : black += rookPosition[7 - i][j] + rook;
                    break;
                case 'q': // queen
                    piece.color === 'w' ? white += queenPosition[i][j] + queen : black += queenPosition[7 - i][j] + queen;
                    break;
                case 'k': // king
                    piece.color === 'w' ? white += kingPosition[i][j] + king : black += kingPosition[7 - i][j] + king;
                    break;
            }
        }
    }

    return white - black;
}

function negamax(chess, alpha, beta, depth) {
    count++;
    if (depth === 0 || chess.moves() === null) return evaluateScore(chess.board());

    const moves = chess.moves({ verbose: true });
    var bestScore = -Infinity;

    for (var i = 0; i < moves.length; i++) {
        chess.move(moves[i]);
        var score = -negamax(chess, -beta, -alpha, depth - 1);
        if (score > bestScore) {
            bestScore = score;
        }
        alpha = Math.max(alpha, bestScore);
        chess.undo();
        if (alpha >= beta) {
            return alpha;
        }
    }
    return bestScore;
}

var count;
function negamaxRoot(chess, depth) {
    count = 0;
    const moves = chess.moves({ verbose: true });
    var bestScore = -Infinity;
    var bestMove = null;

    for (var i = 0; i < moves.length; i++) {
        chess.move(moves[i]);
        var score = -negamax(chess, -Infinity, Infinity, depth);
        chess.undo();
        if (score >= bestScore) {
            bestScore = score;
            bestMove = moves[i];
        }
    }
    return bestMove;
}

// fungsi untuk menggerakkan AI
function moveAI() {
    var move = negamaxRoot(game, 2);
    game.move(move); // menggerakkan AI
    board.position(game.fen()); // perbarui tampilan papan catur
    updateStatus(); // update status papan catur
    $("#execution").text(count);
}