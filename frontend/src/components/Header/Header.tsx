import { Link } from "react-router-dom";

import iconeChapeu from "../../assets/icons/chapeu.svg";

import "./Header.css";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__marca">
        <img
          src={iconeChapeu}
          alt=""
          aria-hidden="true"
          className="header__icone"
        />

        <span className="header__titulo">Blog Educacional</span>
      </Link>
    </header>
  );
}

export default Header;
