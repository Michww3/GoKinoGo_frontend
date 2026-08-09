import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";
import { UpdateUserPayload, UserApi } from "@/api/user";
import "./ProfilePage.css";

export const ProfilePage = observer(function ProfilePage() {
    const { auth } = useStore();
    const navigate = useNavigate();
    const user = auth.user!;

    const [form, setForm] = useState<UpdateUserPayload>({ name: user.name, userName: user.userName, email: user.email });
    const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
    const [error, setError] = useState<string | null>(null);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
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

    const handleDelete = async () => {
        try {
            await UserApi.remove(user.id);
            auth.logout();
            navigate("/");
        } catch {
            setError("Не удалось удалить аккаунт");
        }
    };

    return (
        <div className="profile-page">
            <h1>Профиль</h1>

            <form className="profile-form" onSubmit={handleSubmit}>
                {error && <p className="profile-form__error">{error}</p>}

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
                    disabled={status === "saving" || status ==="saved" }
                    className={`profile-form__button profile-form__button--${status}`}
                >
                    {status === "saving" ? "Сохраняем…" : status === "saved" ? "Сохранено" : "Сохранить"}
                </button>
            </form>

            <div className="profile-danger">
                <h2>Опасная зона</h2>
                {!confirmingDelete ? (
                    <button className="profile-danger__btn" onClick={() => setConfirmingDelete(true)}>
                        Удалить аккаунт
                    </button>
                ) : (
                    <div className="profile-danger__confirm">
                        <p>Это действие необратимо. Точно удалить?</p>
                        <button className="profile-danger__btn" onClick={handleDelete}>
                            Да, удалить
                        </button>
                        <button className="profile-danger__reject" onClick={() => setConfirmingDelete(false)}>Отмена</button>
                    </div>
                )}
            </div>
        </div>
    );
});