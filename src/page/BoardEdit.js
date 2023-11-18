import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);

  // /edit/:id
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleSubmit() {
    // 저장버튼 클릭시 실행되는 함수
    // PUT /api/board/edit

    axios
      .put("/api/board/edit", board)
      .then(() => console.log("good"))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
  }

  return (
    <Box>
      <h1>{id}번 글 수정</h1>

      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={board.title}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.title = e.target.value;
            })
          }
        />
      </FormControl>

      <FormControl>
        <FormLabel>본문</FormLabel>
        <Input
          value={board.content}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.content = e.target.value;
            })
          }
        />
      </FormControl>

      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input
          value={board.writer}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.writer = e.target.value;
            })
          }
        />
      </FormControl>

      <Button colorScheme="blue" onClick={handleSubmit}>
        저장
      </Button>
      {/* -1은 이전화면 */}
      <Button onClick={() => navigate(-1)}>취소</Button>
    </Box>
  );
}
