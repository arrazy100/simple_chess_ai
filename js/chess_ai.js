// fungsi untuk menghitung nilai material pada papan catur
function evaluateMaterial() {

    // nilai untuk semua jenis pion catur, diambil dari https://www.chessprogramming.org/Point_Value
    const pawn = 100;
    const knight = 350;
    const bishop = 350;
    const rook = 525;
    const queen = 1000;
    const king = 10000;

    const boards = game.board();
    var materialValue = 0; // membuat variabel baru untuk nilai material

    // baca board untuk menghitung nilai material
    // tambahkan nilai materai untuk warna putih dan kurangi nilai material untuk setiap warna hitam
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (boards[i][j] === null) continue;
            var piece = boards[i][j]
            if (piece.type === 'p') piece.color === 'w' ? materialValue += pawn : materialValue -= pawn;
            if (piece.type === 'n') piece.color === 'w' ? materialValue += knight : materialValue -= knight;
            if (piece.type === 'b') piece.color === 'w' ? materialValue += bishop : materialValue -= bishop;
            if (piece.type === 'r') piece.color === 'w' ? materialValue += rook : materialValue -= rook;
            if (piece.type === 'q') piece.color === 'w' ? materialValue += queen : materialValue -= queen;
            if (piece.type === 'k') piece.color === 'w' ? materialValue += king : materialValue -= king;
        }
    }

    return materialValue;
}

// fungsi untuk mendapatkan nilai indeks untuk fungsi evaluateFunction
function getArrayIndex(to) {
    var index = 0; // variabel untuk menyimpan nilai indeks
    for (var i = 0; i < to.length; i++) {
        if (to[i] >= '0' && to[i] <= '9') { // char adalah angka
            index += (to[i] - 1) * 8; // tambahkan indeks dengan (angka - 1) * 8
            continue;
        }
        // mendapatkan nilai kolom array
        switch(to[i]) {
            case 'a': index = 0; break;
            case 'b': index = 1; break;
            case 'c': index = 2; break;
            case 'd': index = 3; break;
            case 'e': index = 4; break;
            case 'f': index = 5; break;
            case 'g': index = 6; break;
            case 'h': index = 7; break;
        }
    }

    return index;
}

// fungsi untuk menghitung nilai posisi pergerakan yang dilakukan
function evaluatePosition(move, is_max_player) {
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

    var score = 0; // variabel untuk menyimpan skor
    var index = getArrayIndex(move.to); // mendapatkan nilai index array dari pergerakan yang dilakukan
    var piece = move.piece; // mendapatkan tipe catur

    // tipe piece, p (pawn), n (knight), b (bishop), r (rook), q (queen), dan king (king)
    // jika pemain max, score = position[index], jika pemain min, score = position.reverse()[index]
    switch(piece) {
        case 'p':
            if (is_max_player) score = pawnPosition[index];
            else score = pawnPosition.reverse()[index];
            break;
        case 'n':
            if (is_max_player) score = knightPosition[index];
            else score = knightPosition.reverse()[index];
            break;
        case 'b':
            if (is_max_player) score = bishopPosition[index];
            else score = bishopPosition.reverse()[index];
            break;
        case 'r':
            if (is_max_player) score = rookPosition[index];
            else score = rookPosition.reverse()[index];
            break;
        case 'q':
            if (is_max_player) score = queenPosition[index];
            else score = queenPosition.reverse()[index];
            break;
        case 'k':
            if (is_max_player) score = kingPosition[index];
            else score = kingPosition.reverse()[index];
            break;
    }

    return score;
}

// fungsi untuk menghitung nilai pergerakan terbaik menggunakan algoritma negamax
function negaMax(is_max_player, alpha, beta, depth) {

    if (depth === 0) return (evaluateMaterial() * is_max_player);

    const moves = game.moves(); // mendapatkan semua gerakan yang valid
    //childNodes := orderMoves(childNodes)
    var value = -99999; // nilai minimum

    for (var i = 0; i < moves.length; i++) {
        game.move(moves[i]); // lakukan pergerakan
        value = Math.max(value, -negaMax(-is_max_player, -beta, -alpha, depth - 1)); // ambil nilai yang lebih tinggi antara value dan negamax
        alpha = Math.max(alpha, value); // ambil nilai yang lebih tinggi antara alpha dan value
        game.undo(); // kembalikan pergerakan

        if (alpha >= beta) {
            break;
        }
    }

    return alpha;
}

// fungsi untuk mendapatkan pergerakan terbaik, diambil dari nilai negamax
function getBestMoveFromNegaMax() {
    var bestValue = -99999; // nilai terbaik
    var bestMove = 0; // pergerakan terbaik
    const moves = game.moves(); // mendapatkan gerakan yang valid

    for (var i = 0; i < moves.length; i++) {
        var move = game.move(moves[i]); // gerakkan pemain
        if (move.color === 'w') {
            game.undo();
            continue;
        }
        var score = negaMax(-1, -99999, 99999, 2) + evaluatePosition(move, -1); // hitung nilai negamax + nilai posisi pergerakan
        
        // simpan pergerakan terbaik jika score lebih dari nilai terbaik
        if (score > bestValue) {
            bestValue = score;
            bestMove = moves[i];
        }
        game.undo(); // kembalikan pergerakan
    }
    return bestMove;
}

// fungsi untuk menggerakkan AI
function moveAI() {
    var move = getBestMoveFromNegaMax(); // mendapatkan gerakan
    game.move(move); // menggerakkan AI
    board.position(game.fen()); // perbarui tampilan papan catur
    updateStatus(); // update status papan catur
}