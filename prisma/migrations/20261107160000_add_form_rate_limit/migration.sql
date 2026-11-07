-- Allow form owners to configure the per-network hourly response limit.
ALTER TABLE "Form" ADD COLUMN "rateLimitPerHour" INTEGER NOT NULL DEFAULT 5;
