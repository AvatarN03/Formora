import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090a10] px-6 py-12">
      <SignIn
        fallbackRedirectUrl="/console"
        forceRedirectUrl="/console"
        appearance={{
          variables: {
            colorPrimary: "#f97316",
            colorBackground: "#121422",
            borderRadius: "0.75rem",
          },
          elements: {
            card: "border border-[#23263b] shadow-2xl",
            headerTitle: "text-[#f3f4f6]",
            headerSubtitle: "text-[#9ca3af]",
            formFieldLabel: "text-[#f3f4f6]",
            formFieldInput: "border-[#23263b]",
            formButtonPrimary: "bg-[#f97316] hover:bg-[#ea580c]",
            footerActionLink: "text-[#f97316] hover:text-[#fb923c]",
          },
        }}
      />
    </main>
  );
}
