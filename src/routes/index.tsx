import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

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

function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <span className="font-serif text-2xl tracking-widest text-primary">DG by Douaa</span>
    </div>
  );
}

function Index() {
  return (
    <ClientOnly fallback={<Splash />}>
      <Suspense fallback={<Splash />}>
        <StoreApp />
      </Suspense>
    </ClientOnly>
  );
}
