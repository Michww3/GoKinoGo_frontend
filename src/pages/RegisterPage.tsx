import { useState, SubmitEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";
import { AuthApi } from "@/api/auth";
import "./AuthForm.css";

export const RegisterPage = observer(function RegisterPage() {
  const { auth } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", userName: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [userNameError, setUserNameError] = useState<string | null>(null);

  const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validateEmail = async () => {
    if (!form.email.trim()) return;

    const exists = await AuthApi.checkEmail(form.email);

    if (exists) {
      setEmailError("Пользователь с таким email уже существует");
    } else {
      setEmailError(null);
    }
  };

  const validateUserName = async () => {
    if (!form.userName.trim()) return;

    const exists = await AuthApi.checkUserName(form.userName);

    if (exists) {
      setUserNameError("Такой логин уже занят");
    } else {
      setUserNameError(null);
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await auth.register(form);
      navigate("/");
    } catch {
      setError("Не удалось зарегистрироваться — проверьте данные");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Регистрация</h1>

        {error && <p className="auth-form__error">{error}</p>}

        <div className="auth-form__field">
        <input placeholder="Имя" value={form.name} onChange={update("name")} required />
        </div>

        <div className="auth-form__field">
          <input
            type="text"
            placeholder="Логин"
            value={form.userName}
            onChange={update("userName")}
            onBlur={validateUserName}
            required
          />

          {userNameError && <p className="auth-form__error">{userNameError}</p>}
        </div>

        <div className="auth-form__field">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={update("email")}
            onBlur={validateEmail}
            required
          />

          {emailError && <p className="auth-form__error">{emailError}</p>}
        </div>

        <div className="auth-form__field">
          <input
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={update("password")}
            minLength={6}
            required
          />

        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Создаём…" : "Зарегистрироваться"}
        </button>

        <p className="auth-form__footer">
          Уже есть аккаунт? <Link to="/login" className="auth-form__link">Войти</Link>
        </p>
      </form>
    </div>
  );
});