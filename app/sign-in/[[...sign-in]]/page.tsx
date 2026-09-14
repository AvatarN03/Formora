import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f1eb] px-6 py-12">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#d96445",
            colorBackground: "#faf9f5",
            borderRadius: "0.75rem",
          },
        }}
      />
    </main>
  );
}