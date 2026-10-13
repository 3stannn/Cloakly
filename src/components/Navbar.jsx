import Brand from "./Brand";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar page-width">
      <Brand />
      <nav className="site-nav" aria-label="Main navigation">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/learn">Learn</NavLink>
        <NavLink to="/blog">Blog</NavLink>
      </nav>
    </header>
  );
}
export default Navbar;
