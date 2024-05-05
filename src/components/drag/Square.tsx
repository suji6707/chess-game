/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useRef, useState } from "react";

import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "invariant";
import { Coord, isEqualCoord } from "./Board";
import { PieceRecord, PieceType } from "./Piece";

type SquareProps = {
  pieces: PieceRecord[]; // pieces일 필요가 없음?. 배열에 piece를 넣을거라
  location: Coord;
  children?: React.ReactNode; // children: 컴포넌트 내부에 포함될 자식 요소들(주로 JSX 요소)
};

type HoveredState = "idle" | "validMove" | "invalidMove";

export function isCoord(token: unknown): token is Coord {
  return (
    Array.isArray(token) &&
    token.length === 2 &&
    token.every((val) => typeof val === "number")
  );
}

const pieceTypes: PieceType[] = ["king", "pawn"];

export function isPieceType(value: unknown): value is PieceType {
  return typeof value === "string" && pieceTypes.includes(value as PieceType);
}

function getColor(state: HoveredState, isDark: boolean): string {
  if (state === "validMove") {
    return "lightgreen";
  } else if (state === "invalidMove") {
    return "pink";
  }
  return isDark ? "lightgrey" : "white";
}

/**
 * 말의 시작과 타겟지점, 말의 타입을 알고 있음.
 * distance = abs(start - dest)
 * 1. start 와 dest가 같으면 False (1이 2에 포함됨)
 * 2. dest에 내 편의 다른 말이 있으면 False
 * 3. 말의 타입에 따라 distance가 허용가능한지 판단.
 */
export function canMove(
  start: Coord,
  dest: Coord,
  pieceType: PieceType,
  pieces: PieceRecord[]
) {
  // dest의 좌표위치와 기존 말들의 위치를 비교
  const exist = pieces.find((piece) => isEqualCoord(piece.location, dest));
  if (exist) return false;

  console.log(start, dest, pieceType);

  const rowDist = Math.abs(start[0] - dest[0]);
  const colDist = Math.abs(start[1] - dest[1]);

  switch (pieceType) {
    case "king":
      if ([0, 1].includes(rowDist) && [0, 1].includes(colDist)) {
        return true;
      }
    case "pawn":
      if (colDist === 0 && start[0] - dest[0] === -1) {
        return true;
      }
    default:
      return false;
  }
}

export function Square({ pieces, location, children }: SquareProps) {
  const ref = useRef(null);
  const [state, setState] = useState<HoveredState>("idle");

  useEffect(() => {
    const el = ref.current;
    invariant(el, "Invalid Element");

    return dropTargetForElements({
      element: el,
      getData: () => ({ location }),
      canDrop: ({ source }) => {
        if (!isCoord(source.data.location)) {
          return false;
        }
        // start=dest면 상호작용 자체를 막음(canMove로 가지도 않음)
        return !isEqualCoord(source.data.location, location);
      },
      // 타겟이 드래그될 때마다 불림
      onDragEnter: ({ source }) => {
        // source is the piece being dragged over the drop target
        if (
          // type guards
          !isCoord(source.data.location) ||
          !isPieceType(source.data.pieceType)
        ) {
          return;
        }

        console.log(source);
        // 현재 유저가 선택한 ref = source
        if (
          canMove(
            source.data.location,
            location,
            source.data.pieceType as PieceType,
            pieces
          )
        ) {
          setState("validMove");
        } else {
          setState("invalidMove");
        }
      },
      onDragLeave: () => setState("idle"),
      onDrop: () => setState("idle"),
    });
  }, [location, pieces]);

  const isDark = (location[0] + location[1]) % 2 === 1; // 맨 윗줄부터

  return (
    <div
      css={squareStyles}
      style={{ backgroundColor: getColor(state, isDark) }}
      ref={ref}
    >
      {children}
    </div>
  );
}

const squareStyles = css({
  //   display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",
  gridTemplateRows: "repeat(8, 1fr)",
  width: "100%",
  height: "100%",
  border: "3px solid lightgrey",
});
