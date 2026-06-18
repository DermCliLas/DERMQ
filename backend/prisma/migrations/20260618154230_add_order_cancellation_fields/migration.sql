-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "creditNoteNumber" TEXT,
ADD COLUMN     "creditNotePdfUrl" TEXT,
ADD COLUMN     "creditNoteXmlUrl" TEXT,
ADD COLUMN     "isCancelled" BOOLEAN NOT NULL DEFAULT false;
