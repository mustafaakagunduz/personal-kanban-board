-- AlterTable: add bg color columns to Company
ALTER TABLE "Company" ADD COLUMN     "bgColorStart" TEXT NOT NULL DEFAULT '#171718',
ADD COLUMN     "bgColorEnd" TEXT NOT NULL DEFAULT '#C0FF2D';

-- Backfill Company colors from each company's first board
UPDATE "Company" c
SET "bgColorStart" = b."bgColorStart",
    "bgColorEnd" = b."bgColorEnd"
FROM "Board" b
WHERE b."companyId" = c.id
  AND b."order" = (SELECT MIN("order") FROM "Board" WHERE "companyId" = c.id);

-- AlterTable: remove bg color columns from Board
ALTER TABLE "Board" DROP COLUMN "bgColorStart",
DROP COLUMN "bgColorEnd";
