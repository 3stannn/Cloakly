import { Link, useLocation } from "react-router-dom";
import logo from "../assets/cloakly-logo.svg";

function Brand() {
  const { pathname } = useLocation();

  return (
    <Link className="brand" to={pathname === "/" ? "/#top" : "/"} aria-label="Cloakly home">
      <img src={logo} alt="Cloakly" />
    </Link>
  );
}
export default Brand;
