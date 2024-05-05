/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useRef, useState } from "react";

import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "invariant";
import { Coord, PieceRecord } from "./Board";

type SquareProps = {
  location: Coord;
  children?: React.ReactNode; // children: 컴포넌트 내부에 포함될 자식 요소들(주로 JSX 요소)
  pieces?: PieceRecord[]; // pieces일 필요가 없음. 배열에 piece를 넣을거라
};

function getColor(isDraggedOver: boolean, isDark: boolean): string {
  if (isDraggedOver) {
    return "skyblue";
  }
  return isDark ? "lightgrey" : "white";
}

export function Square({ location, children }: SquareProps) {
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el, "Invalid element");

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

  const isDark = (location[0] + location[1]) % 2 === 1; // 맨 윗줄부터

  return (
    <div
      css={squareStyles}
      style={{ backgroundColor: getColor(isDraggedOver, isDark) }}
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
