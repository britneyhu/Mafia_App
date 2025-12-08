import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Button from "../components/Button";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Button onClick={()=>navigate("/create")}>Create Room</Button>
      <Button onClick={()=>navigate("/join")}>Join Room</Button>
    </>
  );
}

export default Home;
