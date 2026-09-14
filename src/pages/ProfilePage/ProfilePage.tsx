import { ChangeEvent, SubmitEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";
import { UpdateUserPasswordPayload, UpdateUserPayload, UserApi } from "@/api/user";
import "./ProfilePage.css";
import axios from "axios";

export const ProfilePage = observer(function ProfilePage() {
    const { auth } = useStore();
    const navigate = useNavigate();
    const user = auth.user;

    const [form, setForm] = useState<UpdateUserPayload>({ name: user?.name, userName: user?.userName, email: user?.email });
    const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
    const [error, setError] = useState<string | null>(null);

    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState<UpdateUserPasswordPayload>({ currentPassword: "", newPassword: "", });
    const [passwordStatus, setPasswordStatus] = useState<"idle" | "saving" | "saved">("idle");
    const [passwordError, setPasswordError] = useState<string | null>(null);

    if (!user) {
        return null;
    }

    const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const updatePasswordField = (key: keyof UpdateUserPasswordPayload) => (e: ChangeEvent<HTMLInputElement>) =>
        setPasswordForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setStatus("saving");
        try {
            await auth.updateProfile(form);
            setStatus("saved");
            setTimeout(() => setStatus("idle"), 2000);
        } catch {
            setError("Не удалось сохранить изменения");
            setStatus("idle");
        }
    };

    const handlePasswordSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordStatus("saving");
        try {
            await UserApi.changePassword(user.id, passwordForm);
            setPasswordStatus("saved");
            setPasswordForm({ currentPassword: "", newPassword: "" });
            setTimeout(() => {
                setPasswordStatus("idle");
                setIsChangingPassword(false);
            }, 1500);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setPasswordError(
                    err.response?.data?.message || "Не удалось сменить пароль"
                );
            } else {
                setPasswordError("Не удалось сменить пароль");
            }

            setPasswordStatus("idle");
        }
    };

    const handleDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);

        try {
            await UserApi.remove(user.id);
            auth.logout();
            navigate("/");
        } catch {
            setError("Не удалось удалить аккаунт");
        }
        finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="profile-page">
            <h1>Профиль</h1>

            <form className="profile-form" onSubmit={handleSubmit}>
                <label>
                    Имя
                    <input value={form.name} onChange={update("name")} required />
                </label>

                <label>
                    Логин
                    <input value={form.userName} onChange={update("userName")} required />
                </label>

                <label>
                    Email
                    <input type="email" value={form.email} onChange={update("email")} required />
                </label>

                <button
                    type="submit"
                    disabled={status === "saving" || status === "saved"}
                    className={`profile-form__button profile-form__button--${status}`}
                >
                    {status === "saving" ? "Сохраняем…" : status === "saved" ? "Сохранено" : "Сохранить"}
                </button>

                {error && <p className="profile-form__error">{error}</p>}
            </form>

            <div className="profile-password">
                {!isChangingPassword ? (
                    <button className="profile-password__toggle" onClick={() => setIsChangingPassword(true)}>
                        Сменить пароль
                    </button>
                ) : (
                    <form className="profile-form" onSubmit={handlePasswordSubmit}>
                        <h2 className="profile-password__title">Смена пароля</h2>

                        <label>
                            Текущий пароль
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={updatePasswordField("currentPassword")}
                                autoComplete="current-password"
                                minLength={6}
                                maxLength={100}
                                required
                            />
                        </label>

                        <label>
                            Новый пароль
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={updatePasswordField("newPassword")}
                                autoComplete="new-password"
                                minLength={6}
                                maxLength={100}
                                required
                            />
                        </label>

                        <div className="profile-password__actions">
                            <button
                                type="submit"
                                disabled={passwordStatus === "saving" || passwordStatus === "saved"}
                                className={`profile-form__button profile-form__button--${passwordStatus}`}
                            >
                                {passwordStatus === "saving" ? "Меняем…" : passwordStatus === "saved" ? "Готово ✓" : "Сохранить пароль"}
                            </button>
                            <button
                                type="button"
                                className="profile-password__cancel"
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setPasswordError(null);
                                    setPasswordForm({ currentPassword: "", newPassword: "" });
                                }}
                            >
                                Отмена
                            </button>
                        </div>

                        {passwordError && <p className="profile-form__error">{passwordError}</p>}
                    </form>
                )}
            </div>

            <div className="profile-danger">
                <h2>Опасная зона</h2>
                {!confirmingDelete ? (
                    <button className="profile-danger__btn" onClick={() => setConfirmingDelete(true)}>
                        Удалить аккаунт
                    </button>
                ) : (
                    <div className="profile-danger__confirm">
                        <p>Это действие необратимо. Точно удалить?</p>
                        <button disabled={isDeleting} className="profile-danger__btn" onClick={handleDelete}>
                            {isDeleting ? "Удаляем..." : "Да, удалить"}
                        </button>
                        <button disabled={isDeleting} className="profile-danger__reject" onClick={() => setConfirmingDelete(false)}>
                            Отмена
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});