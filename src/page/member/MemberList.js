import { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberList() {
  const [list, setList] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member/list").then((response) => setList(response.data));
  }, []);

  if (list == null) {
    return <Spinner />;
  }

  function handleTableRowClick(id) {
    // /member?id= 파라미터로 받은 id , url인코딩이 되어야함
    const params = new URLSearchParams();
    params.set("id", id);
    navigate("/member?" + params.toString());
  }

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>pw</Th>
            <Th>email</Th>
            <Th>가입일시</Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.map((member) => (
            // handleTableRowClick(member.id) : 해당 함수를 실행할때 member.id 를 넣어서 실행
            <Tr
              _hover={{ cursor: "pointer" }}
              onClick={() => handleTableRowClick(member.id)}
              key={member.id}
            >
              <Td>{member.id}</Td>
              <Td>{member.password}</Td>
              <Td>{member.email}</Td>
              <Td>{member.inserted}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
