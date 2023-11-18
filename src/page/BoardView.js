import { useParams } from "react-router-dom";
import { Box, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function BoardView() {
  const [board, setBoard] = useState(null);

  // 구조분해할당으로 {} 사용
  // 각 행을 클릭했을때 id번호가 넘어감
  const { id } = useParams();

  useEffect(() => {
    axios.get("/api/board/id/" + id).then((response) => setBoard(board));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>글 보기</h1>
      <p>번호 : {board.id}</p>
      <p>제목 : {board.title}</p>
      <p>본문 : {board.content}</p>
      <p>작성자 : {board.writer}</p>
      <p>작성일시 : {board.inserted}</p>
    </Box>
  );
}
