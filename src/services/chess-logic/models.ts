export enum Color {
	White,
	Black
}

export type Coords = {
	x: number,
	y: number
};

export enum FENChar {
	WhitePawn = 'P',
	WhiteKnight = 'N',
	WhiteBishop = 'B',
	WhiteRook = 'R',
	WhiteQueen = 'Q',
	WhiteKing = 'K',
	BlackPawn = 'p',
	BlackKnight = 'n',
	BlackBishop = 'b',
	BlackRook = 'r',
	BlackQueen = 'q',
	BlackKing = 'k',
}

export const pieceImagePaths: Readonly<Record<FENChar, string>> = {
	[FENChar.WhitePawn]: "/pieces/white pawn.svg",
	[FENChar.WhiteKnight]: "/pieces/white knight.svg",
	[FENChar.WhiteBishop]: "/pieces/white bishop.svg",
	[FENChar.WhiteRook]: "/pieces/white rook.svg",
	[FENChar.WhiteQueen]: "/pieces/white queen.svg",
	[FENChar.WhiteKing]: "/pieces/white king.svg",
	[FENChar.BlackPawn]: "/pieces/black pawn.svg",
	[FENChar.BlackKnight]: "/pieces/black knight.svg",
	[FENChar.BlackBishop]: "/pieces/black bishop.svg",
	[FENChar.BlackRook]: "/pieces/black rook.svg",
	[FENChar.BlackQueen]: "/pieces/black queen.svg",
	[FENChar.BlackKing]: "/pieces/black king.svg",
}