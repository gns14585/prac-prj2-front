import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function MemberSginup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");

  // 아이디 가능한지에 대한 변수 , 기본값은 false
  const [idAvailable, setIdAvailable] = useState(false);

  // submitAvailable 함수는 회원가입 폼 안에 하나라도 작성되지 않으면
  // 가입버튼 활성화 되지 않도록 설정
  // true : 활성화
  // false : 비활성화
  let submitAvailable = true; // 기본값은 true(활성화) 단 맞지 않은것들 있으면 비활성화

  // 중복체크를 누르지 않으면 가입버튼 비활성화
  if (!idAvailable) {
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
      })
      .then(() => console.log("good"))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
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
      })
      // 아이디가 없으면 사용 가능
      .catch((error) => {
        if (error.response.status === 404) {
          setIdAvailable(true);
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

      <FormControl>
        <FormLabel>email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
