"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, GripVertical, MousePointer2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

const emptySubscribe = () => () => {};

interface AuthPageProps {
  mode: "sign-in" | "sign-up";
}

export function AuthPage({ mode }: AuthPageProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";
  const logo = isDark ? "/formora-dark.svg" : "/formora-light.svg";
  const appearance = {
    variables: {
      colorPrimary: isDark ? "#ff6b52" : "#e33b2f",
      colorBackground: isDark ? "#1a1d23" : "#fffdf8",
      colorText: isDark ? "#f4f1e8" : "#171717",
      colorTextSecondary: isDark ? "#b7b2aa" : "#625e57",
      colorInputBackground: isDark ? "#242830" : "#f5f1e8",
      colorInputText: isDark ? "#f4f1e8" : "#171717",
      borderRadius: "0.25rem",
    },
    elements: {
      rootBox: "auth-clerk-root",
      cardBox: "auth-clerk-card-box !rounded-sm !border-0 !shadow-none",
      card: "auth-clerk-card !rounded-sm !border-0 !shadow-none",
      headerTitle: "auth-clerk-title",
      headerSubtitle: "auth-clerk-subtitle",
      formFieldLabel: "auth-clerk-label",
      formFieldInput: "auth-clerk-input rounded-xl",
      formButtonPrimary: "auth-clerk-primary rounded-xl",
      footerActionLink: "auth-clerk-link",
      identityPreviewEditButton: "auth-clerk-link",
      formFieldInputShowPasswordButton: "auth-clerk-link",
    },
  };

  return (
    <main className="auth-scene relative isolate flex min-h-screen items-center overflow-hidden px-6 py-24 sm:px-10">
      <div className="auth-rule" aria-hidden="true" />

      <header className="auth-header absolute inset-x-0 top-0 z-10 border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
          <Link href="/" className="flex items-center gap-3">
            <Image src={logo} alt="Formora" width={32} height={32} className="size-8" />
            <span className="font-mono text-sm font-semibold tracking-[0.16em]">FORMORA</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <Link href="/" className="auth-home-link absolute bottom-7 left-6 z-10 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.12em] sm:left-10">
        <ArrowLeft className="size-3.5" />
        <span>Back to home</span>
      </Link>

      <div className="relative mx-auto flex w-full max-w-7xl justify-center lg:items-center lg:justify-between">
        <div className="hidden max-w-sm lg:absolute lg:left-0 lg:top-1/2 lg:block lg:-translate-y-1/2">
          <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-primary">
            <span className="h-0.5 w-10 bg-primary" />
            {mode === "sign-in" ? "Welcome back" : "Start with Formora"}
          </p>
          <h1 className="max-w-[8ch] text-6xl font-bold uppercase leading-[0.9] tracking-[-0.06em] xl:text-8xl">
            {mode === "sign-in" ? "Return to the work." : "Make forms feel effortless."}
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground">
            A focused workspace for composing clear, thoughtful forms without the clutter.
          </p>

          <div className="auth-drag-preview relative mt-12 max-w-sm border p-5">
            <div className="mb-5 flex items-center justify-between border-b pb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <span>Canvas / Untitled form</span>
              <span className="text-primary">Drag to arrange</span>
            </div>
            <div className="space-y-3">
              <div className="auth-drag-item auth-drag-item-source flex items-center gap-3 border p-3">
                <GripVertical className="size-4 shrink-0 text-primary" />
                <div className="h-2 w-32 bg-current opacity-25" />
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">TEXT</span>
              </div>
              <div className="auth-drag-item auth-drag-item-target flex items-center gap-3 border p-3">
                <GripVertical className="size-4 shrink-0 text-primary" />
                <div className="h-2 w-24 bg-current opacity-25" />
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">EMAIL</span>
              </div>
            </div>
            <MousePointer2 className="auth-drag-cursor absolute -bottom-7 right-12 size-9 rotate-[-18deg] fill-primary text-primary" />
          </div>
        </div>

        <div className="auth-card-wrap mx-auto w-full max-w-md lg:ml-auto lg:mr-[6%]">
          <div className="mb-4 flex items-center justify-between border-b pb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <span>{mode === "sign-in" ? "01 / Sign in" : "01 / Create account"}</span>
            <span>FORMORA.STUDIO</span>
          </div>
          {mode === "sign-in" ? (
            <SignIn fallbackRedirectUrl="/console" forceRedirectUrl="/console" appearance={appearance} />
          ) : (
            <SignUp fallbackRedirectUrl="/console" forceRedirectUrl="/console" appearance={appearance} />
          )}
        </div>
      </div>
    </main>
  );
}
