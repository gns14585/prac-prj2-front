import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function BoardView() {
  const [board, setBoard] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  // 구조분해할당으로 {} 사용
  // 각 행을 클릭했을때 id번호가 넘어감
  const { id } = useParams();

  useEffect(() => {
    axios
      // +id를 하는 이유는 각 행을 누르게 되면 board/id번호가 나오는데
      // 그 id번호에 대한 걸 백엔드에 넘겨야 하기 때문
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      // 여기서 +id도 위 get요청과 마찬가지로 같은개념임
      .delete("/api/board/remove/" + id)
      .then((response) => {
        toast({
          description: id + "번 게시물이 삭제되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose());
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

      <Button colorScheme="purple">수정</Button>
      <Button colorScheme="red" onClick={onOpen}>
        삭제
      </Button>

      {/* 삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
