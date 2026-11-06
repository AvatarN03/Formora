export function PrinciplesSection() {
  return (
    <section id="architecture" className="landing-reveal relative border-t border-border/40 py-20 overflow-hidden">
      {/* Subtle Ambient Warm Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 -z-10 size-[380px] rounded-full bg-gradient-to-tr from-primary/[0.05] via-orange-400/[0.02] to-transparent blur-[110px]"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Form creation, without the clutter.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Every detail in Formora is built to help you craft forms that respondents actually finish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border/40 bg-card/60 p-6 space-y-3 shadow-xs">
            <span className="font-mono text-xs font-semibold text-primary block">
              01
            </span>
            <h3 className="text-base font-semibold text-foreground">
              Tactile Composition
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Arrange questions on an open canvas. Reorder items, set requirements, and configure field options directly without digging through nested menus.
            </p>
          </div>

          <div className="rounded-2xl border border-border/40 bg-card/60 p-6 space-y-3 shadow-xs">
            <span className="font-mono text-xs font-semibold text-primary block">
              02
            </span>
            <h3 className="text-base font-semibold text-foreground">
              Immediate Live Preview
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Switch instantly between editing and respondent view. Experience the exact form your audience will see with instant validation.
            </p>
          </div>

          <div className="rounded-2xl border border-border/40 bg-card/60 p-6 space-y-3 shadow-xs">
            <span className="font-mono text-xs font-semibold text-primary block">
              03
            </span>
            <h3 className="text-base font-semibold text-foreground">
              Effortless Sharing
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Publish with a single click to generate a clean, responsive standalone link ready to collect feedback and survey responses.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

