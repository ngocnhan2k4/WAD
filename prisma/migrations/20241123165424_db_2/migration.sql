/*
  Warnings:

  - You are about to drop the column `order_date` on the `Orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "order_date";

-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "creation_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
