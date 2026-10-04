import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="auth-scene relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#090a10] px-6 py-12">
      <Link
        href="/"
        className="auth-home-link absolute top-6 left-6 z-10 inline-flex items-center gap-2 text-sm text-[#9ca3af] transition-colors hover:text-[#f3f4f6] sm:top-8 sm:left-8"
      >
        <ArrowLeft className="size-4" />
        <span>Back to home</span>
      </Link>

      <div className="auth-canvas" aria-hidden="true" />

      <div className="relative z-10">
        <SignIn
          fallbackRedirectUrl="/console"
          forceRedirectUrl="/console"
          appearance={{
            variables: {
              colorPrimary: "#f97316",
              colorBackground: "#121422",
              borderRadius: "0rem",
            },
            elements: {
              card: "rounded-none border border-[#8b5cf6]/70 shadow-2xl",
              headerTitle: "text-[#f3f4f6]",
              headerSubtitle: "text-[#9ca3af]",
              formFieldLabel: "text-[#f3f4f6]",
              formFieldInput: "rounded-none border-[#8b5cf6]/50",
              formButtonPrimary: "bg-[#f97316] hover:bg-[#ea580c]",
              footerActionLink: "text-[#f97316] hover:text-[#fb923c]",
            },
          }}
        />
      </div>
    </main>
  );
}
