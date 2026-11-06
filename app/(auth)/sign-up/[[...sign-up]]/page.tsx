"use client";

import { SignUp } from "@clerk/nextjs";
import { useAuthAppearance } from "@/lib/auth-appearance";

export default function SignUpPage() {
  const appearance = useAuthAppearance();

  return (
    <SignUp
      fallbackRedirectUrl="/console"
      forceRedirectUrl="/console"
      appearance={appearance}
    />
  );
}
