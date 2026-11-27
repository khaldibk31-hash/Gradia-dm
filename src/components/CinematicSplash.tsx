import { useEffect, useState } from "react";

const BRAND_CREST_SRC =
  "/assets/aistudio/Messenger_creation_1E2398F0-575A-4054-A762-C6E5FA028C9C_533e43e0.jpeg";

interface SplashCanvasProps {
  animate?: boolean;
  exiting?: boolean;
}

export function SplashCanvas({ animate = true, exiting = false }: SplashCanvasProps) {
  return (
    <div
      role="status"
      aria-label="DM GRADUATION — أزياء التخرج الفاخرة"
      className={`fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF8F5] px-6 transition-all duration-500 ease-out ${
        exiting ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
    >
      {/* Panoramic Ambient Glow (Champagne Gold + Royal Burgundy) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 flex items-center justify-center ${
          animate ? "splash-ambient-breathe" : ""
        }`}
      >
        <div
          className="h-[340px] w-[340px] sm:h-[440px] sm:w-[440px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(198,163,85,0.15) 0%, rgba(94,23,52,0.08) 52%, transparent 75%)",
          }}
        />
      </div>

      {/* Centered Crest & Editorial Typography (no z-index stacking context so mix-blend-multiply blends directly onto #FAF8F5) */}
      <div className="relative flex flex-col items-center text-center select-none">
        {/* Logo Wrapper without transform/opacity isolation */}
        <div className="relative flex items-center justify-center">
          <img
            src={BRAND_CREST_SRC}
            alt="DG by douaa — DM GRADUATION"
            draggable={false}
            className={`w-44 sm:w-52 h-auto object-contain mix-blend-multiply brightness-105 contrast-110 select-none pointer-events-none ${
              animate ? "splash-logo-reveal" : "scale-100"
            }`}
          />

          {animate && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{
                maskImage: "radial-gradient(circle, black 55%, transparent 82%)",
                WebkitMaskImage: "radial-gradient(circle, black 55%, transparent 82%)",
              }}
            >
              <div
                className="splash-shimmer-sweep absolute -inset-y-6 left-0 w-1/2"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 0%, rgba(198,163,85,0.34) 45%, rgba(255,250,240,0.6) 50%, rgba(198,163,85,0.28) 55%, transparent 100%)",
                }}
              />
            </div>
          )}
        </div>

        {/* Brand Title */}
        <h1
          dir="ltr"
          className={`mt-5 font-luxury-serif uppercase text-[#1A1617] text-xl sm:text-2xl font-semibold ${
            animate ? "splash-title-expand" : "tracking-[0.28em]"
          }`}
        >
          DM GRADUATION
        </h1>

        {/* Expanding Champagne-Gold Line */}
        <div
          aria-hidden="true"
          className={`mt-3.5 mx-auto h-[1.5px] bg-[#C6A355] rounded-full ${
            animate ? "splash-line-expand" : "w-20"
          }`}
        />

        {/* Arabic Tagline */}
        <p
          className={`mt-3 text-xs sm:text-sm font-medium text-[#65525A] tracking-wide ${
            animate ? "splash-tagline-fade" : "opacity-100"
          }`}
        >
          أزياء التخرج الفاخرة • تفصيل حسب الطلب
        </p>
      </div>
    </div>
  );
}

export function CinematicSplash() {
  const [exiting, setExiting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setExiting(true);
    }, 2200);

    const unmountTimer = window.setTimeout(() => {
      setDismissed(true);
    }, 2750);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(unmountTimer);
    };
  }, []);

  if (dismissed) {
    return null;
  }

  return <SplashCanvas animate exiting={exiting} />;
}
