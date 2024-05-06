import { ChessBoard } from "@/services/chess-board/chess-board";
import { SelectedSquare } from "@/services/chess-board/models";
import {
  Color,
  Coords,
  FENChar,
  SafeSquares,
  pieceImagePaths,
} from "@/services/chess-logic/models";
import Image from "next/image";
import React, { useState } from "react";

export const ChessBoardComponent = () => {
  const chessBoard = new ChessBoard();
  const [chessBoardView, setChessBoardView] = useState<(FENChar | null)[][]>(
    chessBoard.chessBoardView
  );
  const [playerColor, setPlayerColor] = useState<Color>(chessBoard.playerColor);
  const [safeSquares, setSafeSquares] = useState<SafeSquares>(
    chessBoard.safeSquares
  );
  const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>({
    piece: null,
  });
  const [pieceSafeSquares, setPieceSafeSquares] = useState<Coords[]>([]);

  const isSquareDark = (x: number, y: number): boolean => {
    return ChessBoard.isSquareDark(x, y);
  };

  const isSquareSelected = (x: number, y: number): boolean => {
    if (!selectedSquare.piece) return false;
    return selectedSquare.x === x && selectedSquare.y === y;
  };

  const isSquareSafeForSelectedPiece = (x: number, y: number): boolean => {
    // 안전한 좌표 배열 중 하나라도 속하는가
    return pieceSafeSquares.some((coords) => coords.x === x && coords.y === y);
  };

  const selectingPiece = (x: number, y: number): void => {
    const piece: FENChar | null = chessBoardView[x][y];
    if (!piece) return;

    setSelectedSquare({ piece, x, y });
    setPieceSafeSquares(safeSquares.get(x + "," + y) || []);
    console.log("pieceSafeSquares", pieceSafeSquares);
  };

  console.log("safeSquares", safeSquares);

  /**
   * 하나라도 클릭하는 순간 8 * 8 좌표의 리렌더링이 일어남.
   * 1. 말 하나를 클릭한다
   * 2. pieceSafeSquares에 안전한 좌표 배열이 입력된다
   * 3. 리렌더링될 때 각 좌표를 돌면서 pieceSafeSquares 배열에 포함되면 safe 표시를 한다
   */
  return (
    <div>
      <div className="chess-board">
        {chessBoardView.map((row, x) => (
          <div key={x} className="row">
            {row.map((piece, y) => (
              <div
                key={y}
                className={`square ${isSquareDark(x, y) ? "dark" : "light"} ${
                  isSquareSelected(x, y) ? "selected-square" : ""
                }`}
                onClick={() => selectingPiece(x, y)}
              >
                <div
                  className={`${
                    isSquareSafeForSelectedPiece(x, y) ? "safe-square" : ""
                  }`}
                ></div>
                {piece && (
                  <div className="piece">
                    <img src={pieceImagePaths[piece]} alt="piece" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
