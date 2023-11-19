import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);

  const toast = useToast();

  // MemberView 에서 수정버튼을 눌렀을때 navigate("edit?" + params.toString())
  // 로 넘기는데, 그 pamras url을 받기 위해 useSearchParams() 사용해서 받아줘야함
  const [params] = useSearchParams();

  useEffect(() => {
    axios.get("/api/member?" + params.toString()).then((response) => {
      setMember(response.data);
      setEmail(response.data.email);
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
        isDisabled={!emailChecked || !passwordChecekd}
        colorScheme="purple"
      >
        저장
      </Button>
    </Box>
  );
}
