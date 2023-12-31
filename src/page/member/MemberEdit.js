import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
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

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [nickNameAvailable, setNickNameAvailable] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);

  const toast = useToast();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const navigate = useNavigate();

  // MemberView 에서 수정버튼을 눌렀을때 navigate("edit?" + params.toString())
  // 로 넘기는데, 그 pamras url을 받기 위해 useSearchParams() 사용해서 받아줘야함
  const [params] = useSearchParams();

  useEffect(() => {
    axios.get("/api/member?" + params.toString()).then((response) => {
      setMember(response.data);
      setEmail(response.data.email);
      setNickName(response.data.nickName);
    });
  }, []);

  const id = params.get("id");

  // 기존 이메일과 같은지 ?
  let sameOriginEmail = false;
  if (member !== null) {
    sameOriginEmail = member.email === email;
  }

  // 기존 이메일과 같거나, 중복확인을 했거나
  let emailChecked = sameOriginEmail || emailAvailable;

  // 기존 별명과 같은지?
  let sameOriginNickName = false;
  if (member != null) {
    sameOriginNickName = member.nickName === nickName;
  }

  let nickNameChecked = sameOriginNickName || nickNameAvailable;

  // 암호가 없으면 기존암호
  // 암호를 작성하면 새 암호, 암호확인 체크
  let passwordChecekd = false;
  if (passwordCheck === password) {
    passwordChecekd = true;
  }
  if (password.length === 0) {
    passwordChecekd = true;
  }

  function handleEmailCheck() {
    const searchParams = new URLSearchParams();
    searchParams.set("email", email);

    axios
      .get("/api/member/check?" + searchParams.toString())
      .then(() => {
        setEmailAvailable(false);
        toast({
          description: "email이 이미 존재합니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        setEmailAvailable(true);
        if (error.response.status === 404) {
          toast({
            description: "email 사용이 가능합니다.",
            status: "success",
          });
        }
      });
  }
  if (member == null) {
    return <Spinner />;
  }

  function handleSubmit() {
    // put /api/member/edit {id, password, email}
    axios
      .put("/api/member/edit", { id: member.id, password, email, nickName })
      .then(() => {
        toast({
          description: "회원정보가 수정되었습니다..",
          status: "success",
        });
        // 모달창 안에 수정버튼을 누르고 난 뒤 이동되는곳(회원정보보기)
        navigate("/member?" + params.toString());
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "수정 권한이 없습니다.",
            status: "error",
          });
        } else {
          toast({
            description: "수정중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => onClose());
  }

  function handleNickNameCheck() {
    const searchParams = new URLSearchParams();
    searchParams.set("nickName", nickName);

    axios
      .get("/api/member/check?" + searchParams.toString())
      .then(() => {
        setNickNameAvailable(false);
        toast({
          description: "email이 이미 존재합니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        setNickNameAvailable(true);
        if (error.response.status === 404) {
          toast({
            description: "email 사용이 가능합니다.",
            status: "success",
          });
        }
      });
  }

  return (
    <Box>
      <h1>{id}님 정보 수정</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormHelperText>작성하지 않으면 기존 암호를 유지합니다.</FormHelperText>
      </FormControl>

      {/* password가 빈값이면 해당 체크 form이 나오지 않고 값이 있으면 나옴 */}
      {password.length > 0 && (
        <FormControl>
          <FormLabel>password 확인</FormLabel>
          <Input
            type="text"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </FormControl>
      )}

      <FormControl>
        <FormLabel>닉네임</FormLabel>
        <Flex>
          <Input
            type="text"
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value);
              setNickNameAvailable(false);
            }}
          />
          <Button isDisabled={nickNameChecked} onClick={handleNickNameCheck}>
            중복확인
          </Button>
        </Flex>
      </FormControl>

      {/* email을 변경하면(작성시작) 중복체크 다시 하도록 */}
      {/* 기존 email과 같으면 중복확인 안해도 됨. */}
      <FormControl>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailAvailable(false);
            }}
          />
          {/* 이메일 체크를 안하면 저장버튼 비활성화 isDisabled */}
          <Button isDisabled={emailChecked} onClick={handleEmailCheck}>
            중복확인
          </Button>
        </Flex>
      </FormControl>

      <Button
        // 암호와 이메일이 다 true일때 저장버튼 활성화
        isDisabled={!emailChecked || !passwordChecekd || !nickNameChecked}
        colorScheme="purple"
        onClick={onOpen}
      >
        수정
      </Button>

      {/* 수정 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>수정 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleSubmit} colorScheme="red">
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
