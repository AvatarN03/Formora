-- Store a hash of the signed browser token to enforce one response per browser/form.
ALTER TABLE "FormSubmission" ADD COLUMN "browserTokenHash" TEXT;

CREATE UNIQUE INDEX "FormSubmission_formId_browserTokenHash_key"
ON "FormSubmission"("formId", "browserTokenHash");
