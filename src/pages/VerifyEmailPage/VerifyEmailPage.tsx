import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getApiErrorMessage } from "@/api/client";
import "./VerifyEmailPage.css";
import { AuthApi } from "@/api/auth";

type Status = "verifying" | "success" | "error" | "missing-token";

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<Status>(token ? "verifying" : "missing-token");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const hasRequested = useRef(false);

    useEffect(() => {
        if (!token || hasRequested.current) return;
        hasRequested.current = true;
        AuthApi.confirmEmail(token)
            .then(() => setStatus("success"))
            .catch((err) => {
                setErrorMessage(getApiErrorMessage(err));
                setStatus("error");
            });
    }, [token]);

    return (
        <div className="verify-email">
            {status === "verifying" && (
                <>
                    <div className="verify-email__spinner" aria-hidden="true" />
                    <p>Подтверждаем email…</p>
                </>
            )}

            {status === "success" && (
                <>
                    <h1>Email подтверждён </h1>
                    <p className="text-muted">Обновите страницу</p>
                    <p className="text-muted">Теперь вам доступны все возможности аккаунта.</p>
                    <Link to="/" className="verify-email__link">
                        На главную
                    </Link>
                </>
            )}

            {status === "missing-token" && (
                <>
                    <h1>Некорректная ссылка</h1>
                    <p className="text-muted">В ссылке отсутствует токен подтверждения.</p>
                    <Link to="/" className="verify-email__link">
                        На главную
                    </Link>
                </>
            )}

            {status === "error" && (
                <>
                    <h1>Не удалось подтвердить email</h1>
                    <p className="text-muted">{errorMessage}</p>
                    <Link to="/" className="verify-email__link">
                        На главную
                    </Link>
                </>
            )}
        </div>
    );
}