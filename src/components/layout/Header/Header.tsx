import { Link, NavLink, useSearchParams } from "react-router-dom";
import "./Header.css";
import { UserMenu } from "../UserMenu/UserMenu";
import { CartButton } from "../CartButton/CartButton";
import { HeaderSearch } from "../HeaderSearch/HeaderSearch";

export function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <span className="header__logo-letter--red">Go</span>
        Kino
        <span className="header__logo-letter--red">Go</span>
      </Link>

      <NavLink
        to="/movies"
        end
        className={({ isActive }) => `header__nav-link ${isActive ? "header__nav-link--active" : ""}`}
      >
        Каталог
      </NavLink>

      <HeaderSearch />

      <div className="header__actions">
        <CartButton />
        <UserMenu />
      </div>

    </header>
  );
}