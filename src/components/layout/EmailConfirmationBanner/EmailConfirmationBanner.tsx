import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";
import { AuthApi } from "@/api/auth";
import "./EmailConfirmationBanner.css";
import { getApiErrorMessage } from "@/api/client";

const RESEND_COOLDOWN_SECONDS = 60;

export const EmailConfirmationBanner = observer(function EmailConfirmationBanner() {
  const { auth } = useStore();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!auth.isAuthenticated || auth.user?.emailConfirmed) {
    return null;
  }

  const handleResend = async () => {
    setStatus("sending");
    setError(null);
    try {
      await AuthApi.resendConfirmation();
      setStatus("sent");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(getApiErrorMessage(err, "Не удалось отправить подтверждение. Попробуйте позже."));
      setStatus("idle");
    }
  };

  const isDisabled = status === "sending" || cooldown > 0;

  return (
    <div className="email-banner" role="alert">
      <span className="email-banner__text">
        Подтвердите email ({auth.user?.email}), чтобы использовать все возможности аккаунта.
      </span>

      <div className="email-banner__actions">
        {error && <span className="email-banner__error">{error}</span>}
        <button className="email-banner__btn" onClick={handleResend} disabled={isDisabled}>
          {status === "sending"
            ? "Отправляем…"
            : cooldown > 0
              ? `Повторить через ${cooldown}с`
              : status === "sent"
                ? "Отправить ещё раз"
                : "Отправить подтверждение"}
        </button>
      </div>
    </div>
  );
});