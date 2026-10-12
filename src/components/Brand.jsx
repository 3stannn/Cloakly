import logo from "../assets/cloakly-logo.svg";

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Cloakly home">
      <img src={logo} alt="Cloakly" />
    </a>
  );
}
export default Brand;
