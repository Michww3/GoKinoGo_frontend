import { Link, useSearchParams } from "react-router-dom";
import "./Header.css";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";

export const Header = observer(function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { auth } = useStore();

  const handleSearch = (value: string) => {
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
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

      <Link to="/profile" className="header__profile" aria-label="Профиль">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
        </svg>
      </Link>
      {auth.isAuthenticated ? (
        <button onClick={() => auth.logout()}>Выйти, {auth.user?.name}</button>
      ) :
      (
        <button onClick={() => auth.login("user@example.com", "string")}>Войти</button>
      )}
    </header>
  );
})