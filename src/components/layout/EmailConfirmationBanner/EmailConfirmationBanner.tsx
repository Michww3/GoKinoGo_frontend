import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreContext";
import { useResendConfirmation } from "@/hooks/useResendConfirmation";
import "./EmailConfirmationBanner.css";

export const EmailConfirmationBanner = observer(function EmailConfirmationBanner() {
  const { auth } = useStore();
  const { resend, isDisabled, label, error } = useResendConfirmation();

  if (!auth.isAuthenticated || auth.isEmailConfirmed) {
    return null;
  }

  return (
    <div className="email-banner" role="alert">
      <span className="email-banner__text">
        Подтвердите email ({auth.user?.email}), чтобы использовать все возможности аккаунта.
      </span>
      <div className="email-banner__actions">
        {error && <span className="email-banner__error">{error}</span>}
        <button className="email-banner__btn" onClick={resend} disabled={isDisabled}>
          {label}
        </button>
      </div>
    </div>
  );
});