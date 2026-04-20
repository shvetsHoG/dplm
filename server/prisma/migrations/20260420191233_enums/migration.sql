/*
  Warnings:

  - Changed the type of `type` on the `custom_days` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `shifts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WeekdayType" AS ENUM ('weekend', 'workday');

-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('custom_days', 'cycle');

-- AlterTable
ALTER TABLE "custom_days" DROP COLUMN "type",
ADD COLUMN     "type" "WeekdayType" NOT NULL;

-- AlterTable
ALTER TABLE "shifts" DROP COLUMN "type",
ADD COLUMN     "type" "ShiftType" NOT NULL;
