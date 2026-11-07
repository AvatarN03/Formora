-- Add an optional hashed client submission key for idempotent retries.
ALTER TABLE "FormSubmission" ADD COLUMN "submissionKeyHash" TEXT;

CREATE UNIQUE INDEX "FormSubmission_formId_submissionKeyHash_key"
ON "FormSubmission"("formId", "submissionKeyHash");
