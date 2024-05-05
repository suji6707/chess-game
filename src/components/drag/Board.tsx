/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ReactElement, useEffect, useRef, useState } from "react";

import { King, Pawn, PieceRecord, PieceType } from "./Piece";
import { Square, canMove, isCoord, isPieceType } from "./Square";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

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
 *
 * 4. Moving Pieces
 * 실제로 위치 이동시키기.
 * - monitorForElements: 드래그앤 드롭 인터렉션을 모니터링하면서 데이터를 전달
 * - useEffect 안에서 square에 드롭이 발생하는지 listen for.
 * - 이를 위해선 drop target내 square의 위치를 알아야.
 *
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

/**
 * drop 위치에 따라 piece location 속성값을 바꿔야 함.
 * source - location: 클릭한 말의 위치
 * dest - location: 드롭하려는 요소의 위치
 *
 */
export function ChessBoard() {
  const [pieces, setPieces] = useState<PieceRecord[]>([
    { type: "king", location: [3, 2] },
    { type: "pawn", location: [1, 6] },
  ]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          // if dropped outside of any drop targets
          return;
        }
        const destinationLocation = destination.data.location;
        const sourceLocation = source.data.location;
        const pieceType = source.data.pieceType;

        if (
          !isCoord(destinationLocation) ||
          !isCoord(sourceLocation) ||
          !isPieceType(pieceType)
        ) {
          return;
        }

        // 이동하려는 source에 해당하는 말을 찾는다
        const piece = pieces.find((p) =>
          isEqualCoord(p.location, sourceLocation)
        );
        const restOfPieces = pieces.filter((p) => p !== piece);

        if (
          piece &&
          canMove(sourceLocation, destinationLocation, pieceType, pieces)
        ) {
          // moving the piece!
          setPieces([
            { type: piece.type, location: destinationLocation },
            ...restOfPieces,
          ]);
        }
      },
    });
  }, [pieces]);

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
