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
        <Input type="text" />
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

      <Button colorScheme="purple">저장</Button>
    </Box>
  );
}
