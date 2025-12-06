import Navbar from "../components/Navbar";
import LinkButton from "../components/LinkButton";

function Home() {
  return (
    <>
      <Navbar />
      <LinkButton to="/create">
        Create Room
      </LinkButton>
      <LinkButton to="/join">Join Room</LinkButton>
    </>
  );
}

export default Home;
