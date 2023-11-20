import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberSginup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");

  // 아이디 가능한지에 대한 변수 , 기본값은 false
  const [idAvailable, setIdAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [nickNameAvailable, setNickNameAvailable] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // submitAvailable 함수는 회원가입 폼 안에 하나라도 작성되지 않으면
  // 가입버튼 활성화 되지 않도록 설정
  // true : 활성화
  // false : 비활성화
  let submitAvailable = true; // 기본값은 true(활성화) 단 맞지 않은것들 있으면 비활성화

  // 중복체크를 누르지 않으면 가입버튼 비활성화
  if (!idAvailable) {
    submitAvailable = false;
  }
  if (!emailAvailable) {
    submitAvailable = false;
  }
  if (!nickNameAvailable) {
    submitAvailable = false;
  }

  // password가 맞지 않으면 가입버튼 비활성화
  if (password != passwordCheck) {
    submitAvailable = false;
  }

  // password가 입력되지 않았다면 가입버튼 비활성화
  if (password.length === 0) {
    submitAvailable = false;
  }

  function handleSubmit() {
    axios
      .post("/api/member/signup", {
        id,
        password,
        email,
        nickName,
      })
      .then(() => {
        toast({
          description: "회원가입이 완료되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            description: "입력값을 확인해주세요.",
            status: "error",
          });
        } else {
          toast({
            description: "가입중에 오류가 발생하였습니다.",
            status: "error",
          });
        }
      });
  }

  function handleIdCheck() {
    // 엔코딩을 대신 해주는게 URLSearchParams();
    const searchParams = new URLSearchParams();
    // id를 중복체크 할꺼니까 set("id", id)로 설정
    searchParams.set("id", id);

    axios
      .get("/api/member/check?" + searchParams.toString())
      // 중복체크는 기존과 반대로 .then
      // 아이디가 있으면 사용하지 못함
      .then(() => {
        setIdAvailable(false);
        toast({
          description: "아이디가 이미 존재합니다.",
          status: "warning",
        });
      })
      // 아이디가 없으면 사용 가능
      .catch((error) => {
        if (error.response.status === 404) {
          setIdAvailable(true);
          toast({
            description: "아이디 사용 가능합니다.",
            status: "success",
          });
        }
      });
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

  function handleNickNameCheck() {
    const searchParams = new URLSearchParams();
    searchParams.set("nickName", nickName);

    axios
      .get("/api/member/check?" + searchParams.toString())
      .then(() => {
        setNickNameAvailable(false);
        toast({
          description: "닉네임이 이미 존재합니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        setNickNameAvailable(true);
        if (error.response.status === 404) {
          toast({
            description: "닉네임 사용이 가능합니다.",
            status: "success",
          });
        }
      });
  }

  return (
    <Box>
      <h1>회원 가입</h1>
      {/* !(not) 인경우 submitAvailable=false로 설정했으니 FormErrorMessage 활성화 */}
      <FormControl isInvalid={!idAvailable}>
        <FormLabel>id</FormLabel>
        <Flex>
          <Input
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setIdAvailable(false);
            }}
          />
          <Button onClick={handleIdCheck}>중복체크</Button>
        </Flex>
        <FormErrorMessage>ID 중복 체크를 해주세요.</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={password.length === 0}>
        <FormLabel>password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormErrorMessage>암호를 입력해 주세요.</FormErrorMessage>
      </FormControl>

      {/* 암호를 체크할때 isInvalid 사용, 비교 하려는것을 비교연산자로 사용 */}
      <FormControl isInvalid={password !== passwordCheck}>
        <FormLabel>password 확인</FormLabel>
        <Input
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        {/* isInvalid 사용 시 FormErrorMessage 활성화됨 */}
        <FormErrorMessage>암호가 다릅니다.</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!nickNameAvailable}>
        <FormLabel>닉네임</FormLabel>
        <Flex>
          <Input
            type="text"
            value={nickName}
            onChange={(e) => {
              setNickNameAvailable(false);
              setNickName(e.target.value);
            }}
          />
          <Button onClick={handleNickNameCheck}>중복체크</Button>
        </Flex>
        <FormErrorMessage>닉네임 중복체크를 해주세요.</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!emailAvailable}>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmailAvailable(false);
              setEmail(e.target.value);
            }}
          />
          <Button onClick={handleEmailCheck}>중복체크</Button>
        </Flex>
        <FormErrorMessage>Email 중복체크를 해주세요.</FormErrorMessage>
      </FormControl>

      {/* 가입버튼 !(not) 기본이 비활성화 */}
      <Button
        isDisabled={!submitAvailable}
        onClick={handleSubmit}
        colorScheme="blue"
      >
        가입
      </Button>
    </Box>
  );
}
