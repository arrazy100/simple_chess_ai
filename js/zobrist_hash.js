var g_hashKeyLow, g_hashKeyHigh;
var g_hashSize = 1 << 22;
var g_hashMask = g_hashSize - 1;
var g_hashTable = new Array(g_hashSize);
var g_zobristLow;
var g_zobristHigh;
var g_zobristBlackLow;
var g_zobristBlackHigh;

function MT() {
   var N = 624;
   var M = 397;
   var MAG01 = [0x0, 0x9908b0df];
   
   this.mt = new Array(N);
   this.mti = N + 1;

   this.setSeed = function()
   {
       var a = arguments;
       switch (a.length) {
       case 1:
           if (a[0].constructor === Number) {
               this.mt[0]= a[0];
               for (var i = 1; i < N; ++i) {
                   var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
                   this.mt[i] = ((1812433253 * ((s & 0xffff0000) >>> 16))
                           << 16)
                       + 1812433253 * (s & 0x0000ffff)
                       + i;
               }
               this.mti = N;
               return;
           }

           this.setSeed(19650218);

           var l = a[0].length;
           var i = 1;
           var j = 0;

           for (var k = N > l ? N : l; k != 0; --k) {
               var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)
               this.mt[i] = (this.mt[i]
                       ^ (((1664525 * ((s & 0xffff0000) >>> 16)) << 16)
                           + 1664525 * (s & 0x0000ffff)))
                   + a[0][j]
                   + j;
               if (++i >= N) {
                   this.mt[0] = this.mt[N - 1];
                   i = 1;
               }
               if (++j >= l) {
                   j = 0;
               }
           }

           for (var k = N - 1; k != 0; --k) {
               var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
               this.mt[i] = (this.mt[i]
                       ^ (((1566083941 * ((s & 0xffff0000) >>> 16)) << 16)
                           + 1566083941 * (s & 0x0000ffff)))
                   - i;
               if (++i >= N) {
                   this.mt[0] = this.mt[N-1];
                   i = 1;
               }
           }

           this.mt[0] = 0x80000000;
           return;
       default:
           var seeds = new Array();
           for (var i = 0; i < a.length; ++i) {
               seeds.push(a[i]);
           }
           this.setSeed(seeds);
           return;
       }
   }

   this.setSeed(0x1BADF00D);

   this.next = function (bits)
   {
       if (this.mti >= N) {
           var x = 0;

           for (var k = 0; k < N - M; ++k) {
               x = (this.mt[k] & 0x80000000) | (this.mt[k + 1] & 0x7fffffff);
               this.mt[k] = this.mt[k + M] ^ (x >>> 1) ^ MAG01[x & 0x1];
           }
           for (var k = N - M; k < N - 1; ++k) {
               x = (this.mt[k] & 0x80000000) | (this.mt[k + 1] & 0x7fffffff);
               this.mt[k] = this.mt[k + (M - N)] ^ (x >>> 1) ^ MAG01[x & 0x1];
           }
           x = (this.mt[N - 1] & 0x80000000) | (this.mt[0] & 0x7fffffff);
           this.mt[N - 1] = this.mt[M - 1] ^ (x >>> 1) ^ MAG01[x & 0x1];

           this.mti = 0;
       }

       var y = this.mt[this.mti++];
       y ^= y >>> 11;
       y ^= (y << 7) & 0x9d2c5680;
       y ^= (y << 15) & 0xefc60000;
       y ^= y >>> 18;
       return (y >>> (32 - bits)) & 0xFFFFFFFF;
   }
}

function ZobristInit() {
    var mt = new MT(0x1badf00d);
    g_zobristLow = new Array(8);
    g_zobristHigh = new Array(8);
    for (var i = 0; i < 8; i++) {
        g_zobristLow[i] = new Array(8);
        g_zobristHigh[i] = new Array(8);
        for (var j = 0; j < 8; j++) {
            g_zobristLow[i][j] = new Array(8);
            g_zobristHigh[i][j] = new Array(8);
            for (var k = 0; k < 12; k++) {
                g_zobristLow[i][j][k] = mt.next(32);
                g_zobristHigh[i][j][k] = mt.next(32);
            }
        }
    }
    g_zobristBlackLow = mt.next(32);
    g_zobristBlackHigh = mt.next(32);
}

function ZobristHash(board, color) {
    var result = new Object();
    result.hashKeyLow = 0;
    result.hashKeyHigh = 0;

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var piece = board[i][j];
            if (piece === null) {
                result.hashKeyLow ^= g_zobristLow[i][j][-1];
                result.hashKeyHigh ^= g_zobristHigh[i][j][-1];
                continue;
            }
            if (piece.type === 'p') {
                if (piece.color === 'w') {
                    result.hashKeyLow ^= g_zobristLow[i][j][0];
                    result.hashKeyHigh ^= g_zobristHigh[i][j][0];
                }
                else {
                    result.hashKeyLow ^= g_zobristLow[i][j][6];
                    result.hashKeyHigh ^= g_zobristHigh[i][j][6];
                }
            }
            else if (piece.type === 'n') {
                if (piece.color === 'w') {
                    result.hashKeyLow ^= g_zobristLow[i][j][1];
                    result.hashKeyHigh ^= g_zobristHigh[i][j][1];
                }
                else {
                    result.hashKeyLow ^= g_zobristLow[i][j][7];
                    result.hashKeyHigh ^= g_zobristHigh[i][j][7];
                }
            }
            else if (piece.type === 'b') {
                if (piece.color === 'w') {
                    result.hashKeyLow ^= g_zobristLow[i][j][2];
                    result.hashKeyHigh ^= g_zobristHigh[i][j][2];
                }
                else {
                    result.hashKeyLow ^= g_zobristLow[i][j][8];
                    result.hashKeyHigh ^= g_zobristHigh[i][j][8];
                }
            }
            else if (piece.type === 'r') {
                if (piece.color === 'w') {
                    result.hashKeyLow ^= g_zobristLow[i][j][3];
                    result.hashKeyHigh ^= g_zobristHigh[i][j][3];
                }
                else {
                    result.hashKeyLow ^= g_zobristLow[i][j][9];
                    result.hashKeyHigh ^= g_zobristHigh[i][j][9];
                }
            }
            else if (piece.type === 'q') {
                if (piece.color === 'w') {
                    result.hashKeyLow ^= g_zobristLow[i][j][4];
                    result.hashKeyHigh ^= g_zobristHigh[i][j][4];
                }
                else {
                    result.hashKeyLow ^= g_zobristLow[i][j][10];
                    result.hashKeyHigh ^= g_zobristHigh[i][j][10];
                }
            }
            else if (piece.type === 'k') {
                if (piece.color === 'w') {
                    result.hashKeyLow ^= g_zobristLow[i][j][5];
                    result.hashKeyHigh ^= g_zobristHigh[i][j][5];
                }
                else {
                    result.hashKeyLow ^= g_zobristLow[i][j][11];
                    result.hashKeyHigh ^= g_zobristHigh[i][j][11];
                }
            }
        }
    }
    if (color === 'b') {
        result.hashKeyLow ^= g_zobristBlackLow;
        result.hashKeyHigh ^= g_zobristBlackHigh;
    }
    
    return result;
}

// alpha beta
// var hashNode = g_hashTable[g_hashKeyLow & g_hashMask];
// (hashNode != null && hashNode.lock == g_hashKeyHigh)
// StoreHash(realEval, hashflagAlpha, ply, hashMove, depth);


//var hashResult = ZobristHash(game.board(), 'w');
//g_hashKeyLow = hashResult.hashKeyLow;
//g_hashKeyHigh = hashResult.hashKeyHigh;
//console.log(g_hashKeyLow);
//console.log(g_hashKeyHigh);