import { Link, useSearchParams } from "react-router-dom";
import "./Header.css";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";
import { UserMenu } from "../UserMenu/UserMenu";
import { CartButton } from "../../cart/CartButton/CartButton";

export const Header = observer(function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { auth } = useStore();

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

      <input
        type="search"
        className="header__search"
        placeholder="Найти фильм…"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <div className="header__actions">
        <CartButton />
        <UserMenu />
      </div>

    </header>
  );
})