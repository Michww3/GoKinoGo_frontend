import { useEffect, useState } from "react";
import { AuthApi } from "@/api/auth";
import { getApiErrorMessage } from "@/api/client";

const RESEND_COOLDOWN_SECONDS = 60;

export function useResendConfirmation() {
    const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
    const [error, setError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const resend = async () => {
        setStatus("sending");
        setError(null);
        try {
            await AuthApi.resendConfirmation();
            setStatus("sent");
            setCooldown(RESEND_COOLDOWN_SECONDS);
        } catch (err) {
            setError(
                getApiErrorMessage(err)
            );
            setStatus("idle");
        }
    };

    const isDisabled = status === "sending" || cooldown > 0;
    const label =
        status === "sending"
            ? "Отправляем…"
            : cooldown > 0
                ? `Повторить через ${cooldown}с`
                : status === "sent"
                    ? "Отправлено ✓ Отправить ещё раз"
                    : "Отправить подтверждение";

    return { resend, isDisabled, label, error };
}