-- Allow form owners to choose whether browser-level duplicate prevention is enabled.
CREATE TYPE "ResponsePolicy" AS ENUM ('UNLIMITED', 'ONE_PER_BROWSER');

ALTER TABLE "Form" ADD COLUMN "responsePolicy" "ResponsePolicy" NOT NULL DEFAULT 'ONE_PER_BROWSER';
