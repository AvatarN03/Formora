-- Store only a keyed hash of the submitting IP for short-window rate limiting.
ALTER TABLE "FormSubmission" ADD COLUMN "ipHash" TEXT;

CREATE INDEX "FormSubmission_formId_ipHash_createdAt_idx"
ON "FormSubmission"("formId", "ipHash", "createdAt");
