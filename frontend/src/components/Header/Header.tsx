import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          Blog Educacional
        </Link>

        <nav className="header__nav">
          <Link to="/">Início</Link>
          <Link to="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;