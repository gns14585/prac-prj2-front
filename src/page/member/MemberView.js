import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import axios from "axios";

export function MemberView() {
  const [member, setMember] = useState(null);

  // /member?id=userid
  // useSearchParams는 구조분해할당 [] 로 받아와야함
  const [params] = useSearchParams();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const toast = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/member?" + params.toString())
      .then((response) => setMember(response.data));
  }, []);

  if (member == null) {
    return <Spinner />;
  }

  function handleDelete() {
    // axios
    // delete /api/member?id=userid
    // ok -> home 이동, toast 띄우기
    // error -> toast 띄우기
    // finally -> modal 닫기
    axios
      .delete("api/member?" + params.toString())
      .then(() => {
        toast({
          description: "회원 탈퇴 되었습니다.",
          status: "success",
        });
        navigate("/"); // 탈퇴 후 home 으로 이동
        // TODO : 로그아웃 기능 추가하기
      })
      .catch((error) => {
        // 401은 로그인 안했으니 권한없음
        // 403은 접근할 권한 없음
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "error",
          });
        } else {
          // 그 외 다른 에러 ex)탈퇴 중 문제
          toast({
            description: "탈퇴 처리 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        onClose();
      });
  }

  return (
    <Box>
      <h1>{member.id}님 정보</h1>

      <FormControl>
        <FormLabel>password</FormLabel>
        <Input type="text" value={member.password} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>닉네임</FormLabel>
        <Input value={member.nickName} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>email</FormLabel>
        <Input value={member.email} readOnly />
      </FormControl>

      {/* 수정버튼을 눌렀을떄 새로운 페이지로 이동되게 */}
      <Button
        colorScheme="blue"
        onClick={() => navigate("edit?" + params.toString())}
      >
        수정
      </Button>
      <Button colorScheme="red" onClick={onOpen}>
        탈퇴
      </Button>

      {/* 탈퇴 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>탈퇴 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>탈퇴 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              탈퇴
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
