-- Step 1: Create a temporary column
ALTER TABLE "categories" ADD COLUMN "name_temp" TEXT;

-- Step 2: Copy data from enum column to temp column (convert to text)
UPDATE "categories" SET "name_temp" = "name"::TEXT;

-- Step 3: Drop the old enum column
ALTER TABLE "categories" DROP COLUMN "name";

-- Step 4: Rename temp column to name
ALTER TABLE "categories" RENAME COLUMN "name_temp" TO "name";

-- Step 5: Add NOT NULL constraint
ALTER TABLE "categories" ALTER COLUMN "name" SET NOT NULL;

-- Step 6: Add UNIQUE constraint
ALTER TABLE "categories" ADD CONSTRAINT "categories_name_key" UNIQUE ("name");

-- Step 7: Drop the old enum type (optional, keeps DB clean)
DROP TYPE IF EXISTS "CategoryType";