import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  MessageCircle,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { WHATSAPP_NUMBER, formatWhatsAppNumber } from "../data/defaultStore";
import {
  normalizeAlgerianPhoneE164,
  requestPasswordResetByEmail,
  sendPasswordResetSmsOtp,
  updateAdminPassword,
  verifyPasswordResetEmailOtp,
  verifyPasswordResetSmsOtp,
} from "../lib/supabase";

export type RecoveryChannel = "email" | "sms" | "whatsapp";

const RESEND_COOLDOWN_SECONDS = 60;

export interface PasswordRecoveryPanelProps {
  initialEmail?: string;
  whatsappNumber?: string;
  brandName?: string;
  initialStep?: "choose" | "new-password";
  accountLabel?: string;
  onBackToLogin: () => void;
  onPasswordUpdated?: () => void;
  onNotify?: (type: "success" | "error" | "info", text: string) => void;
}

export function PasswordRecoveryPanel({
  initialEmail = "",
  whatsappNumber = WHATSAPP_NUMBER,
  brandName = "DG by Douaa",
  initialStep = "choose",
  accountLabel = "حساب الإدارة",
  onBackToLogin,
  onPasswordUpdated,
  onNotify,
}: PasswordRecoveryPanelProps) {
  const [step, setStep] = useState<"choose" | "new-password">(initialStep);
  const [channel, setChannel] = useState<RecoveryChannel>("email");

  // Email direct 6-digit OTP + new password recovery state
  const [emailInput, setEmailInput] = useState(initialEmail);
  const [emailStage, setEmailStage] = useState<"request" | "otp" | "done">("request");
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [emailNewPassword, setEmailNewPassword] = useState("");
  const [showEmailNewPassword, setShowEmailNewPassword] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [emailError, setEmailError] = useState("");

  // SMS direct 6-digit OTP + new password recovery state
  const [smsPhone, setSmsPhone] = useState("");
  const [normalizedSmsPhone, setNormalizedSmsPhone] = useState("");
  const [smsStage, setSmsStage] = useState<"phone" | "otp" | "done">("phone");
  const [smsOtpCode, setSmsOtpCode] = useState("");
  const [smsNewPassword, setSmsNewPassword] = useState("");
  const [showSmsNewPassword, setShowSmsNewPassword] = useState(false);
  const [smsSending, setSmsSending] = useState(false);
  const [smsSubmitting, setSmsSubmitting] = useState(false);
  const [smsCooldown, setSmsCooldown] = useState(0);
  const [smsError, setSmsError] = useState("");
  const [smsGatewayUnavailable, setSmsGatewayUnavailable] = useState(false);

  // WhatsApp recovery state
  const [waPhone, setWaPhone] = useState("");
  const [waEmail, setWaEmail] = useState(initialEmail);
  const [waError, setWaError] = useState("");

  // Fallback new-password step state (for session recovery events)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  useEffect(() => {
    if (initialEmail && !emailInput) {
      setEmailInput(initialEmail);
    }
    if (initialEmail && !waEmail) {
      setWaEmail(initialEmail);
    }
  }, [initialEmail]);

  useEffect(() => {
    if (emailCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setEmailCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [emailCooldown > 0]);

  useEffect(() => {
    if (smsCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setSmsCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [smsCooldown > 0]);

  const liveNormalizedSmsPreview = useMemo(() => normalizeAlgerianPhoneE164(smsPhone), [smsPhone]);

  const liveNormalizedWaPhone = useMemo(() => normalizeAlgerianPhoneE164(waPhone), [waPhone]);

  const officialStoreWhatsApp = useMemo(
    () => formatWhatsAppNumber(whatsappNumber),
    [whatsappNumber],
  );

  const whatsappRecoveryUrl = useMemo(() => {
    const cleanPhoneDisplay = liveNormalizedWaPhone || waPhone.trim();
    const cleanEmailDisplay = waEmail.trim();
    if (!cleanPhoneDisplay && !cleanEmailDisplay) return "";
    const lines = [
      `السلام عليكم، أرجو مساعدتي في استعادة كلمة المرور (${accountLabel}) في متجر ${brandName}:`,
      cleanPhoneDisplay ? `• رقم الهاتف المسجل: ${cleanPhoneDisplay}` : null,
      cleanEmailDisplay ? `• البريد الإلكتروني: ${cleanEmailDisplay}` : null,
    ].filter(Boolean);
    return `https://wa.me/${officialStoreWhatsApp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [accountLabel, brandName, liveNormalizedWaPhone, officialStoreWhatsApp, waEmail, waPhone]);

  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailSending(true);
    try {
      await requestPasswordResetByEmail(emailInput);
      setEmailOtpCode("");
      setEmailNewPassword("");
      setEmailCooldown(RESEND_COOLDOWN_SECONDS);
      setEmailStage("otp");
      onNotify?.("success", "تم إرسال رمز التحقق المكون من 6 أرقام إلى بريدك الإلكتروني");
    } catch (err) {
      setEmailError(
        err instanceof Error ? err.message : "تعذر إرسال رمز التحقق إلى بريدك الإلكتروني.",
      );
    } finally {
      setEmailSending(false);
    }
  };

  const handleResendEmailOtp = async () => {
    if (emailCooldown > 0 || emailSending) return;
    setEmailError("");
    setEmailSending(true);
    try {
      await requestPasswordResetByEmail(emailInput);
      setEmailCooldown(RESEND_COOLDOWN_SECONDS);
      onNotify?.("success", "تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني");
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "تعذر إعادة إرسال رمز التحقق.");
    } finally {
      setEmailSending(false);
    }
  };

  const handleVerifyEmailOtpAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    if (!/^\d{6}$/.test(emailOtpCode.trim())) {
      setEmailError("يرجى إدخال رمز التحقق المكون من 6 أرقام.");
      return;
    }
    if (emailNewPassword.length < 6) {
      setEmailError("يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.");
      return;
    }
    setEmailSubmitting(true);
    try {
      await verifyPasswordResetEmailOtp(emailInput, emailOtpCode);
      await updateAdminPassword(emailNewPassword);
      setEmailOtpCode("");
      setEmailNewPassword("");
      setEmailStage("done");
      onNotify?.("success", "تم تغيير كلمة المرور بنجاح!");
      onPasswordUpdated?.();
    } catch (err) {
      setEmailError(
        err instanceof Error
          ? err.message
          : "تعذر التحقق من الرمز أو تحديث كلمة المرور. يرجى المحاولة مرة أخرى.",
      );
    } finally {
      setEmailSubmitting(false);
    }
  };

  const handleSendSmsOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSmsError("");
    setSmsGatewayUnavailable(false);
    setSmsSending(true);
    try {
      const normalized = await sendPasswordResetSmsOtp(smsPhone);
      setNormalizedSmsPhone(normalized);
      setSmsOtpCode("");
      setSmsNewPassword("");
      setSmsCooldown(RESEND_COOLDOWN_SECONDS);
      setSmsStage("otp");
      onNotify?.("success", `تم إرسال رمز التحقق إلى ${normalized}`);
    } catch (err) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: string }).code || "")
          : "";
      if (code === "SMS_GATEWAY_NOT_CONFIGURED") {
        setSmsGatewayUnavailable(true);
      }
      setSmsError(err instanceof Error ? err.message : "تعذر إرسال رمز التحقق عبر الرسائل النصية.");
    } finally {
      setSmsSending(false);
    }
  };

  const handleResendSmsOtp = async () => {
    if (smsCooldown > 0 || smsSending) return;
    setSmsError("");
    setSmsGatewayUnavailable(false);
    setSmsSending(true);
    try {
      const normalized = await sendPasswordResetSmsOtp(normalizedSmsPhone || smsPhone);
      setNormalizedSmsPhone(normalized);
      setSmsCooldown(RESEND_COOLDOWN_SECONDS);
      onNotify?.("success", `تم إعادة إرسال رمز التحقق إلى ${normalized}`);
    } catch (err) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: string }).code || "")
          : "";
      if (code === "SMS_GATEWAY_NOT_CONFIGURED") {
        setSmsGatewayUnavailable(true);
      }
      setSmsError(err instanceof Error ? err.message : "تعذر إعادة إرسال رمز التحقق.");
    } finally {
      setSmsSending(false);
    }
  };

  const handleVerifySmsOtpAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSmsError("");
    if (!/^\d{6}$/.test(smsOtpCode.trim())) {
      setSmsError("يرجى إدخال رمز التحقق المكون من 6 أرقام.");
      return;
    }
    if (smsNewPassword.length < 6) {
      setSmsError("يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.");
      return;
    }
    setSmsSubmitting(true);
    try {
      await verifyPasswordResetSmsOtp(normalizedSmsPhone || smsPhone, smsOtpCode);
      await updateAdminPassword(smsNewPassword);
      setSmsOtpCode("");
      setSmsNewPassword("");
      setSmsStage("done");
      onNotify?.("success", "تم تغيير كلمة المرور بنجاح!");
      onPasswordUpdated?.();
    } catch (err) {
      setSmsError(
        err instanceof Error ? err.message : "رمز التحقق غير صحيح أو تعذر تحديث كلمة المرور.",
      );
    } finally {
      setSmsSubmitting(false);
    }
  };

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword.length < 6) {
      setPasswordError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("كلمة المرور وتأكيدها غير متطابقين.");
      return;
    }
    setUpdatingPassword(true);
    try {
      await updateAdminPassword(newPassword);
      setPasswordUpdated(true);
      setNewPassword("");
      setConfirmPassword("");
      onNotify?.("success", "تم تغيير كلمة المرور بنجاح!");
      onPasswordUpdated?.();
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "تعذر تحديث كلمة المرور.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const switchChannelFromSmsFallback = (target: "whatsapp" | "email") => {
    setSmsError("");
    setSmsGatewayUnavailable(false);
    if (target === "whatsapp" && smsPhone.trim() && !waPhone.trim()) {
      setWaPhone(smsPhone.trim());
    }
    setChannel(target);
  };

  if (step === "new-password") {
    return (
      <div className="space-y-4 text-right" dir="rtl">
        <div className="rounded-xl bg-[#FAF8F5] border border-[#C6A355]/35 p-3.5">
          <div className="flex items-center gap-2 text-[#5E1734] font-bold text-sm">
            <KeyRound className="w-4 h-4 text-[#C6A355] shrink-0" />
            <h3>تعيين كلمة مرور جديدة</h3>
          </div>
          <p className="text-xs text-[#65525A] mt-1 leading-relaxed">
            تم التحقق من هويتك بنجاح. أدخل كلمة المرور الجديدة لتأمين حسابك.
          </p>
        </div>

        {passwordUpdated ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-3 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-emerald-900">تم تغيير كلمة المرور بنجاح!</p>
            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold cursor-pointer transition-colors"
            >
              العودة لتسجيل الدخول
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitNewPassword} className="space-y-3">
            <div>
              <label
                htmlFor="recovery-new-password"
                className="block text-xs font-bold text-[#1A1617] mb-1"
              >
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  id="recovery-new-password"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  placeholder="6 أحرف على الأقل"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#C6A355]/45 bg-[#FAF8F5] text-sm text-[#1A1617] focus:outline-none focus:border-[#5E1734]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  aria-label={showNewPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#65525A] hover:text-[#5E1734] cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="recovery-confirm-password"
                className="block text-xs font-bold text-[#1A1617] mb-1"
              >
                تأكيد كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  id="recovery-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#C6A355]/45 bg-[#FAF8F5] text-sm text-[#1A1617] focus:outline-none focus:border-[#5E1734]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"
                  }
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#65525A] hover:text-[#5E1734] cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {passwordError && (
              <p className="text-xs font-semibold text-[#BE123C]">{passwordError}</p>
            )}

            <button
              type="submit"
              disabled={updatingPassword}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-sm font-bold disabled:opacity-60 cursor-pointer transition-colors"
            >
              {updatingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{updatingPassword ? "جاري الحفظ..." : "حفظ كلمة المرور الجديدة"}</span>
            </button>
          </form>
        )}

        {!passwordUpdated && (
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[#65525A] hover:text-[#5E1734] cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لتسجيل الدخول</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 text-right" dir="rtl">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#C6A355]/25">
        <div>
          <h4 className="text-sm font-extrabold text-[#5E1734]">استعادة كلمة المرور</h4>
          <p className="text-[11px] text-[#65525A] mt-0.5">اختر طريقة الاستعادة المناسبة لك</p>
        </div>
        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#C6A355]/35 text-[11px] font-bold text-[#5E1734] cursor-pointer transition-colors"
        >
          <ArrowRight className="w-3 h-3" />
          <span>رجوع</span>
        </button>
      </div>

      {/* 3 Clean Recovery Channel Tabs: Email + SMS + WhatsApp (No Telegram) */}
      <div
        role="tablist"
        aria-label="طرق استعادة كلمة المرور"
        className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#FAF8F5] border border-[#C6A355]/30"
      >
        <button
          type="button"
          role="tab"
          aria-selected={channel === "email"}
          onClick={() => {
            setChannel("email");
            setEmailError("");
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            channel === "email"
              ? "bg-[#5E1734] text-white shadow-xs"
              : "text-[#65525A] hover:text-[#1A1617] hover:bg-white/70"
          }`}
        >
          <Mail className="w-4 h-4 shrink-0" />
          <span>البريد الإلكتروني</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={channel === "sms"}
          onClick={() => {
            setChannel("sms");
            setSmsError("");
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            channel === "sms"
              ? "bg-[#5E1734] text-white shadow-xs"
              : "text-[#65525A] hover:text-[#1A1617] hover:bg-white/70"
          }`}
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>رسالة نصية</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={channel === "whatsapp"}
          onClick={() => {
            setChannel("whatsapp");
            setWaError("");
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            channel === "whatsapp"
              ? "bg-[#147A53] text-white shadow-xs"
              : "text-[#65525A] hover:text-[#1A1617] hover:bg-white/70"
          }`}
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>واتساب</span>
        </button>
      </div>

      {/* Option A: Direct 6-Digit Email OTP + New Password */}
      {channel === "email" && (
        <div className="space-y-3">
          {emailStage === "request" && (
            <form onSubmit={handleSendEmailOtp} className="space-y-3">
              <div>
                <label
                  htmlFor="recovery-email-input"
                  className="block text-xs font-bold text-[#1A1617] mb-1"
                >
                  البريد الإلكتروني المسجّل
                </label>
                <input
                  id="recovery-email-input"
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#C6A355]/45 bg-[#FAF8F5] text-sm text-[#1A1617] text-left focus:outline-none focus:border-[#5E1734]"
                />
              </div>

              {emailError && (
                <p role="alert" className="text-xs font-semibold text-[#BE123C]">
                  {emailError}
                </p>
              )}

              <button
                type="submit"
                disabled={emailSending}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-sm font-bold disabled:opacity-60 cursor-pointer transition-colors"
              >
                {emailSending && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{emailSending ? "جاري الإرسال..." : "إرسال رمز التحقق"}</span>
              </button>
            </form>
          )}

          {emailStage === "otp" && (
            <form onSubmit={handleVerifyEmailOtpAndResetPassword} className="space-y-3">
              <div className="rounded-xl bg-[#FAF8F5] border border-[#C6A355]/35 p-3 space-y-1">
                <p className="text-xs font-extrabold text-[#5E1734]">
                  أدخل رمز التحقق (6 أرقام) وكلمة المرور الجديدة
                </p>
                <p className="text-[11px] text-[#65525A]">
                  تم إرسال رمز التحقق إلى{" "}
                  <span dir="ltr" className="font-bold text-[#1A1617]">
                    {emailInput.trim()}
                  </span>
                </p>
              </div>

              <div>
                <label
                  htmlFor="recovery-email-otp"
                  className="block text-xs font-bold text-[#1A1617] mb-1"
                >
                  رمز التحقق (6 أرقام)
                </label>
                <input
                  id="recovery-email-otp"
                  type="text"
                  inputMode="numeric"
                  dir="ltr"
                  maxLength={6}
                  autoComplete="one-time-code"
                  value={emailOtpCode}
                  onChange={(e) => {
                    setEmailOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    if (emailError) setEmailError("");
                  }}
                  placeholder="123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#C6A355]/45 bg-[#FAF8F5] text-base font-extrabold tracking-[0.35em] text-center text-[#1A1617] focus:outline-none focus:border-[#5E1734]"
                />
              </div>

              <div>
                <label
                  htmlFor="recovery-email-new-password"
                  className="block text-xs font-bold text-[#1A1617] mb-1"
                >
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    id="recovery-email-new-password"
                    type={showEmailNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={emailNewPassword}
                    onChange={(e) => {
                      setEmailNewPassword(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="6 أحرف على الأقل"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#C6A355]/45 bg-[#FAF8F5] text-sm text-[#1A1617] focus:outline-none focus:border-[#5E1734]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailNewPassword((prev) => !prev)}
                    aria-label={showEmailNewPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#65525A] hover:text-[#5E1734] cursor-pointer"
                  >
                    {showEmailNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {emailError && (
                <p role="alert" className="text-xs font-semibold text-[#BE123C]">
                  {emailError}
                </p>
              )}

              <button
                type="submit"
                disabled={emailSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-sm font-bold disabled:opacity-60 cursor-pointer transition-colors"
              >
                {emailSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {emailSubmitting ? "جاري التحقق والتحديث..." : "تأكيد الرمز وتغيير كلمة المرور"}
                </span>
              </button>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  disabled={emailCooldown > 0 || emailSending}
                  onClick={handleResendEmailOtp}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5E1734] hover:text-[#4A1129] disabled:text-[#8E7D84] disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${emailSending ? "animate-spin" : ""}`} />
                  <span>
                    {emailCooldown > 0
                      ? `إعادة إرسال الرمز (${emailCooldown} ثانية)`
                      : "إعادة إرسال الرمز"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmailStage("request");
                    setEmailOtpCode("");
                    setEmailNewPassword("");
                    setEmailError("");
                  }}
                  className="text-xs font-bold text-[#65525A] hover:text-[#5E1734] cursor-pointer"
                >
                  تغيير البريد الإلكتروني
                </button>
              </div>
            </form>
          )}

          {emailStage === "done" && (
            <div
              role="status"
              className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-3 text-center"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-emerald-900">تم تغيير كلمة المرور بنجاح!</p>
              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                العودة لتسجيل الدخول
              </button>
            </div>
          )}
        </div>
      )}

      {/* Option B: Direct 6-Digit SMS OTP + New Password */}
      {channel === "sms" && (
        <div className="space-y-3">
          {smsStage === "phone" && (
            <form onSubmit={handleSendSmsOtp} className="space-y-3">
              <div>
                <label
                  htmlFor="recovery-sms-phone"
                  className="block text-xs font-bold text-[#1A1617] mb-1"
                >
                  رقم الهاتف الجزائري (05 / 06 / 07)
                </label>
                <input
                  id="recovery-sms-phone"
                  type="tel"
                  dir="ltr"
                  autoComplete="tel"
                  value={smsPhone}
                  onChange={(e) => {
                    setSmsPhone(e.target.value);
                    if (smsError) setSmsError("");
                    if (smsGatewayUnavailable) setSmsGatewayUnavailable(false);
                  }}
                  placeholder="0550 12 34 56"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#C6A355]/45 bg-[#FAF8F5] text-sm text-[#1A1617] text-left focus:outline-none focus:border-[#5E1734]"
                />
                {liveNormalizedSmsPreview && (
                  <p className="text-[11px] text-[#65525A] mt-1">
                    الصيغة الدولية:{" "}
                    <span dir="ltr" className="font-bold text-[#5E1734]">
                      {liveNormalizedSmsPreview}
                    </span>
                  </p>
                )}
              </div>

              {smsError && (
                <div
                  role="alert"
                  className={`rounded-xl p-3 text-xs leading-relaxed border ${
                    smsGatewayUnavailable
                      ? "bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]"
                      : "bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]"
                  }`}
                >
                  <p className="font-semibold">{smsError}</p>
                  {smsGatewayUnavailable && (
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      <button
                        type="button"
                        onClick={() => switchChannelFromSmsFallback("whatsapp")}
                        className="px-3 py-1.5 rounded-lg bg-[#147A53] hover:bg-[#0F5E40] text-white text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        الاسترداد عبر واتساب
                      </button>
                      <button
                        type="button"
                        onClick={() => switchChannelFromSmsFallback("email")}
                        className="px-3 py-1.5 rounded-lg bg-[#5E1734] hover:bg-[#4A1129] text-white text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        الاسترداد بالبريد الإلكتروني
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={smsSending}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-sm font-bold disabled:opacity-60 cursor-pointer transition-colors"
              >
                {smsSending && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{smsSending ? "جاري إرسال الرمز..." : "إرسال رمز التحقق (SMS)"}</span>
              </button>
            </form>
          )}

          {smsStage === "otp" && (
            <form onSubmit={handleVerifySmsOtpAndResetPassword} className="space-y-3">
              <div className="rounded-xl bg-[#FAF8F5] border border-[#C6A355]/35 p-3 space-y-1">
                <p className="text-xs font-extrabold text-[#5E1734]">
                  أدخل رمز التحقق (6 أرقام) وكلمة المرور الجديدة
                </p>
                <p className="text-[11px] text-[#65525A]">
                  تم إرسال رمز التحقق إلى{" "}
                  <span dir="ltr" className="font-bold text-[#1A1617]">
                    {normalizedSmsPhone}
                  </span>
                </p>
              </div>

              <div>
                <label
                  htmlFor="recovery-sms-otp"
                  className="block text-xs font-bold text-[#1A1617] mb-1"
                >
                  رمز التحقق (6 أرقام)
                </label>
                <input
                  id="recovery-sms-otp"
                  type="text"
                  inputMode="numeric"
                  dir="ltr"
                  maxLength={6}
                  autoComplete="one-time-code"
                  value={smsOtpCode}
                  onChange={(e) => {
                    setSmsOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    if (smsError) setSmsError("");
                  }}
                  placeholder="123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#C6A355]/45 bg-[#FAF8F5] text-base font-extrabold tracking-[0.35em] text-center text-[#1A1617] focus:outline-none focus:border-[#5E1734]"
                />
              </div>

              <div>
                <label
                  htmlFor="recovery-sms-new-password"
                  className="block text-xs font-bold text-[#1A1617] mb-1"
                >
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    id="recovery-sms-new-password"
                    type={showSmsNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={smsNewPassword}
                    onChange={(e) => {
                      setSmsNewPassword(e.target.value);
                      if (smsError) setSmsError("");
                    }}
                    placeholder="6 أحرف على الأقل"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#C6A355]/45 bg-[#FAF8F5] text-sm text-[#1A1617] focus:outline-none focus:border-[#5E1734]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSmsNewPassword((prev) => !prev)}
                    aria-label={showSmsNewPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#65525A] hover:text-[#5E1734] cursor-pointer"
                  >
                    {showSmsNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {smsError && (
                <p role="alert" className="text-xs font-semibold text-[#BE123C]">
                  {smsError}
                </p>
              )}

              <button
                type="submit"
                disabled={smsSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-sm font-bold disabled:opacity-60 cursor-pointer transition-colors"
              >
                {smsSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {smsSubmitting ? "جاري التحقق والتحديث..." : "تأكيد الرمز وتغيير كلمة المرور"}
                </span>
              </button>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  disabled={smsCooldown > 0 || smsSending}
                  onClick={handleResendSmsOtp}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5E1734] hover:text-[#4A1129] disabled:text-[#8E7D84] disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${smsSending ? "animate-spin" : ""}`} />
                  <span>
                    {smsCooldown > 0
                      ? `إعادة إرسال الرمز (${smsCooldown} ثانية)`
                      : "إعادة إرسال الرمز"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSmsStage("phone");
                    setSmsOtpCode("");
                    setSmsNewPassword("");
                    setSmsError("");
                  }}
                  className="text-xs font-bold text-[#65525A] hover:text-[#5E1734] cursor-pointer"
                >
                  تغيير رقم الهاتف
                </button>
              </div>
            </form>
          )}

          {smsStage === "done" && (
            <div
              role="status"
              className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-3 text-center"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-emerald-900">تم تغيير كلمة المرور بنجاح!</p>
              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                العودة لتسجيل الدخول
              </button>
            </div>
          )}
        </div>
      )}

      {/* Option C: WhatsApp Recovery */}
      {channel === "whatsapp" && (
        <div className="space-y-3">
          <p className="text-xs text-[#65525A] leading-relaxed">
            أدخل رقم هاتفك المسجّل لفتح طلب استعادة مباشر عبر واتساب المتجر الرسمي والحصول على
            المساعدة الفورية.
          </p>

          <div>
            <label
              htmlFor="recovery-wa-phone"
              className="block text-xs font-bold text-[#1A1617] mb-1"
            >
              رقم الهاتف المسجّل (05 / 06 / 07)
            </label>
            <input
              id="recovery-wa-phone"
              type="tel"
              dir="ltr"
              autoComplete="tel"
              value={waPhone}
              onChange={(e) => {
                setWaPhone(e.target.value);
                if (waError) setWaError("");
              }}
              placeholder="0550 12 34 56"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#C6A355]/45 bg-[#FAF8F5] text-sm text-[#1A1617] text-left focus:outline-none focus:border-[#147A53]"
            />
          </div>

          <div>
            <label
              htmlFor="recovery-wa-email"
              className="block text-xs font-bold text-[#1A1617] mb-1"
            >
              البريد الإلكتروني (اختياري)
            </label>
            <input
              id="recovery-wa-email"
              type="email"
              dir="ltr"
              autoComplete="email"
              value={waEmail}
              onChange={(e) => {
                setWaEmail(e.target.value);
                if (waError) setWaError("");
              }}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#C6A355]/45 bg-[#FAF8F5] text-sm text-[#1A1617] text-left focus:outline-none focus:border-[#147A53]"
            />
          </div>

          {waError && <p className="text-xs font-semibold text-[#BE123C]">{waError}</p>}

          {whatsappRecoveryUrl ? (
            <a
              href={whatsappRecoveryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#147A53] hover:bg-[#0F5E40] text-white text-sm font-bold shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال طلب الاسترداد عبر واتساب</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-85" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() =>
                setWaError("يرجى إدخال رقم الهاتف أو البريد الإلكتروني للمتابعة عبر واتساب.")
              }
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#147A53]/80 hover:bg-[#147A53] text-white text-sm font-bold cursor-pointer transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال طلب الاسترداد عبر واتساب</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
