import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";
import LogoutIcon from "@/img/logout.svg";
import "./UserMenu.css";

export const UserMenu = observer(function UserMenu({ className }: { className?: string }) {
    const { auth } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    if (!auth.isAuthenticated) {
        return (
            <Link to="/login" className="header__profile-btn">
                Войти
            </Link>
        );
    }

    const initials = auth.user!.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <div className="user-menu" ref={menuRef}>
            <button className="user-menu__trigger" onClick={() => setIsOpen((v) => !v)}>
                {initials}
            </button>

            {isOpen && (
                <div className="user-menu__dropdown">
                    <div className="user-menu__info">
                        <p className="user-menu__name">{auth.user!.name}</p>
                        <p className="user-menu__email">{auth.user!.email}</p>
                    </div>

                    <Link to="/profile" className="user-menu__item" onClick={() => setIsOpen(false)}>
                        Профиль
                    </Link>

                    <button
                        className="user-menu__item user-menu__item--danger"
                        onClick={() => {
                            auth.logout();
                            setIsOpen(false);
                        }}
                    >
                        <LogoutIcon width={16} height={16} />
                        Выйти
                    </button>
                </div>
            )}
        </div>
    );
});