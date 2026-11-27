import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { CinematicSplash, SplashCanvas } from "@/components/CinematicSplash";

const StoreApp = lazy(() => import("@/StoreApp"));

const TITLE = "DG by Douaa | أزياء التخرج في الجزائر";
const DESC =
  "متجر جزائري فاخر لأزياء التخرج: شالات مطرزة باسمك وشعار جامعتك، روبات بمقاسك، وتوصيل لجميع ولايات الجزائر (58 ولاية).";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<SplashCanvas animate={false} />}>
      <CinematicSplash />
      <Suspense fallback={<SplashCanvas animate={false} />}>
        <StoreApp />
      </Suspense>
    </ClientOnly>
  );
}
