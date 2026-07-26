import { SubmitEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";
import "./AuthForm.css";

export const LoginPage = observer(function LoginPage() {
  const { auth } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await auth.login(email, password);
      navigate("/");
    } catch {
      setError("Неверный email или пароль");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Вход</h1>

        {error && <p className="auth-form__error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Входим…" : "Войти"}
        </button>

        <p className="auth-form__footer">
          Нет аккаунта?
          <Link to="/register" className="auth-form__link">
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </div>
  );
});