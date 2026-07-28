import { Link, useSearchParams } from "react-router-dom";
import "./Header.css";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";
import ProfileIcon from "@/img/profile.svg";
import { UserMenu } from "./UserMenu";

export const Header = observer(function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { auth } = useStore();

  console.log(ProfileIcon);
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
      <UserMenu/>
    </header>
  );
})