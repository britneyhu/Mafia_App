import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Button from "../components/Button";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar
        phase={false}
        navRoleVisible={false}
        handleNavRoleReveal={false}
      />
      <Button onClick={()=>navigate("/create")}>Create Room</Button>
      <Button onClick={()=>navigate("/join")}>Join Room</Button>
    </div>
  );
}

export default Home;
