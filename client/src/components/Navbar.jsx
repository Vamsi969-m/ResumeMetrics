import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          ResumeAI
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/analyzer">Analyzer</Link>
          <Link to="/results">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;