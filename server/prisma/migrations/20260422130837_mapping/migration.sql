/*
  Warnings:

  - You are about to drop the column `shiftId` on the `custom_days` table. All the data in the column will be lost.
  - You are about to drop the column `contractId` on the `shifts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contract_id]` on the table `shifts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shift_id` to the `custom_days` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contract_id` to the `shifts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "custom_days" DROP CONSTRAINT "custom_days_shiftId_fkey";

-- DropForeignKey
ALTER TABLE "shifts" DROP CONSTRAINT "shifts_contractId_fkey";

-- DropIndex
DROP INDEX "shifts_contractId_key";

-- AlterTable
ALTER TABLE "custom_days" DROP COLUMN "shiftId",
ADD COLUMN     "shift_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "shifts" DROP COLUMN "contractId",
ADD COLUMN     "contract_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "shifts_contract_id_key" ON "shifts"("contract_id");

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_days" ADD CONSTRAINT "custom_days_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
