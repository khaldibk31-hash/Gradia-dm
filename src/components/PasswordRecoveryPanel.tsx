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
  Smartphone,
} from "lucide-react";
import { WHATSAPP_NUMBER, formatWhatsAppNumber } from "../data/defaultStore";
import {
  normalizeAlgerianPhoneE164,
  requestPasswordResetByEmail,
  sendPasswordResetSmsOtp,
  updateAdminPassword,
  verifyPasswordResetSmsOtp,
} from "../lib/supabase";

export type RecoveryChannel = "email" | "sms" | "whatsapp";

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

  // Email recovery state
  const [emailInput, setEmailInput] = useState(initialEmail);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  // SMS OTP recovery state
  const [smsPhone, setSmsPhone] = useState("");
  const [normalizedSmsPhone, setNormalizedSmsPhone] = useState("");
  const [smsStage, setSmsStage] = useState<"phone" | "otp">("phone");
  const [otpCode, setOtpCode] = useState("");
  const [smsSending, setSmsSending] = useState(false);
  const [smsVerifying, setSmsVerifying] = useState(false);
  const [smsError, setSmsError] = useState("");
  const [smsGatewayUnavailable, setSmsGatewayUnavailable] = useState(false);

  // WhatsApp recovery state
  const [waPhone, setWaPhone] = useState("");
  const [waEmail, setWaEmail] = useState(initialEmail);
  const [waError, setWaError] = useState("");

  // New password form state
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

  const handleSendEmailReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailSent(false);
    setEmailSending(true);
    try {
      await requestPasswordResetByEmail(emailInput);
      setEmailSent(true);
      onNotify?.("success", "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح");
    } catch (err) {
      setEmailError(
        err instanceof Error ? err.message : "تعذر إرسال رابط إعادة تعيين كلمة المرور.",
      );
    } finally {
      setEmailSending(false);
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

  const handleVerifySmsOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSmsError("");
    setSmsVerifying(true);
    try {
      await verifyPasswordResetSmsOtp(normalizedSmsPhone || smsPhone, otpCode);
      setStep("new-password");
      onNotify?.("success", "تم التحقق بنجاح! يمكنك الآن تعيين كلمة مرور جديدة.");
    } catch (err) {
      setSmsError(err instanceof Error ? err.message : "رمز التحقق غير صحيح أو منتهي الصلاحية.");
    } finally {
      setSmsVerifying(false);
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
      onNotify?.("success", "تم تحديث كلمة المرور بنجاح!");
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
            <p className="text-sm font-bold text-emerald-900">تم تحديث كلمة المرور بنجاح</p>
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

      {/* Option A: Email Recovery */}
      {channel === "email" && (
        <form onSubmit={handleSendEmailReset} className="space-y-3">
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
                if (emailSent) setEmailSent(false);
              }}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#C6A355]/45 bg-[#FAF8F5] text-sm text-[#1A1617] text-left focus:outline-none focus:border-[#5E1734]"
            />
          </div>

          {emailError && <p className="text-xs font-semibold text-[#BE123C]">{emailError}</p>}

          {emailSent && (
            <div
              role="status"
              className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 space-y-1 text-emerald-900"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold leading-relaxed">
                  تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح
                </p>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed pr-6">
                افتح الرسالة واضغط على الرابط لتظهر لك نافذة تعيين كلمة المرور الجديدة تلقائياً.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={emailSending}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-sm font-bold disabled:opacity-60 cursor-pointer transition-colors"
          >
            {emailSending && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{emailSending ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}</span>
          </button>
        </form>
      )}

      {/* Option B: SMS OTP Recovery */}
      {channel === "sms" && (
        <div className="space-y-3">
          {smsStage === "phone" ? (
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
          ) : (
            <form onSubmit={handleVerifySmsOtp} className="space-y-3">
              <div className="rounded-xl bg-[#FAF8F5] border border-[#C6A355]/30 p-3 text-xs text-[#65525A]">
                أدخل رمز التحقق المكون من 6 أرقام المرسل إلى{" "}
                <span dir="ltr" className="font-bold text-[#1A1617]">
                  {normalizedSmsPhone}
                </span>
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
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    if (smsError) setSmsError("");
                  }}
                  placeholder="123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#C6A355]/45 bg-[#FAF8F5] text-base font-extrabold tracking-[0.35em] text-center text-[#1A1617] focus:outline-none focus:border-[#5E1734]"
                />
              </div>

              {smsError && <p className="text-xs font-semibold text-[#BE123C]">{smsError}</p>}

              <button
                type="submit"
                disabled={smsVerifying}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5E1734] hover:bg-[#4A1129] text-white text-sm font-bold disabled:opacity-60 cursor-pointer transition-colors"
              >
                {smsVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{smsVerifying ? "جاري التحقق..." : "تأكيد الرمز"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSmsStage("phone");
                  setOtpCode("");
                  setSmsError("");
                }}
                className="w-full py-1.5 text-xs font-bold text-[#65525A] hover:text-[#5E1734] cursor-pointer"
              >
                تغيير رقم الهاتف
              </button>
            </form>
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
