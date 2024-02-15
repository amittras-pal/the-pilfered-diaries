import { SITE_TITLE } from "../../../constants/app";

const Home = () => {
  return (
    <>
      <h2 className="text-4xl text-center text-warning">
        Welcome to {SITE_TITLE} Admin
      </h2>
      <p className="text-center">Choose a task from the left to begin.</p>
    </>
  );
};

export default Home;
