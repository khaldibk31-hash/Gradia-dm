import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminLoginModal } from "@/components/AdminModals";
import { normalizeAlgerianPhoneE164, supabase } from "@/lib/supabase";

describe("Password Recovery Flow (Email, SMS, WhatsApp)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("normalizes Algerian phone numbers to E.164 +213 format", () => {
    expect(normalizeAlgerianPhoneE164("0550123456")).toBe("+213550123456");
    expect(normalizeAlgerianPhoneE164("0661 22 33 44")).toBe("+213661223344");
    expect(normalizeAlgerianPhoneE164("0770-99-88-77")).toBe("+213770998877");
    expect(normalizeAlgerianPhoneE164("+213 550 12 34 56")).toBe("+213550123456");
    expect(normalizeAlgerianPhoneE164("213550123456")).toBe("+213550123456");
    expect(normalizeAlgerianPhoneE164("00213550123456")).toBe("+213550123456");
    expect(normalizeAlgerianPhoneE164("123")).toBe("");
  });

  it("shows نسيت كلمة المرور؟ below password input and renders Email, SMS, and WhatsApp tabs without Telegram", () => {
    const Modal = AdminLoginModal as unknown as React.ComponentType<Record<string, unknown>>;
    render(<Modal isOpen={true} onClose={() => {}} onLogin={async () => {}} />);

    const passwordInput = screen.getByPlaceholderText("كلمة المرور");
    const forgotBtn = screen.getByRole("button", { name: "نسيت كلمة المرور؟" });
    expect(
      passwordInput.compareDocumentPosition(forgotBtn) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    fireEvent.click(forgotBtn);

    expect(screen.getByRole("tab", { name: "البريد الإلكتروني" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "رسالة نصية" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "واتساب" })).toBeInTheDocument();
    expect(screen.queryByText(/تليجرام|Telegram/i)).toBeNull();
  });

  it("sends password reset link via Email and handles recovery new-password session", async () => {
    const resetSpy = vi
      .spyOn(supabase.auth, "resetPasswordForEmail")
      .mockResolvedValue({ data: {}, error: null } as never);
    const updateSpy = vi
      .spyOn(supabase.auth, "updateUser")
      .mockResolvedValue({ data: { user: {} }, error: null } as never);

    const Modal = AdminLoginModal as unknown as React.ComponentType<Record<string, unknown>>;
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} onLogin={async () => {}} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "نسيت كلمة المرور؟" }));

    const emailInput = screen.getByLabelText("البريد الإلكتروني المسجّل") as HTMLInputElement;
    expect(emailInput.value).toBe("khaldibk31@gmail.com");

    fireEvent.click(screen.getByRole("button", { name: "إرسال رابط إعادة التعيين" }));

    await waitFor(() => {
      expect(resetSpy).toHaveBeenCalledWith("khaldibk31@gmail.com", {
        redirectTo: window.location.origin,
      });
    });

    expect(
      await screen.findByText("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح"),
    ).toBeInTheDocument();

    // Simulate returning from email link (PASSWORD_RECOVERY session detected)
    rerender(
      <Modal
        isOpen={true}
        onClose={() => {}}
        onLogin={async () => {}}
        forcePasswordRecovery={true}
      />,
    );

    expect(await screen.findByText("تعيين كلمة مرور جديدة")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("كلمة المرور الجديدة"), {
      target: { value: "NewStrongPass2026" },
    });
    fireEvent.change(screen.getByLabelText("تأكيد كلمة المرور الجديدة"), {
      target: { value: "NewStrongPass2026" },
    });
    fireEvent.click(screen.getByRole("button", { name: "حفظ كلمة المرور الجديدة" }));

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith({ password: "NewStrongPass2026" });
    });

    expect(await screen.findByText("تم تحديث كلمة المرور بنجاح")).toBeInTheDocument();
  });

  it("supports SMS OTP flow and displays polite WhatsApp/Email fallback when SMS gateway is unconfigured", async () => {
    const otpSpy = vi
      .spyOn(supabase.auth, "signInWithOtp")
      .mockResolvedValueOnce({
        data: null,
        error: { message: "Unsupported phone provider", code: "phone_provider_disabled" },
      } as never)
      .mockResolvedValueOnce({ data: {}, error: null } as never);

    const verifySpy = vi
      .spyOn(supabase.auth, "verifyOtp")
      .mockResolvedValue({ data: { session: {} }, error: null } as never);

    const Modal = AdminLoginModal as unknown as React.ComponentType<Record<string, unknown>>;
    render(
      <Modal
        isOpen={true}
        whatsappNumber="213673423172"
        onClose={() => {}}
        onLogin={async () => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "نسيت كلمة المرور؟" }));
    fireEvent.click(screen.getByRole("tab", { name: "رسالة نصية" }));

    const smsPhoneInput = screen.getByLabelText("رقم الهاتف الجزائري (05 / 06 / 07)");
    fireEvent.change(smsPhoneInput, { target: { value: "0550123456" } });
    fireEvent.click(screen.getByRole("button", { name: "إرسال رمز التحقق (SMS)" }));

    expect(
      await screen.findByText(/خدمة الرسائل النصية \(SMS\) غير مفعّلة حالياً/),
    ).toBeInTheDocument();

    // Verify 1-tap switch to WhatsApp pre-fills phone and links to official store WhatsApp
    fireEvent.click(screen.getByRole("button", { name: "الاسترداد عبر واتساب" }));
    const waLink = screen.getByRole("link", { name: /إرسال طلب الاسترداد عبر واتساب/ });
    expect(waLink.getAttribute("href")).toContain("https://wa.me/213673423172?text=");
    expect(decodeURIComponent(waLink.getAttribute("href") || "")).toContain("+213550123456");

    // Switch back to SMS and test successful 6-digit OTP verification -> new password form
    fireEvent.click(screen.getByRole("tab", { name: "رسالة نصية" }));
    fireEvent.click(screen.getByRole("button", { name: "إرسال رمز التحقق (SMS)" }));

    await waitFor(() => {
      expect(otpSpy).toHaveBeenLastCalledWith({ phone: "+213550123456" });
    });

    const otpInput = await screen.findByLabelText("رمز التحقق (6 أرقام)");
    fireEvent.change(otpInput, { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: "تأكيد الرمز" }));

    await waitFor(() => {
      expect(verifySpy).toHaveBeenCalledWith({
        phone: "+213550123456",
        token: "123456",
        type: "sms",
      });
    });

    expect(await screen.findByText("تعيين كلمة مرور جديدة")).toBeInTheDocument();
  });
});
