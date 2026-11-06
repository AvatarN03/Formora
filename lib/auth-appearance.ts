"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function useAuthAppearance() {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";

  return {
    variables: {
      colorPrimary: isDark ? "#ff6b52" : "#e33b2f",
      colorBackground: isDark ? "#181b22" : "#ffffff",
      colorText: isDark ? "#f2efe9" : "#1a1a1a",
      colorTextSecondary: isDark ? "#a6a096" : "#4a453e",
      colorInputBackground: isDark ? "#1e222a" : "#f7f4ed",
      colorInputText: isDark ? "#f2efe9" : "#1a1a1a",
      borderRadius: "0.625rem",
    },
    elements: {
      rootBox: "w-full",
      cardBox: "!rounded-2xl !border-0 !shadow-none !bg-transparent w-full",
      card: "!rounded-2xl !border-0 !shadow-none !bg-transparent w-full p-0",
      headerTitle: "!text-2xl !font-bold !tracking-tight !text-foreground",
      headerSubtitle: "!text-xs !text-muted-foreground !mt-1 font-medium",
      formFieldLabel: "!text-xs !font-semibold !text-foreground",
      formFieldInput:
        "!rounded-xl !border !border-border/80 !bg-secondary/70 !text-foreground placeholder:!text-muted-foreground focus:!bg-background focus:!border-primary focus:!ring-1 focus:!ring-primary text-sm transition-colors",
      formButtonPrimary:
        "!rounded-xl !bg-primary !text-primary-foreground font-medium text-sm !shadow-none hover:!opacity-95 transition-opacity",
      socialButtonsBlockButton:
        "!rounded-xl !border !border-border/80 hover:!bg-secondary/80 !text-foreground font-medium text-sm transition-colors",
      socialButtonsBlockButtonText: "!text-foreground !font-medium",
      footerActionLink: "!text-primary hover:underline font-semibold text-xs",
      footerActionText: "!text-muted-foreground text-xs font-normal",
      identityPreviewEditButton: "!text-primary hover:underline font-medium",
      identityPreviewText: "!text-foreground font-medium",
      formFieldInputShowPasswordButton: "!text-muted-foreground hover:!text-foreground",
      dividerLine: "!bg-border",
      dividerText: "!text-muted-foreground text-xs font-mono uppercase font-medium",
      formHeaderTitle: "!text-foreground !font-bold",
      formHeaderSubtitle: "!text-muted-foreground font-medium",
    },
  };
}

