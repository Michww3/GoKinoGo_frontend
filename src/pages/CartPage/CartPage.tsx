import { useState } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { CartApi, type CartConflictResponse } from "@/api/cart";
import { getApiErrorMessage, getErrorResponseData } from "@/api/client";
import { useStore } from "@/stores/StoreContext";
import BYN_symbol from "@/img/BYN_symbol.svg";
import "./CartPage.css";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const CartPage = observer(function CartPage() {
    const { cart, auth } = useStore();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderNotice, setOrderNotice] = useState<string | null>(null);

    const handleConfirm = async () => {
        const email = auth.user?.email ?? cart.guestEmail ?? "";

        if (!auth.isAuthenticated && !isValidEmail(email)) {
            setEmailError("Введите корректный email — на него отправим чек");
            return;
        }

        setEmailError(null);
        setOrderNotice(null);
        setIsSubmitting(true);

        try {
            await CartApi.sendReceipt({
                email,
                userName: auth.user?.name,
                items: cart.items.map((i) => ({ movieId: i.movieId, quantity: i.quantity, price: i.price })),
            });
            cart.clear();
            setIsConfirmed(true);
        } catch (err) {
            const conflict =
                getErrorResponseData<CartConflictResponse>(err, 409) ??
                getErrorResponseData<CartConflictResponse>(err, 404);

            if (conflict) {
                const { removed, changed } = cart.applyValidatedItems(conflict.items);
                setOrderNotice(buildNotice(removed, changed));
            } else {
                setOrderNotice(getApiErrorMessage(err, "Не удалось отправить чек. Попробуйте позже."));
            }
        } finally {
            setIsSubmitting(false);
        }
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
                {orderNotice && <p className="cart-page__notice">{orderNotice}</p>}
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
                        <Link
                            to={`/movies/${item.movieId}`}
                            className="cart-page__product"
                        >
                            <img
                                src={item.posterUrl}
                                alt={item.name}
                                className="cart-page__poster"
                            />

                            <div className="cart-page__info">
                                <span className="cart-page__name">
                                    {item.name}
                                </span>

                                <span className="cart-page__unit-price">
                                    {item.price.toFixed(2)}
                                    <BYN_symbol aria-hidden="true" />
                                    /шт
                                </span>
                            </div>
                        </Link>

                        <div className="cart-page__qty">
                            <button onClick={() => cart.setQuantity(item.movieId, item.quantity - 1)}>
                                −
                            </button>

                            <span>{item.quantity}</span>

                            <button onClick={() => cart.setQuantity(item.movieId, item.quantity + 1)}>
                                +
                            </button>
                        </div>

                        <span className="cart-page__sum">
                            {(item.price * item.quantity).toFixed(2)}
                            <BYN_symbol aria-hidden="true" />
                        </span>

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

            <button className="cart-page__clear" onClick={() => cart.clear()}>
                Очистить корзину
            </button>

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

            {orderNotice && (
                <p className="cart-page__notice" role="alert">
                    {orderNotice}
                </p>
            )}

            <div className="cart-page__summary">
                <span>Итого ({cart.totalItems} шт.)</span>
                <span className="cart-page__total">
                    {cart.totalPrice.toFixed(2)}
                    <BYN_symbol aria-hidden="true" />
                </span>
            </div>

            <button className="cart-page__confirm" onClick={handleConfirm} disabled={isSubmitting}>
                {isSubmitting ? "Отправляем чек…" : "Подтвердить заказ"}
            </button>
        </div>
    );
});

const formatPrice = (n: number) => n.toFixed(2);

function buildNotice(
    removed: string[],
    changed: { name: string; oldPrice: number; newPrice: number }[]
): string {
    const parts: string[] = [];
    if (changed.length > 0) {
        const list = changed.map((c) => `«${c.name}» ${formatPrice(c.oldPrice)} → ${formatPrice(c.newPrice)}`);
        parts.push(`Цены изменились: ${list.join(", ")}.`);
    }
    if (removed.length > 0) {
        parts.push(`Больше недоступны и удалены из корзины: ${removed.map((n) => `«${n}»`).join(", ")}.`);
    }
    parts.push("Проверьте корзину и подтвердите заказ ещё раз.");
    return parts.join(" ");
}