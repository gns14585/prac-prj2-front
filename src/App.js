import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { BoardWrite } from "./page/board/BoardWrite";
import { BoardList } from "./page/board/BoardList";
import { HomeLayout } from "./layout/HomeLayout";
import { BoardView } from "./page/board/BoardView";
import { BoardEdit } from "./page/board/BoardEdit";
import { MemberSginup } from "./page/member/MemberSginup";
import { MemberList } from "./page/member/MemberList";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      {/* 기본 경로를 그대로 따라가는걸 index */}
      <Route index element={<BoardList />} />
      <Route path="write" element={<BoardWrite />} />
      {/* boardList에서 각 행을 클릭했을때 해당 View로 이동
       주소창엔 board/id번호 */}
      <Route path="board/:id" element={<BoardView />} />
      <Route path="edit/:id" element={<BoardEdit />} />
      <Route path="signup" element={<MemberSginup />} />
      <Route path="member/list" element={<MemberList />} />
    </Route>,
  ),
);

function App(props) {
  return <RouterProvider router={routes} />;
}

export default App;
