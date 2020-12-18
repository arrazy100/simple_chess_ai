// implementasi fungsi untuk mendapatkan skor berdasarkan posisi pada papan catur yang diinputkan
function evaluateScore(board, turn) {

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

    var white = 0; // skor untuk catur warna putih pada papan catur
    var black = 0; // skor untuk catur warna hitam pada papan catur

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
                    piece.color === 'w' ? white += pawnPosition[i][j] + pawn : black += pawnPosition[7 - i][j] + pawn;
                    break;
                case 'n': // kuda
                    piece.color === 'w' ? white += knightPosition[i][j] + knight : black += knightPosition[7 - i][j] + knight;
                    break;
                case 'b': // bishop
                    piece.color === 'w' ? white += bishopPosition[i][j] + bishop : black += bishopPosition[7 - i][j] + bishop;
                    break;
                case 'r': // rook
                    piece.color === 'w' ? white += rookPosition[i][j] + rook : black += rookPosition[7 - i][j] + rook;
                    break;
                case 'q': // ratu
                    piece.color === 'w' ? white += queenPosition[i][j] + queen : black += queenPosition[7 - i][j] + queen;
                    break;
                case 'k': // raja
                    piece.color === 'w' ? white += kingPosition[i][j] + king : black += kingPosition[7 - i][j] + king;
                    break;
            }
        }
    }

    // mendapatkan giliran pemain, jika giliran catur putih, color = 1, sebaliknya, color = -1
    var color;
    (turn === 'w') ? color = 1 : color = -1;

    // kembalikan nilai hasil evaluasi dengan mengurangi variabel white dan black, kemudian kalikan dengan variabel color
    return (white - black) * color;
}