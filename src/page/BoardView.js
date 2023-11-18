import { useParams } from "react-router-dom";
import { Box, FormControl, FormLabel, Input, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function BoardView() {
  const [board, setBoard] = useState(null);

  // 구조분해할당으로 {} 사용
  // 각 행을 클릭했을때 id번호가 넘어감
  const { id } = useParams();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>{board.id}번 글 보기</h1>

      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={board.title} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>본문</FormLabel>
        <Input value={board.content} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input value={board.writer} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>작성일시</FormLabel>
        <Input value={board.inserted} readOnly />
      </FormControl>
    </Box>
  );
}
