import { Color, Coords, FENChar } from "../models";
import { Piece } from "./piece";

export class Pawn extends Piece {
    public _hasMoved: boolean;
	protected _FENChar: FENChar;
	protected _directions: Coords[] = [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: -1 },
	]

	constructor(private pieceColor: Color) {
		super(pieceColor);
        if (pieceColor === Color.Black) {
            this.setBlackPawnDirections();
        }
        this._hasMoved = false;
		this._FENChar = pieceColor === Color.White ? FENChar.WhitePawn : FENChar.BlackPawn;
	}

    // 블랙이면 x 이동방향이 반대임
    private setBlackPawnDirections(): void {
        this._directions = this._directions.map(({x, y}) => ({x: -1 * x, y}))
    }

	get hasMoved(): boolean {
        return this._hasMoved;
    }

    // 처음에만 앞으로 두 칸 이동 가능
    set hasMoved(value: boolean) {
        this._hasMoved = value;
        this._directions = [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: -1 },
        ]
        if (this.pieceColor === Color.Black) {
            this.setBlackPawnDirections();
        }
    }
}