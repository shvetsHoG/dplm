/*
  Warnings:

  - You are about to drop the column `contractId` on the `employee_groups` table. All the data in the column will be lost.
  - You are about to drop the column `externalId` on the `employee_groups` table. All the data in the column will be lost.
  - You are about to drop the column `employeeGroupId` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `shifts` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `shifts` table. All the data in the column will be lost.
  - Added the required column `contract_id` to the `employee_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `employee_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_group_id` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `shifts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `shifts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "employee_groups" DROP CONSTRAINT "employee_groups_contractId_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_employeeGroupId_fkey";

-- AlterTable
ALTER TABLE "employee_groups" DROP COLUMN "contractId",
DROP COLUMN "externalId",
ADD COLUMN     "contract_id" INTEGER NOT NULL,
ADD COLUMN     "external_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "employeeGroupId",
ADD COLUMN     "employee_group_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "shifts" DROP COLUMN "startDate",
DROP COLUMN "startTime",
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "employee_groups" ADD CONSTRAINT "employee_groups_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_employee_group_id_fkey" FOREIGN KEY ("employee_group_id") REFERENCES "employee_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
