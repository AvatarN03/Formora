import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard-header";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const name = user?.fullName ?? user?.firstName ?? "Account";

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/25 selection:text-foreground">
      <DashboardHeader name={name} email={user?.primaryEmailAddress?.emailAddress} />
      {children}
    </div>
  );
}