import { useNavigate } from "react-router-dom";

import { LuDoorOpen } from "react-icons/lu";
import { TbDoorEnter } from "react-icons/tb";

import Navbar from "../components/Navbar";
import Button from "../components/Button";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <Navbar
        phase={false}
        navRoleVisible={false}
        handleNavRoleReveal={false}
        role={false}
        name={false}
      />
      <Button 
        onClick={()=>navigate("/create")} 
        className="flex justify-center items-center gap-8 bg-gray border-1 border-light-gray w-70">
          <div className="w-12 h-12 bg-linear-295 from-teal to-purple rounded-lg flex items-center justify-center">
            <LuDoorOpen className="size-7 text-black"/>
          </div>
          Create Room
        </Button>

        <Button 
        onClick={()=>navigate("/join")} 
        className="flex justify-center items-center gap-8 bg-gray border-1 border-light-gray w-70">
          <div className="w-12 h-12 bg-linear-295 from-teal to-purple rounded-lg flex items-center justify-center">
            <TbDoorEnter className="size-7 text-black"/>
          </div>
          Join Room
        </Button>
    </div>
  );
}

export default Home;
