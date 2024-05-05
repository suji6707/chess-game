import { pieceImagePaths } from "@/services/chess-logic/models";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ReactElement, useEffect, useRef, useState } from "react";

import { King, Pawn, PieceRecord, PieceType } from "./Piece";
import { Square } from "./Square";

/** 구성요소들
 * randerSquares
 * - 모든 칸을 렌더링. 위치에 말이 있으면 렌더링
 *
 * 컴포넌트는 우선 두 개.
 * 1. Piece 컴포넌트 - 여러 말들이 이것을 상속함
 * 2. Chessboard 컴포넌트
 * - pieces: 말의 종류와 위치를 결정
 * 3. Squares 컴포넌트 - drop out 구현
 *
 */

/** 효과들
 * 1. Draggable Pieces
 * 드래그할 때 fade하게 보이기 위해 onDragStart, onDrop 인자를 넣을 것.
 * 이를 통해 style내 css에 적용해 opacity를 조작할 것.
 *
 * 2. Make Squares can be 'dropped' onto
 * dropTargetForElements function
 * - Drop targets: 드래거블 elem이 떨어질 타겟 장소.
 * - Squares 컴포넌트를 만들어보자.
 *
 * 3. 드롭 가능여부에 따른 색깔
 * - 적합하면 green, 아니면 red
 * - getInitialData 인자: piece 타입 및 시작 location을 판단.
 */

export type Coord = [number, number];

// 인자로 타입만 넘겨주면 해당 컴포넌트를 반환
export const pieceLookup: {
  [Key in PieceType]: (squareCoord: Coord) => ReactElement;
} = {
  king: (squareCoord: Coord) => (
    <King location={squareCoord} pieceType={"king"} />
  ),
  pawn: (squareCoord: Coord) => (
    <Pawn location={squareCoord} pieceType={"pawn"} />
  ),
};

export function isEqualCoord(c1: Coord, c2: Coord): boolean {
  return c1[0] === c2[0] && c1[1] === c2[1];
}

function renderSquares(pieces: PieceRecord[]) {
  const squares = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      // 현재 좌표
      const squareCoord: Coord = [row, col];

      const piece = pieces.find((piece) =>
        isEqualCoord(piece.location, squareCoord)
      );

      squares.push(
        <Square location={squareCoord} pieces={pieces}>
          {piece && pieceLookup[piece.type](squareCoord)}
        </Square>
      );
    }
  }
  return squares;
}

export function ChessBoard() {
  const pieces: PieceRecord[] = [
    { type: "king", location: [3, 2] },
    { type: "pawn", location: [1, 6] },
  ];
  return <div css={chessboardStyles}>{renderSquares(pieces)}</div>;
}

const chessboardStyles = css({
  display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",
  gridTemplateRows: "repeat(8, 1fr)",
  width: "600px",
  height: "600px",
  border: "3px solid lightgrey",
});
