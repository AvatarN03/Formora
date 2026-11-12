import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const name =
    user.fullName ??
    user.firstName ??
    user.username ??
    user.primaryEmailAddress?.emailAddress ??
    "User";

  return (
    <div className="console-shell min-h-screen bg-background text-foreground">
      <DashboardHeader name={name} email={user?.primaryEmailAddress?.emailAddress} />
      {children}
    </div>
  );
}
