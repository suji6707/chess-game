import { pieceImagePaths } from "@/services/chess-logic/models";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ReactElement } from "react";
/**
 * randerSquares
 * - 모든 칸을 렌더링. 위치에 말이 있으면 렌더링
 *
 * Chessboard 컴포넌트
 * - pieces: 말의 종류와 위치를 결정
 * -
 */

export type PieceType = "king" | "pawn";

type PieceProps = {
  image: string;
  alt: string;
};

export type Coord = [number, number];

export type PieceRecord = {
  type: PieceType;
  location: Coord;
};

// 인자로 타입만 넘겨주면 해당 컴포넌트를 반환
export const pieceLookup: {
  [Key in PieceType]: () => ReactElement;
} = {
  king: () => <King />,
  pawn: () => <Pawn />,
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

      const isDark = (row + col) % 2 === 1; // 맨 윗줄부터

      squares.push(
        <div
          css={squareStyles}
          style={{ backgroundColor: isDark ? "lightgrey" : "white" }}
        >
          {piece && pieceLookup[piece.type]()}
        </div>
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

function Piece({ image, alt }: PieceProps) {
  return <img css={imageStyles} src={image} alt={alt} />; // draggable="false"
}

export function King() {
  return <Piece image={pieceImagePaths["K"]} alt="King" />;
}

export function Pawn() {
  return <Piece image={pieceImagePaths["P"]} alt="Pawn" />;
}

const chessboardStyles = css({
  display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",
  gridTemplateRows: "repeat(8, 1fr)",
  width: "700px",
  height: "700px",
  border: "3px solid lightgrey",
});

const squareStyles = css({
  //   display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",
  gridTemplateRows: "repeat(8, 1fr)",
  width: "100%",
  height: "100%",
  border: "3px solid lightgrey",
});

const imageStyles = css({
  width: "100%",
  height: "100%",
  margin: "auto", // 중앙 정렬
  display: "block", // 블록 요소로 설정하여 margin: auto가 작동하도록 함
  padding: 4,
  borderRadius: 6,
  boxShadow:
    "1px 3px 3px rgba(9, 30, 66, 0.25),0px 0px 1px rgba(9, 30, 66, 0.31)",
  "&:hover": {
    backgroundColor: "rgba(168, 168, 168, 0.25)",
  },
});
