import { Color, FENChar } from "./models";
import { Bishop } from "./pieces/bishop";
import { King } from "./pieces/king";
import { Knight } from "./pieces/knight";
import { Pawn } from "./pieces/pawn";
import { Piece } from "./pieces/piece";
import { Queen } from "./pieces/queen";
import { Rook } from "./pieces/rook";

export class ChessBoard {
	private chessBoard: (Piece | null)[][];
	private readonly chessBoardSize = 8;
	private _playerColor = Color.White;

	constructor() {
		this.chessBoard = [
			[
				new Rook(Color.White), new Knight(Color.White), new Bishop(Color.White), new Queen(Color.White), 
				new King(Color.White), new Bishop(Color.White), new Knight(Color.White), new Rook(Color.White)
			],
            [
                new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White),
                new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White), new Pawn(Color.White)
            ],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [
                new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black),
                new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black), new Pawn(Color.Black)
            ],
			[
				new Rook(Color.Black), new Knight(Color.Black), new Bishop(Color.Black), new Queen(Color.Black), 
				new King(Color.Black), new Bishop(Color.Black), new Knight(Color.Black), new Rook(Color.Black)
			]
		]
	}

	get playerColor(): Color {
		return this._playerColor;
	}

	get chessBoardView(): (FENChar | null)[][] {
		return this.chessBoard.map(row => row.map(piece => piece instanceof Piece ? piece.FENChar : null));
	}

	static isSquareDark(x: number, y: number): boolean {
		return x % 2 === 0 && y % 2 === 0 || x % 2 === 1 && y % 2 === 1;
	}

	private areCoordsValid(x: number, y: number): boolean {
		return x >= 0 && y >=0 && x < this.chessBoardSize && y < this.chessBoardSize
	}

	// public isInCheck(playerColor: Color): boolean {
	// 	for (let x = 0; x < this.chessBoardSize; x++) {
	// 		for (let y = 0; y < this.chessBoardSize; y++) {
	// 			const piece = this.chessBoard[x][y];

	// 			// 상대방이 나를 공격할 수 있는 위치만 고려. playerColor는 나의 컬러
	// 			if (!piece || piece.color === playerColor) continue;

	// 			for (const {x: dx, y: dy} of piece.directions) {
	// 				let newX = x + dx;
	// 				let newY = y + dy;

	// 				if (!this.areCoordsValid(newX, newY)) continue;

	// 				// piece 조건 추가
	// 				// pawns are only attacking diagonally
	// 				if (piece instanceof Pawn && dy === 0) continue;
	// 				const attackedPiece = this.chessBoard[newX][newY];
	// 				if (attackedPiece instanceof King && attackedPiece.color === playerColor) {
	// 					return true;
	// 				}

	// 				// Bisop, Rooks, Queens can't move over the other pieces
	// 			}
	// 		}
	// 	}
	// 	return false;
	// }
}