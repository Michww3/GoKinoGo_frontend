import { Link, useSearchParams } from "react-router-dom";
import "./Header.css";
import { UserMenu } from "../UserMenu/UserMenu";
import { CartButton } from "../CartButton/CartButton";
import { HeaderSearch } from "../HeaderSearch/HeaderSearch";

export function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const handleSearch = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set("q", value);
        else next.delete("q");
        next.delete("page");
        return next;
      },
      { replace: true }
    );
  };

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <span className="header__logo-letter--red">Go</span>
        Kino
        <span className="header__logo-letter--red">Go</span>
      </Link>

      <HeaderSearch />

      <div className="header__actions">
        <CartButton />
        <UserMenu />
      </div>

    </header>
  );
}