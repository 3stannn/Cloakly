import Navbar from "./Navbar";
import Footer from "./Footer";

function EducationLayout({ children }) {
  return (
    <div className="app-shell">
      <div className="education-shell">
        <Navbar />
        <main className="education-main">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export default EducationLayout;
