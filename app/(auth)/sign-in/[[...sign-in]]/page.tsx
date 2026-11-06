"use client";

import { SignIn } from "@clerk/nextjs";
import { useAuthAppearance } from "@/lib/auth-appearance";

export default function SignInPage() {
  const appearance = useAuthAppearance();

  return (
    <SignIn
      fallbackRedirectUrl="/console"
      forceRedirectUrl="/console"
      appearance={appearance}
    />
  );
}
