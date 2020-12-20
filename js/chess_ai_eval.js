// implementasi fungsi untuk mendapatkan skor berdasarkan posisi pada papan catur yang diinputkan
function evaluateScore(chess, turn) {
    // mendapatkan papan catur dari engine
    var board = chess.board();

    // mendapatkan giliran pemain, jika giliran catur putih, color = 1, sebaliknya, color = -1
    var color;
    (turn === 'w') ? color = 1 : color = -1;

    if (chess.in_threefold_repetition() || chess.in_draw() || chess.in_stalemate()) {
        return 0;
    }
    else if (chess.in_checkmate()) {
        return 99999 * color;
    }

    // nilai material untuk semua jenis catur, diambil dari https://www.chessprogramming.org/Point_Value
    const pawn = 100;
    const knight = 350;
    const bishop = 350;
    const rook = 525;
    const queen = 1000;
    const king = 10000;

    // nilai piece square table berdasarkan posisi jenis catur
    // skor akan ditambahkan berdasarkan nilai ini
    // diambil dari https://www.chessprogramming.org/Piece-Square_Tables

    // posisi pion
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

    // posisi kuda
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

    // posisi bishop
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

    // posisi rook
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

    // posisi ratu
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

    // posisi raja
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

    // posisi raja pada fase end game
    const kingEndGamePosition = [
        [-50,-40,-30,-20,-20,-30,-40,-50],
        [-30,-20,-10,  0,  0,-10,-20,-30],
        [-30,-10, 20, 30, 30, 20,-10,-30],
        [-30,-10, 30, 40, 40, 30,-10,-30],
        [-30,-10, 30, 40, 40, 30,-10,-30],
        [-30,-10, 20, 30, 30, 20,-10,-30],
        [-30,-30,  0,  0,  0,  0,-30,-30],
        [-50,-30,-30,-30,-30,-30,-30,-50]
    ]

    // menyimpan jumlah catur warna putih kecuali raja
    var w_pawn = 0;
    var w_knight = 0;
    var w_bishop = 0;
    var w_rook = 0;
    var w_queen = 0;

    // menyimpan jumlah catur warna hitam kecuali raja
    var b_pawn = 0;
    var b_knight = 0;
    var b_bishop = 0;
    var b_rook = 0;
    var b_queen = 0;

    // menyimpan nilai material
    var w_material = 0;
    var b_material = 0;

    // menyimpan nilai posisi
    var w_position = 0;
    var b_position = 0;

    // menyimpan nilai bonus
    var w_bonus = 0;
    var b_bonus = 0;

    // lakukan perulangan untuk mendapatkan jumlah setiap jenis catur kecuali raja
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var piece = board[i][j];
            if (piece === null) continue;
            switch(piece.type) {
                case 'p': (piece.color === 'w') ? w_pawn += 1 : b_pawn += 1; break;
                case 'n': (piece.color === 'w') ? w_knight += 1 : b_knight += 1; break;
                case 'b': (piece.color === 'w') ? w_bishop += 1 : b_bishop += 1; break;
                case 'r': (piece.color === 'w') ? w_rook += 1 : b_rook += 1; break;
                case 'q': (piece.color === 'w') ? w_queen += 1 : b_queen += 1; break;
            }
        }
    }

    // permainan memasuki end game apabila kedua pemain tidak memiliki queen,
    // atau pemain yang memiliki queen hanya memiliki 1 jenis papan catur lain (tidak termasuk raja)
    var endGame = false;
    var w_pieces = w_pawn + w_knight + w_bishop + w_rook;
    var b_pieces = b_pawn + b_knight + b_bishop + b_rook;
    if ((w_queen + b_queen === 0) || (w_queen != 0 && w_pieces === 1) || (b_queen != 0 && b_pieces === 1)) {
        endGame = true;
    }

    // lakukan perulangan untuk mendapatkan warna dan jenis catur pada setiap posisi
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var piece = board[i][j];

            // jika pada kotak papan catur kosong, abaikan kotak papan ini dan lanjutkan perulangan
            if (piece === null) continue;

            // lakukan switch case untuk setiap jenis catur
            // jika catur berwarna putih, tambahkan skor material dan skor posisi ke variabel white
            // jika catur berwarna hitam, tambahkan skor material dan skor posisi ke variabel black
            switch(piece.type) {
                case 'p': // pawn
                    piece.color === 'w' ? (
                        w_material += pawn,
                        w_position += pawnPosition[i][j]
                    ) : (
                        b_material += pawn,
                        b_position += pawnPosition[7 - i][j]
                    );
                    break;
                case 'n': // kuda
                    piece.color === 'w' ? (
                        w_material += knight,
                        w_position += knightPosition[i][j]
                    ) : (
                        b_material += knight,
                        b_position += knightPosition[7 - i][j]
                    );
                    break;
                case 'b': // bishop
                    piece.color === 'w' ? (
                        w_material += bishop,
                        w_position += bishopPosition[i][j]
                    ) : (
                        b_material += bishop,
                        b_position += bishopPosition[7 - i][j]
                    );
                    break;
                case 'r': // rook
                    piece.color === 'w' ? (
                        w_material += rook,
                        w_position += rookPosition[i][j]
                    ) : (
                        b_material += rook,
                        b_position += rookPosition[7 - i][j]
                    );
                    break;
                case 'q': // ratu
                    piece.color === 'w' ? (
                        w_material += queen,
                        w_position += queenPosition[i][j]
                    ) : (
                        b_material += queen,
                        b_position += queenPosition[7 - i][j]
                    );
                    break;
                case 'k': // raja
                    piece.color === 'w' ? (
                        w_material += king,
                        (endGame) ? w_position += kingEndGamePosition[i][j] : w_position += kingPosition[i][j]
                    ) : (
                        b_material += pawn,
                        (endGame) ? b_position += kingEndGamePosition[7 - i][j] : b_position += kingPosition[7 - i][j]
                    );
                    break;
            }
        }
    }

    // berikan bonus ketika pemain memiliki sepasang bishop
    if (w_bishop === 2) w_bonus += 50;
    if (b_bishop === 2) b_bonus += 50;

    // berikan penalti jika pion putih di posisi awal pada kolom d dan e diblok oleh catur lain
    if ((board[6][3] != null && board[6][3].type === 'p') || (board[6][4] != null && board[6][4].type === 'p')) {
        if (board[5][3] != null || board[5][4] != null) w_bonus -= 50;
    }

    // berikan penalti jika pion hitam di posisi awal pada kolom d dan e diblok oleh catur lain
    if ((board[1][3] != null && board[1][3].type === 'p') || (board[1][4] != null && board[1][4].type === 'p')) {
        if (board[2][3] != null || board[2][4] != null) b_bonus -= 50;
    }

    // dapatkan skor dari penambahan nilai material, posisi, dan bonus dari kedua pemain
    var score = (w_material + w_position + w_bonus) - (b_material + b_position + b_bonus);

    // kembalikan nilai hasil evaluasi dengan mengurangi variabel white dan black, kemudian kalikan dengan variabel color
    return score * color;
}