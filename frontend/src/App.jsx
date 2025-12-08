import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="create/" element={<CreateRoom/>}/>
        <Route path="join/" element={<JoinRoom/>}/>
        <Route path="lobby/:roomCode" element={<Lobby/>}/>
        <Route path="game/:roomCode" element={<Game/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
