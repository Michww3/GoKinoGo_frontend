import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";
import CartIcon from "@/img/cart.svg";
import "./CartButton.css";

export const CartButton = observer(function CartButton() {
  const { cart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="cart-button" ref={ref}>
      <button className="cart-button__trigger" onClick={() => setIsOpen((v) => !v)} aria-label="Корзина">
        <CartIcon width={22} height={22} />
        {cart.totalItems > 0 && <span className="cart-button__badge">{cart.totalItems}</span>}
      </button>

      {isOpen && (
        <div className="cart-button__dropdown">
          {cart.items.length === 0 ? (
            <p className="cart-button__empty">Корзина пуста</p>
          ) : (
            <>
              <ul className="cart-button__list">
                {cart.items.map((item) => (
                  <li key={item.movieId} className="cart-item">
                    <img src={item.posterUrl} alt={item.name} className="cart-item__poster" />
                    <div className="cart-item__info">
                      <p className="cart-item__name">{item.name}</p>
                      <div className="cart-item__qty">
                        <button onClick={() => cart.setQuantity(item.movieId, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => cart.setQuantity(item.movieId, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <span className="cart-item__price">{(item.price * item.quantity).toFixed(2)} BYN</span>
                    <button
                      className="cart-item__remove"
                      onClick={() => cart.removeItem(item.movieId)}
                      aria-label="Убрать из корзины"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <div className="cart-button__footer">
                <span>Итого</span>
                <span className="cart-button__total">{cart.totalPrice.toFixed(2)} BYN</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
});