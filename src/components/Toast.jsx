import { jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-2.5rem)] pointer-events-none",
      role: "status",
      "aria-live": "polite",
      children: toasts.map((toast) => {
        const Icon = toast.type === "success" ? CheckCircle2 : toast.type === "error" ? AlertCircle : Info;
        const accentClass = toast.type === "success" ? "text-[#147A53]" : toast.type === "error" ? "text-[#BE123C]" : "text-[#5E1734]";
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "pointer-events-auto flex items-center justify-between gap-3 bg-white border border-[#C6A355]/40 rounded-2xl px-4 py-3 shadow-xl text-sm text-[#1A1617]",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                /* @__PURE__ */ jsx(Icon, { className: `w-4 h-4 shrink-0 ${accentClass}` }),
                /* @__PURE__ */ jsx("span", { className: "font-medium leading-snug", children: toast.text })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onDismiss(toast.id),
                  className: "p-1 text-[#65525A] hover:text-[#1A1617] transition-colors shrink-0 cursor-pointer",
                  "aria-label": "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u062A\u0646\u0628\u064A\u0647",
                  children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                }
              )
            ]
          },
          toast.id
        );
      })
    }
  );
}
export {
  ToastContainer
};
