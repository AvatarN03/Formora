import { auth, currentUser } from "@clerk/nextjs/server";
import { ArrowUpRight, FilePlus2, FolderOpen, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ConsolePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <main className="min-h-screen bg-muted/30 text-foreground">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link className="flex items-center gap-2 text-xl font-semibold tracking-[-0.04em]" href="/" aria-label="Formly home">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-serif text-lg italic text-primary-foreground">f</span>
            <span>formly</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild><Link href="/">Back home</Link></Button>
            <Button variant="outline" asChild><Link href="/sign-in">Account <ArrowUpRight /></Link></Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Badge variant="secondary" className="mb-4 gap-2 rounded-full"><Sparkles className="size-3.5" /> Workspace</Badge>
            <h1 className="text-4xl font-medium tracking-[-0.06em] sm:text-5xl">Good to see you, {firstName}.</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">Create, organize, and learn from forms that make every response count.</p>
          </div>
          <Button size="lg"><FilePlus2 /> New form</Button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Total forms</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold tracking-tight">0</p><p className="mt-2 text-xs text-muted-foreground">Your workspace is ready.</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Responses</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold tracking-tight">0</p><p className="mt-2 text-xs text-muted-foreground">Insights will appear here.</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Active projects</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold tracking-tight">0</p><p className="mt-2 text-xs text-muted-foreground">Start with your first form.</p></CardContent></Card>
        </div>

        <Card className="mt-5">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><FolderOpen className="size-6" /></div>
            <h2 className="text-xl font-semibold tracking-tight">Your forms will live here</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Build a focused form, share it with your audience, and return here to follow the signal.</p>
            <Button className="mt-6"><FilePlus2 /> Create your first form</Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}