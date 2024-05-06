import { ChessBoard } from "@/services/chess-board/chess-board";
import { SelectedSquare } from "@/services/chess-board/models";
import {
  CheckState,
  Color,
  Coords,
  FENChar,
  LastMove,
  SafeSquares,
  pieceImagePaths,
} from "@/services/chess-logic/models";
import React, { useState } from "react";

export default function ChessBoardComponent() {
  const [chessBoard, setChessBoard] = useState<ChessBoard>(new ChessBoard());
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
  const [lastMove, setLastMove] = useState<LastMove | undefined | null>();
  const [checkState, setCheckState] = useState<CheckState>(
    chessBoard.checkState
  );

  // ================== functions ==================
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

  // ===== Last move check =====
  const isSquareLastMove = (x: number, y: number): boolean => {
    if (!lastMove) return false;
    const { prevX, prevY, currX, currY } = lastMove;
    return (x === prevX && y === prevY) || (x === currX && y === currY);
  };

  const isSquareChecked = (x: number, y: number): boolean => {
    return checkState.isInCheck && checkState.x === x && checkState.y === y;
  };

  const unmarkingPreviouslySelectedAndSafeSquares = (): void => {
    setSelectedSquare({ piece: null });
    setPieceSafeSquares([]);
  };

  // ===== Set pieces =====
  const selectingPiece = (x: number, y: number): void => {
    const piece: FENChar | null = chessBoardView[x][y];
    if (!piece) return;
    if (isWrongPieceSelected(piece)) return;

    // isSameSquareClicked ?
    // unmarkingPreviouslySelectedAndSafeSquares();

    setSelectedSquare({ piece, x, y });
    console.log(safeSquares.get(x + "," + y) || []);
    setPieceSafeSquares(safeSquares.get(x + "," + y) || []);
  };

  const placingPiece = (newX: number, newY: number): void => {
    if (!selectedSquare.piece) return;
    if (!isSquareSafeForSelectedPiece(newX, newY)) return;

    const { x: prevX, y: prevY } = selectedSquare;
    updateBoard(prevX, prevY, newX, newY);
  };

  const updateBoard = (
    prevX: number,
    prevY: number,
    newX: number,
    newY: number
  ): void => {
    // chessBoard 상태 변경
    const newChessBoard = ChessBoard.copy(chessBoard);
    newChessBoard.move(prevX, prevY, newX, newY); // view 배열 및 safeSquares도 업데이트됨
    setChessBoard(newChessBoard);
    setChessBoardView(newChessBoard.chessBoardView);
    setPlayerColor(newChessBoard.playerColor);
    setSafeSquares(newChessBoard.safeSquares);

    setCheckState(newChessBoard.checkState);
    setLastMove(newChessBoard.lastMove);
    // markLastMoveAndCheckState;
    unmarkingPreviouslySelectedAndSafeSquares();
  };

  // const markLastMoveAndCheckState()

  // unmarkingPreviouslySlectedAndSafeSquares

  const isWrongPieceSelected = (piece: FENChar): boolean => {
    const isWhitePieceSelected = piece === piece.toUpperCase();
    return (
      (isWhitePieceSelected && playerColor === Color.Black) ||
      (!isWhitePieceSelected && playerColor === Color.White)
    );
  };

  const move = (x: number, y: number): void => {
    console.log("MOVE", chessBoard.playerColor);
    selectingPiece(x, y);
    placingPiece(x, y);
  };

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
                className={`square ${isSquareDark(x, y) ? "dark" : "light"} 
                  ${isSquareSelected(x, y) ? "selected-square" : ""} 
                  ${isSquareLastMove(x, y) ? "last-move" : ""}
                  ${isSquareChecked(x, y) ? "king-in-check" : ""}
                  `}
                onClick={() => move(x, y)}
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
}
