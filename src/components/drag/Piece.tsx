import { pieceImagePaths } from "@/services/chess-logic/models";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "invariant";
import { useEffect, useRef, useState } from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Coord } from "./Board";

export type PieceType = "king" | "pawn";

export type PieceRecord = {
  type: PieceType;
  location: Coord;
};

type PieceProps = {
  location: Coord;
  pieceType: PieceType;
  image?: string;
  alt?: string;
};

export const Piece = ({ location, pieceType, image, alt }: PieceProps) => {
  const ref = useRef(null); //  DOM 요소에 직접적인 접근
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current; // img element가 렌더링된 후 ref.current는 이 이미지 요소를 직접 가리키게 됨
    invariant(el, "Invalid element");

    return draggable({
      element: el,
      getInitialData: () => ({ location, pieceType }), // source.data의 속성으로 들어감
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [location, pieceType]);

  return (
    <img
      css={[dragging && hidePieceStyles, imageStyles]}
      src={image}
      alt={alt}
      ref={ref}
    />
  );
};

export function King({ location, pieceType }: PieceProps) {
  return (
    <Piece
      image={pieceImagePaths["K"]}
      alt="King"
      location={location}
      pieceType={pieceType}
    />
  );
}

export function Pawn({ location, pieceType }: PieceProps) {
  return (
    <Piece
      image={pieceImagePaths["P"]}
      alt="Pawn"
      location={location}
      pieceType={pieceType}
    />
  );
}

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

const hidePieceStyles = css({
  opacity: 0.5,
  cursor: "grabbing",
});
