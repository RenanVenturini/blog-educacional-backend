import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Post from "./pages/Post/Post";
import CreatePost from "./pages/CreatePost/CreatePost";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/posts/:id" element={<Post />} />

        <Route path="/posts/novo" element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;