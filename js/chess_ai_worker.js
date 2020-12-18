importScripts("https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js");

var game;
var count;

onmessage = function(e) {
    game = new Chess(e.data[0]);
    moveAI();
    postMessage([game.fen(), count]);
}

const SCORE_TYPES = {
    EXACT: 'exact',
    UPPERBOUND: 'upperbound',
    LOWERBOUND: 'lowerbound',
}

const TTable = {};

function TTableGetEntry(key) {
    return TTable[key] || null;
}

function determineScoreType(score, alpha, beta) {
    if (score <= alpha) return SCORE_TYPES.UPPERBOUND;
    else if (score >= beta) return SCORE_TYPES.LOWERBOUND;
    else return SCORE_TYPES.EXACT;
}

function TTableStoreEntry(score, bestMove, alpha, beta, depth, key) {
    TTable[key] = {
        score, bestMove,
        type: determineScoreType(score, alpha, beta),
        depth, key
    };
}

// fungsi untuk menghitung nilai material pada papan catur
function evaluateScore(board, turn) {

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
    var color;
    (turn === 'w') ? color = 1 : color = -1;

    return (white - black) * color;
}

function negamax(chess, alpha, beta, depth) {
    count++;

    if (depth === 0 || chess.moves() === null) return evaluateScore(chess.board());

    const moves = chess.moves({ verbose: true });
    var bestScore = -Infinity;

    var i = 0;
    var nmoves = moves.length;
    for (; i < nmoves; i++) {
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

function quiesce(chess, alpha, beta) {
    var stand_pat = evaluateScore(chess.board(), chess.turn());
    if (stand_pat >= beta) return beta;
    if (alpha < stand_pat) alpha = stand_pat;

    var moves = chess.moves({ verbose: true });
    for (var i = 0; i < moves.length; i++) {
        if (moves[i].flags !== 'c' || moves[i].flags !== 'e') continue;
        chess.move(moves[i]);
        var score = -quiesce(chess, -beta, -alpha);
        chess.undo();
        if (score >= beta) return beta;
        if (score > alpha) alpha = score;
    }

    return alpha;
}

function negamaxWithTranspositionTable(chess, alpha, beta, depth) {
    count++;

    const prevAlpha = alpha;
    var currentFen = chess.fen();
    const entry = TTableGetEntry(currentFen);
    if (entry && entry.depth >= depth) {
        switch(entry.type) {
            case SCORE_TYPES.EXACT:
                return entry.score;
            case SCORE_TYPES.LOWERBOUND:
                alpha = Math.max(alpha, entry.score);
                break;
            case SCORE_TYPES.UPPERBOUND:
                beta = Math.min(beta, entry.score);
                break;
        }
        if (alpha >= beta) return entry.score;
    }

    if (depth === 0 || chess.moves() === null) return quiesce(chess, alpha, beta);

    const moves = chess.moves({ verbose: true });
    var bestScore = -Infinity;
    var bestMove = null;

    var i = 0;
    var nmoves = moves.length;
    for (; i < nmoves; i++) {
        chess.move(moves[i]);
        var score = -negamaxWithTranspositionTable(chess, -beta, -alpha, depth - 1);
        chess.undo();
        if (score > bestScore) {
            bestScore = score;
            bestMove = moves[i];
        }
        alpha = Math.max(alpha, bestScore);
        if (alpha >= beta) break;
    }

    currentFen = chess.fen();
    TTableStoreEntry(bestScore, bestMove, prevAlpha, beta, depth, currentFen);
    return bestScore;
}

function negamaxRoot(chess, depth) {
    count = 0;
    var moves = chess.moves({ verbose: true });
    var bestScore = -Infinity;
    var bestMove = null;

    var i = 0;
    var nmoves = moves.length;
    for (; i < nmoves; i++) {
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

function negamax2root(chess, depth) {
    count = 0;
    negamaxWithTranspositionTable(chess, -Infinity, Infinity, depth);

    const currentFen = chess.fen();
    const currNode = TTableGetEntry(currentFen);
    best = currNode.bestMove;
    return currNode.bestMove;
}

// fungsi untuk menggerakkan AI
function moveAI() {
    var move = negamax2root(game, 2);
    game.move(move); // menggerakkan AI
}