import { useState } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";
import "./CartPage.css";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const CartPage = observer(function CartPage() {
    const { cart, auth } = useStore();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    const handleConfirm = () => {
        if (!auth.isAuthenticated && !isValidEmail(cart.guestEmail ?? "")) {
            setEmailError("Введите корректный email — на него отправим чек");
            return;
        }
        setEmailError(null);
        cart.clear();
        setIsConfirmed(true);
    };

    if (isConfirmed) {
        return (
            <div className="cart-page cart-page--empty">
                <h1>Заказ оформлен 🎬</h1>
                <p className="text-muted">Спасибо за покупку — приятного просмотра.</p>
                <p className="text-muted"> Квитанция с чеком будет отправлена по почте.</p>
                <Link to="/" className="cart-page__link">
                    ← Вернуться к афише
                </Link>
            </div>
        );
    }

    if (cart.items.length === 0) {
        return (
            <div className="cart-page cart-page--empty">
                <h1>Корзина пуста</h1>
                <p className="text-muted">Похоже, вы ещё не выбрали ни одного фильма.</p>
                <Link to="/" className="cart-page__link">
                    ← К афише
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1 className="cart-page__title">Корзина</h1>

            <ul className="cart-page__list">
                {cart.items.map((item) => (
                    <li key={item.movieId} className="cart-page__item">
                        <img src={item.posterUrl} alt={item.name} className="cart-page__poster" />

                        <div className="cart-page__info">
                            <p className="cart-page__name">{item.name}</p>
                            <p className="cart-page__unit-price">{item.price.toFixed(2)} BYN / шт</p>
                        </div>

                        <div className="cart-page__qty">
                            <button onClick={() => cart.setQuantity(item.movieId, item.quantity - 1)}>−</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => cart.setQuantity(item.movieId, item.quantity + 1)}>+</button>
                        </div>

                        <span className="cart-page__sum">{(item.price * item.quantity).toFixed(2)} BYN</span>

                        <button
                            className="cart-page__remove"
                            onClick={() => cart.removeItem(item.movieId)}
                            aria-label={`Убрать ${item.name} из корзины`}
                        >
                            ×
                        </button>
                    </li>
                ))}
            </ul>

            <div className="cart-page__email">
                <label htmlFor="checkout-email">Email для чека</label>
                {auth.isAuthenticated ? (
                    <input id="checkout-email" value={auth.user?.email ?? ""} disabled />
                ) : (
                    <input
                        id="checkout-email"
                        type="email"
                        placeholder="you@example.com"
                        value={cart.guestEmail ?? ""}
                        onChange={(e) => {
                            cart.setGuestEmail(e.target.value);
                            setEmailError(null);
                        }}
                    />
                )}
                {emailError && <p className="cart-page__email-error">{emailError}</p>}
            </div>

            <div className="cart-page__summary">
                <span>Итого ({cart.totalItems} шт.)</span>
                <span className="cart-page__total">{cart.totalPrice.toFixed(2)} BYN</span>
            </div>

            <button className="cart-page__confirm" onClick={handleConfirm}>
                Подтвердить заказ
            </button>
        </div>
    );
});