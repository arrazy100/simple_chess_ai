const TTable = {}; // tabel transposisi

// tipe flag untuk tabel transposisi
const SCORE_TYPES = {
    EXACT: 'exact',
    UPPERBOUND: 'upperbound',
    LOWERBOUND: 'lowerbound',
}

// implementasi fungsi untuk mendapatkan tipe flag data tabel transposisi baru
function determineScoreType(score, alpha, beta) {
    // skor <= alpha, berarti tipe upperbound
    if (score <= alpha) return SCORE_TYPES.UPPERBOUND;

    // skor >= beta, berarti tipe lowerbound
    else if (score >= beta) return SCORE_TYPES.LOWERBOUND;

    // jika bukan di atas, berarti tipe exact
    else return SCORE_TYPES.EXACT;
}

// implementasi fungsi untuk mendapatkan data transposisi tabel dari kunci yang diinputkan
function TTableGetEntry(key) {

    // mendapatkan data transposisi tabel berdasarkan kunci yang diinputkan
    return TTable[key] || null;
}

// implementasi fungsi untuk memasukkan data baru ke dalam tabel transposisi
function TTableStoreEntry(score, bestMove, alpha, beta, depth, key) {

    // membuat data transposisi baru dengan indeks adalah kunci yang diinputkan
    // skor adalah skor dari hasil pencarian
    // bestMove adalah gerakan terbaik dari hasil pencarian
    // type adalah tipe flag dari hasil pencarian
    // depth adalah nilai dari sedalam apa hasil pencarian
    // key adalah kunci tabel transposisi berdasarkan fen dari posisi papan catur
    TTable[key] = {
        score, bestMove,
        type: determineScoreType(score, alpha, beta),
        depth, key
    };
}