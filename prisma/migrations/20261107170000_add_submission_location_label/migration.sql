-- Store provider-derived coarse location labels only; raw IPs remain excluded.
ALTER TABLE "FormSubmission" ADD COLUMN "locationLabel" TEXT;
