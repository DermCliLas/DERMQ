-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('PENDING', 'ISSUED', 'FAILED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "paymentReference" TEXT,
ADD COLUMN "billingStatus" "BillingStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "billingError" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentReference_key" ON "Order"("paymentReference");
