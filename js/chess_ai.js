function evaluateMaterial() {

    // nilai untuk semua jenis pion catur, diambil dari https://www.chessprogramming.org/Point_Value
    const pawn = 100
    const knight = 350
    const bishop = 350
    const rook = 525
    const queen = 1000
    const king = 10000

    const boards = game.board()
    var materialValue = 0 // membuat variabel baru untuk nilai material

    // baca board untuk menghitung nilai material
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

    return materialValue
}

function getRandomMove() {
    const moves = game.moves() // mendapatkan semua gerakan yang valid
    randomMove = moves[Math.floor(Math.random() * moves.length)] // mendapatkan gerakan acak yang valid
    
    return randomMove
}

function getBestMoveFromMaterial() {
    const moves = game.moves() // mendapatkan semua gerakan yang valid
    var bestValue = -99999 // membuat variabel untuk mendapatkan nilai terbaik
    var bestMove = 0 // membuat variabel untuk mendapatkan gerakan terbaik

    for (var i = 0; i < moves.length; i++) {
        var move = moves[i] // ambil gerakan legal indeks ke-i
        game.move(move) // gerakkan AI, hanya untuk percobaan
        
        var materialValue = -evaluateMaterial(); // evaluasi nilai material
        if (materialValue > bestValue) {
            bestValue = materialValue; // ubah nilai terbaik
            bestMove = move; // ubah gerakan terbaik
        }

        game.undo() // undo untuk menghapus pergerakan
    }

    return bestMove
}

// Algoritma minimax
// sumber referensi:
// https://www.chessprogramming.org/Minimax
// https://www.chessprogramming.org/Alpha-Beta

function alphaBetaMaxi(alpha, beta, depth) {
    if (depth === 0) return evaluateMaterial();

    const moves = game.moves()

    for (var i = 0; i < moves.length; i++) {
        game.move(moves[i])
        score = alphaBetaMini(alpha, beta, depth - 1)
        game.undo()
        alpha = Math.max(alpha, score)
        bestIndex = i

        if (beta <= alpha) return bestIndex;
    }

    return bestIndex
}

function alphaBetaMini(alpha, beta, depth) {
    if (depth === 0) return -evaluateMaterial();

    const moves = game.moves()

    for (var i = 0; i < moves.length; i++) {
        game.move(moves[i])
        score = alphaBetaMaxi(alpha, beta, depth - 1)
        game.undo()
        beta = Math.min(beta, score)
        bestIndex = i

        if (beta <= alpha) return bestIndex;
    }

    return bestIndex
}

function getBestMoveFromMinimax() {
    const moves = game.moves()

    bestIndex = alphaBetaMini(-99999, 99999, 3)
    
    return moves[bestIndex]
}

function moveAI() {
    var move = getBestMoveFromMinimax() // mendapatkan gerakan
    game.move(move) // menggerakkan AI
    board.position(game.fen())
    updateStatus()
}