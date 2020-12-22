var count;

// implementasi pencarian negamax dengan alpha beta pruning
function negamax(chess, alpha, beta, depth) {
    count++;

    // jika pohon pencarian sudah berada di akar atau tidak ada gerakan catur yang legal,
    // kembalikan nilai dari papan catur sekarang
    if (depth === 0 || chess.moves() === null) return evaluateScore(chess, chess.turn());

    // dapatkan gerakan catur yang legal
    const moves = chess.moves({ verbose: true });

    // membuat variabel untuk menyimpan skor terbaik dari hasil pencarian
    // diinisialisasi dengan nilai paling rendah
    var bestScore = -Infinity;

    // melakukan perulangan untuk melakukan iterasi semua gerakan yang legal
    var i = 0;
    var nmoves = moves.length;
    for (; i < nmoves; i++) {

        // terapkan gerakan ke-i
        chess.move(moves[i]);

        // menghitung skor gerakan ke-i
        var score = -negamax(chess, -beta, -alpha, depth - 1);

        // kembalikan posisi papan catur seperti semula
        chess.undo();

        // jika skor >= beta maka kembalikan skor sebagai hasil pencarian
        if (score >= beta) return score;

        // jika skor dari gerakan ke-i lebih dari skor terbaik sekarang
        // jadikan skor dari gerakan ke-i menjadi skor terbaik
        // mengganti nilai alpha menjadi skor terbaik jika skor terbaik > alpha
        if (score > bestScore) {
            bestScore = score;
            alpha = Math.max(alpha, bestScore);
        }
    }

    // kembalikan skor terbaik sebagai hasil pencarian
    return bestScore;
}

// implementasi pencarian quiescence
function quiesce(chess, alpha, beta) {

    // menyimpan skor posisi papan catur sekarang
    var stand_pat = evaluateScore(chess, chess.turn());

    // jika skor >= beta, kembalikan nilai beta sebagai hasil pencarian
    if (stand_pat >= beta) return beta;

    // jika alpha < skor, ganti nilai alpha menjadi skor
    if (alpha < stand_pat) alpha = stand_pat;

    // mendapatkan gerakan catur yang legal
    var moves = chess.moves({ verbose: true });

    // lakukan perulangan untuk mendapatkan skor gerakan 'capture'
    var i = 0;
    var nmoves = moves.length;
    for (; i < nmoves; i++) {
        // jika gerakan bukanlah gerakan 'capture', maka abaikan dan lanjutkan perulangan
        if (moves[i].flags !== 'c' || moves[i].flags !== 'e') continue;

        // terapkan gerakan ke-i
        chess.move(moves[i]);

        // hitung skor dari gerakan ke-i
        var score = -quiesce(chess, -beta, -alpha);

        // kembalikan posisi catur seperti semula
        chess.undo();

        // jika skor >= beta maka kembalikan beta sebagai hasil pencarian
        if (score >= beta) return beta;

        // jika skor > alpha maka ganti nilai alpha menjadi skor
        if (score > alpha) alpha = score;
    }

    // kembalikan nilai alpha sebagai hasil pencarian
    return alpha;
}

// implementasi pencarian negamax dengan alpha beta pruning dan table transposisi
function search(chess, alpha, beta, depth) {
    count++;

    // menyimpan variabel alpha
    const prevAlpha = alpha;

    // mendapatkan notasi fen dari posisi catur sekarang
    var currentFen = chess.fen();

    // mendapatkan data transposisi tabel dengan kunci adalah fen sekarang
    const entry = TTableGetEntry(currentFen);

    // jika data tabel ada dan kedalaman pencarian pada data tabel >= kedalaman pencarian sekarang
    if (entry && entry.depth >= depth) {
        
        // mendapatkan tipe flag dari data tabel
        // jika exact, kembalikan skor dari tabel sebagai hasil pencarian
        // jika lowerbound, ganti nilai alpha apabila skor dari tabel > alpha
        // jika upperbound, ganti nilai beta apabila skor dari tabel < beta
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

        // jika alpha >= beta kembalikan skor tabel sebagai hasil pencarian
        if (alpha >= beta) return entry.score;
    }

    // jika pohon pencarian sudah berada di akar atau tidak ada gerakan catur yang legal
    // terapkan pencarian quiesce
    if (depth === 0 || chess.moves() === null) return quiesce(chess, alpha, beta);

    // mendapatkan semua gerakan yang legal
    const moves = chess.moves({ verbose: true });

    // menyimpan skor terbaik, inisialisasi dengan nilai terendah
    var bestScore = -Infinity;

    // menyimpan gerakan terbaik
    var bestMove = null;

    // lakukan perulangan untuk setiap gerakan catur yang legal
    var i = 0;
    var nmoves = moves.length;
    for (; i < nmoves; i++) {
        // terapkan gerakan ke-i
        chess.move(moves[i]);

        // hitung skor dari gerakan ke-i
        var score = -search(chess, -beta, -alpha, depth - 1);

        // kembalikan posisi catur seperti semula
        chess.undo();

        // jika skor gerakan ke-i > skor terbaik sekarang
        // ganti skor terbaik menjadi skor gerakan ke-i
        // masukkan gerakan ke-i sebagai gerakan terbaik
        if (score > bestScore) {
            bestScore = score;
            bestMove = moves[i];
        }

        // ubah nilai alpha menjadi skor terbaik apabila skor terbaik > alpha
        alpha = Math.max(alpha, bestScore);

        // jika alpha >= beta, keluar dari perulangan
        if (alpha >= beta) break;
    }

    // mendapatkan notasi fen dari posisi catur sekarang
    currentFen = chess.fen();

    // masukkan hasil pencarian ke dalam tabel transposisi
    TTableStoreEntry(bestScore, bestMove, prevAlpha, beta, depth, currentFen);

    // kembalikan skor terbaik sebagai hasil pencarian
    return bestScore;
}

// implementasi fungsi untuk mendapatkan root dari pencarian negamax
function negamax_root(chess, depth) {
    count = 0;

    // mendapatkan gerakan catur yang legal
    var moves = chess.moves({ verbose: true });

    // menyimpan variabel skor terbaik
    // diinisialisasi dengan nilai terendah
    var bestScore = -Infinity;

    // inisialisasi variabel untuk menyimpan gerakan terbaik
    var bestMove = null;

    // lakukan perulangan untuk setiap gerakan catur yang legal
    var i = 0;
    var nmoves = moves.length;
    for (; i < nmoves; i++) {
        // terapkan gerakan ke-i
        chess.move(moves[i]);

        // hitung skor dari posisi papan catur sekarang
        var score = -negamax(chess, -Infinity, Infinity, depth);

        // kembalikan posisi catur seperti semula
        chess.undo();

        // jika skor gerakan ke-i > skor terbaik, simpan skor ke dalam skor terbaik, dan simpan gerakan ke-i sebagai gerakan terbak
        if (score >= bestScore) {
            bestScore = score;
            bestMove = moves[i];
        }
    }

    // kembalikan gerakan terbaik sebagai hasil pencarian
    return bestMove;
}

// implementasi fungsi untuk mendapatkan gerakan terbaik untuk AI
function getBestMove(chess, depth) {
    count = 0;

    // melakukan pencarian sedalam depth
    // nilai alpha pencarian adalah -Infinity
    // nilai beta pencarian adalah Infinity
    search(chess, -Infinity, Infinity, depth);

    // mendapatkan notasi fen dari posisi catur sekarang
    const currentFen = chess.fen();

    // mendapatkan data tabel transposisi dengan kuncinya adalah notasi fen
    const currNode = TTableGetEntry(currentFen);

    if (currNode.bestMove === null) return negamax_root(game, 1);

    // mengembalikan gerakan terbaik berdasarkan data tabel transposisi yang didapatkan
    return currNode.bestMove;
}
