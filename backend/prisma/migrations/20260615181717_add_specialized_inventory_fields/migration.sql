-- CreateEnum
CREATE TYPE "ProductFamily" AS ENUM ('MP', 'PI', 'ME', 'PT');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "expirationDate" TIMESTAMP(3),
ADD COLUMN     "family" "ProductFamily",
ADD COLUMN     "lotNumber" TEXT;
