import { ChessBoard } from "@/services/chess-logic/chess-board";
import { Color, FENChar, pieceImagePaths } from "@/services/chess-logic/models";
import Image from "next/image";
import React, { useState } from "react";

export const ChessBoardComponent = () => {
  const chessBoard = new ChessBoard();

  const [chessBoardView, setChessBoardView] = useState<(FENChar | null)[][]>(
    chessBoard.chessBoardView
  );
  const [playerColor, setPlayerColor] = useState<Color>(chessBoard.playerColor);

  const isSquareDark = (x: number, y: number): boolean =>
    ChessBoard.isSquareDark(x, y);

  return (
    <div>
      <div className="chess-board">
        {chessBoardView.map((row, x) => (
          <div key={x} className="row">
            {row.map((piece, y) => (
              <div
                key={y}
                className={`square ${isSquareDark(x, y) ? "dark" : "light"}`}
              >
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
