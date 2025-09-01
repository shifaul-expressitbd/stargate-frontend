import { Link } from "react-router-dom";

const AuthNavbar = () => {
  return (
    <Link to="/">
      <h1 className="text-5xl font-pollinator font-extrabold flex">
        <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Star
        </span>
        <span className="ml-1 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Gate
        </span>
      </h1>
    </Link>
  );
};

export default AuthNavbar;
