import { useSearchParams } from "react-router-dom";

export function MemberView() {
  // /member?id=userid
  // useSearchParams는 구조분해할당 [] 로 받아와야함
  const [params] = useSearchParams();

  return <div>{params.get("id")} 회원 정보 보기</div>;
}
