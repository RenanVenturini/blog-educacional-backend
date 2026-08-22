import { BrowserRouter, Routes, Route } from "react-router-dom";

import RotaPrivada from "./components/RotaPrivada/RotaPrivada";

import Landing from "./pages/Landing/Landing";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Post from "./pages/Post/Post";
import CreatePost from "./pages/CreatePost/CreatePost";
import EditPost from "./pages/EditPost/EditPost";
import Admin from "./pages/Admin/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/aluno" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/posts/:id" element={<Post />} />

        <Route
          path="/admin"
          element={
            <RotaPrivada>
              <Admin />
            </RotaPrivada>
          }
        />

        <Route
          path="/posts/novo"
          element={
            <RotaPrivada>
              <CreatePost />
            </RotaPrivada>
          }
        />

        <Route
          path="/posts/:id/editar"
          element={
            <RotaPrivada>
              <EditPost />
            </RotaPrivada>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;