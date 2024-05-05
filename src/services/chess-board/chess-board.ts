import { Color, Coords, FENChar, SafeSquares } from "../chess-logic/models";
import { Bishop } from "../chess-logic/pieces/bishop";
import { King } from "../chess-logic/pieces/king";
import { Knight } from "../chess-logic/pieces/knight";
import { Pawn } from "../chess-logic/pieces/pawn";
import { Piece } from "../chess-logic/pieces/piece";
import { Queen } from "../chess-logic/pieces/queen";
import { Rook } from "../chess-logic/pieces/rook";

export class ChessBoard {
	private chessBoard: (Piece | null)[][];
	private readonly chessBoardSize = 8;
	private _playerColor = Color.White;
	private _safeSquares: SafeSquares;  // 체스보드 생성과 동시에 안전한 이동가능 좌표를 모두 입력

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
		];
		this._safeSquares = this.findSafeSquares()
	}

	get playerColor(): Color {
		return this._playerColor;
	}

	get chessBoardView(): (FENChar | null)[][] {
		return this.chessBoard.map(row => row.map(piece => piece instanceof Piece ? piece.FENChar : null));
	}

	get safeSquares(): SafeSquares {
		return this._safeSquares
	}

	static isSquareDark(x: number, y: number): boolean {
		return x % 2 === 0 && y % 2 === 0 || x % 2 === 1 && y % 2 === 1;
	}

	private areCoordsValid(x: number, y: number): boolean {
		return x >= 0 && y >=0 && x < this.chessBoardSize && y < this.chessBoardSize
	}

	// 1 - 2 - 3 순으로 3중 for문
	// 3. 상대편 모든 말의 이동 경우의 수를 체크
	isInCheck(playerColor: Color): boolean {
		for (let x = 0; x < this.chessBoardSize; x++) {
			for (let y = 0; y < this.chessBoardSize; y++) {
				const piece = this.chessBoard[x][y];

				// 상대편 말이 아니면 건너뜀
				if (!piece || piece.color === playerColor) continue;

				// 상대편 말이 이동할 수 있는 모든 경우의 수
				for (const {x: dx, y: dy} of piece.directions) {
					let newX = x + dx;
					let newY = y + dy;

					if (!this.areCoordsValid(newX, newY)) continue;
					
					if (piece instanceof Pawn || piece instanceof Knight || piece instanceof King) {
						// pawns are only attacking diagonally
						if (piece instanceof Pawn && dy === 0) continue;
						// 이동할 수 있는 위치에 내 왕이 있으면 Check
						const attackedPiece = this.chessBoard[newX][newY];
						if (attackedPiece instanceof King && attackedPiece.color === playerColor) {
							return true;
						}
					} else {
						// Bisop, Rooks, Queens can't move over the other pieces
						while (this.areCoordsValid(newX, newY)) {
							const attackedPiece = this.chessBoard[newX][newY];
							if (attackedPiece instanceof King && attackedPiece.color === playerColor) {
								return true;
							}
							if (attackedPiece !== null) break;

							newX += dx;
							newY += dy;
						}
					}
				}
			}
		}
		return false;
	}

	// 2. 내 말을 이동시켰을 때 시뮬레이션
	private isPositionSafeAfterMove(piece: Piece, prevX: number, prevY: number, newX: number, newY: number): boolean {
		const newPiece = this.chessBoard[newX][newY]
		// 내 말이 이미 존재
		if (newPiece && newPiece.color == piece.color) return false; 

		// simulate posision -> 이동한 상황을 가정해야만 상대편 시뮬레이션 가능
		this.chessBoard[prevX][prevY] = null;
		this.chessBoard[newX][newY] = piece

		const isPositionSafe: boolean = !this.isInCheck(piece.color)

		// restore position back
		this.chessBoard[prevX][prevY] = piece;
		this.chessBoard[newX][newY] = null

		return isPositionSafe
	}

	// 1. 나의 모든 말에 대해 이동할 수 있는 좌표를 담는 것
	private findSafeSquares(): SafeSquares {
		const safeSquares: SafeSquares = new Map<string, Coords[]>()

		for (let x = 0; x < this.chessBoardSize; x++) {
			for (let y = 0; y < this.chessBoardSize; y++) {
				const piece = this.chessBoard[x][y];

				// 나의 모든 말에 대한 이동 경우의 수 
				if (!piece || piece.color !== this._playerColor) continue;

				const pieceSafeSquares: Coords[] = []

				for (const {x: dx, y: dy} of piece.directions) {
					let newX = x + dx;
					let newY = y + dy;

					if (!this.areCoordsValid(newX, newY)) continue;
					
					let target = this.chessBoard[newX][newY];
					if (target && target.color === piece.color) continue; // 내 말이면 건너뜀. safe 판단에서 제외

					if (piece instanceof Pawn) {
						if (dx === 2 || dx === -2) {
							if (target) continue;
							// dx === 2 : Black, -2 : White
							// 2칸 앞으로 가고자 한다면 기물이 없는곳 까지만 가능
							if (this.chessBoard[newX + (dx === 2 ? -1 : 1)][newY]) continue;
						}
						// 1칸 앞으로 가고자 할 때도 마찬가지.
						if ((dx === 1 || dx === -1) && dy === 0 && target) continue;

						// 대각선으로 이동하려면 상대를 공격할 때만임
						if ((dy === 1 || dy === -1) && (!target || piece.color === target.color)) continue;
					}

					if (piece instanceof Pawn || piece instanceof Knight || piece instanceof King) {
						if (this.isPositionSafeAfterMove(piece, x, y, newX, newY)) {
							pieceSafeSquares.push({x: newX, y: newY})
						}
					} else {
						// Bisop, Rooks, Queens can't move over the other pieces
						while (this.areCoordsValid(newX, newY)) {
							target = this.chessBoard[newX][newY];
							// 상대편 말이면 제거하면 됨(isSafe)
							if (target && target.color === piece.color) break;

							if (this.isPositionSafeAfterMove(piece, x, y, newX, newY)) {
								pieceSafeSquares.push({x: newX, y: newY})
							}

							if (target !== null) break;

							newX += dx;
							newY += dy;
						}
					}
				}

				if (pieceSafeSquares.length) {
					safeSquares.set(x + ',' + y, pieceSafeSquares)
				}
			}
		}
		return safeSquares
	}

}