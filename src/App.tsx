import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const Home = lazy(() => import("./component/Home"));
const EditorPage = lazy(() => import("./component/EditorPage"));
function App() {
  return (
    <div>
      <Toaster position="top-center"></Toaster>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/EditorPage/:roomId" element={<EditorPage />} />
      </Routes>
    </div>
  );
}

export default App;
