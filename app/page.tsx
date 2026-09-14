import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f1eb] text-[#1d2623]">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10" aria-label="Primary navigation">
        <Link className="flex items-center gap-2 text-xl font-semibold tracking-[-0.04em]" href="/" aria-label="Formly home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d2623] font-serif text-lg italic text-[#f4f1eb]">f</span>
          <span>formly</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Show when="signed-out">
            <Link className="transition-colors hover:text-[#d96445]" href="/sign-in">Sign in</Link>
            <Link className="rounded-full bg-[#1d2623] px-5 py-3 text-[#f4f1eb] transition-transform hover:-translate-y-0.5" href="/sign-up">Get started <span aria-hidden="true">↗</span></Link>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-28 lg:pt-24">
        <div className="max-w-xl">
          <p className="mb-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d96445]"><span className="h-2 w-2 rounded-full bg-[#d96445]" /> Form creation, simplified</p>
          <h1 className="max-w-lg text-6xl font-medium leading-[0.95] tracking-[-0.07em] sm:text-7xl">Build forms that feel <em className="font-serif font-normal text-[#d96445]">effortless.</em></h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-[#65716c]">Drag, drop, and ship beautiful forms in minutes. Formly gives your ideas a clear path from first question to final response.</p>
          <div className="mt-9 flex flex-wrap items-center gap-6"><Link className="rounded-full bg-[#1d2623] px-6 py-4 text-sm font-semibold text-[#f4f1eb] transition-transform hover:-translate-y-0.5" href="/sign-up">Create a form <span aria-hidden="true">↗</span></Link><a className="text-sm font-semibold underline decoration-[#c8cec8] underline-offset-8 transition-colors hover:text-[#d96445]" href="#preview">See how it works <span aria-hidden="true">↓</span></a></div>
          <p className="mt-6 text-xs font-medium text-[#8b948f]">No credit card required <span className="px-2">·</span> Free to start</p>
        </div>

        <div className="relative rounded-[2rem] border border-[#dfe1d9] bg-[#e8e6df] p-3 shadow-[0_24px_70px_rgba(29,38,35,0.12)] sm:p-5" id="preview" aria-label="Form builder preview">
          <div className="overflow-hidden rounded-2xl border border-[#d7d9d2] bg-[#faf9f5]">
            <div className="flex items-center justify-between border-b border-[#e3e4de] px-5 py-4 text-xs font-medium text-[#7f8983]"><div className="flex gap-1.5"><i className="h-2 w-2 rounded-full bg-[#e1a18b]" /><i className="h-2 w-2 rounded-full bg-[#d6c58f]" /><i className="h-2 w-2 rounded-full bg-[#9eb9a3]" /></div><span>Untitled form</span><span className="flex items-center gap-1.5"><b className="h-1.5 w-1.5 rounded-full bg-[#86a58d]" /> Draft</span></div>
            <div className="grid min-h-[380px] grid-cols-[120px_1fr] sm:grid-cols-[155px_1fr]">
              <aside className="border-r border-[#e3e4de] bg-[#f4f3ee] p-4"><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9ba39d]">Blocks</span><div className="mt-4 space-y-2 text-xs font-medium text-[#53615a]"><div className="rounded-lg bg-white px-3 py-2 shadow-sm"><span className="mr-2 text-[#d96445]">T</span> Text</div><div className="px-3 py-2"><span className="mr-2">□</span> Choice</div><div className="px-3 py-2"><span className="mr-2">☷</span> Rating</div><div className="px-3 py-2"><span className="mr-2">↕</span> Scale</div></div><div className="my-6 border-t border-[#dedfd8]" /><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9ba39d]">Appearance</span><div className="mt-4 flex gap-1.5"><i className="h-4 w-4 rounded-full bg-[#d96445]" /><i className="h-4 w-4 rounded-full bg-[#1d2623]" /><i className="h-4 w-4 rounded-full bg-[#d6c58f]" /><i className="h-4 w-4 rounded-full bg-[#a9c0ad]" /></div></aside>
              <div className="flex flex-col justify-between p-7 sm:p-12"><div><div className="flex justify-between text-[10px] font-bold tracking-[0.16em] text-[#9ba39d]"><span>FEEDBACK / 01</span><span>•••</span></div><h2 className="mt-16 max-w-sm text-3xl font-medium leading-tight tracking-[-0.05em] sm:text-4xl">What are you working on?</h2><p className="mt-4 max-w-sm text-sm leading-6 text-[#89928c]">Tell us a little about your project and we&apos;ll help you make it better.</p><div className="mt-8 flex justify-between border-b border-[#cfd4cd] pb-3 text-sm text-[#9ba39d]"><span>Your answer</span><span>↵</span></div></div><div className="flex items-center gap-4 text-[10px] font-bold text-[#9ba39d]"><span>1 of 4</span><span className="h-1 flex-1 rounded-full bg-[#e3e4de]"><b className="block h-1 w-1/4 rounded-full bg-[#d96445]" /></span></div></div>
            </div>
          </div>
          <div className="absolute -bottom-5 right-8 rounded-full bg-[#d96445] px-4 py-2 text-xs font-semibold text-white shadow-lg"><span className="mr-2">✦</span> Drag to reorder</div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl items-center gap-5 px-6 pb-8 text-xs font-medium text-[#8b948f] lg:px-10"><span>Made for better questions.</span><span className="h-px flex-1 bg-[#d8d9d2]" /><span>© 2025 Formly</span></footer>
    </main>
  );
}
